const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const Account = require('../models/Account');

// GET Trial Balance
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find({ isActive: true }).sort({ code: 1 });
    const entries = await JournalEntry.find({ status: 'Posted' });

    // Build map of account balances
    const balanceMap = {};

    for (const acc of accounts) {
      balanceMap[acc._id.toString()] = {
        accountId: acc._id,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        debit: 0,
        credit: 0
      };
    }

    // Aggregate from all journal lines
    for (const entry of entries) {
      for (const line of entry.lines) {
        const key = line.account.toString();
        if (balanceMap[key]) {
          balanceMap[key].debit += Number(line.debit) || 0;
          balanceMap[key].credit += Number(line.credit) || 0;
        }
      }
    }

    // Calculate final debit/credit columns for Trial Balance
    const rows = [];
    let totalDebit = 0;
    let totalCredit = 0;

    for (const key of Object.keys(balanceMap)) {
      const row = balanceMap[key];
      let tbDebit = 0;
      let tbCredit = 0;

      const net = row.debit - row.credit;

      if (['Asset', 'Expense'].includes(row.type)) {
        // Debit normal
        if (net >= 0) {
          tbDebit = net;
        } else {
          tbCredit = Math.abs(net);
        }
      } else {
        // Credit normal (Liability, Equity, Income)
        if (net <= 0) {
          tbCredit = Math.abs(net);
        } else {
          tbDebit = net;
        }
      }

      // Only include accounts with activity (optional: show zero balances too)
      if (tbDebit !== 0 || tbCredit !== 0 || req.query.showZero === 'true') {
        rows.push({
          accountId: row.accountId,
          code: row.code,
          name: row.name,
          type: row.type,
          debit: Number(tbDebit.toFixed(2)),
          credit: Number(tbCredit.toFixed(2))
        });
        totalDebit += tbDebit;
        totalCredit += tbCredit;
      }
    }

    res.json({
      asOf: new Date(),
      rows,
      totals: {
        debit: Number(totalDebit.toFixed(2)),
        credit: Number(totalCredit.toFixed(2)),
        isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
