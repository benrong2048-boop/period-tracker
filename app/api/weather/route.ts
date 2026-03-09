import { NextRequest, NextResponse } from "next/server";

/**
 * 天气接口：优先使用 OpenWeather（需 OPENWEATHER_API_KEY），否则回退 wttr.in
 * GET /api/weather?lat=39.9&lon=116.4
 */
export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "缺少 lat 或 lon 参数" }, { status: 400 });
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return NextResponse.json({ error: "lat 或 lon 格式无效" }, { status: 400 });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    if (apiKey) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lonNum}&appid=${apiKey}&units=metric&lang=zh_cn`;
      const res = await fetch(url, { next: { revalidate: 600 } });
      if (!res.ok) throw new Error(`OpenWeather ${res.status}`);
      const data = await res.json();
      const temp = Math.round(data.main?.temp ?? 0);
      const cond = data.weather?.[0]?.description ?? "未知";
      return NextResponse.json({
        temp,
        condition: cond.toLowerCase(),
        conditionText: cond,
        city: data.name ?? null,
      });
    }

    const url = `https://wttr.in/${latNum},${lonNum}?format=j1&lang=zh`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PeriodTracker/1.0)" },
      next: { revalidate: 600 },
    });
    if (!res.ok) throw new Error(`wttr.in ${res.status}`);
    const data = await res.json();
    const current = data.current_condition?.[0];
    const area = data.nearest_area?.[0];
    if (!current) return NextResponse.json({ error: "无法解析天气数据" }, { status: 502 });
    const temp = parseInt(current.temp_C, 10);
    const desc = current.weatherDesc?.[0]?.value ?? "未知";
    return NextResponse.json({
      temp: Number.isNaN(temp) ? null : temp,
      condition: String(desc).toLowerCase(),
      conditionText: String(desc),
      city: area?.areaName?.[0]?.value ?? area?.region?.[0]?.value ?? null,
    });
  } catch (err) {
    console.error("GET /api/weather", err);
    return NextResponse.json({ error: "获取天气失败" }, { status: 500 });
  }
}
