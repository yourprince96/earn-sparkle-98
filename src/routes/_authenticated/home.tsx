import { Link, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { useIsAdmin, useProfile, useTasks, useTodayEarning } from "@/lib/data";
import { taka, taskLook } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Home — TakaTask" },
      { name: "description", content: "Your available earning tasks and current balance." },
      { property: "og:title", content: "Home — TakaTask" },
      { property: "og:description", content: "Your available earning tasks and current balance." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const profile = useProfile();
  const tasks = useTasks(true);
  const today = useTodayEarning();
  const isAdmin = useIsAdmin();

  return (
    <AppShell>
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase">
            Welcome back
          </p>
          <h1 className="font-display text-[22px] leading-tight font-bold">
            {profile.data?.full_name || profile.data?.email?.split("@")[0] || "Earner"}
          </h1>
        </div>
        <Link
          to="/profile"
          className="tap grid size-12 place-items-center rounded-full bg-gradient-to-br from-amber to-rose font-display text-lg font-bold text-white"
        >
          {(profile.data?.full_name || profile.data?.email || "U").charAt(0).toUpperCase()}
        </Link>
      </header>

      {profile.data?.is_blocked && (
        <div className="mt-4 rounded-2xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          Your account is blocked. You cannot earn or withdraw right now.
        </div>
      )}

      <section className="hero-gradient rise-in mt-4 rounded-3xl p-5 text-white">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
            Total balance
          </p>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white">
            +{taka(today.data ?? 0)} today
          </span>
        </div>
        <p className="mt-2 font-display text-[44px] leading-none font-bold tracking-tight">
          {taka(profile.data?.balance ?? 0)}
        </p>
        <div className="mt-5 flex gap-2">
          <Link
            to="/withdraw"
            className="tap flex min-h-[50px] flex-1 items-center justify-center rounded-2xl bg-white font-display text-[15px] font-bold text-ink"
          >
            Withdraw
          </Link>
          <Link
            to="/refer"
            className="tap flex min-h-[50px] flex-1 items-center justify-center rounded-2xl bg-white/15 font-display text-[15px] font-bold text-white ring-1 ring-white/25"
          >
            Refer & earn
          </Link>
        </div>
      </section>

      <div className="mt-6 mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Earning tasks</h2>
        <span className="text-xs font-semibold text-ink-soft">
          {tasks.data?.length ?? 0} available
        </span>
      </div>

      {tasks.isLoading && <p className="text-sm text-ink-soft">Loading tasks…</p>}
      {tasks.data?.length === 0 && (
        <p className="card-soft p-5 text-sm text-ink-soft">No tasks available right now.</p>
      )}

      <div className="flex flex-col gap-3">
        {tasks.data?.map((task, index) => {
          const look = taskLook(task.kind);
          return (
            <Link
              key={task.id}
              to="/task/$id"
              params={{ id: task.id }}
              className="tap card-soft rise-in flex items-center gap-3 p-4"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl text-xl font-bold ${look.tint}`}
              >
                {look.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[15px] font-bold">{task.title}</span>
                <span className="block truncate text-xs text-ink-soft">
                  {task.description || `${task.duration_seconds}s · ${task.daily_limit}x daily`}
                </span>
              </span>
              <span className="rounded-full bg-mint/15 px-3 py-1.5 font-display text-sm font-bold text-mint-deep">
                +{taka(task.reward)}
              </span>
            </Link>
          );
        })}
      </div>

      {isAdmin.data && (
        <Link
          to="/admin"
          className="tap mt-5 flex min-h-[54px] items-center justify-center rounded-2xl bg-ink font-display text-[15px] font-bold text-white"
        >
          Open admin panel
        </Link>
      )}
    </AppShell>
  );
}
