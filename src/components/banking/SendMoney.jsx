// Send Money card: To / From account pickers + amount, with an Add Payee action.
// Entirely a visual demo — nothing is actually transferred.
import { useState } from "react";
import { UserPlus, ArrowRight } from "lucide-react";
import { ACCOUNT } from "../../data/demoAccount";

const PAYEES = ["Select a payee", "Rohan Desai - XXXX1234", "Priya Nair - XXXX5678", "Add a new payee..."];

export default function SendMoney() {
  const [mode, setMode] = useState("domestic");
  const [to, setTo] = useState(PAYEES[0]);
  const [amount, setAmount] = useState("");

  function proceed() {
    if (to === PAYEES[0] || !amount) {
      alert("Please select a payee and enter an amount.");
      return;
    }
    alert("This is a demo. No real money transfer happens here.");
  }

  return (
    <div className="rounded-2xl  bg-white p-6 shadow-lg">
      <div className="flex flex-wrap max-w-[100%] items-center justify-between gap-3">
        <div className="font-semibold text-slate-800">Send Money</div>
        <div className="flex items-center gap-3">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="domestic">Domestic</option>
            <option value="own">Own Accounts</option>
          </select>
          <button type="button" onClick={() => alert("Add Payee is not available in this demo.")} className="flex items-center gap-1 text-sm font-semibold text-blue-800">
            <UserPlus size={16} /> Add Payee
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border border-slate-300 p-3 text-sm">
            {PAYEES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">From</label>
          <div className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
            {ACCOUNT.type} · {ACCOUNT.masked}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">Amount</label>
          <div className="flex items-center rounded-lg border border-slate-300 p-3 text-sm">
            <span className="mr-1 text-slate-400">₹</span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full outline-none"
            />
          </div>
        </div>
      </div>

      <button type="button" onClick={proceed} className="mt-5 flex items-center gap-2 rounded-lg bg-blue-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-900">
        Proceed <ArrowRight size={16} />
      </button>
    </div>
  );
}
