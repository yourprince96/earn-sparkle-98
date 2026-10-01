import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TaskEarn — টাস্ক করে ইনকাম করুন" },
      {
        name: "description",
        content:
          "মোবাইল টাস্ক আর্নিং অ্যাপ — অ্যাড দেখুন, ওয়েবসাইট ভিজিট করুন, ডেইলি স্পিন করুন এবং bKash/Nagad-এ উইথড্র করুন।",
      },
      { property: "og:title", content: "TaskEarn — টাস্ক করে ইনকাম করুন" },
      {
        property: "og:description",
        content: "টাস্ক কমপ্লিট করে টাকা ইনকাম করুন, মিনিমাম ৳১০০ তে bKash/Nagad উইথড্র।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [referral, setReferral] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, referred_by: referral.trim() || null },
          },
        });
        if (error) throw error;
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম 🎉");
      }
      await qc.invalidateQueries();
      void navigate({ to: "/home" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen hero-gradient flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm rise-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-lg mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">TaskEarn</h1>
          <p className="text-sm text-muted-foreground mt-1">টাস্ক করুন, টাকা ইনকাম করুন</p>
        </div>

        <div className="card-soft p-6">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-muted mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`tap rounded-lg py-2.5 text-sm font-semibold transition ${
                  mode === m
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "লগইন" : "সাইন আপ"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <input
                className="input-base"
                placeholder="আপনার নাম"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <input
              className="input-base"
              type="email"
              placeholder="ইমেইল"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="input-base"
              type="password"
              placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
            {mode === "signup" && (
              <input
                className="input-base"
                placeholder="রেফারেল কোড (ঐচ্ছিক)"
                value={referral}
                onChange={(e) => setReferral(e.target.value)}
              />
            )}
            <button
              type="submit"
              disabled={busy}
              className="tap w-full rounded-xl bg-primary text-primary-foreground font-bold py-3.5 shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "লগইন করুন" : "অ্যাকাউন্ট খুলুন"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          টাস্ক কমপ্লিট করে রিওয়ার্ড পান • মিনিমাম ৳১০০ উইথড্র
        </p>
      </div>
    </div>
  );
}
