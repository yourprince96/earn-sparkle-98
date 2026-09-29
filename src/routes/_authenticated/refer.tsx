import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell, PageTitle, StatTile } from "@/components/AppShell";
import { useProfile } from "@/lib/data";
import { taka } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/refer")({
  head: () => ({
    meta: [
      { title: "Refer & earn — TakaTask" },
      { name: "description", content: "Share your referral code and earn ৳20 for every friend." },
      { property: "og:title", content: "Refer & earn — TakaTask" },
      {
        property: "og:description",
        content: "Share your referral code and earn ৳20 for every friend.",
      },
    ],
  }),
  component: ReferPage,
});

function ReferPage() {
  const profile = useProfile();
  const code = profile.data?.referral_code ?? "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Referral code copied!");
    } catch {
      toast.error("Copy failed — long press the code to copy it");
    }
  }

  async function share() {
    const text = `Earn Taka with TakaTask! Use my referral code ${code} when you sign up.`;
    const nav: Navigator = navigator;
    try {
      if (typeof nav.share === "function") {
        await nav.share({ title: "TakaTask", text });
        return;
      }
      await nav.clipboard.writeText(text);
      toast.success("Invite message copied!");
    } catch {
      /* user cancelled */
    }
  }

  return (
    <AppShell>
      <PageTitle title="Refer & earn" subtitle="Get ৳20 for every friend who joins" />

      <section className="hero-gradient rise-in rounded-3xl p-5 text-white">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
          Your referral code
        </p>
        <p className="mt-2 font-display text-[34px] leading-none font-bold tracking-[0.18em]">
          {code || "······"}
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => void copy()}
            className="tap min-h-[50px] flex-1 rounded-2xl bg-white font-display text-[15px] font-bold text-ink"
          >
            Copy code
          </button>
          <button
            type="button"
            onClick={() => void share()}
            className="tap min-h-[50px] flex-1 rounded-2xl bg-white/15 font-display text-[15px] font-bold text-white ring-1 ring-white/25"
          >
            Share
          </button>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTile label="Referral earning" value={taka(profile.data?.referral_earning ?? 0)} tone="mint" />
        <StatTile
          label="Friends joined"
          value={String(Math.floor(Number(profile.data?.referral_earning ?? 0) / 20))}
          tone="amber"
        />
      </div>

      <section className="card-soft mt-5 p-5">
        <h2 className="font-display text-base font-bold">How it works</h2>
        <ol className="mt-3 space-y-3 text-sm text-ink-soft">
          {[
            "Share your referral code with friends.",
            "They enter it while creating their account.",
            "You instantly get ৳20 in your wallet.",
          ].map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint/15 font-display text-xs font-bold text-mint-deep">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
