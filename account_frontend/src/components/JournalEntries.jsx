import React, { useEffect, useMemo, useState } from 'react';
import {
  getAccounts,
  getJournalEntries,
  createJournalEntry,
  deleteJournalEntry,
} from '../api';

import {
  Plus,
  Trash2,
  RefreshCw,
  X,
  CheckCircle,
  Search,
  FileText,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  Save,
  ChevronRight,
  WalletCards,
  CalendarDays,
  Hash,
  CircleDollarSign,
} from 'lucide-react';

export default function JournalEntries() {
  const [entries, setEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const emptyLine = () => ({
    account: '',
    debit: '',
    credit: '',
    memo: '',
  });

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    reference: '',
    lines: [emptyLine(), emptyLine()],
  });

  const load = async () => {
    setLoading(true);

    try {
      const [jeRes, accRes] = await Promise.all([
        getJournalEntries(),
        getAccounts(),
      ]);

      setEntries(jeRes.data);
      setAccounts(accRes.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to load data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateLine = (idx, field, value) => {
    const newLines = [...form.lines];

    newLines[idx] = {
      ...newLines[idx],
      [field]: value,
    };

    if (field === 'debit' && value) {
      newLines[idx].credit = '';
    }

    if (field === 'credit' && value) {
      newLines[idx].debit = '';
    }

    setForm({
      ...form,
      lines: newLines,
    });
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [...form.lines, emptyLine()],
    });
  };

  const removeLine = (idx) => {
    if (form.lines.length <= 2) return;

    setForm({
      ...form,
      lines: form.lines.filter(
        (_, i) => i !== idx
      ),
    });
  };

  const totalDebit = form.lines.reduce(
    (sum, line) =>
      sum + (Number(line.debit) || 0),
    0
  );

  const totalCredit = form.lines.reduce(
    (sum, line) =>
      sum + (Number(line.credit) || 0),
    0
  );

  const difference = Math.abs(
    totalDebit - totalCredit
  );

  const isBalanced =
    difference < 0.01 &&
    totalDebit > 0;

  const formatCurrency = (n) =>
    Number(n).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return entries;

    return entries.filter((entry) => {
      return (
        entry.entryNumber
          ?.toLowerCase()
          .includes(query) ||
        entry.description
          ?.toLowerCase()
          .includes(query) ||
        entry.reference
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [entries, search]);

  const totalJournalValue = useMemo(() => {
    return entries.reduce(
      (sum, entry) =>
        sum + (Number(entry.totalDebit) || 0),
      0
    );
  }, [entries]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!form.description.trim()) {
      setError(
        'Description is required'
      );
      return;
    }

    if (!isBalanced) {
      setError(
        `Entry is not balanced. Debits: ${totalDebit.toFixed(
          2
        )}, Credits: ${totalCredit.toFixed(2)}`
      );
      return;
    }

    const payload = {
      date: form.date,
      description: form.description,
      reference: form.reference,

      lines: form.lines
        .filter(
          (line) =>
            line.account &&
            (Number(line.debit) > 0 ||
              Number(line.credit) > 0)
        )
        .map((line) => ({
          account: line.account,
          debit: Number(line.debit) || 0,
          credit: Number(line.credit) || 0,
          memo: line.memo || '',
        })),
    };

    try {
      await createJournalEntry(payload);

      setSuccess(
        'Journal entry created successfully!'
      );

      setForm({
        date: new Date()
          .toISOString()
          .slice(0, 10),
        description: '',
        reference: '',
        lines: [
          emptyLine(),
          emptyLine(),
        ],
      });

      setShowForm(false);

      load();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to create entry'
      );
    }
  };

  const handleDelete = async (
    id,
    number
  ) => {
    if (
      !window.confirm(
        `Delete journal entry ${number}?`
      )
    ) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await deleteJournalEntry(id);

      setSuccess(
        'Journal entry deleted successfully'
      );

      load();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to delete'
      );
    }
  };

  return (
    <div className="min-h-full">

      {/* =====================================================
          PREMIUM HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-7 mb-6 shadow-xl">

        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-10 top-8 opacity-10 hidden md:block">
          <BookOpen size={110} />
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
              Journal Entries
            </h2>

            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Create, manage and review your
              double-entry accounting transactions
              from one centralized workspace.
            </p>

          </div>

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
                : 'New Journal Entry'}
            </button>

          </div>

        </div>
      </div>

      {/* =====================================================
          ALERTS
      ====================================================== */}

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
            <CheckCircle size={16} />
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
          STATS
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">

        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

          <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-blue-500/10 blur-xl" />

          <div className="relative flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={18} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Total Entries
              </p>

              <p className="text-xl font-black text-slate-800 mt-0.5">
                {entries.length}
              </p>
            </div>

          </div>

        </div>

        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

          <div className="relative flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={18} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Balanced
              </p>

              <p className="text-xl font-black text-slate-800 mt-0.5">
                {entries.length}
              </p>
            </div>

          </div>

        </div>

        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

          <div className="relative flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <WalletCards size={18} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Accounts
              </p>

              <p className="text-xl font-black text-slate-800 mt-0.5">
                {accounts.length}
              </p>
            </div>

          </div>

        </div>

        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">

          <div className="relative flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <CircleDollarSign size={18} />
            </div>

            <div className="min-w-0">

              <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Journal Volume
              </p>

              <p className="text-lg font-black text-slate-800 mt-0.5 truncate">
                {formatCurrency(
                  totalJournalValue
                )}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          NEW JOURNAL ENTRY FORM
      ====================================================== */}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="
            relative overflow-hidden
            bg-white
            border border-slate-200
            rounded-2xl
            mb-6
            shadow-sm
          "
        >

          <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-primary-500/5 blur-3xl" />

          <div className="relative">

            {/* FORM HEADER */}

            <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <BookOpen size={19} />
                </div>

                <div>

                  <h3 className="text-base font-black text-slate-800">
                    New Journal Entry
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Record a balanced double-entry transaction
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="
                  w-9 h-9
                  rounded-xl
                  flex items-center justify-center
                  text-slate-400
                  hover:text-slate-700
                  hover:bg-slate-100
                  transition
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* BASIC INFORMATION */}

            <div className="p-5 sm:p-6">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div>

                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-slate-500 mb-2">
                    <CalendarDays size={12} />
                    Date *
                  </label>

                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        date: e.target.value,
                      })
                    }
                    className="
                      w-full h-11
                      border border-slate-200
                      bg-slate-50
                      rounded-xl
                      px-3.5
                      text-sm font-medium
                      text-slate-800
                      outline-none
                      focus:bg-white
                      focus:border-primary-500
                      focus:ring-4
                      focus:ring-primary-500/10
                      transition
                    "
                  />

                </div>

                <div>

                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-slate-500 mb-2">
                    <Hash size={12} />
                    Reference
                  </label>

                  <input
                    type="text"
                    value={form.reference}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        reference:
                          e.target.value,
                      })
                    }
                    className="
                      w-full h-11
                      border border-slate-200
                      bg-slate-50
                      rounded-xl
                      px-3.5
                      text-sm font-medium
                      text-slate-800
                      placeholder:text-slate-400
                      outline-none
                      focus:bg-white
                      focus:border-primary-500
                      focus:ring-4
                      focus:ring-primary-500/10
                      transition
                    "
                    placeholder="Invoice / Voucher no."
                  />

                </div>

                <div>

                  <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-black text-slate-500 mb-2">
                    <FileText size={12} />
                    Description *
                  </label>

                  <input
                    type="text"
                    required
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
                      text-sm font-medium
                      text-slate-800
                      placeholder:text-slate-400
                      outline-none
                      focus:bg-white
                      focus:border-primary-500
                      focus:ring-4
                      focus:ring-primary-500/10
                      transition
                    "
                    placeholder="Narration of the entry"
                  />

                </div>

              </div>

              {/* TRANSACTION LINES */}

              <div className="rounded-2xl border border-slate-200 overflow-hidden">

                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                      <WalletCards
                        size={14}
                        className="text-slate-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-black text-slate-700">
                        Transaction Lines
                      </p>

                      <p className="text-[10px] text-slate-400">
                        Debit and credit accounts
                      </p>
                    </div>

                  </div>

                  <span className="text-[10px] font-bold text-slate-400">
                    {form.lines.length} Lines
                  </span>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full min-w-[850px] text-sm">

                    <thead className="bg-white">

                      <tr>

                        <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-black text-slate-400">
                          Account
                        </th>

                        <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-black text-slate-400 w-36">
                          Debit
                        </th>

                        <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-black text-slate-400 w-36">
                          Credit
                        </th>

                        <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-black text-slate-400">
                          Memo
                        </th>

                        <th className="w-12" />

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {form.lines.map(
                        (line, idx) => (
                          <tr
                            key={idx}
                            className="group hover:bg-slate-50/60 transition"
                          >

                            <td className="px-4 py-3">

                              <select
                                required
                                value={line.account}
                                onChange={(e) =>
                                  updateLine(
                                    idx,
                                    'account',
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full h-10
                                  border border-slate-200
                                  bg-slate-50
                                  rounded-xl
                                  px-3
                                  text-xs
                                  font-medium
                                  text-slate-700
                                  outline-none
                                  focus:bg-white
                                  focus:border-primary-500
                                  focus:ring-4
                                  focus:ring-primary-500/10
                                "
                              >

                                <option value="">
                                  Select account...
                                </option>

                                {accounts.map(
                                  (account) => (
                                    <option
                                      key={
                                        account._id
                                      }
                                      value={
                                        account._id
                                      }
                                    >
                                      {account.code} –{' '}
                                      {account.name}
                                    </option>
                                  )
                                )}

                              </select>

                            </td>

                            <td className="px-4 py-3">

                              <div className="relative">

                                <ArrowDownLeft
                                  size={13}
                                  className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-emerald-500
                                  "
                                />

                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={
                                    line.debit
                                  }
                                  onChange={(e) =>
                                    updateLine(
                                      idx,
                                      'debit',
                                      e.target.value
                                    )
                                  }
                                  className="
                                    w-full h-10
                                    pl-8 pr-3
                                    border border-slate-200
                                    bg-slate-50
                                    rounded-xl
                                    text-xs
                                    text-right
                                    font-semibold
                                    outline-none
                                    focus:bg-white
                                    focus:border-emerald-500
                                    focus:ring-4
                                    focus:ring-emerald-500/10
                                  "
                                  placeholder="0.00"
                                />

                              </div>

                            </td>

                            <td className="px-4 py-3">

                              <div className="relative">

                                <ArrowUpRight
                                  size={13}
                                  className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-blue-500
                                  "
                                />

                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={
                                    line.credit
                                  }
                                  onChange={(e) =>
                                    updateLine(
                                      idx,
                                      'credit',
                                      e.target.value
                                    )
                                  }
                                  className="
                                    w-full h-10
                                    pl-8 pr-3
                                    border border-slate-200
                                    bg-slate-50
                                    rounded-xl
                                    text-xs
                                    text-right
                                    font-semibold
                                    outline-none
                                    focus:bg-white
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                  "
                                  placeholder="0.00"
                                />

                              </div>

                            </td>

                            <td className="px-4 py-3">

                              <input
                                type="text"
                                value={line.memo}
                                onChange={(e) =>
                                  updateLine(
                                    idx,
                                    'memo',
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full h-10
                                  border border-slate-200
                                  bg-slate-50
                                  rounded-xl
                                  px-3
                                  text-xs
                                  outline-none
                                  focus:bg-white
                                  focus:border-primary-500
                                  focus:ring-4
                                  focus:ring-primary-500/10
                                "
                                placeholder="Optional memo"
                              />

                            </td>

                            <td className="px-3 py-3">

                              {form.lines.length >
                                2 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeLine(
                                      idx
                                    )
                                  }
                                  className="
                                    w-8 h-8
                                    rounded-lg
                                    flex
                                    items-center
                                    justify-center
                                    text-slate-400
                                    hover:text-red-600
                                    hover:bg-red-50
                                    transition
                                  "
                                >
                                  <Trash2
                                    size={14}
                                  />
                                </button>
                              )}

                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                    {/* TOTALS */}

                    <tfoot>

                      <tr className="bg-slate-50 border-t border-slate-200">

                        <td className="px-4 py-4">

                          <span className="text-xs font-black text-slate-700">
                            Entry Totals
                          </span>

                        </td>

                        <td className="px-4 py-4 text-right">

                          <div className="text-sm font-black text-emerald-600">
                            {formatCurrency(
                              totalDebit
                            )}
                          </div>

                          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                            Debit
                          </div>

                        </td>

                        <td className="px-4 py-4 text-right">

                          <div className="text-sm font-black text-blue-600">
                            {formatCurrency(
                              totalCredit
                            )}
                          </div>

                          <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                            Credit
                          </div>

                        </td>

                        <td
                          colSpan={2}
                          className="px-4 py-4"
                        >

                          {isBalanced ? (
                            <span className="
                              inline-flex
                              items-center
                              gap-2
                              px-3
                              py-1.5
                              rounded-full
                              bg-emerald-50
                              border border-emerald-200
                              text-emerald-700
                              text-[10px]
                              font-black
                            ">
                              <CheckCircle
                                size={13}
                              />
                              Entry Balanced
                            </span>
                          ) : totalDebit > 0 ||
                            totalCredit > 0 ? (
                            <span className="
                              inline-flex
                              items-center
                              gap-2
                              px-3
                              py-1.5
                              rounded-full
                              bg-red-50
                              border border-red-200
                              text-red-700
                              text-[10px]
                              font-black
                            ">
                              Difference:{' '}
                              {formatCurrency(
                                difference
                              )}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Enter debit and credit
                              amounts
                            </span>
                          )}

                        </td>

                      </tr>

                    </tfoot>

                  </table>

                </div>

              </div>

              {/* FORM ACTIONS */}

              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">

                <button
                  type="button"
                  onClick={addLine}
                  className="
                    h-10 px-4
                    rounded-xl
                    border border-primary-100
                    bg-primary-50
                    text-primary-700
                    hover:bg-primary-100
                    text-xs
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition
                  "
                >
                  <Plus size={15} />
                  Add Line
                </button>

                <div className="flex-1" />

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
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!isBalanced}
                  className="
                    h-10 px-5
                    rounded-xl
                    bg-primary-600
                    hover:bg-primary-700
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    text-white
                    text-xs font-bold
                    flex items-center
                    justify-center
                    gap-2
                    shadow-lg
                    shadow-primary-600/20
                    transition
                  "
                >
                  <Save size={15} />
                  Post Journal Entry
                </button>

              </div>

            </div>

          </div>

        </form>
      )}

      {/* =====================================================
          ENTRIES LIST
      ====================================================== */}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

        {/* LIST HEADER */}

        <div className="p-4 sm:p-5 border-b border-slate-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <BookOpen size={18} />
              </div>

              <div>

                <h3 className="text-sm font-black text-slate-800">
                  Journal History
                </h3>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  {filteredEntries.length} of{' '}
                  {entries.length} entries shown
                </p>

              </div>

            </div>

            <div className="relative">

              <Search
                size={15}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search journal entries..."
                className="
                  w-full sm:w-72
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
                  transition
                "
              />

            </div>

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="p-8">

            <div className="space-y-5">

              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      border
                      border-slate-100
                      rounded-2xl
                      p-5
                      animate-pulse
                    "
                  >

                    <div className="flex gap-4 mb-5">

                      <div className="w-20 h-4 bg-slate-200 rounded" />

                      <div className="w-24 h-4 bg-slate-200 rounded" />

                      <div className="w-40 h-4 bg-slate-200 rounded" />

                    </div>

                    <div className="space-y-3">

                      <div className="h-4 bg-slate-100 rounded" />

                      <div className="h-4 bg-slate-100 rounded" />

                      <div className="h-4 bg-slate-100 rounded" />

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

        ) : entries.length === 0 ? (

          /* EMPTY */

          <div className="p-12 text-center">

            <div className="
              mx-auto
              w-16 h-16
              rounded-2xl
              bg-slate-100
              flex
              items-center
              justify-center
            ">
              <BookOpen
                size={27}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-5 text-sm font-black text-slate-700">
              No journal entries yet
            </h3>

            <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
              Create your first balanced journal
              entry to start recording financial
              transactions.
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
                inline-flex
                items-center
                gap-2
              "
            >
              <Plus size={15} />
              Create Journal Entry
            </button>

          </div>

        ) : filteredEntries.length === 0 ? (

          /* NO SEARCH RESULTS */

          <div className="p-12 text-center">

            <div className="
              mx-auto
              w-14 h-14
              rounded-2xl
              bg-slate-100
              flex
              items-center
              justify-center
            ">
              <Search
                size={23}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-700">
              No matching entries
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search keywords.
            </p>

          </div>

        ) : (

          /* ENTRIES */

          <div className="p-4 sm:p-5 space-y-4">

            {filteredEntries.map(
              (entry) => (

                <div
                  key={entry._id}
                  className="
                    group
                    border
                    border-slate-200
                    rounded-2xl
                    overflow-hidden
                    hover:border-slate-300
                    hover:shadow-md
                    transition-all
                  "
                >

                  {/* ENTRY HEADER */}

                  <div className="
                    px-4 sm:px-5
                    py-4
                    bg-gradient-to-r
                    from-slate-50
                    to-white
                    border-b
                    border-slate-100
                  ">

                    <div className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      gap-4
                    ">

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="
                          w-10 h-10
                          shrink-0
                          rounded-xl
                          bg-primary-50
                          text-primary-600
                          flex
                          items-center
                          justify-center
                        ">
                          <FileText
                            size={18}
                          />
                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-2.5 py-1
                              rounded-lg
                              bg-slate-900
                              text-white
                              font-mono
                              text-[10px]
                              font-bold
                            ">
                              <Hash size={10} />
                              {entry.entryNumber}
                            </span>

                            <span className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-2.5 py-1
                              rounded-lg
                              bg-emerald-50
                              text-emerald-700
                              border
                              border-emerald-100
                              text-[10px]
                              font-bold
                            ">
                              <CheckCircle
                                size={11}
                              />
                              Posted
                            </span>

                          </div>

                          <div className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                            mt-2
                          ">

                            <span className="text-xs text-slate-500 flex items-center gap-1.5">
                              <CalendarDays
                                size={12}
                              />

                              {new Date(
                                entry.date
                              ).toLocaleDateString(
                                'en-IN'
                              )}
                            </span>

                            <span className="text-slate-300">
                              •
                            </span>

                            <span className="
                              text-sm
                              font-bold
                              text-slate-800
                            ">
                              {entry.description}
                            </span>

                            {entry.reference && (
                              <>
                                <span className="text-slate-300">
                                  •
                                </span>

                                <span className="
                                  text-[10px]
                                  text-slate-400
                                  font-medium
                                ">
                                  Ref: {entry.reference}
                                </span>
                              </>
                            )}

                          </div>

                        </div>

                      </div>

                      <button
                        onClick={() =>
                          handleDelete(
                            entry._id,
                            entry.entryNumber
                          )
                        }
                        className="
                          self-end
                          lg:self-center
                          w-9 h-9
                          rounded-xl
                          flex
                          items-center
                          justify-center
                          text-slate-400
                          hover:text-red-600
                          hover:bg-red-50
                          border
                          border-transparent
                          hover:border-red-100
                          transition-all
                        "
                        title="Delete entry"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                  {/* ENTRY TABLE */}

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[650px] text-sm">

                      <thead className="bg-white">

                        <tr className="border-b border-slate-100">

                          <th className="
                            text-left
                            px-4 sm:px-5
                            py-3
                            text-[10px]
                            uppercase
                            tracking-wider
                            font-black
                            text-slate-400
                          ">
                            Account
                          </th>

                          <th className="
                            text-right
                            px-4
                            py-3
                            text-[10px]
                            uppercase
                            tracking-wider
                            font-black
                            text-slate-400
                            w-32
                          ">
                            Debit
                          </th>

                          <th className="
                            text-right
                            px-4
                            py-3
                            text-[10px]
                            uppercase
                            tracking-wider
                            font-black
                            text-slate-400
                            w-32
                          ">
                            Credit
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-50">

                        {entry.lines.map(
                          (line, i) => (

                            <tr
                              key={i}
                              className="
                                hover:bg-slate-50/60
                                transition
                              "
                            >

                              <td className="px-4 sm:px-5 py-3">

                                <div className="flex items-center gap-3">

                                  <div className="
                                    w-8 h-8
                                    rounded-lg
                                    bg-slate-100
                                    text-slate-500
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                  ">
                                    <WalletCards
                                      size={14}
                                    />
                                  </div>

                                  <div className="min-w-0">

                                    <div className="
                                      flex
                                      flex-wrap
                                      items-center
                                      gap-2
                                    ">

                                      <span className="
                                        font-mono
                                        text-[10px]
                                        font-bold
                                        text-primary-600
                                        bg-primary-50
                                        px-1.5 py-0.5
                                        rounded
                                      ">
                                        {line.accountCode ||
                                          line.account
                                            ?.code}
                                      </span>

                                      <span className="
                                        text-xs
                                        font-bold
                                        text-slate-700
                                      ">
                                        {line.accountName ||
                                          line.account
                                            ?.name}
                                      </span>

                                    </div>

                                    {line.memo && (
                                      <p className="
                                        text-[10px]
                                        text-slate-400
                                        mt-1
                                      ">
                                        {line.memo}
                                      </p>
                                    )}

                                  </div>

                                </div>

                              </td>

                              <td className="
                                px-4
                                py-3
                                text-right
                                font-bold
                                text-slate-700
                              ">

                                {line.debit > 0
                                  ? formatCurrency(
                                      line.debit
                                    )
                                  : '—'}

                              </td>

                              <td className="
                                px-4
                                py-3
                                text-right
                                font-bold
                                text-slate-700
                              ">

                                {line.credit > 0
                                  ? formatCurrency(
                                      line.credit
                                    )
                                  : '—'}

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                      <tfoot>

                        <tr className="
                          bg-slate-50
                          border-t
                          border-slate-200
                        ">

                          <td className="
                            px-4 sm:px-5
                            py-3
                            text-xs
                            font-black
                            text-slate-600
                          ">
                            Entry Total
                          </td>

                          <td className="
                            px-4
                            py-3
                            text-right
                            text-xs
                            font-black
                            text-emerald-700
                          ">
                            {formatCurrency(
                              entry.totalDebit
                            )}
                          </td>

                          <td className="
                            px-4
                            py-3
                            text-right
                            text-xs
                            font-black
                            text-blue-700
                          ">
                            {formatCurrency(
                              entry.totalCredit
                            )}
                          </td>

                        </tr>

                      </tfoot>

                    </table>

                  </div>

                  {/* ENTRY FOOTER */}

                  <div className="
                    px-4 sm:px-5
                    py-2.5
                    bg-slate-50/60
                    border-t
                    border-slate-100
                    flex
                    items-center
                    justify-between
                  ">

                    <span className="
                      text-[10px]
                      text-slate-400
                    ">
                      Double-entry transaction
                    </span>

                    <div className="
                      flex
                      items-center
                      gap-1
                      text-[10px]
                      text-slate-400
                    ">
                      Journal
                      <ChevronRight
                        size={11}
                      />
                      <span className="font-bold text-slate-600">
                        {entry.entryNumber}
                      </span>
                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

        {!loading &&
          entries.length > 0 &&
          filteredEntries.length > 0 && (

            <div className="
              px-5 py-3
              border-t
              border-slate-100
              bg-slate-50/50
              flex
              items-center
              justify-between
            ">

              <p className="text-[10px] text-slate-400">
                Showing{' '}
                <span className="font-bold text-slate-600">
                  {filteredEntries.length}
                </span>{' '}
                journal entries
              </p>

              <div className="
                flex
                items-center
                gap-1
                text-[10px]
                text-slate-400
              ">
                <span>Accounting</span>
                <ChevronRight size={11} />
                <span className="font-bold text-slate-600">
                  Journal
                </span>
              </div>

            </div>

          )}

      </div>

    </div>
  );
}