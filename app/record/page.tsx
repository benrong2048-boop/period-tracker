"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RecordPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

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
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("done");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">記錄經期</h1>
        <p className="text-sm text-gray-500 mt-1">
          填寫這次月經的開始與結束日期，我們會幫你推算週期階段。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
            開始日期
          </label>
          <input
            id="start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-gray-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20"
          />
        </div>

        <div>
          <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
            結束日期（選填）
          </label>
          <input
            id="end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-gray-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20"
          />
        </div>

        <div>
          <label htmlFor="cycle" className="block text-sm font-medium text-gray-700 mb-1">
            週期天數（預設 28 天）
          </label>
          <input
            id="cycle"
            type="number"
            min={21}
            max={45}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value) || 28)}
            className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-gray-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-400/20"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-rose-400 py-3 text-white font-medium hover:bg-rose-500 disabled:opacity-50 tap-highlight-none"
        >
          {status === "sending" ? "儲存中…" : "儲存記錄"}
        </button>

        {status === "done" && (
          <p className="text-center text-sm text-rose-600">已儲存，可在「今日」與「日曆」查看。</p>
        )}
        {status === "error" && (
          <p className="text-center text-sm text-red-600">儲存失敗，請檢查網路或稍後再試。</p>
        )}
      </form>
    </div>
  );
}
