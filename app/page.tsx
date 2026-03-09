import { getPeriods } from "@/lib/supabase";
import { getTodayPhase, getCycleStats } from "@/lib/cycle";
import { getDailyTips } from "@/lib/health-tips";
import { PhaseBadge } from "@/components/PhaseBadge";
import { StatusDashboard } from "@/components/StatusDashboard";
import { Lightbulb } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let periods: Awaited<ReturnType<typeof getPeriods>> = [];
  try {
    periods = await getPeriods(null);
  } catch {
    periods = [];
  }

  const today = getTodayPhase(periods);
  const stats = getCycleStats(periods);
  const tips = getDailyTips(today.phase);

  const todayStr = new Date().toLocaleDateString("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-morandi-gray">{todayStr}</p>
        <h1 className="text-xl font-semibold text-morandi-dark mt-0.5">今日階段</h1>
      </div>

      <StatusDashboard stats={stats} />

      <div className="flex flex-wrap gap-2">
        <PhaseBadge phase={today.phase} label={today.label} />
      </div>

      <section className="rounded-2xl bg-morandi-card border border-morandi-border p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-morandi-dark font-medium mb-3">
          <Lightbulb className="w-4 h-4 text-morandi-pink" strokeWidth={1.8} />
          今日小提醒
        </h2>
        <ul className="space-y-2.5">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-sm text-morandi-gray leading-relaxed">
              <span className="text-morandi-pink shrink-0">
                {tip.type === "diet" ? "飲食" : tip.type === "rest" ? "休息" : "情緒"}
              </span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-morandi-gray/80 text-center">
        僅供參考，不取代醫療建議。
      </p>
    </div>
  );
}
