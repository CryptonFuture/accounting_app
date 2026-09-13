const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Asset', 'Liability', 'Equity', 'Income', 'Expense']
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for normal balance side
accountSchema.virtual('normalBalance').get(function() {
  return ['Asset', 'Expense'].includes(this.type) ? 'Debit' : 'Credit';
});

accountSchema.set('toJSON', { virtuals: true });
accountSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Account', accountSchema);
