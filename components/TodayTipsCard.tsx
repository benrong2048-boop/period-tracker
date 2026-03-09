"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Cloud, MapPin } from "lucide-react";
import { MOOD_OPTIONS } from "@/lib/mood";
import { getTodayMood, setTodayMood } from "@/lib/today-mood";
import { getDailyRecommendation } from "@/lib/recommendation";
import type { CyclePhase } from "@/lib/types";
import type { WeatherInput } from "@/lib/recommendation";

interface TodayTipsCardProps {
  phase: CyclePhase;
  phaseLabel: string;
  dayOfPeriod: number | null;
}

type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherInput }
  | { status: "error"; message: string };

export function TodayTipsCard({
  phase,
  phaseLabel,
  dayOfPeriod,
}: TodayTipsCardProps) {
  const [weather, setWeather] = useState<WeatherState>({ status: "idle" });
  const [mood, setMoodState] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);

  const loadMood = useCallback(() => {
    setMoodState(getTodayMood());
  }, []);

  useEffect(() => {
    loadMood();
  }, [loadMood]);

  const handleMoodSelect = (key: string) => {
    const next = mood === key ? null : key;
    setMoodState(next);
    setTodayMood(next);
    // 重新生成贴士（若有天气则立即更新）
    if (weather.status === "success") {
      setTip(
        getDailyRecommendation({
          weather: weather.data,
          phase,
          phaseLabel,
          dayOfPeriod,
          mood: next,
        })
      );
    }
  };

  useEffect(() => {
    if (weather.status !== "idle") return;

    setWeather({ status: "loading" });

    const onSuccess = (position: GeolocationPosition) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetch(`/api/weather?lat=${lat}&lon=${lon}`)
        .then((res) => {
          if (!res.ok) throw new Error("天气请求失败");
          return res.json();
        })
        .then((data) => {
          const weatherData: WeatherInput = {
            temp: data.temp ?? null,
            condition: data.condition ?? "",
            conditionText: data.conditionText ?? "未知",
            city: data.city ?? null,
          };
          setWeather({ status: "success", data: weatherData });
          setTip(
            getDailyRecommendation({
              weather: weatherData,
              phase,
              phaseLabel,
              dayOfPeriod,
              mood: mood ?? getTodayMood(),
            })
          );
        })
        .catch(() => {
          setWeather({
            status: "error",
            message: "无法获取天气，请检查定位权限或网络",
          });
          setTip(
            getDailyRecommendation({
              weather: { temp: null, condition: "", conditionText: "未知", city: null },
              phase,
              phaseLabel,
              dayOfPeriod,
              mood: mood ?? getTodayMood(),
            })
          );
        });
    };

    const onError = () => {
      setWeather({
        status: "error",
        message: "未获取到位置，将不包含天气信息",
      });
      setTip(
        getDailyRecommendation({
          weather: { temp: null, condition: "", conditionText: "未知", city: null },
          phase,
          phaseLabel,
          dayOfPeriod,
          mood: mood ?? getTodayMood(),
        })
      );
    };

    if (!navigator.geolocation) {
      onError();
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      timeout: 10000,
      maximumAge: 300000,
    });
  }, [phase, phaseLabel, dayOfPeriod]); // 仅首次挂载依赖

  // 当心情从 localStorage 加载或用户切换心情、且已有天气时，重新生成贴士
  useEffect(() => {
    const currentMood = mood ?? getTodayMood();
    if (weather.status === "success") {
      setTip(
        getDailyRecommendation({
          weather: weather.data,
          phase,
          phaseLabel,
          dayOfPeriod,
          mood: currentMood,
        })
      );
    }
  }, [mood, weather.status, phase, phaseLabel, dayOfPeriod]);

  return (
    <section className="rounded-2xl bg-morandi-card border border-morandi-border p-5 shadow-card hover:shadow-cardHover transition-shadow">
      <h2 className="flex items-center gap-2 text-morandi-dark font-medium mb-3">
        <Sparkles className="w-4 h-4 text-morandi-pink" strokeWidth={1.8} />
        今日专属贴士
      </h2>

      <div className="mb-4">
        <span className="text-xs text-morandi-gray block mb-2">今日心情（可选）</span>
        <div className="flex gap-2">
          {MOOD_OPTIONS.map(({ key, emoji }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleMoodSelect(key)}
              className={`w-10 h-10 rounded-xl border text-lg transition-all tap-highlight-none ${
                mood === key
                  ? "border-morandi-pink bg-morandi-pinkLight/60"
                  : "border-morandi-border bg-white hover:border-morandi-pink/50"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {weather.status === "loading" && (
        <div className="flex items-center gap-2 text-morandi-gray text-sm py-2">
          <Cloud className="w-4 h-4 animate-pulse" />
          正在获取天气与位置…
        </div>
      )}

      {weather.status === "error" && (
        <div className="flex items-center gap-2 text-morandi-gray/80 text-xs py-1 mb-2">
          <MapPin className="w-3.5 h-3.5" />
          {weather.message}
        </div>
      )}

      {tip && (
        <p className="text-sm text-morandi-gray leading-relaxed whitespace-pre-wrap">
          {tip}
        </p>
      )}
    </section>
  );
}
