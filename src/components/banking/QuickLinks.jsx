// "Quick Links" card shown on the right side of Accounts and Statement pages.
import { ChevronRight } from "lucide-react";

// links = [{ label, icon: LucideIcon, onClick }]
export default function QuickLinks({ title = "Quick Links", links }) {
  return (
   <aside className="h-fit self-start overflow-hidden rounded-2xl bg-white shadow-lg">
      <h2 className="bg-slate-100 px-6 py-5 text-lg font-semibold text-slate-800">{title}</h2>
      <ul className="max-h-[360px] overflow-y-auto p-3">
        {links.map(({ label, icon: Icon, onClick }) => (
          <li key={label}>
            <button
              type="button"
              onClick={onClick}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <span className="flex items-center gap-3">
                {Icon && <Icon size={18} className="text-blue-700" />}
                {label}
              </span>
              <ChevronRight size={16} className="text-blue-700" />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
