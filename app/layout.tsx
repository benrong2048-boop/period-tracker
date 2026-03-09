import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "週期小記",
  description: "輕量經期記錄與每日小提醒",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen flex flex-col pb-20">
        <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-6">
          {children}
        </main>
        <Nav />
      </body>
    </html>
  );
}
