import React, { useEffect, useState } from 'react';
import {
  getAccounts,
  createAccount,
  deleteAccount,
} from '../api';

import {
  Plus,
  Trash2,
  RefreshCw,
  List,
  Search,
  X,
  Save,
  ChevronRight,
  WalletCards,
  Landmark,
  TrendingUp,
  Receipt,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const ACCOUNT_TYPES = [
  'Asset',
  'Liability',
  'Equity',
  'Income',
  'Expense',
];

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    code: '',
    name: '',
    type: 'Asset',
    description: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const load = async () => {
    setLoading(true);

    try {
      const res = await getAccounts();
      setAccounts(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to load accounts'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =====================================================
     CREATE ACCOUNT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    try {
      await createAccount(form);

      setSuccess(
        'Account created successfully'
      );

      setForm({
        code: '',
        name: '',
        type: 'Asset',
        description: '',
      });

      setShowForm(false);

      load();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to create account'
      );
    }
  };

  /* =====================================================
     DELETE / DEACTIVATE
  ===================================================== */

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Deactivate account "${name}"?`
      )
    ) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await deleteAccount(id);

      setSuccess('Account deactivated');

      load();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to delete'
      );
    }
  };

  /* =====================================================
     COLORS
  ===================================================== */

  const typeColors = {
    Asset: {
      badge:
        'bg-blue-50 text-blue-700 border-blue-100',
      icon:
        'bg-blue-50 text-blue-600',
    },

    Liability: {
      badge:
        'bg-red-50 text-red-700 border-red-100',
      icon:
        'bg-red-50 text-red-600',
    },

    Equity: {
      badge:
        'bg-violet-50 text-violet-700 border-violet-100',
      icon:
        'bg-violet-50 text-violet-600',
    },

    Income: {
      badge:
        'bg-emerald-50 text-emerald-700 border-emerald-100',
      icon:
        'bg-emerald-50 text-emerald-600',
    },

    Expense: {
      badge:
        'bg-orange-50 text-orange-700 border-orange-100',
      icon:
        'bg-orange-50 text-orange-600',
    },
  };

  /* =====================================================
     FILTER ACCOUNTS
  ===================================================== */

  const filteredAccounts = accounts.filter(
    (acc) => {
      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        acc.code
          ?.toLowerCase()
          .includes(searchValue) ||
        acc.name
          ?.toLowerCase()
          .includes(searchValue) ||
        acc.description
          ?.toLowerCase()
          .includes(searchValue);

      const matchesType =
        typeFilter === 'All' ||
        acc.type === typeFilter;

      return (
        matchesSearch &&
        matchesType
      );
    }
  );

  /* =====================================================
     ACCOUNT COUNTS
  ===================================================== */

  const accountStats = {
    total: accounts.length,

    assets: accounts.filter(
      (a) => a.type === 'Asset'
    ).length,

    liabilities: accounts.filter(
      (a) => a.type === 'Liability'
    ).length,

    incomeExpense: accounts.filter(
      (a) =>
        a.type === 'Income' ||
        a.type === 'Expense'
    ).length,
  };

  return (
    <div className="min-h-full">

      {/* =====================================================
          PREMIUM HEADER
      ===================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-7 mb-6 shadow-xl">

        {/* Background glow */}

        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="absolute right-10 top-8 opacity-10 hidden sm:block">
          <WalletCards size={100} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-4">

              <Sparkles
                size={13}
                className="text-blue-300"
              />

              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300">
                General Ledger
              </span>

            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Chart of Accounts
            </h2>

            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Organize and manage your financial ledger
              accounts from one centralized workspace.
            </p>

          </div>

          {/* Header actions */}

          <div className="flex flex-wrap gap-2">

            <button
              onClick={load}
              disabled={loading}
              className="
                h-11 px-4
                rounded-xl
                bg-white/10
                hover:bg-white/15
                border border-white/10
                text-white
                text-xs font-bold
                flex items-center gap-2
                transition-all
              "
            >

              <RefreshCw
                size={15}
                className={
                  loading
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh

            </button>

            <button
              onClick={() =>
                setShowForm(!showForm)
              }
              className="
                h-11 px-4
                rounded-xl
                bg-primary-600
                hover:bg-primary-500
                text-white
                text-xs font-bold
                flex items-center gap-2
                shadow-lg shadow-primary-600/20
                transition-all
              "
            >

              {showForm ? (
                <X size={16} />
              ) : (
                <Plus size={16} />
              )}

              {showForm
                ? 'Close Form'
                : 'New Account'}

            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (
        <div className="mb-5 flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">

          <div className="w-8 h-8 shrink-0 rounded-lg bg-red-100 flex items-center justify-center">
            <X size={16} />
          </div>

          <div className="flex-1">

            <p className="text-xs font-black">
              Something went wrong
            </p>

            <p className="text-xs mt-1 text-red-600">
              {error}
            </p>

          </div>

          <button
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-600"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {success && (
        <div className="mb-5 flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">

          <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
            <ShieldCheck size={16} />
          </div>

          <div className="flex-1">

            <p className="text-xs font-black">
              Success
            </p>

            <p className="text-xs mt-1 text-emerald-600">
              {success}
            </p>

          </div>

          <button
            onClick={() => setSuccess('')}
            className="text-emerald-400 hover:text-emerald-600"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">

        {/* Total */}

        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-blue-500/10 blur-xl" />

          <div className="relative flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <List size={18} />
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Total Accounts
              </p>

              <p className="text-xl font-black text-slate-800 mt-0.5">
                {accountStats.total}
              </p>

            </div>

          </div>

        </div>

        {/* Assets */}

        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

          <div className="relative flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Landmark size={18} />
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Assets
              </p>

              <p className="text-xl font-black text-slate-800 mt-0.5">
                {accountStats.assets}
              </p>

            </div>

          </div>

        </div>

        {/* Liabilities */}

        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

          <div className="relative flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Receipt size={18} />
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Liabilities
              </p>

              <p className="text-xl font-black text-slate-800 mt-0.5">
                {accountStats.liabilities}
              </p>

            </div>

          </div>

        </div>

        {/* Income / Expense */}

        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

          <div className="relative flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>

            <div>

              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Income / Expense
              </p>

              <p className="text-xl font-black text-slate-800 mt-0.5">
                {accountStats.incomeExpense}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          CREATE ACCOUNT FORM
      ===================================================== */}

      {showForm && (

        <form
          onSubmit={handleSubmit}
          className="
            relative overflow-hidden
            bg-white
            border border-slate-200
            rounded-2xl
            p-5 sm:p-6
            mb-6
            shadow-sm
          "
        >

          <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-primary-500/5 blur-3xl" />

          <div className="relative">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Plus size={19} />
              </div>

              <div>

                <h3 className="text-base font-black text-slate-800">
                  Add New Account
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Create a new ledger account
                </p>

              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Code */}

              <div>

                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">
                  Account Code *
                </label>

                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value,
                    })
                  }
                  className="
                    w-full h-11
                    border border-slate-200
                    bg-slate-50
                    rounded-xl
                    px-3.5
                    text-sm
                    font-medium
                    text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    focus:bg-white
                    focus:ring-4
                    focus:ring-primary-500/10
                    focus:border-primary-500
                    transition
                  "
                  placeholder="e.g. 1000"
                />

              </div>

              {/* Name */}

              <div>

                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">
                  Account Name *
                </label>

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="
                    w-full h-11
                    border border-slate-200
                    bg-slate-50
                    rounded-xl
                    px-3.5
                    text-sm
                    font-medium
                    text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    focus:bg-white
                    focus:ring-4
                    focus:ring-primary-500/10
                    focus:border-primary-500
                    transition
                  "
                  placeholder="e.g. Cash"
                />

              </div>

              {/* Type */}

              <div>

                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">
                  Account Type *
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                  className="
                    w-full h-11
                    border border-slate-200
                    bg-slate-50
                    rounded-xl
                    px-3.5
                    text-sm
                    font-medium
                    text-slate-800
                    outline-none
                    focus:bg-white
                    focus:ring-4
                    focus:ring-primary-500/10
                    focus:border-primary-500
                    transition
                  "
                >
                  {ACCOUNT_TYPES.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>

              </div>

              {/* Description */}

              <div>

                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">
                  Description
                </label>

                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description:
                        e.target.value,
                    })
                  }
                  className="
                    w-full h-11
                    border border-slate-200
                    bg-slate-50
                    rounded-xl
                    px-3.5
                    text-sm
                    font-medium
                    text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    focus:bg-white
                    focus:ring-4
                    focus:ring-primary-500/10
                    focus:border-primary-500
                    transition
                  "
                  placeholder="Optional"
                />

              </div>

            </div>

            {/* Form actions */}

            <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-2">

              <button
                type="submit"
                className="
                  h-10 px-4
                  rounded-xl
                  bg-primary-600
                  hover:bg-primary-700
                  text-white
                  text-xs font-bold
                  flex items-center gap-2
                  shadow-lg shadow-primary-600/20
                  transition-all
                "
              >

                <Save size={15} />

                Save Account

              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="
                  h-10 px-4
                  rounded-xl
                  border border-slate-200
                  bg-white
                  hover:bg-slate-50
                  text-slate-600
                  text-xs font-bold
                  flex items-center gap-2
                  transition
                "
              >

                <X size={15} />

                Cancel

              </button>

            </div>

          </div>

        </form>
      )}

      {/* =====================================================
          ACCOUNTS TABLE
      ===================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        {/* Table Header */}

        <div className="p-4 sm:p-5 border-b border-slate-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <List size={18} />
              </div>

              <div>

                <h3 className="text-sm font-black text-slate-800">
                  All Accounts
                </h3>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  {filteredAccounts.length} of{' '}
                  {accounts.length} accounts shown
                </p>

              </div>

            </div>

            {/* Search */}

            <div className="flex flex-col sm:flex-row gap-2">

              <div className="relative">

                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search accounts..."
                  className="
                    w-full sm:w-56
                    h-10
                    pl-9 pr-3
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    text-xs
                    outline-none
                    focus:bg-white
                    focus:border-primary-500
                    focus:ring-4
                    focus:ring-primary-500/10
                  "
                />

              </div>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
                className="
                  h-10
                  px-3
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  text-xs font-medium
                  text-slate-600
                  outline-none
                  focus:bg-white
                  focus:border-primary-500
                "
              >
                <option value="All">
                  All Types
                </option>

                {ACCOUNT_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="p-10">

            <div className="space-y-4">

              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 animate-pulse"
                  >

                    <div className="w-16 h-4 bg-slate-200 rounded" />

                    <div className="w-32 h-4 bg-slate-200 rounded" />

                    <div className="w-20 h-6 bg-slate-200 rounded-full" />

                    <div className="flex-1 h-4 bg-slate-100 rounded" />

                  </div>
                )
              )}

            </div>

          </div>

        ) : accounts.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="p-12 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">

              <WalletCards
                size={27}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-5 text-sm font-black text-slate-700">
              No accounts found
            </h3>

            <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
              Run the seed script or create your
              first ledger account manually.
            </p>

            <button
              onClick={() =>
                setShowForm(true)
              }
              className="
                mt-5
                h-10 px-4
                rounded-xl
                bg-primary-600
                hover:bg-primary-700
                text-white
                text-xs font-bold
                inline-flex items-center gap-2
              "
            >

              <Plus size={15} />

              Create Account

            </button>

          </div>

        ) : filteredAccounts.length === 0 ? (

          /* =================================================
             NO SEARCH RESULTS
          ================================================= */

          <div className="p-12 text-center">

            <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">

              <Search
                size={23}
                className="text-slate-400"
              />

            </div>

            <h3 className="mt-4 text-sm font-black text-slate-700">
              No matching accounts
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or account type.
            </p>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-50/80 border-b border-slate-200">

                <tr>

                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider font-black text-slate-400">
                    Code
                  </th>

                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider font-black text-slate-400">
                    Account
                  </th>

                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider font-black text-slate-400">
                    Type
                  </th>

                  <th className="text-left px-5 py-3.5 text-[10px] uppercase tracking-wider font-black text-slate-400">
                    Description
                  </th>

                  <th className="text-right px-5 py-3.5 text-[10px] uppercase tracking-wider font-black text-slate-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredAccounts.map(
                  (acc) => {

                    const colors =
                      typeColors[
                        acc.type
                      ] || {
                        badge:
                          'bg-slate-100 text-slate-600 border-slate-200',
                        icon:
                          'bg-slate-100 text-slate-600',
                      };

                    return (
                      <tr
                        key={acc._id}
                        className="
                          group
                          hover:bg-slate-50/80
                          transition-colors
                        "
                      >

                        {/* Code */}

                        <td className="px-5 py-4">

                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-slate-700">
                            {acc.code}
                          </span>

                        </td>

                        {/* Name */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div
                              className={`
                                w-9 h-9
                                rounded-xl
                                flex items-center justify-center
                                ${colors.icon}
                              `}
                            >
                              <WalletCards
                                size={16}
                              />
                            </div>

                            <div>

                              <p className="font-bold text-slate-800">
                                {acc.name}
                              </p>

                              <p className="text-[10px] text-slate-400 mt-0.5">
                                Ledger account
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* Type */}

                        <td className="px-5 py-4">

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              px-2.5 py-1
                              rounded-full
                              border
                              text-[10px]
                              font-bold
                              ${colors.badge}
                            `}
                          >

                            <span className="w-1.5 h-1.5 rounded-full bg-current" />

                            {acc.type}

                          </span>

                        </td>

                        {/* Description */}

                        <td className="px-5 py-4 max-w-xs">

                          <p className="text-xs text-slate-500 truncate">
                            {acc.description ||
                              'No description'}
                          </p>

                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              handleDelete(
                                acc._id,
                                acc.name
                              )
                            }
                            className="
                              w-9 h-9
                              inline-flex
                              items-center
                              justify-center
                              rounded-xl
                              text-slate-400
                              hover:text-red-600
                              hover:bg-red-50
                              border border-transparent
                              hover:border-red-100
                              transition-all
                            "
                            title="Deactivate account"
                          >

                            <Trash2 size={16} />

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

        {/* =================================================
            TABLE FOOTER
        ================================================= */}

        {!loading &&
          accounts.length > 0 &&
          filteredAccounts.length > 0 && (

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">

              <p className="text-[10px] text-slate-400">
                Showing{' '}
                <span className="font-bold text-slate-600">
                  {filteredAccounts.length}
                </span>{' '}
                accounts
              </p>

              <div className="flex items-center gap-1 text-[10px] text-slate-400">

                <span>
                  Chart of Accounts
                </span>

                <ChevronRight size={12} />

                <span className="font-bold text-slate-600">
                  Ledger
                </span>

              </div>

            </div>
          )}

      </div>

    </div>
  );
}

