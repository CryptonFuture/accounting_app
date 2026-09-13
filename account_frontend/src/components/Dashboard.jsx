import React, { useEffect, useState } from 'react';
import {
  getAccounts,
  getJournalEntries,
  getTrialBalance,
} from '../api';

import {
  FileText,
  List,
  Scale,
  BookOpen,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Activity,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const [stats, setStats] = useState({
    accounts: 0,
    entries: 0,
    trialBalanced: null,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [accRes, jeRes, tbRes] = await Promise.all([
          getAccounts(),
          getJournalEntries(),
          getTrialBalance(),
        ]);

        setStats({
          accounts: accRes.data.length,
          entries: jeRes.data.length,
          trialBalanced: tbRes.data.totals.isBalanced,
          loading: false,
        });
      } catch (err) {
        console.error(err);

        setStats((s) => ({
          ...s,
          loading: false,
        }));
      }
    }

    load();
  }, []);

  const cards = [
    {
      title: 'Chart of Accounts',
      value: stats.accounts,
      icon: List,
      color: 'blue',
      tab: 'accounts',
      desc: 'Active ledger accounts',
    },
    {
      title: 'Journal Entries',
      value: stats.entries,
      icon: FileText,
      color: 'emerald',
      tab: 'journal',
      desc: 'Posted general entries',
    },
    {
      title: 'T-Accounts',
      value: 'View',
      icon: BookOpen,
      color: 'violet',
      tab: 'taccount',
      desc: 'Ledger in T-format',
    },
    {
      title: 'Trial Balance',
      value:
        stats.trialBalanced === null
          ? '—'
          : stats.trialBalanced
            ? 'Balanced'
            : 'Unbalanced',
      icon: Scale,
      color: stats.trialBalanced
        ? 'emerald'
        : 'amber',
      tab: 'trial',
      desc: 'Current trial balance status',
    },
  ];

  const colorMap = {
    blue: {
      icon: 'bg-blue-500',
      iconLight: 'bg-blue-50',
      iconText: 'text-blue-600',
      glow: 'bg-blue-500/10',
      hover: 'group-hover:border-blue-200',
      value: 'group-hover:text-blue-700',
    },
    emerald: {
      icon: 'bg-emerald-500',
      iconLight: 'bg-emerald-50',
      iconText: 'text-emerald-600',
      glow: 'bg-emerald-500/10',
      hover: 'group-hover:border-emerald-200',
      value: 'group-hover:text-emerald-700',
    },
    violet: {
      icon: 'bg-violet-500',
      iconLight: 'bg-violet-50',
      iconText: 'text-violet-600',
      glow: 'bg-violet-500/10',
      hover: 'group-hover:border-violet-200',
      value: 'group-hover:text-violet-700',
    },
    amber: {
      icon: 'bg-amber-500',
      iconLight: 'bg-amber-50',
      iconText: 'text-amber-600',
      glow: 'bg-amber-500/10',
      hover: 'group-hover:border-amber-200',
      value: 'group-hover:text-amber-700',
    },
  };

  return (
    <div className="min-h-full">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-7 shadow-xl">

        {/* Background decoration */}

        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-8 top-8 hidden sm:block opacity-10">
          <Activity size={100} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-4">

              <Sparkles
                size={13}
                className="text-blue-300"
              />

              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Accounting Overview
              </span>

            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Dashboard
            </h2>

            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Monitor your accounts, journal entries and
              financial balance from one place.
            </p>

          </div>

          {/* System status */}

          <div className="shrink-0">

            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">

              <div className="relative">

                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Activity
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <span className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />

              </div>

              <div>

                <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                  System Status
                </p>

                <p className="text-xs font-bold text-emerald-400 mt-0.5">
                  All Systems Operational
                </p>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {stats.loading ? (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-36 rounded-2xl bg-white border border-slate-200 p-5 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className="w-28 h-3 bg-slate-200 rounded" />
                  <div className="w-16 h-7 bg-slate-200 rounded" />
                  <div className="w-36 h-2.5 bg-slate-100 rounded" />
                </div>

                <div className="w-11 h-11 bg-slate-200 rounded-xl" />
              </div>
            </div>
          ))}

        </div>

      ) : (

        <>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            {cards.map((card) => {
              const Icon = card.icon;
              const colors = colorMap[card.color];

              return (
                <button
                  key={card.tab}
                  onClick={() =>
                    setActiveTab(card.tab)
                  }
                  className={`
                    group relative overflow-hidden
                    bg-white rounded-2xl
                    border border-slate-200
                    p-5 text-left
                    shadow-sm
                    hover:shadow-xl
                    hover:-translate-y-1
                    ${colors.hover}
                    transition-all duration-300
                  `}
                >

                  {/* Background glow */}

                  <div
                    className={`
                      absolute -right-8 -top-8
                      w-28 h-28 rounded-full
                      ${colors.glow}
                      blur-2xl
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                    `}
                  />

                  <div className="relative z-10">

                    <div className="flex items-start justify-between">

                      <div className="min-w-0">

                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {card.title}
                        </p>

                        <p
                          className={`
                            text-2xl font-black
                            text-slate-800
                            mt-2
                            ${colors.value}
                            transition-colors
                          `}
                        >
                          {card.value}
                        </p>

                        <p className="text-xs text-slate-400 mt-2">
                          {card.desc}
                        </p>

                      </div>

                      <div
                        className={`
                          shrink-0
                          w-11 h-11
                          rounded-xl
                          ${colors.iconLight}
                          flex items-center justify-center
                          ${colors.iconText}
                          group-hover:scale-110
                          transition-transform duration-300
                        `}
                      >
                        <Icon size={20} />
                      </div>

                    </div>

                    {/* Bottom action */}

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">

                      <span
                        className={`
                          text-[10px] font-bold
                          ${colors.iconText}
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
                        `}
                      >
                        Open module
                      </span>

                      <ArrowUpRight
                        size={15}
                        className="
                          ml-auto
                          text-slate-300
                          group-hover:text-slate-600
                          group-hover:translate-x-0.5
                          group-hover:-translate-y-0.5
                          transition-all
                        "
                      />

                    </div>

                  </div>

                </button>
              );
            })}

          </div>

          {/* =================================================
              QUICK START + BALANCE STATUS
          ================================================= */}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* ===============================================
                QUICK START
            =============================================== */}

            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              {/* Header */}

              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <TrendingUp
                      size={19}
                      className="text-primary-600"
                    />
                  </div>

                  <div>

                    <h3 className="text-base font-bold text-slate-800">
                      Quick Start Guide
                    </h3>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Get started with your accounting workflow
                    </p>

                  </div>

                </div>

                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 border border-slate-100">

                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />

                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                    4 Steps
                  </span>

                </div>

              </div>

              {/* Steps */}

              <div className="p-5 sm:p-6">

                <div className="space-y-3">

                  {/* Step 1 */}

                  <button
                    onClick={() =>
                      setActiveTab('accounts')
                    }
                    className="w-full group flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all text-left"
                  >

                    <div className="w-9 h-9 shrink-0 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">
                      01
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-bold text-slate-700 group-hover:text-blue-700">
                        Set up Chart of Accounts
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Make sure your ledger accounts are configured.
                      </p>

                    </div>

                    <ChevronRight
                      size={17}
                      className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                    />

                  </button>

                  {/* Step 2 */}

                  <button
                    onClick={() =>
                      setActiveTab('journal')
                    }
                    className="w-full group flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all text-left"
                  >

                    <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm">
                      02
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">
                        Create Journal Entries
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Record transactions with balanced debits and credits.
                      </p>

                    </div>

                    <ChevronRight
                      size={17}
                      className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"
                    />

                  </button>

                  {/* Step 3 */}

                  <button
                    onClick={() =>
                      setActiveTab('taccount')
                    }
                    className="w-full group flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/40 transition-all text-left"
                  >

                    <div className="w-9 h-9 shrink-0 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-black text-sm">
                      03
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-bold text-slate-700 group-hover:text-violet-700">
                        Review T-Accounts
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Inspect account-level debit and credit activity.
                      </p>

                    </div>

                    <ChevronRight
                      size={17}
                      className="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all"
                    />

                  </button>

                  {/* Step 4 */}

                  <button
                    onClick={() =>
                      setActiveTab('trial')
                    }
                    className="w-full group flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/40 transition-all text-left"
                  >

                    <div className="w-9 h-9 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm">
                      04
                    </div>

                    <div className="flex-1">

                      <p className="text-sm font-bold text-slate-700 group-hover:text-amber-700">
                        Generate Trial Balance
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Verify that total debits equal total credits.
                      </p>

                    </div>

                    <ChevronRight
                      size={17}
                      className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all"
                    />

                  </button>

                </div>

              </div>

            </div>

            {/* ===============================================
                TRIAL BALANCE STATUS
            =============================================== */}

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-xl">

              <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="absolute -left-20 -bottom-20 w-52 h-52 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative z-10 p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Financial Health
                    </p>

                    <h3 className="text-lg font-bold text-white mt-1">
                      Trial Balance
                    </h3>

                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">

                    <Scale
                      size={18}
                      className="text-emerald-400"
                    />

                  </div>

                </div>

                <div className="mt-8 flex justify-center">

                  <div
                    className={`
                      relative
                      w-32 h-32
                      rounded-full
                      border-4
                      ${
                        stats.trialBalanced
                          ? 'border-emerald-400/30'
                          : 'border-amber-400/30'
                      }
                      flex items-center justify-center
                    `}
                  >

                    <div
                      className={`
                        absolute inset-2 rounded-full
                        ${
                          stats.trialBalanced
                            ? 'bg-emerald-500/10'
                            : 'bg-amber-500/10'
                        }
                        flex items-center justify-center
                      `}
                    >

                      {stats.trialBalanced ? (
                        <CheckCircle2
                          size={45}
                          className="text-emerald-400"
                        />
                      ) : (
                        <AlertCircle
                          size={45}
                          className="text-amber-400"
                        />
                      )}

                    </div>

                  </div>

                </div>

                <div className="text-center mt-6">

                  <p className="text-lg font-black">
                    {stats.trialBalanced
                      ? 'Books are Balanced'
                      : 'Review Required'}
                  </p>

                  <p className="text-xs text-slate-400 mt-2 leading-5">
                    {stats.trialBalanced
                      ? 'Total debits and credits are currently equal.'
                      : 'Your accounts may require review before closing.'}
                  </p>

                </div>

                <button
                  onClick={() =>
                    setActiveTab('trial')
                  }
                  className="w-full mt-6 h-11 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all flex items-center justify-center gap-2"
                >
                  View Trial Balance
                  <ArrowUpRight size={14} />
                </button>

              </div>

            </div>

          </div>

          {/* =================================================
              TIP
          ================================================= */}

          <div className="mt-6 relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">

            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-amber-200/30 blur-2xl" />

            <div className="relative flex items-start gap-3">

              <div className="w-9 h-9 shrink-0 rounded-xl bg-white border border-amber-200 flex items-center justify-center shadow-sm">

                <AlertCircle
                  size={18}
                  className="text-amber-600"
                />

              </div>

              <div>

                <p className="text-xs font-black text-amber-900">
                  Development Tip
                </p>

                <p className="text-xs text-amber-800/80 mt-1 leading-5">
                  Run{' '}
                  <code className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-200 font-mono font-bold">
                    npm run seed
                  </code>{' '}
                  in the backend folder to load sample
                  Chart of Accounts and journal entries for testing.
                </p>

              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}
