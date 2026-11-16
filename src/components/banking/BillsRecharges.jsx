// "Bills & Recharges" strip: a row of category icons. Visual demo only.
import { Zap, Smartphone, Tv, Wifi, Flame, ShieldCheck } from "lucide-react";

const CATEGORIES = [
  { label: "Electricity", icon: Zap },
  { label: "Mobile", icon: Smartphone },
  { label: "DTH", icon: Tv },
  { label: "Broadband", icon: Wifi },
  { label: "Gas", icon: Flame },
  { label: "Insurance", icon: ShieldCheck },
];

export default function BillsRecharges() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-800 to-indigo-900 p-6 shadow-lg">
      <div className="flex items-right justify-between">
        <h2 className="font-semibold text-white">Bills &amp; Recharges</h2>
        <button type="button" onClick={() => alert("This is not available in this demo.")} className="text-sm font-semibold text-white/80">
          View All
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-5">
        {CATEGORIES.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => alert(`${item.label} bill pay is not available in this demo.`)}
              className="flex w-20 flex-col items-center gap-2 text-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-white text-blue-800">
                <Icon size={22} />
              </span>
              <span className="text-xs text-white/90">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
