import type { PeriodRecord } from "./types";
import type { DayPhase, CyclePhase } from "./types";

const DEFAULT_CYCLE_LENGTH = 28;
const LUTEAL_DAYS_BEFORE_PERIOD = 14; // ovulation = 14 days before next period
const FERTILE_DAYS_BEFORE_OVULATION = 5;

function parseDate(s: string): Date {
  const d = new Date(s + "T12:00:00");
  if (isNaN(d.getTime())) throw new Error("Invalid date: " + s);
  return d;
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
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

/**
 * Get the next expected period start from a given period start and cycle length.
 */
export function getNextPeriodStart(
  periodStart: string,
  cycleLength: number = DEFAULT_CYCLE_LENGTH
): string {
  const start = parseDate(periodStart);
  return formatDate(addDays(start, cycleLength));
}

/**
 * Ovulation = 14 days before next period.
 */
export function getOvulationDate(periodStart: string, cycleLength: number = DEFAULT_CYCLE_LENGTH): string {
  const next = parseDate(getNextPeriodStart(periodStart, cycleLength));
  return formatDate(addDays(next, -LUTEAL_DAYS_BEFORE_PERIOD));
}

/**
 * Fertile window = ovulation - 5 days to ovulation day (inclusive).
 */
export function getFertileWindow(periodStart: string, cycleLength: number = DEFAULT_CYCLE_LENGTH): { start: string; end: string } {
  const ov = parseDate(getOvulationDate(periodStart, cycleLength));
  return {
    start: formatDate(addDays(ov, -FERTILE_DAYS_BEFORE_OVULATION)),
    end: formatDate(ov),
  };
}

/**
 * Luteal phase = ovulation day to next period (exclusive of next period start).
 */
export function getLutealRange(periodStart: string, cycleLength: number = DEFAULT_CYCLE_LENGTH): { start: string; end: string } {
  const ov = parseDate(getOvulationDate(periodStart, cycleLength));
  const nextStart = parseDate(getNextPeriodStart(periodStart, cycleLength));
  return {
    start: formatDate(ov),
    end: formatDate(addDays(nextStart, -1)),
  };
}

/**
 * Determine cycle phase for a single day from a list of periods (sorted by start_date desc).
 * Uses the most recent period that could "cover" this date (period start <= date).
 */
export function getPhaseForDate(dateStr: string, periods: PeriodRecord[]): DayPhase {
  const d = parseDate(dateStr);
  const unknown: DayPhase = {
    date: dateStr,
    phase: "unknown",
    label: "—",
    isPeriod: false,
    isOvulation: false,
    isFertile: false,
    isLuteal: false,
  };

  if (periods.length === 0) return unknown;

  // Find the period whose cycle contains this date: start_date <= date < start_date + cycle_length
  for (const p of periods) {
    const start = parseDate(p.start_date);
    const cycleLen = p.cycle_length_days ?? DEFAULT_CYCLE_LENGTH;
    const nextStart = addDays(start, cycleLen);
    if (d < start) continue;
    if (d >= nextStart) continue;

    const periodEnd = p.end_date ? parseDate(p.end_date) : addDays(start, 4);
    const ovulation = parseDate(getOvulationDate(p.start_date, cycleLen));
    const fertile = getFertileWindow(p.start_date, cycleLen);
    const fertileStart = parseDate(fertile.start);
    const fertileEnd = parseDate(fertile.end);
    const luteal = getLutealRange(p.start_date, cycleLen);
    const lutealStart = parseDate(luteal.start);
    const lutealEnd = parseDate(luteal.end);

    const isPeriod = d >= start && d <= periodEnd;
    const isOvulation = dateStr === formatDate(ovulation);
    const isFertile = d >= fertileStart && d <= fertileEnd;
    const isLuteal = d >= lutealStart && d <= lutealEnd;

    let phase: CyclePhase = "follicular";
    let label = "濾泡期";

    if (isPeriod) {
      phase = "menstrual";
      label = "月經期";
    } else if (isOvulation) {
      phase = "ovulation";
      label = "排卵日";
    } else if (isFertile) {
      phase = "fertile";
      label = "易孕期";
    } else if (isLuteal) {
      phase = "luteal";
      label = "黃體期";
    }

    return {
      date: dateStr,
      phase,
      label,
      isPeriod,
      isOvulation,
      isFertile,
      isLuteal,
    };
  }

  return unknown;
}

/**
 * Get phase for today using the latest period.
 */
export function getTodayPhase(periods: PeriodRecord[]): DayPhase {
  return getPhaseForDate(formatDate(new Date()), periods);
}

/**
 * Get phases for every day in a month (YYYY-MM).
 */
export function getPhasesForMonth(yearMonth: string, periods: PeriodRecord[]): DayPhase[] {
  const [y, m] = yearMonth.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  const out: DayPhase[] = [];
  const cur = new Date(first);
  while (cur <= last) {
    out.push(getPhaseForDate(formatDate(cur), periods));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}
