export type CyclePhase =
  | "menstrual"
  | "follicular"
  | "fertile"
  | "ovulation"
  | "luteal"
  | "unknown";

export type MoodKey = "happy" | "sad" | "tired" | "angry" | null;

export interface PeriodRecord {
  id: string;
  user_id: string | null;
  start_date: string;
  end_date: string | null;
  cycle_length_days: number;
  mood?: MoodKey | string | null;
  symptom_intensity?: number | null;
  note?: string | null;
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
  isPredicted?: boolean;
}

export interface CycleStats {
  daysUntilNext: number | null;
  currentDayOfCycle: number | null;
  predictedNextStart: string | null;
  averageCycleLength: number;
}
