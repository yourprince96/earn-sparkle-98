import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell, PageTitle, StatTile } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useProfile, useTodayEarning } from "@/lib/data";
import { taka } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — TakaTask" },
      { name: "description", content: "Manage your TakaTask account details and sign out." },
      { property: "og:title", content: "Profile — TakaTask" },
      { property: "og:description", content: "Manage your TakaTask account details and sign out." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const profile = useProfile();
  const today = useTodayEarning();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile.data) setName(profile.data.full_name);
  }, [profile.data]);

  async function save() {
    if (!profile.data) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() })
      .eq("id", profile.data.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated");
    void queryClient.invalidateQueries({ queryKey: ["profile"] });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/", replace: true });
  }

  return (
    <AppShell>
      <PageTitle title="Profile" />

      <section className="card-soft flex items-center gap-4 p-5">
        <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-amber to-rose font-display text-2xl font-bold text-white">
          {(profile.data?.full_name || profile.data?.email || "U").charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold">
            {profile.data?.full_name || "Earner"}
          </p>
          <p className="truncate text-sm text-ink-soft">{profile.data?.email}</p>
          {isAdmin.data && (
            <span className="mt-1 inline-block rounded-full bg-violet/15 px-2.5 py-0.5 text-[11px] font-bold text-violet">
              Admin
            </span>
          )}
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatTile label="Balance" value={taka(profile.data?.balance ?? 0)} tone="mint" />
        <StatTile label="Today" value={taka(today.data ?? 0)} tone="amber" />
      </div>

      <section className="card-soft mt-4 p-5">
        <h2 className="font-display text-base font-bold">Your name</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-base mt-3"
          placeholder="Your name"
        />
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="tap mt-3 min-h-[50px] w-full rounded-2xl bg-primary font-display text-[15px] font-bold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </section>

      {isAdmin.data && (
        <Link
          to="/admin"
          className="tap mt-4 flex min-h-[54px] items-center justify-center rounded-2xl bg-ink font-display text-[15px] font-bold text-white"
        >
          Open admin panel
        </Link>
      )}

      <button
        type="button"
        onClick={() => void signOut()}
        className="tap mt-4 min-h-[54px] w-full rounded-2xl border border-destructive/30 bg-destructive/10 font-display text-[15px] font-bold text-destructive"
      >
        Sign out
      </button>
    </AppShell>
  );
}
