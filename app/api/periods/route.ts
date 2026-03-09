import { NextResponse } from "next/server";
import { addPeriod, getPeriods } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      start_date,
      end_date,
      cycle_length_days,
      mood,
      symptom_intensity,
      note,
    } = body;

    if (!start_date || typeof start_date !== "string") {
      return NextResponse.json(
        { error: "經期開始日期不能為空" },
        { status: 400 }
      );
    }

    const cycleLength = Math.min(45, Math.max(21, Number(cycle_length_days) || 28));
    const symptom =
      symptom_intensity != null
        ? Math.min(5, Math.max(1, Number(symptom_intensity)))
        : null;

    const record = await addPeriod(
      start_date,
      end_date || null,
      cycleLength,
      null,
      {
        mood: mood || null,
        symptom_intensity: symptom,
        note: note?.trim() || null,
      }
    );

    return NextResponse.json({ data: record, message: "保存成功" }, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/periods", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "儲存失敗" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await getPeriods(null);
    return NextResponse.json({ data }, { status: 200 });
  } catch (err: unknown) {
    console.error("GET /api/periods", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "取得失敗" },
      { status: 500 }
    );
  }
}
