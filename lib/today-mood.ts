const STORAGE_KEY_PREFIX = "period-tracker-mood-";

export function getTodayMoodKey(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${STORAGE_KEY_PREFIX}${y}-${m}-${d}`;
}

export function getTodayMood(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(getTodayMoodKey());
  } catch {
    return null;
  }
}

export function setTodayMood(mood: string | null): void {
  if (typeof window === "undefined") return;
  try {
    const key = getTodayMoodKey();
    if (mood) {
      window.localStorage.setItem(key, mood);
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
}
