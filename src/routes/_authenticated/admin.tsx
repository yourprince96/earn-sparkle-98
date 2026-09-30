import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import {
  useAdminStats,
  useAllUsers,
  useAllWithdrawals,
  useDeleteTask,
  useFraudReviews,
  useIsAdmin,
  useReviewWithdrawal,
  useRunFraudReview,
  useSaveTask,
  useTasks,
  useToggleBlock,
  type FraudPattern,
  type Task,
} from "@/lib/data";
import { shortDate, taka } from "@/lib/format";


export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin panel — TakaTask" },
      { name: "description", content: "Manage tasks, users and withdraw requests." },
      { property: "og:title", content: "Admin panel — TakaTask" },
      { property: "og:description", content: "Manage tasks, users and withdraw requests." },
    ],
  }),
  component: AdminPage,
});

const TABS = ["Dashboard", "Tasks", "Withdraws", "Users", "AI Review"] as const;
type Tab = (typeof TABS)[number];


function AdminPage() {
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Dashboard");

  if (isAdmin.isLoading) {
    return (
      <AppShell nav={false}>
        <p className="text-sm text-ink-soft">Checking access…</p>
      </AppShell>
    );
  }

  if (!isAdmin.data) {
    return (
      <AppShell nav={false}>
        <div className="card-soft p-6 text-center">
          <h1 className="font-display text-xl font-bold">Admins only</h1>
          <p className="mt-2 text-sm text-ink-soft">
            This area is for administrators. Sign in with the admin account to continue.
          </p>
          <button
            type="button"
            onClick={() => void navigate({ to: "/home" })}
            className="tap mt-5 min-h-[50px] w-full rounded-2xl bg-primary font-display text-[15px] font-bold text-primary-foreground"
          >
            Back to home
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell nav={false}>
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase">
            Admin panel
          </p>
          <h1 className="font-display text-2xl font-bold">Control center</h1>
        </div>
        <button
          type="button"
          onClick={() => void navigate({ to: "/home" })}
          className="tap grid size-12 place-items-center rounded-full border border-border bg-card text-lg"
          aria-label="Back to app"
        >
          ⌂
        </button>
      </header>

      <div className="mt-4 -mx-4 overflow-x-auto px-4 pb-1">
        <div className="flex w-max gap-2">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`tap min-h-[44px] rounded-2xl px-4 text-sm font-bold ${
                tab === item ? "bg-ink text-white" : "border border-border bg-card text-ink-soft"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {tab === "Dashboard" && <DashboardTab />}
        {tab === "Tasks" && <TasksTab />}
        {tab === "Withdraws" && <WithdrawsTab />}
        {tab === "Users" && <UsersTab />}
        {tab === "AI Review" && <FraudTab />}

      </div>
    </AppShell>
  );
}

function DashboardTab() {
  const stats = useAdminStats();
  const s = stats.data;
  const cards = [
    { label: "Total users", value: String(s?.total_users ?? 0), tone: "bg-violet/15 text-violet" },
    {
      label: "Pending withdraws",
      value: String(s?.pending_withdraws ?? 0),
      tone: "bg-amber/25 text-amber-deep",
    },
    { label: "Pending amount", value: taka(s?.pending_amount ?? 0), tone: "bg-rose/15 text-rose" },
    { label: "Total paid", value: taka(s?.total_paid ?? 0), tone: "bg-mint/15 text-mint-deep" },
    { label: "Blocked users", value: String(s?.blocked_users ?? 0), tone: "bg-ink/10 text-ink" },
    { label: "Total tasks", value: String(s?.total_tasks ?? 0), tone: "bg-mint/15 text-mint-deep" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="card-soft p-4">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${card.tone}`}
          >
            {card.label}
          </span>
          <p className="mt-2 font-display text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

const EMPTY_TASK = {
  title: "",
  description: "",
  kind: "watch_ad",
  reward: 5,
  link: "",
  duration_seconds: 30,
  daily_limit: 5,
  is_active: true,
};

function TasksTab() {
  const tasks = useTasks(false);
  const save = useSaveTask();
  const remove = useDeleteTask();
  const [editing, setEditing] = useState<(typeof EMPTY_TASK & { id?: string }) | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    try {
      await save.mutateAsync({
        id: editing.id,
        title: editing.title.trim(),
        description: editing.description.trim(),
        kind: editing.kind,
        reward: Number(editing.reward),
        link: editing.link.trim() || null,
        duration_seconds: Number(editing.duration_seconds) || 30,
        daily_limit: Number(editing.daily_limit) || 1,
        is_active: editing.is_active,
      });
      toast.success(editing.id ? "Task updated" : "Task created");
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save task");
    }
  }

  async function del(id: string) {
    try {
      await remove.mutateAsync(id);
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete task");
    }
  }

  if (editing) {
    return (
      <form onSubmit={submit} className="card-soft space-y-3 p-5">
        <h2 className="font-display text-lg font-bold">{editing.id ? "Edit task" : "New task"}</h2>

        <Labeled label="Title">
          <input
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            required
            className="input-base"
          />
        </Labeled>
        <Labeled label="Description">
          <input
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            className="input-base"
          />
        </Labeled>
        <Labeled label="Task type">
          <select
            value={editing.kind}
            onChange={(e) => setEditing({ ...editing, kind: e.target.value })}
            className="input-base"
          >
            <option value="watch_ad">Watch Ad</option>
            <option value="visit_website">Visit Website</option>
            <option value="daily_spin">Daily Spin</option>
          </select>
        </Labeled>
        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Reward (৳)">
            <input
              value={String(editing.reward)}
              onChange={(e) =>
                setEditing({ ...editing, reward: Number(e.target.value.replace(/[^0-9.]/g, "")) })
              }
              inputMode="decimal"
              className="input-base"
            />
          </Labeled>
          <Labeled label="Timer (seconds)">
            <input
              value={String(editing.duration_seconds)}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  duration_seconds: Number(e.target.value.replace(/[^0-9]/g, "")),
                })
              }
              inputMode="numeric"
              className="input-base"
            />
          </Labeled>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Daily limit">
            <input
              value={String(editing.daily_limit)}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  daily_limit: Number(e.target.value.replace(/[^0-9]/g, "")),
                })
              }
              inputMode="numeric"
              className="input-base"
            />
          </Labeled>
          <Labeled label="Website link">
            <input
              value={editing.link}
              onChange={(e) => setEditing({ ...editing, link: e.target.value })}
              placeholder="https://"
              className="input-base"
            />
          </Labeled>
        </div>

        <button
          type="button"
          onClick={() => setEditing({ ...editing, is_active: !editing.is_active })}
          className={`tap min-h-[50px] w-full rounded-2xl font-display text-sm font-bold ${
            editing.is_active ? "bg-mint/15 text-mint-deep" : "bg-muted text-ink-soft"
          }`}
        >
          {editing.is_active ? "Active — visible to users" : "Inactive — hidden from users"}
        </button>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="tap min-h-[52px] flex-1 rounded-2xl border border-border bg-card font-display text-sm font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={save.isPending}
            className="tap min-h-[52px] flex-1 rounded-2xl bg-primary font-display text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {save.isPending ? "Saving…" : "Save task"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setEditing({ ...EMPTY_TASK })}
        className="tap mb-3 min-h-[54px] w-full rounded-2xl bg-primary font-display text-[15px] font-bold text-primary-foreground"
      >
        + Add new task
      </button>

      <div className="flex flex-col gap-2">
        {tasks.data?.map((task: Task) => (
          <div key={task.id} className="card-soft p-4">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] font-bold">{task.title}</p>
                <p className="truncate text-xs text-ink-soft">
                  {task.kind.replace("_", " ")} · {task.duration_seconds}s · {task.daily_limit}x
                  daily
                </p>
              </div>
              <span className="rounded-full bg-mint/15 px-2.5 py-1 font-display text-sm font-bold text-mint-deep">
                {taka(task.reward)}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    kind: task.kind,
                    reward: Number(task.reward),
                    link: task.link ?? "",
                    duration_seconds: task.duration_seconds,
                    daily_limit: task.daily_limit,
                    is_active: task.is_active,
                  })
                }
                className="tap min-h-[46px] flex-1 rounded-xl border border-border bg-card text-sm font-bold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => void del(task.id)}
                className="tap min-h-[46px] flex-1 rounded-xl bg-destructive/10 text-sm font-bold text-destructive"
              >
                Delete
              </button>
              <span
                className={`grid min-h-[46px] flex-1 place-items-center rounded-xl text-xs font-bold ${
                  task.is_active ? "bg-mint/15 text-mint-deep" : "bg-muted text-ink-soft"
                }`}
              >
                {task.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WithdrawsTab() {
  const withdrawals = useAllWithdrawals();
  const review = useReviewWithdrawal();

  async function decide(id: string, approve: boolean) {
    try {
      await review.mutateAsync({ id, approve });
      toast.success(approve ? "Withdraw approved" : "Withdraw rejected and refunded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update request");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {withdrawals.data?.length === 0 && (
        <p className="card-soft p-4 text-sm text-ink-soft">No withdraw requests yet.</p>
      )}
      {withdrawals.data?.map((item) => (
        <div key={item.id} className="card-soft p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-violet/15 font-display text-xs font-bold text-violet uppercase">
              {item.method === "bkash" ? "bK" : "Ng"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-bold">{taka(item.amount)}</p>
              <p className="truncate text-xs text-ink-soft">
                {item.account_number} · {shortDate(item.created_at)}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
                item.status === "approved"
                  ? "bg-mint/15 text-mint-deep"
                  : item.status === "rejected"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-amber/25 text-amber-deep"
              }`}
            >
              {item.status}
            </span>
          </div>
          {item.status === "pending" && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void decide(item.id, true)}
                className="tap min-h-[48px] flex-1 rounded-xl bg-primary text-sm font-bold text-primary-foreground"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => void decide(item.id, false)}
                className="tap min-h-[48px] flex-1 rounded-xl bg-destructive/10 text-sm font-bold text-destructive"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function UsersTab() {
  const users = useAllUsers();
  const toggle = useToggleBlock();

  async function setBlocked(id: string, blocked: boolean) {
    try {
      await toggle.mutateAsync({ id, blocked });
      toast.success(blocked ? "User blocked" : "User unblocked");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update user");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {users.data?.map((user) => (
        <div key={user.id} className="card-soft p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-amber to-rose font-display text-sm font-bold text-white">
              {(user.full_name || user.email).charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold">
                {user.full_name || "No name"}
              </p>
              <p className="truncate text-xs text-ink-soft">{user.email}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-sm font-bold text-mint-deep">{taka(user.balance)}</p>
              <p className="text-[11px] text-ink-soft">code {user.referral_code}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void setBlocked(user.id, !user.is_blocked)}
            className={`tap mt-3 min-h-[48px] w-full rounded-xl text-sm font-bold ${
              user.is_blocked
                ? "bg-mint/15 text-mint-deep"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {user.is_blocked ? "Unblock user" : "Block user"}
          </button>
        </div>
      ))}
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
