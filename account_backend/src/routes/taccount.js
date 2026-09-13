const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const Account = require('../models/Account');

// GET T-Account for a specific account
router.get('/:accountId', async (req, res) => {
  try {
    const account = await Account.findById(req.params.accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Find all journal entries that touch this account
    const entries = await JournalEntry.find({
      'lines.account': account._id,
      status: 'Posted'
    }).sort({ date: 1, createdAt: 1 });

    const debitLines = [];
    const creditLines = [];
    let totalDebit = 0;
    let totalCredit = 0;

    for (const entry of entries) {
      for (const line of entry.lines) {
        if (line.account.toString() === account._id.toString()) {
          const item = {
            date: entry.date,
            entryNumber: entry.entryNumber,
            description: entry.description,
            amount: line.debit > 0 ? line.debit : line.credit,
            memo: line.memo
          };
          if (line.debit > 0) {
            debitLines.push(item);
            totalDebit += line.debit;
          } else {
            creditLines.push(item);
            totalCredit += line.credit;
          }
        }
      }
    }

    // Calculate balance based on normal balance side
    let balance = 0;
    let balanceSide = 'Debit';

    if (['Asset', 'Expense'].includes(account.type)) {
      // Debit normal balance
      balance = totalDebit - totalCredit;
      balanceSide = balance >= 0 ? 'Debit' : 'Credit';
      if (balance < 0) balance = Math.abs(balance);
    } else {
      // Credit normal balance
      balance = totalCredit - totalDebit;
      balanceSide = balance >= 0 ? 'Credit' : 'Debit';
      if (balance < 0) balance = Math.abs(balance);
    }

    res.json({
      account: {
        _id: account._id,
        code: account.code,
        name: account.name,
        type: account.type,
        normalBalance: account.normalBalance
      },
      debitLines,
      creditLines,
      totals: {
        debit: totalDebit,
        credit: totalCredit
      },
      balance: {
        amount: Number(balance.toFixed(2)),
        side: balanceSide
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
