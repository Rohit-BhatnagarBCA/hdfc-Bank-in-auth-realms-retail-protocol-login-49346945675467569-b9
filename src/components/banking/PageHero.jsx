// Dark blue band under the navbar with an optional Back link and a page title.
// By default the band hugs its own content (small, just enough for the title) —
// this is what Accounts, Statement, and other pages use.
// Pass `tall` to get the bigger fixed-height blue background — only Home uses this.
// Pass `compact` to make the small band even shorter — used by Statement.
import { ArrowLeft } from "lucide-react";

export default function PageHero({ title, onBack, children, tall = false, compact = false }) {
  if (tall) {
    // Big fixed-height blue background, used only on Home.
    return (
      <div className="relative isolate pb-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[480px] bg-gradient-to-b from-[#08295c] to-[#051b42]  " />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-3 sm:px-8">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-white/80"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          <h1 className="mt-4 text-4xl font-semibold text-white">{title}</h1>

          {children}
        </div>
      </div>
    );
  }

  // Default (small, auto-height) blue band — used by Accounts, Statement, etc.
  // `compact` shrinks the bottom padding further for pages that need even less blue.
  return (
    <div className={`bg-gradient-to-b h-[260px] from-[#08295c] to-[#2754a0] ${compact ? "pb-4" : "pb-4"}`}>
      <div className="mx-auto max-w-7xl px-9 pt-9 sm:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-1xl text-white/80"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        <h1 className="mt-4 text-3xl font-semibold text-white">{title}</h1>

        {children}
      </div>
    </div>
  );
}