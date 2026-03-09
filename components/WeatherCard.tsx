"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import { FloatingCard } from "./FloatingCard";

export function WeatherCard() {
  const [data, setData] = useState<{ temp: number | null; condition: string; city?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetch(`/api/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            setData({
              temp: d?.temp ?? null,
              condition: d?.conditionText ?? d?.condition ?? "—",
              city: d?.city,
            });
          })
          .catch(() => setData({ temp: null, condition: "获取失败" }))
          .finally(() => setLoading(false));
      },
      () => {
        setData({ temp: null, condition: "未获取位置" });
        setLoading(false);
      }
    );
  }, []);

  return (
    <FloatingCard delay={0.4}>
      <div className="flex items-center gap-2 text-inkLight text-sm mb-2">
        <Cloud className="w-4 h-4 text-blossom" strokeWidth={1.8} />
        天气信息
      </div>
      {loading ? (
        <p className="text-inkLight text-sm">正在获取…</p>
      ) : data ? (
        <div className="text-ink">
          {data.city && <span className="text-inkLight">{data.city} · </span>}
          {data.temp != null && <span className="font-medium">{data.temp}°C</span>}
          <span className="text-inkLight"> {data.condition}</span>
        </div>
      ) : null}
    </FloatingCard>
  );
}
