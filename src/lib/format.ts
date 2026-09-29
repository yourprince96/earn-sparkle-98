export function taka(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  return `৳${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

export function shortDate(value: string): string {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const TASK_LOOK: Record<string, { icon: string; tint: string; label: string }> = {
  watch_ad: { icon: "▶", tint: "bg-rose/15 text-rose", label: "Watch Ad" },
  visit_website: { icon: "◈", tint: "bg-violet/15 text-violet", label: "Visit Website" },
  daily_spin: { icon: "✦", tint: "bg-amber/25 text-amber-deep", label: "Daily Spin" },
};

export function taskLook(kind: string) {
  return TASK_LOOK[kind] ?? { icon: "★", tint: "bg-mint/15 text-mint-deep", label: "Task" };
}
