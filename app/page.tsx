import { getPeriods } from "@/lib/supabase";
import { getTodayPhase } from "@/lib/cycle";
import { getDailyTips } from "@/lib/health-tips";
import { PhaseBadge } from "@/components/PhaseBadge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let periods: Awaited<ReturnType<typeof getPeriods>> = [];
  try {
    periods = await getPeriods(null);
  } catch {
    periods = [];
  }

  const today = getTodayPhase(periods);
  const tips = getDailyTips(today.phase);

  const todayStr = new Date().toLocaleDateString("zh-TW", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-500">{todayStr}</p>
        <h1 className="text-2xl font-semibold text-gray-800 mt-1">
          今天的身體階段
        </h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <PhaseBadge phase={today.phase} label={today.label} />
      </div>

      <section className="rounded-2xl bg-white/80 p-5 shadow-sm space-y-4">
        <h2 className="text-lg font-medium text-gray-800">今日小提醒</h2>
        <p className="text-xs text-rose-600/80">
          💡 每天來這裡看看，會依你的週期階段給一點飲食、休息與情緒小建議。
        </p>
        <ul className="space-y-3">
          {tips.map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-rose-400 shrink-0">
                {tip.type === "diet" ? "🍵" : tip.type === "rest" ? "🌙" : "💭"}
              </span>
              <span className="text-gray-700 text-sm leading-relaxed">
                {tip.text}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-400 text-center">
        僅供參考，不取代醫療建議。若有疑問請諮詢醫師。
      </p>
    </div>
  );
}
