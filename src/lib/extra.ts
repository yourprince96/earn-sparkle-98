import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as any;

export type AppSettings = {
  spin_fee: number;
  spin_prizes: number[];
  ad_top: string;
  ad_middle: string;
  ad_bottom: string;
  ad_interstitial: string;
  support_whatsapp: string;
  support_telegram: string;
  support_email: string;
  bkash_number: string;
  nagad_number: string;
};

export type VipPlan = {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  perks: string;
  is_active: boolean;
};

export type VipPurchase = {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  method: string;
  trx_id: string | null;
  sender_number: string | null;
  status: string;
  created_at: string;
};

export type Submission = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  reward: number;
  proof_text: string;
  proof_path: string | null;
  status: string;
  note: string | null;
  created_at: string;
};

export type PromoCode = {
  id: string;
  code: string;
  amount: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
};

export type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
};

function err(e: unknown): never {
  throw e instanceof Error ? e : new Error((e as { message?: string })?.message ?? "Request failed");
}

async function rows<T>(q: Promise<{ data: unknown; error: unknown }>): Promise<T> {
  const { data, error } = await q;
  if (error) err(error);
  return data as T;
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const s = await rows<AppSettings | null>(db.from("app_settings").select("*").eq("id", 1).maybeSingle());
      return s;
    },
    staleTime: 60_000,
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Partial<AppSettings>) =>
      rows(db.from("app_settings").update(values).eq("id", 1)),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}

export function useVipPlans(onlyActive = true) {
  return useQuery({
    queryKey: ["vip-plans", onlyActive],
    queryFn: async () => {
      let q = db.from("vip_plans").select("*").order("price");
      if (onlyActive) q = q.eq("is_active", true);
      return rows<VipPlan[]>(q);
    },
  });
}

export function useSavePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: Omit<VipPlan, "id"> & { id?: string | undefined }) => {
      const { id, ...v } = p;
      return id ? rows(db.from("vip_plans").update(v).eq("id", id)) : rows(db.from("vip_plans").insert(v));
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["vip-plans"] }),
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => rows(db.from("vip_plans").delete().eq("id", id)),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["vip-plans"] }),
  });
}

export function useVipPurchases(all = false) {
  return useQuery({
    queryKey: ["vip-purchases", all],
    queryFn: async () => {
      let q = db.from("vip_purchases").select("*").order("created_at", { ascending: false }).limit(100);
      if (!all) {
        const { data } = await supabase.auth.getUser();
        q = q.eq("user_id", data.user?.id ?? "");
      }
      return rows<VipPurchase[]>(q);
    },
  });
}

function invalidateMoney(qc: ReturnType<typeof useQueryClient>) {
  for (const k of ["profile", "today-earning", "completions", "vip-purchases", "submissions", "admin-stats"])
    void qc.invalidateQueries({ queryKey: [k] });
}

export function useBuyVipWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (planId: string) => rows(db.rpc("buy_vip_wallet", { _plan_id: planId })),
    onSuccess: () => invalidateMoney(qc),
  });
}

export function useRequestVipManual() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: { planId: string; method: string; trx: string; sender: string }) =>
      rows(db.rpc("request_vip_manual", { _plan_id: i.planId, _method: i.method, _trx: i.trx, _sender: i.sender })),
    onSuccess: () => invalidateMoney(qc),
  });
}

export function useReviewVip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: { id: string; approve: boolean }) =>
      rows(db.rpc("review_vip_purchase", { _id: i.id, _approve: i.approve })),
    onSuccess: () => invalidateMoney(qc),
  });
}

export async function startTask(taskId: string) {
  return rows<string>(db.rpc("start_task", { _task_id: taskId }));
}

