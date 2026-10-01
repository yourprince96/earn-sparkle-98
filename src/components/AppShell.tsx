import type { ReactNode } from "react";

import { AdSlot } from "./AdSlot";
import { BottomNav } from "./BottomNav";

export function AppShell({ children, nav = true }: { children: ReactNode; nav?: boolean }) {
  return (
    <main className="min-h-screen w-full">
      <div className={`mx-auto max-w-[430px] px-4 pt-5 ${nav ? "pb-32" : "pb-10"}`}>
        <AdSlot slot="ad_top" />
        {children}
        <AdSlot slot="ad_bottom" />
      </div>
      {nav && <BottomNav />}
    </main>
  );
}

export function StatTile({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "mint" | "amber";
}) {
  const color =
    tone === "mint" ? "text-mint-deep" : tone === "amber" ? "text-amber-deep" : "text-ink";
  return (
    <div className="card-soft p-4">
      <p className="text-[11px] font-semibold tracking-wide text-ink-soft uppercase">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-4">
      <h1 className="font-display text-2xl font-bold">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
    </header>
  );
}
