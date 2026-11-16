
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

// Add or replace your images inside public/images/.
const TOP_BANNER = "/images/home-banner-top.jpg";
const BOTTOM_BANNER = "/images/home-banner-bottom.jpg";

// Reusable image banner.
function ImageBanner({ src }) {
  return (
    <div
      className="h-[130px] w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#08295c] to-[#2754a0] bg-cover bg-center sm:h-[160px]"
      style={{ backgroundImage: `url("${src}")` }}
    />
  );
}

export default function Home({ user, setPage }) {
  const [showBalance, setShowBalance] = useState(false);

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
        <p className="mt-6 text-xs text-white/60">
          Last logged in at {now.toLocaleString("en-IN")}
        </p>

        {/* Welcome navigation pills */}
        <div className="mt-8 flex flex-wrap items-center gap-9 text-sm">
  {[
    "Cards",
    "FD/RD/Flexi-RD",
    "Loans",
    "Invest",
    "Insure",
    <ImageBanner src={TOP_BANNER} />
  ].map((t, index) => (
    typeof t === "string" ? (
      <button
        key={t}
        type="button"
        className="rounded-full border border-[#294d73] bg-[#10345e] px-5 py-3 font-semibold text-white whitespace-nowrap transition-colors duration-200 hover:border-[#52769b] hover:bg-[#194775]"
      >
        {t}
      </button>
    ) : (
      <div key={index}>{t}</div>
    )
  ))}
</div>
      </PageHero>

      {/* Main existing two-column layout */}
      <div className="mx-auto -mt-20 grid max-w-7xl gap-6 px-4 pb-10 sm:px-8 lg:grid-cols-[1fr_340px]">

        {/* LEFT SIDE */}
        <div>

          {/* IMAGE BLOCK 1 - ABOVE SHOW BALANCE */}
          
          
          

          {/* SHOW BALANCE */}
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

          {/* ACCOUNT CARDS - DIRECTLY BELOW SHOW BALANCE */}
          <div className="mt-1 grid gap-2 sm:grid-cols-3">

            {/* SAVINGS ACCOUNT */}
            <div
              className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl p-5 mb-3 shadow-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${savingsBg})` }}
            >
              <div className="relative z-10">
                <p className="text-2xl text-black">
                  Savings Accounts
                </p>

                <p className="mt-2 text-xl font-semibold text-black">
                  {showBalance ? formatAmount(balance) : "XXXXXXXX"}
                </p>

                <button
                  type="button"
                  onClick={() => setPage("statement")}
                  className="mt-3 w-full rounded-lg bg-blue-800 py-2.5 text-sm font-semibold text-white"
                >
                  Get Statement
                </button>
              </div>
            </div>

            {/* LOAN CARD */}
            <div
              className="relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl p-5 mb-3 shadow-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${getaloanBg})` }}
            />

            {/* OFFER CARD */}
            <div
              className="relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl p-5 mb-3 shadow-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${l3lBg})` }}
            />

          </div>
        </div>

        {/* RIGHT SIDE - FAVOURITE LINKS */}
        <aside className="h-[380px] relative rounded-2xl bg-white p-4 shadow-lg">
          <h2 className="mb-2 font-bold text-slate-800">
            My Favourite Links
          </h2>

          <ul>
            {favourites.map((f) => (
              <li key={f.label}>
                <button
                  type="button"
                  onClick={f.onClick}
                  className="flex w-full items-center justify-between py-3 text-left text-sm text-slate-800"
                >
                  {f.label}
                  <ChevronRight size={16} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* FULL WIDTH - SEND MONEY */}
        <div className="lg:col-span-2">
          <SendMoney />
        </div>

        {/* QUICK RECHARGE + QUICK LINKS */}
        <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2 h-[550px]">
          <QuickRecharge />
          <QuickLinksGrid />
        </div>

        {/* IMAGE BLOCK 2 - BOTTOM */}
        <div className="lg:col-span-2">
          <ImageBanner src={BOTTOM_BANNER} />
        </div>

      </div>
    </div>
  );
}
