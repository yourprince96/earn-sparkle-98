import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { useClaimTask, useTask } from "@/lib/data";
import { taka, taskLook } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/task/$id")({
  head: () => ({
    meta: [
      { title: "Task — TakaTask" },
      { name: "description", content: "Start the task, wait for the timer, then claim reward." },
      { property: "og:title", content: "Task — TakaTask" },
      {
        property: "og:description",
        content: "Start the task, wait for the timer, then claim reward.",
      },
    ],
  }),
  component: TaskPage,
});

type Phase = "idle" | "running" | "ready" | "done";

function TaskPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const task = useTask(id);
  const claim = useClaimTask();
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(30);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = task.data?.duration_seconds ?? 30;

  useEffect(() => {
    setLeft(total);
  }, [total]);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  function start() {
    if (phase === "running" || !task.data) return;
    if (task.data.kind === "visit_website" && task.data.link) {
      window.open(task.data.link, "_blank", "noopener,noreferrer");
    }
    setPhase("running");
    setLeft(total);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          if (timer.current) clearInterval(timer.current);
          setPhase("ready");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function claimReward() {
    try {
      const reward = await claim.mutateAsync(id);
      setPhase("done");
      toast.success(`${taka(reward)} added to your wallet!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not claim reward");
    }
  }

  const look = taskLook(task.data?.kind ?? "");
  const progress = total > 0 ? ((total - left) / total) * 100 : 0;

  return (
    <AppShell nav={false}>
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void navigate({ to: "/home" })}
          className="tap grid size-12 shrink-0 place-items-center rounded-full border border-border bg-card text-xl"
          aria-label="Go back"
        >
          ←
        </button>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase">
            {look.label}
          </p>
          <h1 className="truncate font-display text-xl font-bold">
            {task.data?.title ?? "Loading…"}
          </h1>
        </div>
      </header>

      <section className="card-soft rise-in mt-5 p-6 text-center">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase">Reward</p>
        <p className="mt-1 font-display text-4xl font-bold">{taka(task.data?.reward ?? 0)}</p>
        {task.data?.description && (
          <p className="mx-auto mt-2 max-w-[17rem] text-sm text-ink-soft">{task.data.description}</p>
        )}

        <div className="relative mx-auto mt-6 grid size-52 place-items-center">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(var(--mint) ${progress * 3.6}deg, var(--muted) ${progress * 3.6}deg)`,
              mask: "radial-gradient(farthest-side, transparent calc(100% - 12px), #000 calc(100% - 11px))",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 12px), #000 calc(100% - 11px))",
            }}
          />
          <div className="relative text-center">
            {phase === "done" ? (
              <span className="pop-in grid size-20 place-items-center rounded-full bg-mint text-4xl text-white">
                ✓
              </span>
            ) : (
              <>
                <p className="font-display text-5xl leading-none font-bold">{left}</p>
                <p className="mt-1 text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase">
                  seconds
                </p>
              </>
            )}
          </div>
        </div>

        {phase === "idle" && (
          <button
            type="button"
            onClick={start}
            className="tap mt-6 min-h-[56px] w-full rounded-2xl bg-primary font-display text-[17px] font-bold text-primary-foreground"
          >
            Start task
          </button>
        )}

        {phase === "running" && (
          <button
            type="button"
            disabled
            className="mt-6 min-h-[56px] w-full rounded-2xl bg-muted font-display text-[17px] font-bold text-ink-soft"
          >
            Please wait… {left}s
          </button>
        )}

        {phase === "ready" && (
          <button
            type="button"
            onClick={() => void claimReward()}
            disabled={claim.isPending}
            className="tap mt-6 min-h-[56px] w-full rounded-2xl bg-amber font-display text-[17px] font-bold text-ink disabled:opacity-60"
          >
            {claim.isPending ? "Claiming…" : `Claim ${taka(task.data?.reward ?? 0)}`}
          </button>
        )}

        {phase === "done" && (
          <div className="mt-6 space-y-2">
            <p className="font-display text-lg font-bold text-mint-deep">Reward claimed!</p>
            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setLeft(total);
              }}
              className="tap min-h-[52px] w-full rounded-2xl bg-primary font-display text-[15px] font-bold text-primary-foreground"
            >
              Do it again
            </button>
            <button
              type="button"
              onClick={() => void navigate({ to: "/home" })}
              className="tap min-h-[52px] w-full rounded-2xl border border-border bg-card font-display text-[15px] font-bold text-ink"
            >
              Back to tasks
            </button>
          </div>
        )}
      </section>

      <p className="mt-4 text-center text-xs text-ink-soft">
        Daily limit: {task.data?.daily_limit ?? 0} times per day
      </p>
    </AppShell>
  );
}
