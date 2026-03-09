"use client";

import { motion } from "framer-motion";
import { BodyStatusCard } from "@/components/BodyStatusCard";
import { CycleRingCard } from "@/components/CycleRingCard";
import { MoodCard } from "@/components/MoodCard";
import { SuggestionCard } from "@/components/SuggestionCard";
import { WeatherCard } from "@/components/WeatherCard";

export default function HomePage() {
  const todayStr = new Date().toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-screen pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-4 pt-6 px-4 max-w-lg mx-auto"
      >
        <div className="mb-6">
          <p className="text-inkLight text-sm">{todayStr}</p>
          <h1 className="text-xl font-semibold text-ink mt-0.5">身体节律</h1>
        </div>

        <div className="space-y-4">
          <BodyStatusCard />
          <CycleRingCard />
          <MoodCard />
          <SuggestionCard />
          <WeatherCard />
        </div>

        <p className="text-inkLight text-xs text-center pt-2">
          点击右下角气泡可打开情绪陪伴
        </p>

        <p className="text-inkLight/70 text-xs text-center pt-6">
          仅供参考，不取代医疗建议。点击右下角气泡可打开情绪陪伴。
        </p>
      </motion.div>
    </div>
  );
}
