"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { getTodayPhase, getNextPeriodPrediction, getOvulationWindow } from "@/lib/cycle-engine";
import { FloatingCard } from "./FloatingCard";

const phaseColors = {
  menstrual: "#ffb7c5",
  follicular: "#e8d5f2",
  ovulation: "#ffc9b9",
  luteal: "#ffd6e0",
};

export function CycleRingCard() {
  const periods = useStore((s) => s.periods);
  const phase = getTodayPhase(periods);
  const nextPred = getNextPeriodPrediction(periods);
  const ovWindow = getOvulationWindow(periods);

  const circumference = 2 * Math.PI * 42;
  const segments = [
    { phase: "menstrual" as const, ratio: 5 / 28 },
    { phase: "follicular" as const, ratio: 9 / 28 },
    { phase: "ovulation" as const, ratio: 6 / 28 },
    { phase: "luteal" as const, ratio: 8 / 28 },
  ];

  let offset = 0;
  const circles = segments.map((seg, i) => {
    const dash = seg.ratio * circumference;
    const el = (
      <circle
        key={i}
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke={phaseColors[seg.phase]}
        strokeWidth="10"
        strokeDasharray={`${dash} ${circumference}`}
        strokeDashoffset={-offset}
        opacity={phase.phase === seg.phase ? 1 : 0.35}
      />
    );
    offset += dash;
    return el;
  });

  return (
    <FloatingCard delay={0.1}>
      <div className="text-inkLight text-sm mb-3">身体节律地图</div>
      <div className="flex gap-6 items-center">
        <div className="relative w-28 h-28 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {circles}
          </svg>
        </div>
        <div className="flex-1 space-y-2 text-sm">
          {nextPred && (
            <p className="text-ink">
              下次经期预测：<span className="font-medium">{nextPred.date}</span>
              <span className="text-inkLight ml-1">（可信度 {nextPred.confidence}%）</span>
            </p>
          )}
          {ovWindow && (
            <p className="text-ink">
              排卵概率最高：{ovWindow.start} — {ovWindow.end}
            </p>
          )}
          {periods.length < 2 && (
            <p className="text-inkLight">记录更多经期以提升预测准确度</p>
          )}
        </div>
      </div>
    </FloatingCard>
  );
}
