"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "今日" },
  { href: "/calendar", label: "日曆" },
  { href: "/record", label: "記錄" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/90 backdrop-blur border-t border-rose-100 safe-area-pb">
      <ul className="flex justify-around py-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`block px-6 py-2 rounded-full text-sm font-medium transition-colors tap-highlight-none ${
                pathname === href
                  ? "bg-rose-200/80 text-rose-800"
                  : "text-gray-500 hover:text-rose-700"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
