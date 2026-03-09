"use client";

import type { PeriodRecord } from "@/lib/types";
import { TrendingUp } from "lucide-react";

const DEFAULT_CYCLE = 28;
const MIN_BAR = 21;
const MAX_BAR = 45;

function getCycleLengths(records: PeriodRecord[]): { label: string; length: number }[] {
  if (records.length < 2) return [];
  const sorted = [...records].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
  const out: { label: string; length: number }[] = [];
  for (let i = 0; i < sorted.length - 1 && out.length < 6; i++) {
    const a = new Date(sorted[i].start_date);
    const b = new Date(sorted[i + 1].start_date);
    const days = Math.round((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000));
    if (days >= MIN_BAR && days <= MAX_BAR) {
      out.push({
        label: `${sorted[i + 1].start_date.slice(0, 7)}`,
        length: days,
      });
    }
  }
  return out.reverse();
}

export function CycleTrendChart({ records }: { records: PeriodRecord[] }) {
  const data = getCycleLengths(records);
  if (data.length === 0) return null;

  const maxLen = Math.max(...data.map((d) => d.length), MAX_BAR);
  const scale = (n: number) => (n - MIN_BAR) / (maxLen - MIN_BAR + 2);

  return (
    <section className="rounded-2xl bg-morandi-card border border-morandi-border p-4 shadow-card">
      <h2 className="flex items-center gap-2 text-morandi-dark font-medium mb-4">
        <TrendingUp className="w-4 h-4 text-morandi-pink" strokeWidth={1.8} />
        週期趨勢
      </h2>
      <div className="space-y-3">
        {data.map(({ label, length }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-xs text-morandi-gray w-14 shrink-0">{label}</span>
            <div className="flex-1 h-6 rounded-lg bg-morandi-border/60 overflow-hidden">
              <div
                className="h-full rounded-lg bg-morandi-pink/70 transition-all duration-300"
                style={{ width: `${Math.max(10, scale(length) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-medium text-morandi-dark w-8">{length} 天</span>
          </div>
        ))}
      </div>
    </section>
  );
}
