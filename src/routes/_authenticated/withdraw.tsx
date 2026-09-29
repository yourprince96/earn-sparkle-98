import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageTitle } from "@/components/AppShell";
import { useProfile, useRequestWithdrawal } from "@/lib/data";
import { taka } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/withdraw")({
  head: () => ({
    meta: [
      { title: "Withdraw — TakaTask" },
      { name: "description", content: "Withdraw your earnings to bKash or Nagad from ৳100." },
      { property: "og:title", content: "Withdraw — TakaTask" },
      {
        property: "og:description",
        content: "Withdraw your earnings to bKash or Nagad from ৳100.",
      },
    ],
  }),
  component: WithdrawPage,
});

const METHODS = [
  { id: "bkash", label: "bKash", hint: "Personal number" },
  { id: "nagad", label: "Nagad", hint: "Personal number" },
] as const;

function WithdrawPage() {
  const navigate = useNavigate();
  const profile = useProfile();
  const request = useRequestWithdrawal();
  const [method, setMethod] = useState<string>("bkash");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("100");

  const balance = Number(profile.data?.balance ?? 0);
  const value = Number(amount || 0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (value < 100) {
      toast.error("Minimum withdraw amount is ৳100");
      return;
    }
    if (value > balance) {
      toast.error("You don't have enough balance");
      return;
    }
    try {
      await request.mutateAsync({ method, account: account.trim(), amount: value });
      toast.success("Withdraw request sent! Admin will review it shortly.");
      setAccount("");
      setAmount("100");
      void navigate({ to: "/wallet" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send request");
    }
  }

  return (
    <AppShell>
      <PageTitle title="Withdraw" subtitle={`Available: ${taka(balance)} · minimum ৳100`} />

      <form onSubmit={submit} className="space-y-5">
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-soft">Payment method</p>
          <div className="grid grid-cols-2 gap-3">
            {METHODS.map((item) => {
              const active = method === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMethod(item.id)}
                  className={`tap min-h-[86px] rounded-2xl border p-4 text-left ${
                    active
                      ? "border-primary bg-mint/10"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="block font-display text-base font-bold">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-ink-soft">{item.hint}</span>
                  <span
                    className={`mt-2 block text-[11px] font-bold ${active ? "text-mint-deep" : "text-ink-soft"}`}
                  >
                    {active ? "Selected" : "Tap to select"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-soft">
            {method === "bkash" ? "bKash" : "Nagad"} number
          </span>
          <input
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            required
            inputMode="tel"
            placeholder="01XXXXXXXXX"
            className="input-base"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink-soft">Amount (৳)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            required
            inputMode="decimal"
            className="input-base font-display text-lg font-bold"
          />
        </label>

        <div className="flex gap-2">
          {[100, 200, 500].map((quick) => (
            <button
              key={quick}
              type="button"
              onClick={() => setAmount(String(quick))}
              className="tap min-h-[46px] flex-1 rounded-2xl border border-border bg-card font-display text-sm font-bold"
            >
              ৳{quick}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount(String(Math.floor(balance)))}
            className="tap min-h-[46px] flex-1 rounded-2xl border border-border bg-card font-display text-sm font-bold"
          >
            All
          </button>
        </div>

        <button
          type="submit"
          disabled={request.isPending}
          className="tap min-h-[56px] w-full rounded-2xl bg-primary font-display text-[17px] font-bold text-primary-foreground disabled:opacity-60"
        >
          {request.isPending ? "Sending…" : "Request withdraw"}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-ink-soft">
        Requests are usually reviewed within 24 hours. The amount is held from your balance and
        returned if rejected.
      </p>
    </AppShell>
  );
}
