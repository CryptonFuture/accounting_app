
import React, { useEffect, useState } from 'react';
import { getTrialBalance } from '../api';
import {
  RefreshCw,
  Scale,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  CalendarDays,
  WalletCards,
  ArrowDownToLine,
  ArrowUpToLine,
  Eye,
  Sparkles,
} from 'lucide-react';

export default function TrialBalance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showZero, setShowZero] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await getTrialBalance(showZero);
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to load Trial Balance'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [showZero]);

  const formatCurrency = (n) =>
    Number(n).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const rows = data?.rows || [];
  const debit = data?.totals?.debit || 0;
  const credit = data?.totals?.credit || 0;
  const isBalanced = data?.totals?.isBalanced;

  return (
    <div className="min-h-full space-y-6">

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-7 shadow-xl">
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-500/10 blur-2xl" />
        <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur">
              <Scale className="h-7 w-7 text-white" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
                  General Ledger
                </span>
                <Sparkles size={13} className="text-amber-300" />
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Trial Balance
              </h2>

              <p className="mt-1.5 max-w-xl text-sm text-slate-300">
                Review account balances and verify that total debits
                equal total credits.
              </p>

              {data?.asOf && (
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays size={14} />
                  As of {formatDate(data.asOf)}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

            {/* Show Zero Toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 backdrop-blur transition hover:bg-white/10">
              <input
                type="checkbox"
                checked={showZero}
                onChange={(e) => setShowZero(e.target.checked)}
                className="h-4 w-4 rounded border-slate-500 bg-transparent text-primary-600 focus:ring-primary-500"
              />

              <span className="flex items-center gap-2">
                <Eye size={15} />
                Show zero balances
              </span>
            </label>

            {/* Refresh */}
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <XCircle className="mt-0.5 shrink-0 text-red-600" size={20} />

          <div>
            <p className="font-semibold text-red-800">
              Unable to load Trial Balance
            </p>
            <p className="mt-0.5 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* ================= LOADING ================= */}
      {loading ? (
        <div className="space-y-5">

          {/* Skeleton Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
                <div className="mt-4 h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="mt-2 h-6 w-32 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          {/* Skeleton Table */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-16 animate-pulse bg-slate-100" />

            <div className="space-y-4 p-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-5 gap-4"
                >
                  <div className="h-4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-slate-500">
            Generating Trial Balance...
          </div>
        </div>
      ) : data ? (
        <>
          {/* ================= SUMMARY CARDS ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Accounts */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                  <FileSpreadsheet size={21} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Accounts
                </span>
              </div>

              <p className="mt-4 text-2xl font-bold text-slate-900">
                {rows.length}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Accounts displayed
              </p>
            </div>

            {/* Debit */}
            <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ArrowDownToLine size={21} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Debit
                </span>
              </div>

              <p className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
                {formatCurrency(debit)}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Total debit balance
              </p>
            </div>

            {/* Credit */}
            <div className="group rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <ArrowUpToLine size={21} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Credit
                </span>
              </div>

              <p className="mt-4 text-xl font-bold text-slate-900 sm:text-2xl">
                {formatCurrency(credit)}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Total credit balance
              </p>
            </div>

            {/* Status */}
            <div
              className={`rounded-2xl border p-5 shadow-sm ${
                isBalanced
                  ? 'border-green-100 bg-gradient-to-br from-green-50 to-white'
                  : 'border-red-100 bg-gradient-to-br from-red-50 to-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    isBalanced
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {isBalanced ? (
                    <CheckCircle2 size={21} />
                  ) : (
                    <XCircle size={21} />
                  )}
                </div>

                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isBalanced
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  Status
                </span>
              </div>

              <p
                className={`mt-4 text-xl font-bold ${
                  isBalanced
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}
              >
                {isBalanced ? 'Balanced' : 'Not Balanced'}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Debit & credit verification
              </p>
            </div>
          </div>

          {/* ================= MAIN TABLE CARD ================= */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Card Header */}
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <WalletCards size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Account Balances
                  </h3>
                  <p className="text-xs text-slate-500">
                    Detailed debit and credit breakdown
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isBalanced
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'bg-red-50 text-red-700 ring-1 ring-red-200'
                }`}
              >
                {isBalanced ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <XCircle size={14} />
                )}

                {isBalanced
                  ? 'Books are balanced'
                  : 'Balance mismatch detected'}
              </div>
            </div>

            {/* Status Banner */}
            <div
              className={`mx-5 mt-5 flex items-center gap-3 rounded-2xl border px-4 py-3 sm:mx-6 ${
                isBalanced
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              {isBalanced ? (
                <CheckCircle2
                  className="shrink-0 text-green-600"
                  size={20}
                />
              ) : (
                <XCircle
                  className="shrink-0 text-red-600"
                  size={20}
                />
              )}

              <div>
                <p
                  className={`text-sm font-semibold ${
                    isBalanced
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}
                >
                  {isBalanced
                    ? 'Trial Balance is Balanced'
                    : 'Trial Balance is NOT Balanced'}
                </p>

                <p
                  className={`mt-0.5 text-xs ${
                    isBalanced
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {isBalanced
                    ? 'Total debit and credit amounts are equal.'
                    : 'Please review your journal entries and account balances.'}
                </p>
              </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">

                <thead>
                  <tr className="border-y border-slate-200 bg-slate-50">
                    <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Code
                    </th>

                    <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Account Name
                    </th>

                    <th className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="px-4 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                      Debit (Dr)
                    </th>

                    <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      Credit (Cr)
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {rows.map((row, index) => (
                    <tr
                      key={row.accountId}
                      className="group transition hover:bg-slate-50/80"
                    >
                      {/* Code */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700 transition group-hover:bg-primary-50 group-hover:text-primary-700">
                          {row.code}
                        </span>
                      </td>

                      {/* Account Name */}
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-slate-800">
                            {row.name}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Account #{index + 1}
                          </p>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {row.type}
                        </span>
                      </td>

                      {/* Debit */}
                      <td className="px-4 py-4 text-right">
                        {row.debit > 0 ? (
                          <span className="font-semibold tabular-nums text-slate-800">
                            {formatCurrency(row.debit)}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Credit */}
                      <td className="px-6 py-4 text-right">
                        {row.credit > 0 ? (
                          <span className="font-semibold tabular-nums text-slate-800">
                            {formatCurrency(row.credit)}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* ================= TOTAL ================= */}
                {rows.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 bg-gradient-to-r from-primary-50 via-white to-primary-50">

                      <td
                        colSpan={3}
                        className="px-6 py-5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                            <Scale size={18} />
                          </div>

                          <div>
                            <p className="text-sm font-bold uppercase tracking-wide text-primary-900">
                              Total
                            </p>

                            <p className="text-xs font-normal text-primary-600">
                              Trial balance summary
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-5 text-right">
                        <div className="text-base font-bold tabular-nums text-slate-900">
                          {formatCurrency(debit)}
                        </div>

                        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                          Total Debit
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="text-base font-bold tabular-nums text-slate-900">
                          {formatCurrency(credit)}
                        </div>

                        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                          Total Credit
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* ================= EMPTY STATE ================= */}
            {rows.length === 0 && (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FileSpreadsheet size={28} />
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  No balances to display
                </h3>

                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  There are currently no account balances available.
                  Create some journal entries first to generate a
                  Trial Balance.
                </p>
              </div>
            )}

            {/* ================= FOOTER ================= */}
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Scale size={14} />
                Trial Balance verification
              </div>

              <div className="text-xs text-slate-400">
                {rows.length} account{rows.length !== 1 ? 's' : ''}{' '}
                displayed
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

