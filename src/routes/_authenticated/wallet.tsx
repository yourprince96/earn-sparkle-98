import { Link, createFileRoute } from "@tanstack/react-router";

import { AppShell, PageTitle, StatTile } from "@/components/AppShell";
import { useCompletions, useMyWithdrawals, useProfile, useTodayEarning } from "@/lib/data";
import { shortDate, taka } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — TakaTask" },
      { name: "description", content: "Your balance, today's earning and withdrawn total." },
      { property: "og:title", content: "Wallet — TakaTask" },
      {
        property: "og:description",
        content: "Your balance, today's earning and withdrawn total.",
      },
    ],
  }),
  component: WalletPage,
});

function WalletPage() {
  const profile = useProfile();
  const today = useTodayEarning();
  const completions = useCompletions(15);
  const withdrawals = useMyWithdrawals();

  return (
    <AppShell>
      <PageTitle title="Wallet" subtitle="Everything you have earned so far" />

      <section className="hero-gradient rise-in rounded-3xl p-5 text-white">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
          Total balance
        </p>
        <p className="mt-2 font-display text-[46px] leading-none font-bold tracking-tight">
          {taka(profile.data?.balance ?? 0)}
        </p>
        <Link
          to="/withdraw"
          className="tap mt-5 flex min-h-[52px] items-center justify-center rounded-2xl bg-white font-display text-[16px] font-bold text-ink"
        >
          Withdraw money
        </Link>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTile label="Today's earning" value={taka(today.data ?? 0)} tone="mint" />
        <StatTile label="Total withdrawn" value={taka(profile.data?.total_withdrawn ?? 0)} />
      </div>

      <h2 className="mt-6 mb-3 font-display text-lg font-bold">Withdraw requests</h2>
      {withdrawals.data?.length === 0 && (
        <p className="card-soft p-4 text-sm text-ink-soft">No withdraw requests yet.</p>
      )}
      <div className="flex flex-col gap-2">
        {withdrawals.data?.map((item) => (
          <div key={item.id} className="card-soft flex items-center gap-3 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet/15 font-display text-xs font-bold text-violet uppercase">
              {item.method === "bkash" ? "bK" : "Ng"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold">{taka(item.amount)}</p>
              <p className="truncate text-xs text-ink-soft">
                {item.account_number} · {shortDate(item.created_at)}
              </p>
            </div>
            <StatusPill status={item.status} />
          </div>
        ))}
      </div>

      <h2 className="mt-6 mb-3 font-display text-lg font-bold">Earning history</h2>
      {completions.data?.length === 0 && (
        <p className="card-soft p-4 text-sm text-ink-soft">
          No earnings yet — complete a task to get started.
        </p>
      )}
      <div className="flex flex-col gap-2">
        {completions.data?.map((item) => (
          <div key={item.id} className="card-soft flex items-center gap-3 p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-mint/15 text-lg text-mint-deep">
              ↑
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold">{item.title}</p>
              <p className="text-xs text-ink-soft">{shortDate(item.created_at)}</p>
            </div>
            <span className="font-display text-sm font-bold text-mint-deep">
              +{taka(item.reward)}
            </span>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "approved"
      ? "bg-mint/15 text-mint-deep"
      : status === "rejected"
        ? "bg-destructive/10 text-destructive"
        : "bg-amber/25 text-amber-deep";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${tone}`}>
      {status}
    </span>
  );
}
