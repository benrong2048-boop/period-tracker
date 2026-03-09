"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getPhaseForDate, getNextPeriodPrediction, getOvulationWindow } from "@/lib/cycle-engine";
import { FloatingCard } from "@/components/FloatingCard";

const phaseColors: Record<string, string> = {
  menstrual: "bg-blossom/60",
  follicular: "bg-lavender/50",
  ovulation: "bg-coral/60",
  luteal: "bg-soft/60",
};

export default function CalendarPage() {
  const periods = useStore((s) => s.periods);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();

  const nextPred = getNextPeriodPrediction(periods);
  const ovWindow = getOvulationWindow(periods);

  const dates: { date: string; phase: string }[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    const dateStr = d.toISOString().slice(0, 10);
    const phase = getPhaseForDate(dateStr, periods);
    dates.push({ date: dateStr, phase: phase.phase });
  }

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">身体节律日历</h1>
        <p className="text-inkLight text-sm mt-0.5">
          {year}年{month + 1}月
        </p>
      </div>

      {nextPred && (
        <FloatingCard>
          <p className="text-ink text-sm">
            下次经期预测：<span className="font-medium">{nextPred.date}</span>
            <span className="text-inkLight ml-1">（可信度 {nextPred.confidence}%）</span>
          </p>
          {ovWindow && (
            <p className="text-ink text-sm mt-1">
              排卵概率最高：{ovWindow.start} — {ovWindow.end}
            </p>
          )}
        </FloatingCard>
      )}

      <FloatingCard>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((d) => (
            <div key={d} className="py-1 text-xs font-medium text-inkLight">
              {d}
            </div>
          ))}
          {Array.from({ length: startPad }, (_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          {dates.map(({ date, phase }) => (
            <div
              key={date}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm ${phaseColors[phase] ?? "bg-white/30"}`}
            >
              {new Date(date + "T12:00:00").getDate()}
            </div>
          ))}
        </div>
      </FloatingCard>

      <div className="rounded-2xl bg-white/40 p-4 text-sm text-inkLight">
        <p className="font-medium text-ink mb-2">图例</p>
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blossom/60" />经期</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-lavender/50" />卵泡期</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-coral/60" />排卵/易孕</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-soft/60" />黄体期</span>
        </div>
      </div>
    </div>
  );
}
