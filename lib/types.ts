export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "fertile"
  | "ovulation"
  | "luteal"
  | "unknown";

export interface PeriodRecord {
  id: string;
  user_id: string | null;
  start_date: string; // YYYY-MM-DD
  end_date: string | null;
  cycle_length_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface DayPhase {
  date: string;
  phase: CyclePhase;
  label: string;
  isPeriod: boolean;
  isOvulation: boolean;
  isFertile: boolean;
  isLuteal: boolean;
}
