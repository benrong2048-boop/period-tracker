"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { getTodayPhase } from "@/lib/cycle-engine";
import { FloatingCard } from "./FloatingCard";

const phaseGentle: Record<string, string> = {
  menstrual: "身体正在进入安静的节律",
  follicular: "身体能量在慢慢回升",
  ovulation: "身体处于活跃的节律",
  luteal: "身体正在为下一次周期做准备",
};

export function BodyStatusCard() {
  const periods = useStore((s) => s.periods);
  const phase = getTodayPhase(periods);

  return (
    <FloatingCard delay={0}>
      <div className="flex items-center gap-2 text-inkLight text-sm mb-2">
        <Heart className="w-4 h-4 text-blossom" strokeWidth={1.8} />
        今日身体状态
      </div>
      <div className="space-y-1">
        <p className="text-ink text-lg font-medium">
          {phase.phase === "menstrual" && phase.dayOfPeriod != null
            ? `经期 第${phase.dayOfPeriod}天`
            : phase.label}
        </p>
        <p className="text-inkLight text-sm">{phaseGentle[phase.phase] ?? ""}</p>
      </div>
    </FloatingCard>
  );
}
