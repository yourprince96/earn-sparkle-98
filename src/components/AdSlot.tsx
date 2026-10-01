import { useEffect, useState } from "react";

import { useSettings, type AppSettings } from "@/lib/extra";

type Slot = "ad_top" | "ad_middle" | "ad_bottom" | "ad_interstitial";

/** Renders admin-provided ad code (e.g. Adsterra) inside a sandboxed frame. */
export function AdSlot({ slot, height = 60 }: { slot: Slot; height?: number }) {
  const settings = useSettings();
  const code = (settings.data as AppSettings | null | undefined)?.[slot] ?? "";
  if (!code.trim()) return null;
  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-border bg-card">
      <iframe
        title={`ad-${slot}`}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        srcDoc={`<!doctype html><html><body style="margin:0;display:flex;justify-content:center;align-items:center">${code}</body></html>`}
        style={{ width: "100%", height, border: 0 }}
      />
    </div>
  );
}

/** Non-skippable 10s ad shown before a task opens. */
export function AdGate({ onDone, seconds = 10 }: { onDone: () => void; seconds?: number }) {
  const [left, setLeft] = useState(seconds);
  const settings = useSettings();
  const hasAd = Boolean(settings.data?.ad_interstitial?.trim());

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[430px] flex-1 flex-col px-4 pt-6 pb-8">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-ink-soft uppercase">
            Sponsored · watch to continue
          </p>
          <span className="rounded-full bg-amber/25 px-3 py-1 font-display text-sm font-bold text-amber-deep">
            {left}s
          </span>
        </div>
        <div className="mt-4 flex flex-1 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card">
          {hasAd ? (
            <AdSlot slot="ad_interstitial" height={320} />
          ) : (
            <div className="hero-gradient grid h-full w-full place-items-center p-6 text-center text-white">
              <div>
                <p className="font-display text-2xl font-bold">Your ad here</p>
                <p className="mt-2 text-sm text-white/70">Task will open in {left} seconds</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-mint transition-all" style={{ width: `${((seconds - left) / seconds) * 100}%` }} />
        </div>
        <button
          type="button"
          disabled={left > 0}
          onClick={onDone}
          className="tap mt-4 min-h-[56px] w-full rounded-2xl bg-primary font-display text-[17px] font-bold text-primary-foreground disabled:bg-muted disabled:text-ink-soft"
        >
          {left > 0 ? `Please wait ${left}s…` : "Continue to task"}
        </button>
      </div>
    </div>
  );
}
