import { createClient } from '@supabase/supabase-js';
import type { PeriodRecord } from './types';

// 從環境變數讀取，變數名必須和 .env.local 完全一致
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 建立客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getPeriods(userId: string | null): Promise<PeriodRecord[]> {
  const query = supabase
    .from("periods")
    .select("*")
    .order("start_date", { ascending: false });

  if (userId) {
    query.eq("user_id", userId);
  } else {
    query.is("user_id", null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PeriodRecord[];
}

export async function addPeriod(
  startDate: string,
  endDate: string | null,
  cycleLength: number,
  userId: string | null
): Promise<PeriodRecord> {
  const { data, error } = await supabase
    .from("periods")
    .insert({
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
      cycle_length_days: cycleLength,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as PeriodRecord;
}

export async function updatePeriod(
  id: string,
  updates: { end_date?: string | null; cycle_length_days?: number }
): Promise<PeriodRecord> {
  const { data, error } = await supabase
    .from("periods")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PeriodRecord;
}
