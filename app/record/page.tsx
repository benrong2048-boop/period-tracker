"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { FloatingCard } from "@/components/FloatingCard";

function parseDate(s: string): Date {
  return new Date(s + "T12:00:00");
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}

export default function RecordPage() {
  const addPeriod = useStore((s) => s.addPeriod);
  const periods = useStore((s) => s.periods);
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  const periodLength = endDate
    ? daysBetween(parseDate(startDate), parseDate(endDate)) + 1
    : 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    try {
      addPeriod({
        start_date: startDate,
        end_date: endDate || null,
        cycle_length_days: Math.min(45, Math.max(21, cycleLength)),
        period_length_days: Math.min(10, Math.max(2, periodLength)),
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">记录经期</h1>
        <p className="text-inkLight text-sm mt-0.5">填写开始与结束日期，用于周期预测</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <FloatingCard>
          <label className="block text-ink text-sm font-medium mb-2">开始日期</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-4 py-3 text-ink focus:border-blossom/60 focus:outline-none"
          />
        </FloatingCard>

        <FloatingCard>
          <label className="block text-ink text-sm font-medium mb-2">结束日期（选填）</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-4 py-3 text-ink focus:border-blossom/60 focus:outline-none"
          />
        </FloatingCard>

        <FloatingCard>
          <label className="block text-ink text-sm font-medium mb-2">周期天数（默认 28）</label>
          <input
            type="number"
            min={21}
            max={45}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value) || 28)}
            className="w-full rounded-2xl border-2 border-white/60 bg-white/40 px-4 py-3 text-ink focus:border-blossom/60 focus:outline-none"
          />
        </FloatingCard>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-2xl bg-blossom/80 py-4 text-white font-medium shadow-float hover:bg-blossom transition-colors tap-highlight-none"
        >
          保存记录
        </motion.button>

        {status === "done" && (
          <p className="text-center text-sm text-inkLight">已保存</p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-red-500">保存失败</p>
        )}
      </motion.form>

      {periods.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-ink font-medium">历史记录</h2>
          {periods.slice(0, 10).map((p) => (
            <FloatingCard key={p.id}>
              <p className="text-ink">
                {p.start_date}
                {p.end_date ? ` — ${p.end_date}` : ""}
              </p>
              <p className="text-inkLight text-xs mt-1">周期 {p.cycle_length_days} 天</p>
            </FloatingCard>
          ))}
        </div>
      )}
    </div>
  );
}
