import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  balance: number;
  total_withdrawn: number;
  referral_code: string;
  referral_earning: number;
  is_blocked: boolean;
  created_at: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  kind: string;
  reward: number;
  link: string | null;
  duration_seconds: number;
  daily_limit: number;
  is_active: boolean;
};

export type Withdrawal = {
  id: string;
  user_id: string;
  method: string;
  account_number: string;
  amount: number;
  status: string;
  note: string | null;
  created_at: string;
};

export type Completion = {
  id: string;
  title: string;
  reward: number;
  created_at: string;
};

async function requireUserId() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile> => {
      const uid = await requireUserId();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Profile not ready yet");
      return data as unknown as Profile;
    },
  });
}

export function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const uid = await requireUserId();
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return Boolean(data);
    },
  });
}

export function useTodayEarning() {
  return useQuery({
    queryKey: ["today-earning"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("today_earning");
      if (error) throw error;
      return Number(data ?? 0);
    },
  });
}

export function useTasks(onlyActive = true) {
  return useQuery({
    queryKey: ["tasks", onlyActive],
    queryFn: async (): Promise<Task[]> => {
      let query = supabase.from("tasks").select("*").order("created_at", { ascending: true });
      if (onlyActive) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as Task[];
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async (): Promise<Task> => {
      const { data, error } = await supabase.from("tasks").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Task not found");
      return data as unknown as Task;
    },
  });
}

export function useCompletions(limit = 20) {
  return useQuery({
    queryKey: ["completions", limit],
    queryFn: async (): Promise<Completion[]> => {
      const uid = await requireUserId();
      const { data, error } = await supabase
        .from("task_completions")
        .select("id,title,reward,created_at")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as unknown as Completion[];
    },
  });
}

export function useMyWithdrawals() {
  return useQuery({
    queryKey: ["my-withdrawals"],
    queryFn: async (): Promise<Withdrawal[]> => {
      const uid = await requireUserId();
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Withdrawal[];
    },
  });
}

export function useClaimTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await supabase.rpc("claim_task", { _task_id: taskId });
      if (error) throw error;
      return Number(data ?? 0);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["profile"] });
      void qc.invalidateQueries({ queryKey: ["today-earning"] });
      void qc.invalidateQueries({ queryKey: ["completions"] });
    },
  });
}

export function useRequestWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { method: string; account: string; amount: number }) => {
      const { error } = await supabase.rpc("request_withdrawal", {
        _method: input.method,
        _account: input.account,
        _amount: input.amount,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["profile"] });
      void qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
    },
  });
}

/* ---------------- admin ---------------- */

export type AdminStats = {
  total_users: number;
  blocked_users: number;
  pending_withdraws: number;
  pending_amount: number;
  total_paid: number;
  total_tasks: number;
};

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      const { data, error } = await supabase.rpc("admin_stats");
      if (error) throw error;
      return data as unknown as AdminStats;
    },
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Profile[];
    },
  });
}

export function useAllWithdrawals() {
  return useQuery({
    queryKey: ["all-withdrawals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Withdrawal[];
    },
  });
}

export function useToggleBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; blocked: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_blocked: input.blocked })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["all-users"] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useReviewWithdrawal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; approve: boolean }) => {
      const { error } = await supabase.rpc("review_withdrawal", {
        _id: input.id,
        _approve: input.approve,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["all-withdrawals"] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export type TaskInput = {
  title: string;
  description: string;
  kind: string;
  reward: number;
  link: string | null;
  duration_seconds: number;
  daily_limit: number;
  is_active: boolean;
};

export function useSaveTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TaskInput & { id?: string }) => {
      const { id, ...values } = input;
      if (id) {
        const { error } = await supabase.from("tasks").update(values).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tasks").insert(values);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["tasks"] });
      void qc.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
