"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { useStore } from "@/lib/store";
import { getTodayPhase } from "@/lib/cycle-engine";
import { FloatingCard } from "./FloatingCard";

const RESPONSES: Record<string, string[]> = {
  "累": [
    "你现在可能处于黄体期，身体的能量通常会下降。如果感觉疲惫，也许今天适合慢一点。",
    "身体在发出休息的信号。或许可以尝试给自己一段不被打扰的时间，不必勉强。",
  ],
  "疲惫": [
    "黄体期身体能量通常会下降。也许今天适合慢一点，不必勉强。",
  ],
  "低落": [
    "如果感觉低落，或许可以尝试调暗灯光，听一些舒缓的音乐。身体比思想更早知道答案。",
  ],
  "烦躁": [
    "情绪有些紧绷时，也许适合给自己一点空间。或许可以尝试深呼吸，或短暂离开当下环境。",
  ],
  "痛": [
    "如果感觉不适，也许可以尝试温热敷或轻柔的伸展。若持续不适，建议咨询医生。",
  ],
  "default": [
    "我在这里。如果感觉疲惫，也许今天适合慢一点。",
    "身体自有其节奏。或许可以尝试倾听它，不必勉强。",
  ],
};

function getResponse(input: string, phase: string): string {
  const lower = input.trim().toLowerCase();
  for (const [key, replies] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) {
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }
  const def = RESPONSES.default;
  return def[Math.floor(Math.random() * def.length)];
}

export function CompanionChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const periods = useStore((s) => s.periods);
  const phase = getTodayPhase(periods);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    const reply = getResponse(text, phase.phase);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    }, 600);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-blossom/80 text-white shadow-float flex items-center justify-center z-40 tap-highlight-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" strokeWidth={1.8} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-t-3xl bg-white/80 backdrop-blur-xl border-t border-white/60 p-4 pb-8 max-h-[70vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-ink font-medium">情绪陪伴</span>
                <button
                  onClick={() => setOpen(false)}
                  className="text-inkLight text-sm"
                >
                  关闭
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 min-h-[120px]">
                {messages.length === 0 && (
                  <p className="text-inkLight text-sm">
                    可以输入简单表达，例如「今天好累」
                  </p>
                )}
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                        m.role === "user"
                          ? "bg-blossom/30 text-ink"
                          : "bg-white/60 text-ink border border-white/60"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="输入..."
                  className="flex-1 rounded-2xl border-2 border-white/60 bg-white/40 px-4 py-2.5 text-ink text-sm focus:border-blossom/60 focus:outline-none"
                />
                <motion.button
                  onClick={handleSend}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-2xl bg-blossom/80 p-2.5 text-white"
                >
                  <Send className="w-5 h-5" strokeWidth={1.8} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
