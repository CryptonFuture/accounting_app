
import React, { useEffect, useState } from 'react';
import { getAccounts, getTAccount } from '../api';

import {
  RefreshCw,
  BookOpen,
  WalletCards,
  Landmark,
  TrendingDown,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  CalendarDays,
  FileText,
  Sparkles,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function TAccount() {
  const [accounts, setAccounts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getAccounts()
      .then((res) => {
        setAccounts(res.data);

        if (res.data.length > 0) {
          setSelectedId(res.data[0]._id);
        }
      })
      .catch((err) =>
        setError(
          err.response?.data?.error ||
            'Failed to load accounts'
        )
      );
  }, []);

  const loadTAccount = async (id) => {
    if (!id) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await getTAccount(id);
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to load T-Account'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) {
      loadTAccount(selectedId);
    }
  }, [selectedId]);

  const formatCurrency = (n) =>
    Number(n).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const totalTransactions =
    (data?.debitLines?.length || 0) +
    (data?.creditLines?.length || 0);

  return (
    <div className="min-h-full">

      {/* =====================================================
          PREMIUM HEADER
      ====================================================== */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 sm:p-7 mb-6 shadow-xl">

        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute right-10 top-8 opacity-10 hidden md:block">
          <BookOpen size={115} />
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
              T-Accounts
            </h2>

            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              View detailed debit and credit movements
              for any account in your general ledger.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-2">

            <div className="relative">

              <select
                value={selectedId}
                onChange={(e) =>
                  setSelectedId(e.target.value)
                }
                className="
                  h-11
                  min-w-[240px]
                  appearance-none
                  rounded-xl
                  border
                  border-white/10
                  bg-white/10
                  backdrop-blur-sm
                  text-white
                  text-xs
                  font-bold
                  pl-4
                  pr-10
                  outline-none
                  cursor-pointer
                  focus:border-primary-400
                  focus:ring-4
                  focus:ring-primary-500/10
                "
              >

                <option
                  value=""
                  className="text-slate-800"
                >
                  Select account...
                </option>

                {accounts.map((account) => (
                  <option
                    key={account._id}
                    value={account._id}
                    className="text-slate-800"
                  >
                    {account.code} – {account.name}
                  </option>
                ))}

              </select>

              <ChevronRight
                size={15}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  rotate-90
                  text-slate-400
                  pointer-events-none
                "
              />

            </div>

            <button
              onClick={() =>
                loadTAccount(selectedId)
              }
              disabled={!selectedId || loading}
              className="
                h-11
                px-4
                rounded-xl
                bg-white/10
                hover:bg-white/15
                disabled:opacity-40
                border
                border-white/10
                text-white
                text-xs
                font-bold
                flex
                items-center
                justify-center
                gap-2
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

          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR
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

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading ? (

        <div className="space-y-5">

          {/* Skeleton Stats */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-4
                  animate-pulse
                "
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-slate-200" />

                  <div className="flex-1">

                    <div className="w-20 h-2 bg-slate-200 rounded mb-2" />

                    <div className="w-14 h-5 bg-slate-200 rounded" />

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* Skeleton Ledger */}

          <div className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            overflow-hidden
            animate-pulse
          ">

            <div className="h-20 bg-slate-200" />

            <div className="grid grid-cols-2 divide-x divide-slate-200">

              <div className="p-6 space-y-5">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-10 bg-slate-100 rounded-xl"
                  />
                ))}

              </div>

              <div className="p-6 space-y-5">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-10 bg-slate-100 rounded-xl"
                  />
                ))}

              </div>

            </div>

          </div>

        </div>

      ) : data ? (

        <>
          {/* =================================================
              ACCOUNT SUMMARY
          ================================================== */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">

            <div className="
              relative
              overflow-hidden
              bg-white
              rounded-2xl
              border
              border-slate-200
              p-4
              shadow-sm
            ">

              <div className="absolute -right-5 -top-5 w-20 h-20 rounded-full bg-blue-500/10 blur-xl" />

              <div className="relative flex items-center gap-3">

                <div className="
                  w-10 h-10
                  rounded-xl
                  bg-blue-50
                  text-blue-600
                  flex
                  items-center
                  justify-center
                ">
                  <WalletCards size={18} />
                </div>

                <div className="min-w-0">

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-slate-400
                  ">
                    Account
                  </p>

                  <p className="
                    text-sm
                    font-black
                    text-slate-800
                    mt-0.5
                    truncate
                  ">
                    {data.account.name}
                  </p>

                </div>

              </div>

            </div>

            <div className="
              relative
              overflow-hidden
              bg-white
              rounded-2xl
              border
              border-slate-200
              p-4
              shadow-sm
            ">

              <div className="flex items-center gap-3">

                <div className="
                  w-10 h-10
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600
                  flex
                  items-center
                  justify-center
                ">
                  <ArrowDownLeft size={18} />
                </div>

                <div>

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-slate-400
                  ">
                    Total Debit
                  </p>

                  <p className="
                    text-base
                    font-black
                    text-slate-800
                    mt-0.5
                  ">
                    {formatCurrency(
                      data.totals.debit
                    )}
                  </p>

                </div>

              </div>

            </div>

            <div className="
              relative
              overflow-hidden
              bg-white
              rounded-2xl
              border
              border-slate-200
              p-4
              shadow-sm
            ">

              <div className="flex items-center gap-3">

                <div className="
                  w-10 h-10
                  rounded-xl
                  bg-violet-50
                  text-violet-600
                  flex
                  items-center
                  justify-center
                ">
                  <ArrowUpRight size={18} />
                </div>

                <div>

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-slate-400
                  ">
                    Total Credit
                  </p>

                  <p className="
                    text-base
                    font-black
                    text-slate-800
                    mt-0.5
                  ">
                    {formatCurrency(
                      data.totals.credit
                    )}
                  </p>

                </div>

              </div>

            </div>

            <div className="
              relative
              overflow-hidden
              bg-white
              rounded-2xl
              border
              border-slate-200
              p-4
              shadow-sm
            ">

              <div className="flex items-center gap-3">

                <div className="
                  w-10 h-10
                  rounded-xl
                  bg-orange-50
                  text-orange-600
                  flex
                  items-center
                  justify-center
                ">
                  <CircleDollarSign size={18} />
                </div>

                <div>

                  <p className="
                    text-[9px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-slate-400
                  ">
                    Transactions
                  </p>

                  <p className="
                    text-xl
                    font-black
                    text-slate-800
                    mt-0.5
                  ">
                    {totalTransactions}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              T ACCOUNT CARD
          ================================================== */}

          <div className="
            bg-white
            border
            border-slate-200
            rounded-2xl
            overflow-hidden
            shadow-sm
          ">

            {/* ACCOUNT HEADER */}

            <div className="
              relative
              overflow-hidden
              bg-gradient-to-br
              from-slate-950
              via-slate-900
              to-slate-800
              px-5
              sm:px-7
              py-6
            ">

              <div className="
                absolute
                -right-20
                -top-20
                w-52
                h-52
                rounded-full
                bg-primary-500/10
                blur-3xl
              " />

              <div className="
                relative
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
              ">

                <div className="flex items-center gap-4">

                  <div className="
                    w-12 h-12
                    rounded-2xl
                    bg-white/10
                    border
                    border-white/10
                    text-white
                    flex
                    items-center
                    justify-center
                  ">
                    <BookOpen size={21} />
                  </div>

                  <div>

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="
                        px-2.5
                        py-1
                        rounded-lg
                        bg-white/10
                        border
                        border-white/10
                        text-white
                        font-mono
                        text-[10px]
                        font-bold
                      ">
                        {data.account.code}
                      </span>

                      <span className="
                        px-2.5
                        py-1
                        rounded-full
                        bg-emerald-500/10
                        border
                        border-emerald-400/20
                        text-emerald-300
                        text-[10px]
                        font-bold
                      ">
                        {data.account.type}
                      </span>

                    </div>

                    <h3 className="
                      text-xl
                      sm:text-2xl
                      font-black
                      text-white
                      mt-2
                    ">
                      {data.account.name}
                    </h3>

                    <p className="
                      text-xs
                      text-slate-400
                      mt-1
                    ">
                      Normal Balance:{' '}
                      <span className="text-slate-200 font-bold">
                        {data.account.normalBalance}
                      </span>
                    </p>

                  </div>

                </div>

                <div className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  self-start
                  sm:self-center
                ">

                  <ShieldCheck
                    size={15}
                    className="text-emerald-400"
                  />

                  <span className="
                    text-[10px]
                    font-bold
                    text-slate-300
                  ">
                    Ledger Account
                  </span>

                </div>

              </div>

            </div>

            {/* T ACCOUNT */}

            <div className="
              grid
              grid-cols-1
              lg:grid-cols-2
              divide-y
              lg:divide-y-0
              lg:divide-x
              divide-slate-200
            ">

              {/* ============================================
                  DEBIT
              ============================================= */}

              <div>

                <div className="
                  px-5
                  py-4
                  bg-emerald-50/70
                  border-b
                  border-emerald-100
                  flex
                  items-center
                  justify-between
                ">

                  <div className="flex items-center gap-3">

                    <div className="
                      w-9 h-9
                      rounded-xl
                      bg-emerald-100
                      text-emerald-600
                      flex
                      items-center
                      justify-center
                    ">
                      <ArrowDownLeft
                        size={17}
                      />
                    </div>

                    <div>

                      <p className="
                        text-xs
                        font-black
                        text-emerald-800
                      ">
                        Debit
                      </p>

                      <p className="
                        text-[10px]
                        text-emerald-600
                        mt-0.5
                      ">
                        Dr
                      </p>

                    </div>

                  </div>

                  <span className="
                    px-2.5
                    py-1
                    rounded-full
                    bg-white
                    border
                    border-emerald-100
                    text-[10px]
                    font-bold
                    text-emerald-700
                  ">
                    {data.debitLines.length}{' '}
                    Entries
                  </span>

                </div>

                <div className="min-h-[280px]">

                  {data.debitLines.length === 0 ? (

                    <div className="
                      min-h-[280px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      p-8
                      text-center
                    ">

                      <div className="
                        w-12 h-12
                        rounded-2xl
                        bg-slate-100
                        text-slate-400
                        flex
                        items-center
                        justify-center
                      ">
                        <ArrowDownLeft
                          size={21}
                        />
                      </div>

                      <p className="
                        mt-4
                        text-xs
                        font-bold
                        text-slate-500
                      ">
                        No debit entries
                      </p>

                      <p className="
                        text-[10px]
                        text-slate-400
                        mt-1
                      ">
                        Debit transactions will
                        appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[500px] text-sm">

                        <thead className="bg-slate-50/70">

                          <tr>

                            <th className="
                              text-left
                              px-5
                              py-3
                              text-[9px]
                              uppercase
                              tracking-wider
                              font-black
                              text-slate-400
                            ">
                              Date
                            </th>

                            <th className="
                              text-left
                              px-3
                              py-3
                              text-[9px]
                              uppercase
                              tracking-wider
                              font-black
                              text-slate-400
                            ">
                              Transaction
                            </th>

                            <th className="
                              text-right
                              px-5
                              py-3
                              text-[9px]
                              uppercase
                              tracking-wider
                              font-black
                              text-slate-400
                            ">
                              Amount
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100">

                          {data.debitLines.map(
                            (line, i) => (

                              <tr
                                key={i}
                                className="
                                  group
                                  hover:bg-emerald-50/30
                                  transition
                                "
                              >

                                <td className="px-5 py-3">

                                  <div className="
                                    flex
                                    items-center
                                    gap-1.5
                                    text-[10px]
                                    text-slate-500
                                    whitespace-nowrap
                                  ">
                                    <CalendarDays
                                      size={11}
                                    />

                                    {formatDate(
                                      line.date
                                    )}
                                  </div>

                                </td>

                                <td className="px-3 py-3">

                                  <div className="
                                    text-xs
                                    font-bold
                                    text-slate-700
                                  ">
                                    {line.description}
                                  </div>

                                  <div className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    mt-1
                                    text-[9px]
                                    text-slate-400
                                    font-mono
                                  ">
                                    <FileText
                                      size={9}
                                    />

                                    {line.entryNumber}
                                  </div>

                                </td>

                                <td className="
                                  px-5
                                  py-3
                                  text-right
                                  whitespace-nowrap
                                ">

                                  <span className="
                                    text-xs
                                    font-black
                                    text-emerald-700
                                  ">
                                    {formatCurrency(
                                      line.amount
                                    )}
                                  </span>

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

                <div className="
                  px-5
                  py-4
                  bg-slate-50
                  border-t
                  border-slate-200
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-black
                    text-slate-400
                  ">
                    Total Debit
                  </span>

                  <span className="
                    text-sm
                    font-black
                    text-emerald-700
                  ">
                    {formatCurrency(
                      data.totals.debit
                    )}
                  </span>

                </div>

              </div>

              {/* ============================================
                  CREDIT
              ============================================= */}

              <div>

                <div className="
                  px-5
                  py-4
                  bg-blue-50/70
                  border-b
                  border-blue-100
                  flex
                  items-center
                  justify-between
                ">

                  <div className="flex items-center gap-3">

                    <div className="
                      w-9 h-9
                      rounded-xl
                      bg-blue-100
                      text-blue-600
                      flex
                      items-center
                      justify-center
                    ">
                      <ArrowUpRight
                        size={17}
                      />
                    </div>

                    <div>

                      <p className="
                        text-xs
                        font-black
                        text-blue-800
                      ">
                        Credit
                      </p>

                      <p className="
                        text-[10px]
                        text-blue-600
                        mt-0.5
                      ">
                        Cr
                      </p>

                    </div>

                  </div>

                  <span className="
                    px-2.5
                    py-1
                    rounded-full
                    bg-white
                    border
                    border-blue-100
                    text-[10px]
                    font-bold
                    text-blue-700
                  ">
                    {data.creditLines.length}{' '}
                    Entries
                  </span>

                </div>

                <div className="min-h-[280px]">

                  {data.creditLines.length === 0 ? (

                    <div className="
                      min-h-[280px]
                      flex
                      flex-col
                      items-center
                      justify-center
                      p-8
                      text-center
                    ">

                      <div className="
                        w-12 h-12
                        rounded-2xl
                        bg-slate-100
                        text-slate-400
                        flex
                        items-center
                        justify-center
                      ">
                        <ArrowUpRight
                          size={21}
                        />
                      </div>

                      <p className="
                        mt-4
                        text-xs
                        font-bold
                        text-slate-500
                      ">
                        No credit entries
                      </p>

                      <p className="
                        text-[10px]
                        text-slate-400
                        mt-1
                      ">
                        Credit transactions will
                        appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[500px] text-sm">

                        <thead className="bg-slate-50/70">

                          <tr>

                            <th className="
                              text-left
                              px-5
                              py-3
                              text-[9px]
                              uppercase
                              tracking-wider
                              font-black
                              text-slate-400
                            ">
                              Date
                            </th>

                            <th className="
                              text-left
                              px-3
                              py-3
                              text-[9px]
                              uppercase
                              tracking-wider
                              font-black
                              text-slate-400
                            ">
                              Transaction
                            </th>

                            <th className="
                              text-right
                              px-5
                              py-3
                              text-[9px]
                              uppercase
                              tracking-wider
                              font-black
                              text-slate-400
                            ">
                              Amount
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100">

                          {data.creditLines.map(
                            (line, i) => (

                              <tr
                                key={i}
                                className="
                                  group
                                  hover:bg-blue-50/30
                                  transition
                                "
                              >

                                <td className="px-5 py-3">

                                  <div className="
                                    flex
                                    items-center
                                    gap-1.5
                                    text-[10px]
                                    text-slate-500
                                    whitespace-nowrap
                                  ">
                                    <CalendarDays
                                      size={11}
                                    />

                                    {formatDate(
                                      line.date
                                    )}
                                  </div>

                                </td>

                                <td className="px-3 py-3">

                                  <div className="
                                    text-xs
                                    font-bold
                                    text-slate-700
                                  ">
                                    {line.description}
                                  </div>

                                  <div className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    mt-1
                                    text-[9px]
                                    text-slate-400
                                    font-mono
                                  ">
                                    <FileText
                                      size={9}
                                    />

                                    {line.entryNumber}
                                  </div>

                                </td>

                                <td className="
                                  px-5
                                  py-3
                                  text-right
                                  whitespace-nowrap
                                ">

                                  <span className="
                                    text-xs
                                    font-black
                                    text-blue-700
                                  ">
                                    {formatCurrency(
                                      line.amount
                                    )}
                                  </span>

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

                <div className="
                  px-5
                  py-4
                  bg-slate-50
                  border-t
                  border-slate-200
                  flex
                  items-center
                  justify-between
                ">

                  <span className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-black
                    text-slate-400
                  ">
                    Total Credit
                  </span>

                  <span className="
                    text-sm
                    font-black
                    text-blue-700
                  ">
                    {formatCurrency(
                      data.totals.credit
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                CLOSING BALANCE
            ================================================== */}

            <div className="
              relative
              overflow-hidden
              border-t
              border-slate-200
              bg-gradient-to-r
              from-primary-50
              via-white
              to-blue-50
              px-5
              sm:px-7
              py-5
            ">

              <div className="
                absolute
                -right-10
                -top-16
                w-40
                h-40
                rounded-full
                bg-primary-500/5
                blur-2xl
              " />

              <div className="
                relative
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-4
              ">

                <div className="flex items-center gap-3">

                  <div className="
                    w-10 h-10
                    rounded-xl
                    bg-primary-100
                    text-primary-700
                    flex
                    items-center
                    justify-center
                  ">
                    <CircleDollarSign
                      size={19}
                    />
                  </div>

                  <div>

                    <p className="
                      text-[10px]
                      uppercase
                      tracking-wider
                      font-black
                      text-slate-400
                    ">
                      Closing Balance
                    </p>

                    <p className="
                      text-xs
                      text-slate-500
                      mt-0.5
                    ">
                      Current account balance
                    </p>

                  </div>

                </div>

                <div className="text-left sm:text-right">

                  <div className="
                    text-2xl
                    font-black
                    text-primary-800
                  ">
                    {formatCurrency(
                      data.balance.amount
                    )}
                  </div>

                  <span className="
                    inline-flex
                    items-center
                    gap-1.5
                    mt-1
                    px-2.5
                    py-1
                    rounded-full
                    bg-primary-100
                    text-primary-700
                    text-[10px]
                    font-black
                  ">
                    {data.balance.side}
                    <ChevronRight
                      size={11}
                    />
                  </span>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="
              px-5
              py-3
              bg-slate-50/70
              border-t
              border-slate-100
              flex
              items-center
              justify-between
            ">

              <p className="
                text-[10px]
                text-slate-400
              ">
                T-Account ledger view
              </p>

              <div className="
                flex
                items-center
                gap-1
                text-[10px]
                text-slate-400
              ">

                <span>Accounting</span>

                <ChevronRight
                  size={11}
                />

                <span className="font-bold text-slate-600">
                  T-Account
                </span>

              </div>

            </div>

          </div>
        </>

      ) : (

        /* =====================================================
           NO ACCOUNT SELECTED
        ====================================================== */

        <div className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          shadow-sm
          p-12
          text-center
        ">

          <div className="
            mx-auto
            w-16 h-16
            rounded-2xl
            bg-slate-100
            flex
            items-center
            justify-center
          ">
            <Landmark
              size={28}
              className="text-slate-400"
            />
          </div>

          <h3 className="
            mt-5
            text-sm
            font-black
            text-slate-700
          ">
            Select an account
          </h3>

          <p className="
            mt-2
            text-xs
            text-slate-400
            max-w-sm
            mx-auto
          ">
            Choose an account from the selector
            above to view its complete T-Account
            ledger.
          </p>

        </div>

      )}

    </div>
  );
}

