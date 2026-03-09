import type { CycleStats } from "@/lib/types";
import { CalendarClock } from "lucide-react";

interface StatusDashboardProps {
  stats: CycleStats;
}

export function StatusDashboard({ stats }: StatusDashboardProps) {
  const { daysUntilNext, currentDayOfCycle, predictedNextStart, averageCycleLength } = stats;

  return (
    <div className="rounded-2xl bg-morandi-card border border-morandi-border p-5 shadow-card hover:shadow-cardHover transition-shadow">
      <div className="flex items-center gap-2 text-morandi-gray text-sm mb-3">
        <CalendarClock className="w-4 h-4" strokeWidth={1.8} />
        状态看板
      </div>
      <div className="space-y-2">
        {daysUntilNext !== null && predictedNextStart && (
          <p className="text-morandi-dark text-lg font-medium">
            距离下次预计经期 <span className="text-morandi-pink font-semibold">{daysUntilNext}</span> 天
          </p>
        )}
        {currentDayOfCycle !== null && (
          <p className="text-morandi-gray text-sm">
            当前周期第 <span className="text-morandi-dark font-medium">{currentDayOfCycle}</span> 天
          </p>
        )}
        {daysUntilNext === null && currentDayOfCycle === null && (
          <p className="text-morandi-gray text-sm">记录经期后将显示预测与状态</p>
        )}
        {predictedNextStart && (
          <p className="text-morandi-gray text-xs mt-1">
            预测下次：{predictedNextStart} · 平均周期 {averageCycleLength} 天
          </p>
        )}
      </div>
    </div>
  );
}
