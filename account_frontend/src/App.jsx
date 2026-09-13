import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChartOfAccounts from './components/ChartOfAccounts';
import JournalEntries from './components/JournalEntries';
import TAccount from './components/TAccount';
import TrialBalance from './components/TrialBalance';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'accounts':
        return <ChartOfAccounts />;
      case 'journal':
        return <JournalEntries />;
      case 'taccount':
        return <TAccount />;
      case 'trial':
        return <TrialBalance />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-slate-500">
          Accounting Application • Journal Entries • T-Accounts • Trial Balance • Built with React + Node.js + MongoDB + Python
        </div>
      </footer>
    </div>
  );
}

export default App;
