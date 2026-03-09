import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "週期小記 2.0",
  description: "經期記錄與週期預測",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen flex flex-col pb-20 bg-morandi-bg">
        <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-6">
          {children}
        </main>
        <Nav />
      </body>
    </html>
  );
}
