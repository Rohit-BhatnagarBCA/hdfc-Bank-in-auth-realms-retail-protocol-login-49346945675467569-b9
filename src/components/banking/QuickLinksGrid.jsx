// "Quick Links" icon-grid card shown bottom-right on Home (loans/cards shortcuts).
// Has a background image behind the content — change BG_IMAGE below to swap it.
// Visual demo only — each tile just shows an alert.
import { Wallet, CreditCard, Unlock, Percent, Home, Car, ChevronRight } from "lucide-react";
import quickLinksBg from "../../assets/quicklinks-bg.jpg"; // <- put your image here, update filename if needed

const LINKS = [
  { label: "Personal Loan/TopUp", sub: "In 10 secs", icon: Wallet },
  { label: "Credit Card", sub: "Apply Now", icon: CreditCard },
  { label: "Loan on Card", sub: "Instant funds", icon: Unlock },
  { label: "Smart EMI", sub: "Convert purchases", icon: Percent },
  { label: "Home Loan", sub: "Low interest rates", icon: Home },
  { label: "Car Loan", sub: "Drive today", icon: Car },
];

export default function QuickLinksGrid() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 shadow-lg bg-cover bg-center"
      style={{ backgroundImage: `url(${quickLinksBg})` }}
    >
      {/* Light overlay so text stays readable over any image */}
      {/* <div className="absolute inset-0 bg-white/80" />

      {/* Content sits above the overlay/image */}
      {/* <div className="relative z-10">
        <h2 className="mb-4 font-bold text-slate-800">Quick Links</h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => alert(`${item.label} is not available in this demo.`)}
                className="flex items-center gap-3 text-left"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
                  <Icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-800">{item.label}</span>
                  <span className="block text-xs text-slate-400">{item.sub}</span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-slate-300" />
              </button>
            );
          })}
        </div>
      </div>  */}
    </div>
  );
}