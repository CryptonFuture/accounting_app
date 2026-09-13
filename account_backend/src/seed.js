require('dotenv').config();
const mongoose = require('mongoose');
const Account = require('./models/Account');
const JournalEntry = require('./models/JournalEntry');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/accounting';

const defaultAccounts = [
  { code: '1000', name: 'Cash', type: 'Asset', description: 'Cash in hand and bank' },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', description: 'Money owed by customers' },
  { code: '1200', name: 'Inventory', type: 'Asset', description: 'Goods available for sale' },
  { code: '1500', name: 'Equipment', type: 'Asset', description: 'Office and business equipment' },
  { code: '1600', name: 'Furniture', type: 'Asset', description: 'Office furniture' },
  { code: '2000', name: 'Accounts Payable', type: 'Liability', description: 'Money owed to suppliers' },
  { code: '2100', name: 'Loans Payable', type: 'Liability', description: 'Bank loans and borrowings' },
  { code: '3000', name: "Owner's Equity", type: 'Equity', description: 'Owner capital' },
  { code: '3100', name: 'Retained Earnings', type: 'Equity', description: 'Accumulated profits' },
  { code: '4000', name: 'Sales Revenue', type: 'Income', description: 'Revenue from sales' },
  { code: '4100', name: 'Service Revenue', type: 'Income', description: 'Revenue from services' },
  { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', description: 'Direct cost of goods sold' },
  { code: '5100', name: 'Rent Expense', type: 'Expense', description: 'Office and shop rent' },
  { code: '5200', name: 'Salary Expense', type: 'Expense', description: 'Employee salaries' },
  { code: '5300', name: 'Utilities Expense', type: 'Expense', description: 'Electricity, water, internet' },
  { code: '5400', name: 'Depreciation Expense', type: 'Expense', description: 'Asset depreciation' }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Account.deleteMany({});
    await JournalEntry.deleteMany({});
    console.log('Cleared existing data');

    // Insert accounts
    const accounts = await Account.insertMany(defaultAccounts);
    console.log(`Inserted ${accounts.length} accounts`);

    // Create a map for easy lookup
    const accMap = {};
    accounts.forEach(a => { accMap[a.code] = a; });

    // Sample journal entries
    const sampleEntries = [
      {
        date: new Date('2025-01-05'),
        description: 'Owner invested cash into the business',
        reference: 'INV-001',
        lines: [
          { account: accMap['1000']._id, accountCode: '1000', accountName: 'Cash', debit: 500000, credit: 0 },
          { account: accMap['3000']._id, accountCode: '3000', accountName: "Owner's Equity", debit: 0, credit: 500000 }
        ]
      },
      {
        date: new Date('2025-01-08'),
        description: 'Purchased equipment for cash',
        reference: 'EQP-001',
        lines: [
          { account: accMap['1500']._id, accountCode: '1500', accountName: 'Equipment', debit: 120000, credit: 0 },
          { account: accMap['1000']._id, accountCode: '1000', accountName: 'Cash', debit: 0, credit: 120000 }
        ]
      },
      {
        date: new Date('2025-01-10'),
        description: 'Purchased inventory on credit',
        reference: 'PO-001',
        lines: [
          { account: accMap['1200']._id, accountCode: '1200', accountName: 'Inventory', debit: 80000, credit: 0 },
          { account: accMap['2000']._id, accountCode: '2000', accountName: 'Accounts Payable', debit: 0, credit: 80000 }
        ]
      },
      {
        date: new Date('2025-01-15'),
        description: 'Sold goods for cash',
        reference: 'INV-1001',
        lines: [
          { account: accMap['1000']._id, accountCode: '1000', accountName: 'Cash', debit: 45000, credit: 0 },
          { account: accMap['4000']._id, accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: 45000 },
          { account: accMap['5000']._id, accountCode: '5000', accountName: 'Cost of Goods Sold', debit: 25000, credit: 0 },
          { account: accMap['1200']._id, accountCode: '1200', accountName: 'Inventory', debit: 0, credit: 25000 }
        ]
      },
      {
        date: new Date('2025-01-20'),
        description: 'Paid office rent for January',
        reference: 'RENT-JAN',
        lines: [
          { account: accMap['5100']._id, accountCode: '5100', accountName: 'Rent Expense', debit: 15000, credit: 0 },
          { account: accMap['1000']._id, accountCode: '1000', accountName: 'Cash', debit: 0, credit: 15000 }
        ]
      },
      {
        date: new Date('2025-01-25'),
        description: 'Paid salaries',
        reference: 'SAL-JAN',
        lines: [
          { account: accMap['5200']._id, accountCode: '5200', accountName: 'Salary Expense', debit: 35000, credit: 0 },
          { account: accMap['1000']._id, accountCode: '1000', accountName: 'Cash', debit: 0, credit: 35000 }
        ]
      },
      {
        date: new Date('2025-01-28'),
        description: 'Received payment from customer',
        reference: 'REC-001',
        lines: [
          { account: accMap['1000']._id, accountCode: '1000', accountName: 'Cash', debit: 20000, credit: 0 },
          { account: accMap['1100']._id, accountCode: '1100', accountName: 'Accounts Receivable', debit: 0, credit: 20000 }
        ]
      }
    ];

    for (const e of sampleEntries) {
      const entry = new JournalEntry(e);
      await entry.save();
    }
    console.log(`Inserted ${sampleEntries.length} sample journal entries`);

    console.log('\n✅ Seed completed successfully!');
    console.log('You can now start the server and explore the app.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
