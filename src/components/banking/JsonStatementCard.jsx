// A transaction list card styled like a netbanking statement view.
// Data comes from src/data/statementData.json — edit that file to change the entries.
// Has list/grid toggle, a category filter, a text search, and sorts newest-first by date.
import { useMemo, useState } from "react";
import { List, LayoutGrid, Search, ChevronDown, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import statementData from "../../data/statementData.json";

const formatAmount = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);

const formatDisplayDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export default function JsonStatementCard() {
  const [view, setView] = useState("list"); // "list" | "grid"
  const [category, setCategory] = useState("All Transactions");
  const [search, setSearch] = useState("");
  const [openRow, setOpenRow] = useState(null);

  const categories = useMemo(
    () => ["All Transactions", ...new Set(statementData.map((r) => r.category))],
    []
  );

  const rows = useMemo(() => {
    let list = [...statementData].sort((a, b) => b.date.localeCompare(a.date));
    if (category !== "All Transactions") list = list.filter((r) => r.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.narration.toLowerCase().includes(q));
    }
    return list;
  }, [category, search]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      {/* Top controls: list/grid toggle, category filter, search */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-slate-300">
          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="List view"
            className={`flex h-10 w-10 items-center justify-center ${view === "list" ? "bg-blue-800 text-white" : "bg-white text-slate-500"}`}
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`flex h-10 w-10 items-center justify-center border-l border-slate-300 ${view === "grid" ? "bg-blue-800 text-white" : "bg-white text-slate-500"}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-slate-700"
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a transaction"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Recent transactions may take up to 2 hours to reflect here. Showing demo data for illustration only.
      </p>

      {/* LIST VIEW */}
      {view === "list" && (
        <ul className="mt-2 divide-y divide-slate-100">
  {rows.length === 0 && (
    <li className="py-6 text-center text-xs text-slate-400">No matching transactions.</li>
  )}
  {rows.map((r, i) => {
    const isOpen = openRow === i;
    const isCredit = r.type === "Credit";
    return (
      <li key={i} className="py-1">
        <button
  type="button"
  onClick={() => setOpenRow(isOpen ? null : i)}
  className={`flex w-full items-center gap-4 rounded-lg border-2 px-3 py-2 text-left transition-colors hover:border-blue-600  ${
    isOpen ? "border-blue-600 " : "border-transparent"
  }`}
>
          <span className="w-24 shrink-0 text-xs text-slate-500">{formatDisplayDate(r.date)}</span>
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-blue-900">{r.narration}</span>
          <span className="flex w-32 shrink-0 items-center justify-end gap-1 font-semibold text-slate-800">
  {isCredit ? (
    <ArrowDownLeft size={16} className="text-green-600" />
  ) : (
    <ArrowUpRight size={16} className="text-red-600" />
  )}
  ₹{formatAmount(r.amount)}
</span>
          <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="ml-28 mt-2 grid gap-1 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            <span>Category: {r.category}</span>
            <span>Reference No.: {r.reference}</span>
            <span>Type: {r.type}</span>
          </div>
        )}
      </li>
    );
  })}
</ul>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.length === 0 && (
            <p className="col-span-full py-6 text-center text-xs text-slate-400">No matching transactions.</p>
          )}
          {rows.map((r, i) => {
            const isCredit = r.type === "Credit";
            return (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatDisplayDate(r.date)}</span>
                  {isCredit ? (
                    <ArrowDownLeft size={16} className="text-green-600" />
                  ) : (
                    <ArrowUpRight size={16} className="text-red-600" />
                  )}
                </div>
                <p className="mt-2 truncate font-mono text-xs text-blue-900">{r.narration}</p>
                <p className={`mt-2 text-lg font-bold ${isCredit ? "text-green-600" : "text-red-600"}`}>
                  ₹{formatAmount(r.amount)}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">{r.category}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}