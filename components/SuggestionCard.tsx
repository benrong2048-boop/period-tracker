"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useStore } from "@/lib/store";
import { getTodayPhase } from "@/lib/cycle-engine";
import { buildSuggestion } from "@/lib/suggestions";
import { getRandomQuote } from "@/lib/philosophy";
import { FloatingCard } from "./FloatingCard";

interface WeatherData {
  temp: number | null;
  condition: string;
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function SuggestionCard() {
  const periods = useStore((s) => s.periods);
  const getMood = useStore((s) => s.getMood);
  const today = getTodayKey();
  const mood = getMood(today);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [quote, setQuote] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
          .then((r) => r.ok ? r.json() : null)
          .then((d) => d && setWeather({ temp: d.temp, condition: d.condition ?? "" }))
          .catch(() => setWeather({ temp: null, condition: "" }));
      },
      () => setWeather({ temp: null, condition: "" })
    );
  }, []);

  const phase = getTodayPhase(periods);
  const lines = buildSuggestion({
    phase: phase.phase,
    dayOfPeriod: phase.dayOfPeriod,
    mood: mood as "happy" | "calm" | "low" | "tired" | "irritable" | null,
    temp: weather?.temp ?? null,
    condition: weather?.condition ?? "",
  });

  useEffect(() => {
    const text = [...lines, `\n「${quote}」`].join("\n");
    if (text.length === 0) {
      setDisplayText("");
      setDone(true);
      return;
    }
    setDone(false);
    setDisplayText("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [lines.join(""), quote]);

  return (
    <FloatingCard delay={0.3}>
      <div className="flex items-center gap-2 text-inkLight text-sm mb-3">
        <Lightbulb className="w-4 h-4 text-blossom" strokeWidth={1.8} />
        智能建议
      </div>
      <p className="text-ink text-sm leading-relaxed whitespace-pre-wrap min-h-[80px]">
        {displayText || "正在生成..."}
        {!done && <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>|</motion.span>}
      </p>
    </FloatingCard>
  );
}
