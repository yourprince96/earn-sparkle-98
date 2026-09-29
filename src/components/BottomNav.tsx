import { Link } from "@tanstack/react-router";

const ITEMS = [
  { to: "/home", label: "Home", icon: "⌂" },
  { to: "/wallet", label: "Wallet", icon: "◈" },
  { to: "/refer", label: "Refer", icon: "✦" },
  { to: "/profile", label: "Profile", icon: "◉" },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30">
      <div className="mx-auto max-w-[430px] px-3 pb-3">
        <div className="grid grid-cols-4 gap-1 rounded-3xl border border-border bg-card/95 p-2 shadow-float backdrop-blur-xl">
          {ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="tap flex min-h-[58px] flex-col items-center justify-center gap-0.5 rounded-2xl text-ink-soft data-[status=active]:bg-mint/15 data-[status=active]:text-mint-deep"
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