export function useSubmitProof() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: { taskId: string; text: string; file: File | null }) => {
      let path: string | null = null;
      if (i.file) {
        const { data } = await supabase.auth.getUser();
        const ext = i.file.name.split(".").pop() || "jpg";
        path = `${data.user?.id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("proofs").upload(path, i.file);
        if (error) err(error);
      }
      return rows(db.rpc("submit_task_proof", { _task_id: i.taskId, _proof_text: i.text, _proof_path: path }));
    },
    onSuccess: () => invalidateMoney(qc),
  });
}

export function useSubmissions(all = false) {
  return useQuery({
    queryKey: ["submissions", all],
    queryFn: async () => {
      let q = db.from("task_submissions").select("*").order("created_at", { ascending: false }).limit(100);
      if (!all) {
        const { data } = await supabase.auth.getUser();
        q = q.eq("user_id", data.user?.id ?? "");
      }
      return rows<Submission[]>(q);
    },
  });
}

export function useReviewSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: { id: string; approve: boolean }) =>
      rows(db.rpc("review_task_submission", { _id: i.id, _approve: i.approve })),
    onSuccess: () => invalidateMoney(qc),
  });
}

export async function proofUrl(path: string) {
  const { data } = await supabase.storage.from("proofs").createSignedUrl(path, 600);
  return data?.signedUrl ?? null;
}

export function usePlaySpin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => rows<{ index: number; prize: number; fee: number }>(db.rpc("play_spin")),
    onSuccess: () => invalidateMoney(qc),
  });
}

export function useRedeemCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (code: string) => Number(await rows<number>(db.rpc("redeem_code", { _code: code }))),
    onSuccess: () => invalidateMoney(qc),
  });
}

export function usePromoCodes() {
  return useQuery({
    queryKey: ["promo-codes"],
    queryFn: () => rows<PromoCode[]>(db.from("promo_codes").select("*").order("created_at", { ascending: false })),
  });
}

export function useSavePromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: { code: string; amount: number; max_uses: number; expires_at: string | null }) =>
      rows(db.from("promo_codes").insert({ ...p, code: p.code.trim().toUpperCase() })),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["promo-codes"] }),
  });
}

export function useUpdatePromo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: { id: string; is_active?: boolean; remove?: boolean }) =>
      i.remove
        ? rows(db.from("promo_codes").delete().eq("id", i.id))
        : rows(db.from("promo_codes").update({ is_active: i.is_active }).eq("id", i.id)),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["promo-codes"] }),
  });
}

export function useTickets(all = false) {
  return useQuery({
    queryKey: ["tickets", all],
    queryFn: async () => {
      let q = db.from("support_tickets").select("*").order("created_at", { ascending: false });
      if (!all) {
        const { data } = await supabase.auth.getUser();
        q = q.eq("user_id", data.user?.id ?? "");
      }
      return rows<Ticket[]>(q);
    },
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: { subject: string; message: string }) => {
      const { data } = await supabase.auth.getUser();
      return rows(db.from("support_tickets").insert({ ...i, user_id: data.user?.id }));
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}

export function useReplyTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (i: { id: string; reply: string; close: boolean }) =>
      rows(db.from("support_tickets").update({ admin_reply: i.reply, status: i.close ? "closed" : "answered" }).eq("id", i.id)),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}

export async function uploadAvatar(file: File) {
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (!uid) throw new Error("Not signed in");
  const path = `${uid}/avatar-${Date.now()}.${file.name.split(".").pop() || "jpg"}`;
  const up = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
  if (up.error) err(up.error);
  const signed = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
  if (signed.error) err(signed.error);
  await rows(db.from("profiles").update({ avatar_url: signed.data.signedUrl }).eq("id", uid));
}

export function isVipActive(expires: string | null | undefined) {
  return Boolean(expires && new Date(expires).getTime() > Date.now());
}

export const CATEGORIES = [
  { key: "account_sale", title: "Task 1 · Account Sale", hint: "Sell social accounts" },
  { key: "coin_sale", title: "Task 2 · Crypto Coin Sale", hint: "Sell your coins" },
  { key: "website_visit", title: "Task 3 · Website Visit", hint: "Visit & wait for timer" },
  { key: "whatsapp_bind", title: "Task 4 · WhatsApp Bind", hint: "Send SMS & bind WhatsApp" },
] as const;
