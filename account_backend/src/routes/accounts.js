const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// GET all accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find({ isActive: true }).sort({ code: 1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single account
router.get('/:id', async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE account
router.post('/', async (req, res) => {
  try {
    const { code, name, type, description } = req.body;
    if (!code || !name || !type) {
      return res.status(400).json({ error: 'code, name and type are required' });
    }
    const existing = await Account.findOne({ code });
    if (existing) {
      return res.status(400).json({ error: 'Account code already exists' });
    }
    const account = new Account({ code, name, type, description });
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE account
router.put('/:id', async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json({ message: 'Account deactivated', account });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
