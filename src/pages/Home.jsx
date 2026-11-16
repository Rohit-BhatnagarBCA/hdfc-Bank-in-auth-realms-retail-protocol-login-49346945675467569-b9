// Home page: welcome band, account tiles, favourite links, Send Money, Quick Recharge and Quick Links.
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import PageHero from "../components/banking/PageHero";
import SendMoney from "../components/banking/SendMoney";
import QuickRecharge from "../components/banking/QuickRecharge";
import QuickLinksGrid from "../components/banking/QuickLinksGrid";
import { formatAmount } from "../data/demoAccount";
import { getCurrentBalance } from "../data/demoTransactions";
import savingsBg from "../assets/logo_only_no_button.png";
import getaloanBg from "../assets/getaloan.png";
import l3lBg from "../assets/l3l3.png";

export default function Home({ user, setPage }) {
  const [showBalance, setShowBalance] = useState(false);

  // Fictional balance up to today (changes automatically as the date moves).
  const now = new Date();
  const balance = getCurrentBalance();

  const favourites = [
    { label: "Account Statement", onClick: () => setPage("statement") },
    { label: "Open FD" },
    { label: "Download FD Summary" },
    { label: "Sweep-in / OD against FD" },
    { label: "CASA Interest Certificate" },
  ];

  return (
    <div>
      <PageHero title="Welcome, Navin Kukreja" tall>
        <p className="mt-6 text-xs text-white/60">Last logged in at {now.toLocaleString("en-IN")}</p>
        <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
          {["Accounts", "Cards", "FD/Flexi-RD", "Loans", "Invest", "Insure"].map((t, i) => (
            <span key={t} className={i === 0 ? "border-b-2 border-white pb-4 text-white" : ""}>{t}</span>
          ))}
        </div>
      </PageHero>

      {/*
        Main grid: column 1 is the big left side (cards), column 2 is the 340px
        "My Favourite Links" sidebar. Send Money and the Quick Recharge/Quick Links
        row each use lg:col-span-2 so they stretch across BOTH columns, full width,
        sitting below the top row — exactly like the screenshot.
      */}
      <div className="mx-auto -mt-20 grid max-w-7xl gap-6 px-4 pb-10 sm:px-8 lg:grid-cols-[1fr_340px]">

        {/* LEFT: Show Balance toggle + the 3 account tiles (unchanged) */}
        <div>
          <div className="mb-3 mt-6 flex items-center relative gap-3 text-sm text-white">
            <span>Show Balance</span>
            <button
              type="button"
              role="switch"
              aria-checked={showBalance}
              onClick={() => setShowBalance(!showBalance)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${
                showBalance ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                  showBalance ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="mt-12 grid gap-2 sm:grid-cols-3">
            <div
              className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl p-5 mb-3 shadow-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${savingsBg})` }}
            >
              <div className="relative z-10">
                <p className="text-2xl text-black">Savings Accounts</p>
                <p className="mt-2 text-xl font-semibold text-black">{showBalance ? formatAmount(balance) : "XXXXXXXX"}</p>
                <button type="button" onClick={() => setPage("statement")} className="mt-3 w-full rounded-lg bg-blue-800 py-2.5 text-sm font-semibold text-white">
                  Get Statement
                </button>
              </div>
            </div>

            <div
              className="relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl p-5 mb-3 shadow-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${getaloanBg})` }}
            />

            <div
              className="relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl p-5 mb-3 shadow-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${l3lBg})` }}
            />
          </div>
        </div>

        {/* RIGHT: My Favourite Links — sits beside the cards row only, auto height */}
        <aside className="h-[380px] relative rounded-2xl bg-white p-4 shadow-lg">
          <h2 className="mb-2 font-bold text-slate-800">My Favourite Links</h2>
          <ul>
            {favourites.map((f) => (
              <li key={f.label}>
                <button type="button" onClick={f.onClick} className="flex w-full items-center justify-between py-3 text-left text-sm text-slate-800">
                  {f.label} <ChevronRight size={16} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* FULL WIDTH: Send Money (spans both columns) */}
        <div className="lg:col-span-2">
          <SendMoney />
        </div>

        {/* FULL WIDTH ROW, split 50/50: Quick Recharge + Quick Links */}
        <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2 h-[550px]">
          <QuickRecharge />
          <QuickLinksGrid />
        </div>

      </div>
    </div>
  );
}