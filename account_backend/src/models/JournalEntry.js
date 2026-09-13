const mongoose = require('mongoose');

const journalLineSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  accountCode: String,      // denormalized for easier reporting
  accountName: String,      // denormalized
  debit: {
    type: Number,
    default: 0,
    min: 0
  },
  credit: {
    type: Number,
    default: 0,
    min: 0
  },
  memo: {
    type: String,
    default: ''
  }
}, { _id: false });

const journalEntrySchema = new mongoose.Schema({
  entryNumber: {
    type: String,
    unique: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  reference: {
    type: String,
    default: ''
  },
  lines: {
    type: [journalLineSchema],
    validate: {
      validator: function(lines) {
        if (!lines || lines.length < 2) return false;
        const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
        const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);
        // Allow small floating point difference
        return Math.abs(totalDebit - totalCredit) < 0.01;
      },
      message: 'Journal entry must be balanced (Total Debits must equal Total Credits) and have at least 2 lines'
    }
  },
  totalDebit: {
    type: Number,
    default: 0
  },
  totalCredit: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Draft', 'Posted'],
    default: 'Posted'
  },
  createdBy: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
});

// Pre-save: calculate totals and generate entry number
journalEntrySchema.pre('save', async function(next) {
  if (this.lines && this.lines.length > 0) {
    this.totalDebit = this.lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
    this.totalCredit = this.lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  }

  if (!this.entryNumber) {
    const count = await mongoose.model('JournalEntry').countDocuments();
    this.entryNumber = `JE-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
