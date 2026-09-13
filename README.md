# Accounting Application

Complete double-entry accounting system with:

- **General Journal Entries** (Journal Entries)
- **T-Accounts** (Ledger view)
- **Trial Balance**
- Chart of Accounts

## Tech Stack

| Layer          | Technology                  |
|----------------|-----------------------------|
| Frontend       | React + Vite + Tailwind CSS |
| Backend        | Node.js + Express.js        |
| Database       | MongoDB + Mongoose          |
| Python Service | FastAPI (for advanced calculations & validation) |

## Features

1. **Chart of Accounts** – Create, edit, delete accounts (Assets, Liabilities, Equity, Income, Expenses)
2. **General Entries (Journal)** – Create balanced journal entries with multiple debit/credit lines
3. **T-Accounts** – View any account in classic T-format with running balance
4. **Trial Balance** – Auto-generate Trial Balance from all posted entries
5. Double-entry validation (Debits must equal Credits)

## Project Structure

```
accounting-app/
├── backend/                 # Node.js + Express + MongoDB
├── frontend/                # React + Vite
├── python-service/          # FastAPI microservice
├── docker-compose.yml       # MongoDB (optional)
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)
- npm / yarn

## Quick Start

### 1. Start MongoDB

```bash
# Using Docker
docker-compose up -d

# OR use local MongoDB / MongoDB Atlas
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env if needed (default: mongodb://localhost:27017/accounting)

npm install
npm run dev
```

Backend runs on: **http://localhost:5000**

### 3. Python Service (Optional but recommended)

```bash
cd python-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Python service runs on: **http://localhost:8000**

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

## API Endpoints

### Accounts
- `GET    /api/accounts`          – List all accounts
- `POST   /api/accounts`          – Create account
- `PUT    /api/accounts/:id`      – Update account
- `DELETE /api/accounts/:id`      – Delete account

### Journal Entries
- `GET    /api/journal`           – List all journal entries
- `POST   /api/journal`           – Create journal entry (must be balanced)
- `GET    /api/journal/:id`       – Get single entry
- `DELETE /api/journal/:id`       – Delete entry

### T-Account
- `GET    /api/taccount/:accountId` – Get T-Account data for an account

### Trial Balance
- `GET    /api/trial-balance`     – Generate current Trial Balance

### Python Service
- `POST   /calculate/trial-balance` – Advanced trial balance calculation
- `POST   /calculate/t-account`     – Advanced T-account calculation

## Sample Chart of Accounts (auto-seeded)

| Code | Name                  | Type      |
|------|-----------------------|-----------|
| 1000 | Cash                  | Asset     |
| 1100 | Accounts Receivable   | Asset     |
| 1200 | Inventory             | Asset     |
| 1500 | Equipment             | Asset     |
| 2000 | Accounts Payable      | Liability |
| 3000 | Owner's Equity        | Equity    |
| 4000 | Sales Revenue         | Income    |
| 5000 | Cost of Goods Sold    | Expense   |
| 5100 | Rent Expense          | Expense   |
| 5200 | Salary Expense        | Expense   |

## How Double-Entry Works

Every journal entry must have:
- Total Debits = Total Credits
- At least one debit and one credit line

Example Entry:
```
Date: 2025-01-15
Description: Purchased equipment for cash

Dr. Equipment          50,000
   Cr. Cash                     50,000
```

## Notes

- All amounts are stored as numbers (use 2 decimal places in UI)
- Deleting a journal entry reverses the effect on accounts
- Trial Balance shows only accounts with non-zero balances by default
- Python service can be used for heavy calculations or audit validation

## License

MIT
# accounting_app
