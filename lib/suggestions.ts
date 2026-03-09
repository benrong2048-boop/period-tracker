import type { PhaseType } from "./cycle-engine";
import type { MoodKey } from "./store";

export interface SuggestionInput {
  phase: PhaseType;
  dayOfPeriod: number | null;
  mood: MoodKey | null;
  temp: number | null;
  condition: string;
}

/** 根据周期、心情、天气生成温柔建议，避免说教 */
export function buildSuggestion(input: SuggestionInput): string[] {
  const { phase, dayOfPeriod, mood, temp, condition } = input;
  const lines: string[] = [];

  if (phase === "menstrual") {
    lines.push("今天身体的节律正在放缓。");
    if (dayOfPeriod != null && dayOfPeriod <= 2) {
      lines.push("或许可以尝试喝一杯温热的饮品，让身体更舒服一些。");
    }
  } else if (phase === "luteal") {
    lines.push("黄体期身体能量通常会下降。");
    lines.push("也许今天适合慢一点，不必勉强。");
  } else if (phase === "ovulation") {
    lines.push("当前处于易孕或排卵期，体力尚可。");
    lines.push("如果感觉良好，或许可以适度活动。");
  } else {
    lines.push("身体正在平稳运行。");
  }

  const cond = condition.toLowerCase();
  if (cond.includes("rain") || cond.includes("雨")) {
    lines.push("如果外面在下雨，或许可以把房间灯光调暗一点，享受片刻静谧。");
  } else if (cond.includes("sun") || cond.includes("晴")) {
    lines.push("若外出，可以做好防晒，让皮肤少一点负担。");
  }

  if (temp != null) {
    if (temp < 10) {
      lines.push("气温较低，或许可以穿上保暖的羊毛袜，照顾好自己。");
    } else if (temp > 30) {
      lines.push("注意防暑，多补充水分，尽量在阴凉处休息。");
    }
  }

  if (mood === "low" || mood === "tired" || mood === "irritable") {
    lines.push("如果感觉疲惫或低落，也许今天适合给自己一段不被打扰的时间。");
  }

  return lines;
}
