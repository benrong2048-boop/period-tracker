import { NextRequest, NextResponse } from "next/server";

/**
 * 代理请求 wttr.in 获取天气，避免前端 CORS 并统一设置 User-Agent。
 * 使用方式：GET /api/weather?lat=39.9&lon=116.4
 */
export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "缺少 lat 或 lon 参数" },
      { status: 400 }
    );
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (Number.isNaN(latNum) || Number.isNaN(lonNum)) {
    return NextResponse.json(
      { error: "lat 或 lon 格式无效" },
      { status: 400 }
    );
  }

  try {
    const url = `https://wttr.in/${latNum},${lonNum}?format=j1&lang=zh`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PeriodTracker/1.0)",
      },
      next: { revalidate: 600 }, // 10 分钟缓存
    });

    if (!res.ok) {
      throw new Error(`wttr.in 返回 ${res.status}`);
    }

    const data = await res.json();
    const current = data.current_condition?.[0];
    const area = data.nearest_area?.[0];

    if (!current) {
      return NextResponse.json(
        { error: "无法解析天气数据" },
        { status: 502 }
      );
    }

    const temp = parseInt(current.temp_C, 10);
    const desc = current.weatherDesc?.[0]?.value ?? current.weatherDesc ?? "未知";
    const city = area?.areaName?.[0]?.value ?? area?.region?.[0]?.value ?? null;

    return NextResponse.json({
      temp: Number.isNaN(temp) ? null : temp,
      condition: String(desc).toLowerCase(),
      conditionText: String(desc),
      city,
    });
  } catch (err) {
    console.error("GET /api/weather", err);
    return NextResponse.json(
      { error: "获取天气失败，请稍后重试" },
      { status: 500 }
    );
  }
}
