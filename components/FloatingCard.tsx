"use client";

import { motion } from "framer-motion";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FloatingCard({ children, className = "", delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        rounded-3xl backdrop-blur-xl bg-white/55 border border-white/60
        shadow-float hover:shadow-floatHover
        p-5 transition-shadow duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
