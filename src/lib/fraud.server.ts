import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

function createRunIdFetch() {
  let runId: string | undefined;
  return {
    getRunId: () => runId,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      const response = await fetch(input, { ...init, headers });
      runId ??= response.headers.get(RUN_ID_HEADER)?.trim() || undefined;
      return response;
    },
  };
}

const reviewSchema = z.object({
  risk_level: z.enum(["normal", "suspicious", "high"]),
  risk_score: z.number(),
  summary: z.string(),
  recommended_action: z.string(),
  patterns: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }),
  ),
});

export type FraudReview = z.infer<typeof reviewSchema>;

const SYSTEM_PROMPT = `You are a fraud analyst for a mobile micro-task earning app in Bangladesh.
Users earn small Taka rewards by completing short tasks (watch ad, visit website, daily spin) and then
withdraw via bKash or Nagad with a 100 Taka minimum.

You receive task completion and withdrawal activity and must decide whether the earning pattern looks
suspicious. Look for: bot-like or near-identical intervals between claims, claims faster than the task
timer, bursts of claims in a few seconds or minutes, activity clustered at unusual hours, many claims of
the same task beyond a sane daily limit, referral-farming shapes, withdrawals that immediately drain a
freshly earned balance, repeated withdrawals to the same account number across users, and mismatches
between total earned and total withdrawn.

Rules:
- risk_score is an integer from 0 to 100. normal = 0-39, suspicious = 40-74, high = 75-100.
- List at most 5 patterns, most important first. If nothing is suspicious, return an empty list.
- Each detail is one or two plain sentences quoting the concrete numbers or timestamps that justify it.
- summary is at most 350 characters, plain language an admin can read quickly.
- recommended_action is one short sentence, e.g. keep monitoring, hold withdrawals, or block the account.
- Never invent activity that is not in the data. If the data is too thin to judge, say so and keep the score low.`;

function clamp(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalize(review: FraudReview): FraudReview {
  return {
    risk_level: review.risk_level,
    risk_score: clamp(review.risk_score),
    summary: review.summary.slice(0, 600),
    recommended_action: review.recommended_action.slice(0, 300),
    patterns: review.patterns.slice(0, 5).map((pattern) => ({
      title: pattern.title.slice(0, 120),
      detail: pattern.detail.slice(0, 500),
      severity: pattern.severity,
    })),
  };
}

export async function analyzeEarningActivity(activity: string): Promise<FraudReview> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI review is not configured yet.");

  const runIdFetch = createRunIdFetch();
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    system: SYSTEM_PROMPT,
    prompt: `Review this activity and report suspicious earning patterns.\n\n${activity}`,
    experimental_output: Output.object({ schema: reviewSchema }),
    providerOptions: {
      openai: {
        store: false,
        forceReasoning: true,
        reasoningEffort: "medium",
        reasoningSummary: "auto",
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  try {
    const output = (await result.experimental_output) as FraudReview;
    return normalize(output);
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      try {
        const parsed = reviewSchema.parse(JSON.parse(error.text));
        return normalize(parsed);
      } catch {
        throw new Error("The AI review came back unreadable. Please try again.");
      }
    }
    throw error;
  }
}
