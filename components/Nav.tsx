"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Calendar, PenLine } from "lucide-react";

const links = [
  { href: "/", label: "首页", Icon: Home },
  { href: "/calendar", label: "日历", Icon: Calendar },
  { href: "/record", label: "记录", Icon: PenLine },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto backdrop-blur-xl bg-white/50 border-t border-white/60 shadow-glass">
      <ul className="flex justify-around py-3">
        {links.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link href={href} className="flex flex-col items-center gap-1 tap-highlight-none">
              <motion.span
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-xl transition-colors ${
                  pathname === href ? "bg-blossom/20 text-blossom" : "text-inkLight"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.8} />
              </motion.span>
              <span className={`text-xs ${pathname === href ? "text-ink font-medium" : "text-inkLight"}`}>
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
