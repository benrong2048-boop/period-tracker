import type { CyclePhase } from "./types";

export interface WeatherInput {
  temp: number | null;
  condition: string;
  conditionText: string;
  city: string | null;
}

export interface RecommendationInput {
  weather: WeatherInput;
  phase: CyclePhase;
  phaseLabel: string;
  dayOfPeriod: number | null;
  mood: string | null;
}

/**
 * 根据天气、周期阶段、经期第几天、心情生成一段温和且专业的「今日专属贴士」。
 * 原则：避免说教（用「或许可以尝试」）；加入身体现象学关怀（光线、声音、触感等）。
 */
export function getDailyRecommendation(input: RecommendationInput): string {
  const { weather, phase, phaseLabel, dayOfPeriod, mood } = input;
  const parts: string[] = [];

  // 开场：今天 + 城市 + 气温 + 天气
  const city = weather.city ? `${weather.city}` : "您所在的城市";
  const tempStr =
    weather.temp != null ? `${weather.temp}°C` : "气温未知";
  parts.push(`今天${city}${weather.city ? "" : " "}${tempStr}，${weather.conditionText}。`);

  // 周期阶段与经期第几天
  if (phase === "menstrual" && dayOfPeriod != null) {
    parts.push(`您正处于经期第 ${dayOfPeriod} 天。`);
  } else if (phase !== "unknown") {
    parts.push(`当前处于${phaseLabel}。`);
  }

  // 心情（若存在）
  if (mood) {
    const moodText =
      mood === "sad"
        ? "心情似乎有些低落"
        : mood === "tired"
          ? "身体可能有些疲惫"
          : mood === "angry"
            ? "情绪有些紧绷"
            : null;
    if (moodText) parts.push(moodText + "。");
  }

  // 建议句：天气 + 身体 + 感官，语气温和
  const suggestions: string[] = [];

  // 气温
  if (weather.temp != null) {
    if (weather.temp < 10) {
      suggestions.push("或许可以尝试穿上保暖的羊毛袜，喝一杯热姜茶");
    } else if (weather.temp > 30) {
      suggestions.push("注意防暑，多补充水分，尽量在阴凉处休息");
    }
  }

  // 天气现象 + 身体现象学
  const cond = weather.condition;
  if (cond.includes("rain") || cond.includes("雨")) {
    suggestions.push(
      "窗外有雨时，身体有时会对光线和声音更敏感，或许可以调暗室内灯光，享受片刻静谧"
    );
  } else if (
    cond.includes("sun") ||
    cond.includes("晴") ||
    cond.includes("clear")
  ) {
    suggestions.push("若外出，可以做好防晒，让皮肤少一点负担");
  }

  // 经期关怀
  if (phase === "menstrual") {
    if (!suggestions.some((s) => s.includes("热") || s.includes("姜"))) {
      suggestions.push("喝一点温热饮品，让身体暖一些");
    }
    suggestions.push("对自己温柔一点，不必勉强");
  }

  // 排卵期
  if (phase === "ovulation" || phase === "fertile") {
    suggestions.push("体力尚可时，可以适度活动，但不必强求");
  }

  // 黄体期
  if (phase === "luteal") {
    suggestions.push("黄体期容易感到疲惫，早一点休息会舒服很多");
  }

  // 心情关怀（与天气、身体结合）
  if (mood === "sad" || mood === "tired" || mood === "angry") {
    suggestions.push("听一些舒缓的音乐，或给自己一段不被打扰的时间");
  }

  // 去重并限制条数，拼接成一句
  const unique = Array.from(new Set(suggestions)).slice(0, 4);
  if (unique.length > 0) {
    parts.push(`建议：${unique.join("；")}。`);
  }

  return parts.join(" ");
}
