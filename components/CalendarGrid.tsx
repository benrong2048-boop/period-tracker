"use client";

import type { DayPhase } from "@/lib/types";

const phaseColor: Record<string, string> = {
  menstrual: "bg-morandi-pink/60",
  follicular: "bg-morandi-stone/20",
  fertile: "bg-morandi-pinkLight/60",
  ovulation: "bg-morandi-pink/50 ring-2 ring-morandi-pink/70",
  luteal: "bg-morandi-stone/25",
  unknown: "bg-morandi-border/50",
};

export function CalendarGrid({
  yearMonth,
  phases,
}: {
  yearMonth: string;
  phases: DayPhase[];
}) {
  const [y, m] = yearMonth.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const startPad = first.getDay();

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="rounded-2xl bg-morandi-card border border-morandi-border p-4 shadow-card">
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((d) => (
          <div key={d} className="py-1 text-xs font-medium text-morandi-gray">
            {d}
          </div>
        ))}
        {Array.from({ length: startPad }, (_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        {phases.map((day) => (
          <div
            key={day.date}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs ${
              day.isPredicted
                ? "border border-morandi-pink bg-morandi-pinkLight/40"
                : phaseColor[day.phase] ?? phaseColor.unknown
            }`}
            title={`${day.date} ${day.label}${day.isPredicted ? " (預測)" : ""}`}
          >
            <span className="font-medium text-morandi-dark">
              {new Date(day.date + "T12:00:00").getDate()}
            </span>
            {day.isOvulation && (
              <span className="text-[10px] text-morandi-dark/80">排卵</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
