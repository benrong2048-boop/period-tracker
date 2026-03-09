import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { CompanionChat } from "@/components/CompanionChat";

export const metadata: Metadata = {
  title: "身体节律",
  description: "温暖的身体节律陪伴系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Nav />
        <CompanionChat />
      </body>
    </html>
  );
}
