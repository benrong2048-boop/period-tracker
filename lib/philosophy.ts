/** 哲学语录，每条不超过 20 字。参考 Spinoza, Merleau-Ponty, Beauvoir 等 */
export const PHILOSOPHY_QUOTES = [
  "身体比思想更早知道答案。",
  "感受先于理解。",
  "身体是我们在世的媒介。",
  "倾听身体的节奏。",
  "存在先于本质。",
  "身体自有其智慧。",
  "温柔地对待自己。",
  "时间在身体里流淌。",
  "接纳此刻的状态。",
  "身体会记得。",
  "慢下来，感受呼吸。",
  "你不需要完美。",
  "身体与心灵同在。",
  "允许自己休息。",
  "此刻即是全部。",
];

export function getRandomQuote(): string {
  return PHILOSOPHY_QUOTES[Math.floor(Math.random() * PHILOSOPHY_QUOTES.length)];
}
