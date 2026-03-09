const DEFAULT_CYCLE = 28;
const DEFAULT_PERIOD = 5;
const LUTEAL_DAYS = 14;

function parseDate(s: string): Date {
  return new Date(s + "T12:00:00");
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}

export interface PeriodRecord {
  start_date: string;
  end_date: string | null;
  cycle_length_days: number;
  period_length_days: number;
}

export function getAverageCycleLength(periods: PeriodRecord[]): number {
  if (periods.length < 2) return DEFAULT_CYCLE;
  const sorted = [...periods].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
  let sum = 0,
    count = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    const diff = daysBetween(
      parseDate(sorted[i + 1].start_date),
      parseDate(sorted[i].start_date)
    );
    if (diff >= 21 && diff <= 45) {
      sum += diff;
      count++;
      if (count >= 5) break;
    }
  }
  return count ? Math.round(sum / count) : DEFAULT_CYCLE;
}

export function getAveragePeriodLength(periods: PeriodRecord[]): number {
  if (periods.length === 0) return DEFAULT_PERIOD;
  let sum = 0,
    count = 0;
  for (const p of periods) {
    const start = parseDate(p.start_date);
    const end = p.end_date ? parseDate(p.end_date) : addDays(start, 4);
    const len = daysBetween(start, end) + 1;
    if (len >= 2 && len <= 10) {
      sum += len;
      count++;
    }
  }
  return count ? Math.round(sum / count) : DEFAULT_PERIOD;
}

/** 预测可信度：基于历史记录数量 */
export function getPredictionConfidence(periods: PeriodRecord[]): number {
  if (periods.length < 2) return 40;
  if (periods.length < 4) return 55;
  if (periods.length < 6) return 70;
  return Math.min(95, 70 + periods.length * 3);
}

/** 下次经期预测 */
export function getNextPeriodPrediction(
  periods: PeriodRecord[]
): { date: string; confidence: number } | null {
  if (periods.length === 0) return null;
  const sorted = [...periods].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
  const last = sorted[0];
  const avg = getAverageCycleLength(periods);
  const next = addDays(parseDate(last.start_date), avg);
  return {
    date: formatDate(next),
    confidence: getPredictionConfidence(periods),
  };
}

/** 排卵概率最高区间（含前后 1 天） */
export function getOvulationWindow(
  periods: PeriodRecord[]
): { start: string; end: string; confidence: number } | null {
  const pred = getNextPeriodPrediction(periods);
  if (!pred) return null;
  const nextStart = parseDate(pred.date);
  const ovDay = addDays(nextStart, -LUTEAL_DAYS);
  const start = addDays(ovDay, -1);
  const end = addDays(ovDay, 1);
  return {
    start: formatDate(start),
    end: formatDate(end),
    confidence: pred.confidence,
  };
}

export type PhaseType = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface DayPhase {
  date: string;
  phase: PhaseType;
  label: string;
  dayOfPeriod: number | null;
}

export function getPhaseForDate(
  dateStr: string,
  periods: PeriodRecord[]
): DayPhase {
  const d = parseDate(dateStr);
  const unknown: DayPhase = {
    date: dateStr,
    phase: "follicular",
    label: "—",
    dayOfPeriod: null,
  };

  if (periods.length === 0) return unknown;

  for (const p of periods) {
    const start = parseDate(p.start_date);
    const cycleLen = p.cycle_length_days ?? DEFAULT_CYCLE;
    const periodLen = p.period_length_days ?? DEFAULT_PERIOD;
    const end = p.end_date ? parseDate(p.end_date) : addDays(start, periodLen - 1);
    const nextStart = addDays(start, cycleLen);

    if (d < start) continue;
    if (d >= nextStart) continue;

    if (d >= start && d <= end) {
      const day = daysBetween(start, d) + 1;
      return {
        date: dateStr,
        phase: "menstrual",
        label: "经期",
        dayOfPeriod: day,
      };
    }

    const ovDay = addDays(nextStart, -LUTEAL_DAYS);
    if (formatDate(d) === formatDate(ovDay)) {
      return { date: dateStr, phase: "ovulation", label: "排卵期", dayOfPeriod: null };
    }

    const fertStart = addDays(ovDay, -5);
    const fertEnd = ovDay;
    if (d >= fertStart && d <= fertEnd) {
      return { date: dateStr, phase: "ovulation", label: "易孕期", dayOfPeriod: null };
    }

    if (d > fertEnd && d < nextStart) {
      return { date: dateStr, phase: "luteal", label: "黄体期", dayOfPeriod: null };
    }

    return { date: dateStr, phase: "follicular", label: "卵泡期", dayOfPeriod: null };
  }

  return unknown;
}

export function getTodayPhase(periods: PeriodRecord[]): DayPhase {
  return getPhaseForDate(formatDate(new Date()), periods);
}
