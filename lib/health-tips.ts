import type { CyclePhase } from "./types";

export interface HealthTip {
  type: "diet" | "rest" | "mood";
  text: string;
}

const tipsByPhase: Record<CyclePhase, HealthTip[]> = {
  menstrual: [
    { type: "diet", text: "多喝溫水，可以適量吃一點含鐵食物，例如深色蔬菜或紅棗。" },
    { type: "rest", text: "這幾天身體在休息，少一點劇烈運動，多睡半小時也很好。" },
    { type: "mood", text: "如果容易累或情緒起伏，都是正常的，對自己溫柔一點。" },
  ],
  follicular: [
    { type: "diet", text: "均衡飲食就好，可以多吃一點新鮮蔬菜與蛋白質。" },
    { type: "rest", text: "體力通常不錯，適合輕度到中度的運動與戶外活動。" },
    { type: "mood", text: "能量回升的階段，很適合做一點自己喜歡的小事。" },
  ],
  fertile: [
    { type: "diet", text: "保持正常飲食與水分，避免過多咖啡因或酒精。" },
    { type: "rest", text: "作息盡量規律，睡飽有助於身體平衡。" },
    { type: "mood", text: "這段時間可能比較有精神，可以安排需要專注的事。" },
  ],
  ovulation: [
    { type: "diet", text: "今天記得喝足夠的水，吃一頓讓自己舒服的飯。" },
    { type: "rest", text: "若體力好可以動一動，但不必勉強，聆聽身體就好。" },
    { type: "mood", text: "排卵日附近情緒可能較敏感，多一點自我接納。" },
  ],
  luteal: [
    { type: "diet", text: "可以適量吃一點複合碳水，有助穩定情緒與睡眠。" },
    { type: "rest", text: "黃體期容易累，早一點睡、少熬夜會舒服很多。" },
    { type: "mood", text: "若感到焦慮或低落，都是常見的，給自己一點空間休息。" },
  ],
  unknown: [
    { type: "diet", text: "今天也記得好好吃飯、多喝一點水。" },
    { type: "rest", text: "累了就休息，不需要硬撐。" },
    { type: "mood", text: "照顧好自己，從一件小事開始就好。" },
  ],
};

/**
 * Get one tip per category (diet, rest, mood) for the given phase.
 */
export function getDailyTips(phase: CyclePhase): HealthTip[] {
  return tipsByPhase[phase] ?? tipsByPhase.unknown;
}
