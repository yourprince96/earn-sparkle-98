import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  userId: z.string().uuid().nullable().default(null),
  activity: z.string().max(20000).nullable().default(null),
  label: z.string().max(200).nullable().default(null),
});

function line(values: (string | number)[]) {
  return values.join(" | ");
}

export const reviewEarningActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId: adminId } = context;

    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: adminId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Only admins can run a fraud review.");

    let activityText = (data.activity ?? "").trim();
    let label = (data.label ?? "").trim();
    let source = data.userId ? "user_activity" : "manual";

    if (data.userId) {
      const [profileRes, completionsRes, withdrawalsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("email,full_name,balance,total_withdrawn,referral_earning,is_blocked,created_at")
          .eq("id", data.userId)
          .maybeSingle(),
        supabase
          .from("task_completions")
          .select("title,reward,created_at")
          .eq("user_id", data.userId)
          .order("created_at", { ascending: false })
          .limit(120),
        supabase
          .from("withdrawals")
          .select("method,account_number,amount,status,created_at")
          .eq("user_id", data.userId)
          .order("created_at", { ascending: false })
          .limit(60),
      ]);

      if (profileRes.error) throw new Error(profileRes.error.message);
      if (!profileRes.data) throw new Error("User not found.");
      if (completionsRes.error) throw new Error(completionsRes.error.message);
      if (withdrawalsRes.error) throw new Error(withdrawalsRes.error.message);

      const profile = profileRes.data;
      label = label || profile.full_name || profile.email;

      const parts = [
        `ACCOUNT`,
        line([
          `email: ${profile.email}`,
          `name: ${profile.full_name || "-"}`,
          `joined: ${profile.created_at}`,
          `balance: ${profile.balance}`,
          `total_withdrawn: ${profile.total_withdrawn}`,
          `referral_earning: ${profile.referral_earning}`,
          `blocked: ${profile.is_blocked}`,
        ]),
        ``,
        `TASK COMPLETIONS (newest first, ${completionsRes.data?.length ?? 0} rows)`,
        `time | task | reward`,
        ...(completionsRes.data ?? []).map((row) =>
          line([row.created_at, row.title, row.reward]),
        ),
        ``,
        `WITHDRAWALS (newest first, ${withdrawalsRes.data?.length ?? 0} rows)`,
        `time | method | account | amount | status`,
        ...(withdrawalsRes.data ?? []).map((row) =>
          line([row.created_at, row.method, row.account_number, row.amount, row.status]),
        ),
      ];

      const gathered = parts.join("\n");
      activityText = activityText ? `${gathered}\n\nADMIN NOTES\n${activityText}` : gathered;
    }

    if (!activityText) throw new Error("Add some activity to review first.");
    if (!label) label = "Pasted activity";
    if (!data.userId && data.activity) source = "manual";

    const { analyzeEarningActivity } = await import("./fraud.server");
    const review = await analyzeEarningActivity(activityText);

    const { data: saved, error: saveError } = await supabase
      .from("fraud_reviews")
      .insert({
        reviewed_user_id: data.userId,
        reviewed_label: label,
        source,
        risk_level: review.risk_level,
        risk_score: review.risk_score,
        summary: review.summary,
        patterns: review.patterns,
        recommended_action: review.recommended_action,
        activity_input: activityText.slice(0, 20000),
        created_by: adminId,
      })
      .select("id")
      .single();

    if (saveError) throw new Error(saveError.message);

    return { id: saved.id, ...review };
  });
