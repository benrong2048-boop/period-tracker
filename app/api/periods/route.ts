import { NextRequest, NextResponse } from "next/server";
import { addPeriod } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { start_date, end_date, cycle_length_days } = body;

    if (!start_date || typeof start_date !== "string") {
      return NextResponse.json(
        { error: "start_date is required" },
        { status: 400 }
      );
    }

    const cycleLength = Math.min(45, Math.max(21, Number(cycle_length_days) || 28));
    const record = await addPeriod(
      start_date,
      end_date || null,
      cycleLength,
      null
    );

    return NextResponse.json(record);
  } catch (err) {
    console.error("POST /api/periods", err);
    return NextResponse.json(
      { error: "Failed to save period" },
      { status: 500 }
    );
  }
}
