"""
Python Microservice for Accounting Calculations
Provides advanced Trial Balance and T-Account computation
with validation and audit features.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP

app = FastAPI(
    title="Accounting Calculation Service",
    description="Python service for Trial Balance, T-Accounts and double-entry validation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Models ----------

class JournalLine(BaseModel):
    account_id: str
    account_code: str
    account_name: str
    account_type: str
    debit: float = 0.0
    credit: float = 0.0
    memo: Optional[str] = ""


class JournalEntryIn(BaseModel):
    entry_number: Optional[str] = None
    date: Optional[str] = None
    description: str
    lines: List[JournalLine]


class AccountIn(BaseModel):
    id: str
    code: str
    name: str
    type: str  # Asset, Liability, Equity, Income, Expense


class TrialBalanceRequest(BaseModel):
    accounts: List[AccountIn]
    entries: List[JournalEntryIn]
    show_zero: bool = False


class TAccountRequest(BaseModel):
    account: AccountIn
    entries: List[JournalEntryIn]


# ---------- Helpers ----------

def quantize(value: float) -> float:
    """Round to 2 decimal places using banker's rounding."""
    return float(Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def is_debit_normal(account_type: str) -> bool:
    return account_type in ("Asset", "Expense")


# ---------- Endpoints ----------

@app.get("/")
def root():
    return {
        "service": "Accounting Calculation Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "trial_balance": "POST /calculate/trial-balance",
            "t_account": "POST /calculate/t-account",
            "validate_entry": "POST /validate/entry"
        }
    }


@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.post("/validate/entry")
def validate_entry(entry: JournalEntryIn):
    """Validate a single journal entry for double-entry rules."""
    if len(entry.lines) < 2:
        raise HTTPException(status_code=400, detail="At least 2 lines required")

    total_debit = sum(l.debit for l in entry.lines)
    total_credit = sum(l.credit for l in entry.lines)

    for line in entry.lines:
        if line.debit > 0 and line.credit > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Line for {line.account_code} has both debit and credit"
            )
        if line.debit == 0 and line.credit == 0:
            raise HTTPException(
                status_code=400,
                detail=f"Line for {line.account_code} has zero amount"
            )

    balanced = abs(total_debit - total_credit) < 0.01

    return {
        "valid": balanced,
        "total_debit": quantize(total_debit),
        "total_credit": quantize(total_credit),
        "difference": quantize(total_debit - total_credit),
        "message": "Entry is balanced" if balanced else "Entry is NOT balanced"
    }


@app.post("/calculate/trial-balance")
def calculate_trial_balance(req: TrialBalanceRequest):
    """
    Calculate Trial Balance from accounts + journal entries.
    Returns debit/credit columns ready for display.
    """
    # Initialize balances
    balances: Dict[str, Dict[str, Any]] = {}
    for acc in req.accounts:
        balances[acc.id] = {
            "account_id": acc.id,
            "code": acc.code,
            "name": acc.name,
            "type": acc.type,
            "raw_debit": 0.0,
            "raw_credit": 0.0
        }

    # Aggregate
    for entry in req.entries:
        for line in entry.lines:
            if line.account_id in balances:
                balances[line.account_id]["raw_debit"] += line.debit
                balances[line.account_id]["raw_credit"] += line.credit

    rows = []
    total_debit = 0.0
    total_credit = 0.0

    for acc_id, data in balances.items():
        net = data["raw_debit"] - data["raw_credit"]
        tb_debit = 0.0
        tb_credit = 0.0

        if is_debit_normal(data["type"]):
            if net >= 0:
                tb_debit = net
            else:
                tb_credit = abs(net)
        else:
            if net <= 0:
                tb_credit = abs(net)
            else:
                tb_debit = net

        tb_debit = quantize(tb_debit)
        tb_credit = quantize(tb_credit)

        if tb_debit != 0 or tb_credit != 0 or req.show_zero:
            rows.append({
                "account_id": data["account_id"],
                "code": data["code"],
                "name": data["name"],
                "type": data["type"],
                "debit": tb_debit,
                "credit": tb_credit
            })
            total_debit += tb_debit
            total_credit += tb_credit

    # Sort by code
    rows.sort(key=lambda x: x["code"])

    return {
        "as_of": datetime.utcnow().isoformat(),
        "rows": rows,
        "totals": {
            "debit": quantize(total_debit),
            "credit": quantize(total_credit),
            "is_balanced": abs(total_debit - total_credit) < 0.01
        }
    }


@app.post("/calculate/t-account")
def calculate_t_account(req: TAccountRequest):
    """
    Build classic T-Account data for a single account.
    """
    account = req.account
    debit_lines = []
    credit_lines = []
    total_debit = 0.0
    total_credit = 0.0

    for entry in req.entries:
        for line in entry.lines:
            if line.account_id == account.id:
                item = {
                    "date": entry.date,
                    "entry_number": entry.entry_number,
                    "description": entry.description,
                    "amount": quantize(line.debit if line.debit > 0 else line.credit),
                    "memo": line.memo or ""
                }
                if line.debit > 0:
                    debit_lines.append(item)
                    total_debit += line.debit
                else:
                    credit_lines.append(item)
                    total_credit += line.credit

    total_debit = quantize(total_debit)
    total_credit = quantize(total_credit)

    # Balance
    if is_debit_normal(account.type):
        balance_amt = total_debit - total_credit
        side = "Debit" if balance_amt >= 0 else "Credit"
    else:
        balance_amt = total_credit - total_debit
        side = "Credit" if balance_amt >= 0 else "Debit"

    balance_amt = quantize(abs(balance_amt))

    return {
        "account": {
            "id": account.id,
            "code": account.code,
            "name": account.name,
            "type": account.type,
            "normal_balance": "Debit" if is_debit_normal(account.type) else "Credit"
        },
        "debit_lines": debit_lines,
        "credit_lines": credit_lines,
        "totals": {
            "debit": total_debit,
            "credit": total_credit
        },
        "balance": {
            "amount": balance_amt,
            "side": side
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
