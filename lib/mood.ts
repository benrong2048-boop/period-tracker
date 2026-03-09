export const MOOD_OPTIONS = [
  { key: "happy", emoji: "😊", label: "平和" },
  { key: "sad", emoji: "😔", label: "低落" },
  { key: "tired", emoji: "😫", label: "疲憊" },
  { key: "angry", emoji: "😡", label: "煩躁" },
] as const;

export type MoodOptionKey = (typeof MOOD_OPTIONS)[number]["key"];
