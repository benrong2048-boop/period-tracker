"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Star, MessageSquare } from "lucide-react";
import { MOOD_OPTIONS } from "@/lib/mood";
import type { PeriodRecord } from "@/lib/types";
import { CycleTrendChart } from "@/components/CycleTrendChart";

export default function RecordPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [mood, setMood] = useState<string | null>(null);
  const [symptomIntensity, setSymptomIntensity] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [records, setRecords] = useState<PeriodRecord[]>([]);

  useEffect(() => {
    fetch("/api/periods")
      .then((res) => res.ok && res.json())
      .then((json) => setRecords(json?.data ?? []))
      .catch(() => setRecords([]));
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate || null,
          cycle_length_days: cycleLength,
          mood: mood || null,
          symptom_intensity: symptomIntensity,
          note: note.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("done");
      setNote("");
      setMood(null);
      setSymptomIntensity(null);
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-morandi-dark">記錄經期</h1>
        <p className="text-sm text-morandi-gray mt-0.5">填寫開始與結束日期，可選填情緒與症狀。</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl bg-morandi-card border border-morandi-border p-4 shadow-card space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-morandi-dark">
            <Calendar className="w-4 h-4 text-morandi-pink" strokeWidth={1.8} />
            日期
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-morandi-gray block mb-1">開始</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full rounded-xl border border-morandi-border bg-white px-3 py-2.5 text-morandi-dark text-sm focus:border-morandi-pink focus:outline-none focus:ring-1 focus:ring-morandi-pink/30"
              />
            </div>
            <div>
              <span className="text-xs text-morandi-gray block mb-1">結束（選填）</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full rounded-xl border border-morandi-border bg-white px-3 py-2.5 text-morandi-dark text-sm focus:border-morandi-pink focus:outline-none focus:ring-1 focus:ring-morandi-pink/30"
              />
            </div>
          </div>
          <div>
            <span className="text-xs text-morandi-gray block mb-1">週期天數（預設 28）</span>
            <input
              type="number"
              min={21}
              max={45}
              value={cycleLength}
              onChange={(e) => setCycleLength(Number(e.target.value) || 28)}
              className="w-full rounded-xl border border-morandi-border bg-white px-3 py-2.5 text-morandi-dark text-sm focus:border-morandi-pink focus:outline-none focus:ring-1 focus:ring-morandi-pink/30"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-morandi-card border border-morandi-border p-4 shadow-card">
          <span className="text-sm font-medium text-morandi-dark block mb-2">情緒</span>
          <div className="flex gap-3">
            {MOOD_OPTIONS.map(({ key, emoji }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMood(mood === key ? null : key)}
                className={`w-11 h-11 rounded-xl border text-lg transition-all tap-highlight-none ${
                  mood === key
                    ? "border-morandi-pink bg-morandi-pinkLight/50"
                    : "border-morandi-border bg-white hover:border-morandi-pink/50"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-morandi-card border border-morandi-border p-4 shadow-card">
          <label className="flex items-center gap-2 text-sm font-medium text-morandi-dark mb-2">
            <Star className="w-4 h-4 text-morandi-pink" strokeWidth={1.8} />
            症狀強度（1–5）
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setSymptomIntensity(symptomIntensity === n ? null : n)}
                className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all tap-highlight-none ${
                  symptomIntensity !== null && n <= symptomIntensity
                    ? "border-morandi-pink bg-morandi-pinkLight/50 text-morandi-dark"
                    : "border-morandi-border bg-white text-morandi-gray"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-morandi-card border border-morandi-border p-4 shadow-card">
          <label className="flex items-center gap-2 text-sm font-medium text-morandi-dark mb-2">
            <MessageSquare className="w-4 h-4 text-morandi-pink" strokeWidth={1.8} />
            筆記（選填）
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="簡短記錄..."
            rows={3}
            className="w-full rounded-xl border border-morandi-border bg-white px-3 py-2.5 text-morandi-dark text-sm placeholder:text-morandi-gray/70 focus:border-morandi-pink focus:outline-none focus:ring-1 focus:ring-morandi-pink/30 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-morandi-pink py-3 text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity tap-highlight-none"
        >
          {status === "sending" ? "儲存中…" : "儲存記錄"}
        </button>

        {status === "done" && (
          <p className="text-center text-sm text-morandi-gray">已儲存。</p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-red-600">儲存失敗，請稍後再試。</p>
        )}
      </form>

      {records.length > 0 && (
        <>
          <section>
            <h2 className="text-morandi-dark font-medium mb-3">歷史記錄</h2>
            <ul className="space-y-3">
              {records.map((r) => (
                <li
                  key={r.id}
                  className="rounded-2xl bg-morandi-card border border-morandi-border p-4 shadow-card hover:shadow-cardHover transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-morandi-dark">
                        {r.start_date}
                        {r.end_date ? ` — ${r.end_date}` : ""}
                      </p>
                      <p className="text-xs text-morandi-gray mt-0.5">
                        週期 {r.cycle_length_days} 天
                        {r.mood && ` · ${MOOD_OPTIONS.find((m) => m.key === r.mood)?.emoji ?? r.mood}`}
                        {r.symptom_intensity != null && ` · 症狀 ${r.symptom_intensity}/5`}
                      </p>
                      {r.note && (
                        <p className="text-sm text-morandi-gray mt-1.5 line-clamp-2">{r.note}</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <CycleTrendChart records={records} />
        </>
      )}
    </div>
  );
}
