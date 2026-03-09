import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CyclePhase = "menstrual" | "follicular" | "ovulation" | "luteal";
export type MoodKey = "happy" | "calm" | "low" | "tired" | "irritable";

export interface PeriodRecord {
  id: string;
  start_date: string;
  end_date: string | null;
  cycle_length_days: number;
  period_length_days: number;
  created_at: string;
}

export interface MoodRecord {
  date: string;
  mood: MoodKey;
}

interface AppState {
  periods: PeriodRecord[];
  moods: MoodRecord[];
  addPeriod: (p: Omit<PeriodRecord, "id" | "created_at">) => void;
  setMood: (date: string, mood: MoodKey) => void;
  getMood: (date: string) => MoodKey | null;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      periods: [],
      moods: [],

      addPeriod: (p) =>
        set((state) => ({
          periods: [
            {
              ...p,
              id: crypto.randomUUID(),
              created_at: new Date().toISOString(),
            },
            ...state.periods,
          ].sort(
            (a, b) =>
              new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
          ),
        })),

      setMood: (date, mood) =>
        set((state) => {
          const rest = state.moods.filter((m) => m.date !== date);
          return { moods: [...rest, { date, mood }] };
        }),

      getMood: (date) => {
        const m = get().moods.find((x) => x.date === date);
        return m?.mood ?? null;
      },
    }),
    {
      name: "period-tracker-storage",
      partialize: (s) => ({ periods: s.periods, moods: s.moods }),
    }
  )
);
