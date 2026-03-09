"use client";

import type { DayPhase } from "@/lib/types";

const phaseColor: Record<string, string> = {
  menstrual: "bg-pink-300",
  follicular: "bg-sky-200",
  fertile: "bg-violet-300",
  ovulation: "bg-purple-400 ring-2 ring-purple-500",
  luteal: "bg-amber-200",
  unknown: "bg-gray-100",
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
  const daysInMonth = new Date(y, m, 0).getDate();
  const total = startPad + daysInMonth;
  const rows = Math.ceil(total / 7);

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="rounded-2xl bg-white/80 p-4 shadow-sm">
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekDays.map((d) => (
          <div key={d} className="py-1 text-xs font-medium text-gray-500">
            {d}
          </div>
        ))}
        {Array.from({ length: startPad }, (_, i) => (
          <div key={`pad-${i}`} className="aspect-square" />
        ))}
        {phases.map((day) => (
          <div
            key={day.date}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs ${phaseColor[day.phase] ?? phaseColor.unknown}`}
            title={`${day.date} ${day.label}`}
          >
            <span className="font-medium text-gray-800">
              {new Date(day.date + "T12:00:00").getDate()}
            </span>
            {day.isOvulation && (
              <span className="text-[10px] text-purple-700">排卵</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
