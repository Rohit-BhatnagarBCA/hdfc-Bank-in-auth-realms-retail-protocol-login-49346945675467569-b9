// Top bar: hamburger (mobile), greeting, notification bell and user avatar.
import { Menu, Bell, User } from "lucide-react";

export default function Header({ user, setMobileOpen }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger is visible only below the `lg` breakpoint */}
        <button
          type="button"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="text-xs text-slate-400">Welcome back</p>
          <p className="text-sm font-bold text-slate-800">{user.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" aria-label="Notifications" className="text-slate-500">
          <Bell size={20} />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-700">
          <User size={18} />
        </div>
      </div>
    </header>
  );
}