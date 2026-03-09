"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile } from "lucide-react";
import { useStore } from "@/lib/store";
import { FloatingCard } from "./FloatingCard";

const MOODS: { key: "happy" | "calm" | "low" | "tired" | "irritable"; emoji: string; label: string }[] = [
  { key: "happy", emoji: "😊", label: "开心" },
  { key: "calm", emoji: "😌", label: "平静" },
  { key: "low", emoji: "😔", label: "低落" },
  { key: "tired", emoji: "😫", label: "疲惫" },
  { key: "irritable", emoji: "😤", label: "烦躁" },
];

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function MoodCard() {
  const today = getTodayKey();
  const currentMood = useStore((s) => s.getMood(today));
  const setMood = useStore((s) => s.setMood);
  const [ripple, setRipple] = useState<{ x: number; y: number; color: string } | null>(null);

  const handleMoodClick = (key: "happy" | "calm" | "low" | "tired" | "irritable", e: React.MouseEvent<HTMLButtonElement>) => {
    setMood(today, key);
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.parentElement?.getBoundingClientRect();
    if (parent) {
      setRipple({
        x: rect.left - parent.left + rect.width / 2,
        y: rect.top - parent.top + rect.height / 2,
        color: key === "low" || key === "irritable" ? "rgba(255,182,193,0.5)" : "rgba(232,213,242,0.5)",
      });
      setTimeout(() => setRipple(null), 1200);
    }
  };

  return (
    <FloatingCard delay={0.2}>
      <div className="flex items-center gap-2 text-inkLight text-sm mb-3">
        <Smile className="w-4 h-4 text-blossom" strokeWidth={1.8} />
        心情记录
      </div>
      <div className="relative flex flex-wrap gap-2 overflow-hidden min-h-[60px]">
        {ripple && (
          <motion.div
            initial={{ width: 0, height: 0, opacity: 0.9 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x - 200,
              top: ripple.y - 200,
              background: `radial-gradient(circle, ${ripple.color} 0%, transparent 70%)`,
            }}
          />
        )}
        {MOODS.map(({ key, emoji, label }) => (
          <motion.button
            key={key}
            type="button"
            onClick={(e) => handleMoodClick(key, e)}
            whileTap={{ scale: 0.92 }}
            className={`
              w-12 h-12 rounded-2xl border-2 text-xl
              transition-colors tap-highlight-none
              ${currentMood === key
                ? "border-blossom bg-blossom/20"
                : "border-white/60 bg-white/40 hover:border-blossom/50"
              }
            `}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
      {currentMood && (
        <p className="text-inkLight text-xs mt-2">
          今日：{MOODS.find((m) => m.key === currentMood)?.label}
        </p>
      )}
    </FloatingCard>
  );
}
