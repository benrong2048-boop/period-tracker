"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, PenLine } from "lucide-react";

const links = [
  { href: "/", label: "今日", Icon: Home },
  { href: "/calendar", label: "日曆", Icon: Calendar },
  { href: "/record", label: "記錄", Icon: PenLine },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-morandi-card/95 backdrop-blur border-t border-morandi-border shadow-card">
      <ul className="flex justify-around py-2">
        {links.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl text-sm font-medium transition-all tap-highlight-none ${
                pathname === href
                  ? "text-morandi-dark bg-morandi-pinkLight/80"
                  : "text-morandi-gray hover:text-morandi-dark"
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.8} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
