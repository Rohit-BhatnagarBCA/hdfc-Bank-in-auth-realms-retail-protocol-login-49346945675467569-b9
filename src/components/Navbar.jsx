// Top navigation: logo, search, support icons, avatar and the main menu tabs.
import { Search, Bell, Power, Menu, CircleHelp } from "lucide-react";
import { LOGO_URL } from "../../data/demoAccount";

const tabs = [
  { label: "Home", page: "home" },
  { label: "Accounts", page: "accounts" },
  { label: "Send Money" },
  { label: "Cards" },
  { label: "FD/RD" },
  { label: "Bills & Recharges" },
  { label: "Loans" },
  { label: "Invest" },
  { label: "Insure" },
];

export default function Navbar({ page, setPage, onLogout }) {
  const activePage = page === "statement" ? "accounts" : page;
  const initials = "NK";

  return (
    <header className="bg-[#08295c] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Bank logo" className="h-8 w-auto rounded-sm bg-white p-0.5" />
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">DEMO</span>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex w-full max-w-md items-center gap-3 rounded-lg bg-white px-4 py-2.5 text-slate-500">
            <Search size={18} />
            <input
              type="text"
              placeholder="Book Deposit / Download Form 16 / etc."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-white/80">
          <span className="hidden items-center gap-2 text-sm lg:flex">
            <CircleHelp size={18} /> Services &amp; Support
          </span>
          <Bell size={19} />
          <button type="button" onClick={onLogout} aria-label="Logout" title="Logout">
            <Power size={19} />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-white/10 p-1 pl-3">
            <Menu size={17} />
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-base font-bold text-[#08295c]">
              {initials}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs row: bigger text + more gap between them */}
      <nav className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-8">
        <ul className="flex min-w-max gap-12 text-lg">
          {tabs.map((tab) => {
            const active = tab.page && tab.page === activePage;
            return (
              <li key={tab.label}>
                <button
                  type="button"
                  onClick={() => tab.page && setPage(tab.page)}
                  className={`border-b-2 pb-3 pt-1 font-medium whitespace-nowrap ${
                    active ? "border-white text-white" : "border-transparent text-white/70"
                  } ${tab.page ? "cursor-pointer" : "cursor-default"}`}
                >
                  {tab.label}
                </button>
              </li> 
            );
          } 
          )}
        </ul>
      </nav>
    </header>
  );
}