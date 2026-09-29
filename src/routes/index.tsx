import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TakaTask — Earn money by doing small tasks" },
      {
        name: "description",
        content:
          "Sign in to TakaTask and earn Taka by watching ads, visiting websites and spinning daily. Withdraw to bKash or Nagad from 100 Taka.",
      },
      { property: "og:title", content: "TakaTask — Earn money by doing small tasks" },
      {
        property: "og:description",
        content: "Watch, visit, spin and earn. Withdraw to bKash or Nagad from 100 Taka.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/home", replace: true });
    });
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name.trim(), referral_code: referral.trim().toUpperCase() },
          },
        });
        if (error) throw error;
        toast.success("Account created — welcome!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await router.invalidate();
        void navigate({ to: "/home", replace: true });
      } else {
        toast.info("Check your email to confirm your account, then sign in.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col">
        <section className="hero-gradient rounded-b-[38px] px-6 pt-12 pb-10 text-white">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 font-display text-2xl font-bold ring-1 ring-white/25">
            ৳
          </div>
          <h1 className="mt-5 font-display text-3xl leading-tight font-bold">
            Earn Taka
            <br />
            every single day
          </h1>
          <p className="mt-2 max-w-[18rem] text-sm text-white/70">
            Watch ads, visit websites and spin daily. Cash out to bKash or Nagad from ৳100.
          </p>
        </section>

        <div className="flex-1 px-5 pt-6 pb-10">
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
            {(["login", "signup"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={`tap min-h-[46px] rounded-xl text-sm font-bold ${
                  mode === value ? "bg-card text-ink shadow-card" : "text-ink-soft"
                }`}
              >
                {value === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3">
            {mode === "signup" && (
              <Field label="Full name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="input-base"
                />
              </Field>
            )}
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                inputMode="email"
                autoComplete="email"
                placeholder="you@email.com"
                className="input-base"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="At least 6 characters"
                className="input-base"
              />
            </Field>
            {mode === "signup" && (
              <Field label="Referral code (optional)">
                <input
                  value={referral}
                  onChange={(e) => setReferral(e.target.value.toUpperCase())}
                  placeholder="e.g. 9F2A81C4"
                  className="input-base tracking-[0.18em]"
                />
              </Field>
            )}

            <button
              type="submit"
              disabled={busy}
              className="tap mt-2 min-h-[54px] w-full rounded-2xl bg-primary font-display text-[17px] font-bold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-soft">
            Admin? Sign in with your admin email to open the admin panel.
          </p>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
