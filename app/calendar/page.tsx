import { getPeriods } from "@/lib/supabase";
import { getPhasesForMonth } from "@/lib/cycle";
import { CalendarGrid } from "@/components/CalendarGrid";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  let periods: Awaited<ReturnType<typeof getPeriods>> = [];
  try {
    periods = await getPeriods(null);
  } catch {
    periods = [];
  }

  const now = new Date();
  const yearMonth =
    now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
  const phases = getPhasesForMonth(yearMonth, periods);

  const title = now.toLocaleDateString("zh-TW", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">日曆</h1>
        <p className="text-sm text-gray-500 mt-1">{title}</p>
      </div>

      <CalendarGrid yearMonth={yearMonth} phases={phases} />

      <div className="rounded-xl bg-white/60 p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-700 mb-2">圖例</p>
        <ul className="space-y-1">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-pink-300 shrink-0" /> 月經期
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-sky-200 shrink-0" /> 濾泡期
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-violet-300 shrink-0" /> 易孕期
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-purple-400 shrink-0" /> 排卵日
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-amber-200 shrink-0" /> 黃體期
          </li>
        </ul>
      </div>
    </div>
  );
}
