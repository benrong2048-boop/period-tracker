import { getPeriods } from "@/lib/supabase";
import {
  getPhasesForMonth,
  getPredictedPeriodDatesInMonth,
} from "@/lib/cycle";
import { CalendarGrid } from "@/components/CalendarGrid";
import { Calendar as CalendarIcon } from "lucide-react";

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
  const predictedDates = getPredictedPeriodDatesInMonth(yearMonth, periods);
  const phases = getPhasesForMonth(yearMonth, periods, predictedDates);

  const title = now.toLocaleDateString("zh-TW", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-morandi-pink" strokeWidth={1.8} />
        <div>
          <h1 className="text-xl font-semibold text-morandi-dark">日曆</h1>
          <p className="text-sm text-morandi-gray">{title}</p>
        </div>
      </div>

      <CalendarGrid yearMonth={yearMonth} phases={phases} />

      <div className="rounded-2xl bg-morandi-card border border-morandi-border p-4 text-sm text-morandi-gray">
        <p className="font-medium text-morandi-dark mb-2">圖例</p>
        <ul className="space-y-1.5">
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-morandi-pink/60 shrink-0" /> 月經期
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded border border-morandi-pink bg-morandi-pinkLight/50 shrink-0" /> 預測經期
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-morandi-stone/30 shrink-0" /> 濾泡期
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-morandi-pinkLight/70 shrink-0" /> 易孕期
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-morandi-pink/50 shrink-0 ring-1 ring-morandi-pink" /> 排卵日
          </li>
          <li className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-morandi-stone/25 shrink-0" /> 黃體期
          </li>
        </ul>
      </div>
    </div>
  );
}
