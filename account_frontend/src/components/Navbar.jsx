
import React from 'react';
import {
  BookOpen,
  FileText,
  Scale,
  LayoutDashboard,
  List,
  Sparkles,
} from 'lucide-react';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accounts', label: 'Chart of Accounts', icon: List },
  { id: 'journal', label: 'General Entries', icon: FileText },
  { id: 'taccount', label: 'T-Accounts', icon: BookOpen },
  { id: 'trial', label: 'Trial Balance', icon: Scale },
];

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ================= DESKTOP HEADER ================= */}
        <div className="flex h-[72px] items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex min-w-0 items-center gap-3">

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/20">
                <BookOpen size={21} strokeWidth={2.2} />
              </div>

              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                  Accounting App
                </h1>

                <span className="hidden items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-600 lg:inline-flex">
                  <Sparkles size={10} />
                  Pro
                </span>
              </div>

              <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
                Double-Entry Bookkeeping
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center rounded-2xl border border-slate-200 bg-slate-50/80 p-1.5 shadow-inner md:flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 lg:px-4 ${
                    isActive
                      ? 'bg-white text-primary-700 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'bg-transparent text-slate-400 group-hover:text-slate-600'
                    }`}
                  >
                    <Icon size={16} strokeWidth={2} />
                  </span>

                  <span className="hidden lg:inline">
                    {tab.label}
                  </span>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -bottom-[7px] left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right side status */}
          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-semibold text-slate-600">
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* ================= MOBILE TABS ================= */}
        <div className="md:hidden -mx-1 overflow-x-auto pb-3 scrollbar-hide">
          <div className="flex min-w-max gap-1.5 px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'border-primary-200 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-transparent bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-800'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                      isActive
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-slate-400'
                    }`}
                  >
                    <Icon size={14} />
                  </span>

                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

