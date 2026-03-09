-- Period Tracker 2.0: 多维记录字段
-- 在 Supabase SQL Editor 中执行此脚本（在已有 public.periods 表的前提下）

-- 情绪（存储 emoji 或 key，如 😊 😔 😫 😡）
alter table public.periods
  add column if not exists mood text;

-- 症状强度 1-5
alter table public.periods
  add column if not exists symptom_intensity int check (symptom_intensity is null or (symptom_intensity >= 1 and symptom_intensity <= 5));

-- 简短笔记
alter table public.periods
  add column if not exists note text;

comment on column public.periods.mood is 'Emoji or key: 😊😔😫😡';
comment on column public.periods.symptom_intensity is '1-5 star rating';
comment on column public.periods.note is 'Optional short note';
