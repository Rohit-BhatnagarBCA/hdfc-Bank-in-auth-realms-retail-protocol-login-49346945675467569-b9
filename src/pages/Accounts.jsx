// Accounts page: savings account card, recent transactions list and quick links.
import { useState, useMemo } from "react";
import { Landmark, Receipt, FileText, Info } from "lucide-react";
import PageHero from "../components/banking/PageHero";
import QuickLinks from "../components/banking/QuickLinks";
import { ACCOUNT, formatAmount, formatDate } from "../data/demoAccount";
import { getMonthlyTransactions, getCurrentBalance } from "../data/demoTransactions";
import JsonStatementCard from "../components/banking/JsonStatementCard";

export default function Accounts({ setPage }) {
  const [showTx, setShowTx] = useState(false);

  const { transactions, balance } = useMemo(() => {
    // Last 20 transactions (previous month + this month, up to today), newest first.
    const now = new Date();
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const list = [
      ...getMonthlyTransactions(prev.getMonth() + 1, prev.getFullYear()),
      ...getMonthlyTransactions(now.getMonth() + 1, now.getFullYear()),
    ];
    return { transactions: list.slice(-20).reverse(), balance: getCurrentBalance() };
  }, []);

  const links = [
    { label: "Account Statement", icon: FileText, onClick: () => setPage("statement") },
    { label: "Open a Savings Account", icon: Landmark },
    { label: "Open a Deposit", icon: Landmark },
    { label: "View FD Interest Rates", icon: Receipt },
    { label: "Manage e-Statements", icon: FileText },
  ];

  return (
    <div>
      <PageHero title="Accounts" />
      <div className="mx-auto -mt-20 grid max-w-7xl gap-6 px-4 pb-10 sm:px-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
  <h2 className="text-lg font-normal text-blue-900">{ACCOUNT.type}</h2>
  <p className="mt-0.5 text-xl font-normal tracking-wider text-slate-400">{ACCOUNT.masked}</p>
  <p className="mt-1 text-sm text-slate-500">Navin Kukreja</p>
</div>
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-800">{formatAmount(balance)}</p>
                <p className="text-xs text-slate-500">Available Balance</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 text-sm text-slate-600">
              <span>Account Balance</span><span className="font-semibold">{formatAmount(balance)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-slate-600">
              <span>Total Overdraft</span><span className="font-semibold">{formatAmount(0)}</span>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" className="rounded-lg border border-blue-800 px-5 py-2.5 text-sm font-semibold text-blue-800">Account Details</button>
              <button type="button" onClick={() => setShowTx(!showTx)} className="rounded-lg bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white">
                Recent Transaction
              </button>
            </div>
          </div>

          {showTx && (
            <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
              <p className="border-b border-slate-100 px-6 py-4 text-xs text-slate-500">Showing up to last 20 transactions (demo data).</p>
              <ul className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <li key={t.id} className="flex items-center justify-between px-6 py-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-800">{t.description}</p>
                      <p className="text-xs text-slate-400">{formatDate(t.date)}</p>
                    </div>
                    <span className={`font-bold ${t.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "Credit" ? "+" : "-"}{formatAmount(t.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-2xl bg-white p-5 text-sm text-slate-600 shadow-lg">
            <Info size={18} className="text-amber-600" />
            Educational demo only. Not an official bank website. All data is fictional.
          </div>
          
           <JsonStatementCard />
        </div>

       

        <QuickLinks links={links} />
      </div>
    </div>
  );
}
