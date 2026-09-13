const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const Account = require('../models/Account');

// GET all journal entries
router.get('/', async (req, res) => {
  try {
    const entries = await JournalEntry.find()
      .populate('lines.account', 'code name type')
      .sort({ date: -1, createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id)
      .populate('lines.account', 'code name type');
    if (!entry) return res.status(404).json({ error: 'Journal entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE journal entry
router.post('/', async (req, res) => {
  try {
    const { date, description, reference, lines } = req.body;

    if (!description || !lines || !Array.isArray(lines) || lines.length < 2) {
      return res.status(400).json({ error: 'Description and at least 2 lines are required' });
    }

    // Enrich lines with account details
    const enrichedLines = [];
    for (const line of lines) {
      if (!line.account) {
        return res.status(400).json({ error: 'Each line must have an account' });
      }
      const acc = await Account.findById(line.account);
      if (!acc) {
        return res.status(400).json({ error: `Account not found: ${line.account}` });
      }
      const debit = Number(line.debit) || 0;
      const credit = Number(line.credit) || 0;
      if (debit > 0 && credit > 0) {
        return res.status(400).json({ error: 'A line cannot have both debit and credit' });
      }
      if (debit === 0 && credit === 0) {
        return res.status(400).json({ error: 'Each line must have either debit or credit' });
      }
      enrichedLines.push({
        account: acc._id,
        accountCode: acc.code,
        accountName: acc.name,
        debit,
        credit,
        memo: line.memo || ''
      });
    }

    const totalDebit = enrichedLines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = enrichedLines.reduce((s, l) => s + l.credit, 0);

    if (Math.abs(totalDebit - totalCredit) >= 0.01) {
      return res.status(400).json({
        error: `Entry is not balanced. Debits: ${totalDebit.toFixed(2)}, Credits: ${totalCredit.toFixed(2)}`
      });
    }

    const entry = new JournalEntry({
      date: date || new Date(),
      description,
      reference: reference || '',
      lines: enrichedLines,
      totalDebit,
      totalCredit,
      status: 'Posted'
    });

    await entry.save();
    const populated = await JournalEntry.findById(entry._id)
      .populate('lines.account', 'code name type');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE journal entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await JournalEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Journal entry not found' });
    res.json({ message: 'Journal entry deleted', entryNumber: entry.entryNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
