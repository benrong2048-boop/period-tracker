# 週期小記 — Period Tracker 2.0

經期記錄、週期預測與多維記錄（情緒、症狀、筆記）。莫蘭迪色系 UI，狀態看板、日曆預測、週期趨勢圖。

## 1. Project structure

```
period-tracker/
├── app/
│   ├── api/periods/route.ts   # POST: save period record
│   ├── calendar/page.tsx     # Calendar page with colored phases
│   ├── record/page.tsx       # Record period start/end
│   ├── page.tsx              # Home: today's phase + daily tips
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Nav.tsx               # Bottom nav (Lucide icons)
│   ├── PhaseBadge.tsx        # Phase label badge
│   ├── CalendarGrid.tsx      # Month grid + predicted period
│   ├── StatusDashboard.tsx   # 狀態看板（距離下次 / 週期第幾天）
│   └── CycleTrendChart.tsx   # 週期長度趨勢（CSS 進度條）
├── lib/
│   ├── supabase.ts           # getPeriods, addPeriod (含 mood/symptom/note)
│   ├── cycle.ts              # 週期計算 + 智能預測 getCycleStats, getPredictedNextPeriodStart
│   ├── health-tips.ts        # Phase-based daily tips
│   ├── mood.ts               # 情緒選項 (😊😔😫😡)
│   └── types.ts              # PeriodRecord, CycleStats, DayPhase
├── supabase/
│   ├── schema.sql            # 初版表結構
│   └── migration_2.0_periods_extend.sql  # 2.0 新增 mood, symptom_intensity, note
├── .env.local.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 2. Key code files

| File | Purpose |
|------|--------|
| `lib/cycle.ts` | Default 28-day cycle; ovulation = 14 days before next period; fertile window = ovulation −5 to ovulation; luteal = ovulation to next period. `getPhaseForDate()`, `getTodayPhase()`, `getPhasesForMonth()`. |
| `lib/supabase.ts` | `getPeriods(userId)`, `addPeriod(start, end, cycleLength, userId)`. Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. |
| `lib/health-tips.ts` | `getDailyTips(phase)` returns diet / rest / mood tips per phase (menstrual, follicular, fertile, ovulation, luteal, unknown). |
| `app/page.tsx` | Server component: fetches periods, computes today’s phase, shows phase badge and daily tips. |
| `app/calendar/page.tsx` | Server component: fetches periods, computes phases for current month, renders `CalendarGrid`. |
| `app/record/page.tsx` | Client form: start date, optional end date, cycle length; POSTs to `/api/periods`. |
| `app/api/periods/route.ts` | POST handler: validates body, calls `addPeriod()`, returns saved record. |

## 3. Database schema (Supabase / PostgreSQL)

Run `supabase/schema.sql` in the Supabase SQL Editor.

**Table: `periods`**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (default gen_random_uuid()) |
| user_id | uuid | Optional, references auth.users(id) |
| start_date | date | Period start (required) |
| end_date | date | Period end (optional) |
| cycle_length_days | int | Default 28 |
| created_at, updated_at | timestamptz | Auto-set |

RLS is enabled; policy allows users to manage only their own rows (`auth.uid() = user_id`). For **anonymous/demo** use with `user_id = null`, add a policy that allows anon to select/insert rows where `user_id is null` (see comment in schema).

**Table: `user_settings`** (optional, for future reminder time)

| Column | Type |
|--------|------|
| user_id | uuid PK, references auth.users |
| reminder_enabled | boolean default true |
| reminder_hour, reminder_minute | int |

## 4. 升級至 2.0（已有初版資料庫）

在 Supabase SQL Editor 執行 **`supabase/migration_2.0_periods_extend.sql`**，為 `periods` 表新增：

- `mood` (text) — 情緒
- `symptom_intensity` (int, 1–5) — 症狀強度
- `note` (text) — 筆記

執行後重新部署或重啟應用即可。

## 5. Setup instructions

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Steps

1. **Clone / open the project and install dependencies**

   ```bash
   cd period-tracker
   npm install
   ```

2. **Create Supabase project and run schema**

   - In [Supabase Dashboard](https://app.supabase.com) create a new project.
   - Open **SQL Editor** and run the contents of `supabase/schema.sql`. For 2.0 多維記錄（情緒、症狀、筆記），再執行 `supabase/migration_2.0_periods_extend.sql`。

3. **Configure environment**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   ```

   Get both from Supabase: Project Settings → API.

4. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Use **記錄** to add a period, **今日** for today’s phase and tips, **日曆** for the monthly view.

### Daily reminder notification

The app shows a short “daily reminder” message on the home page (今日小提醒). For **browser push notifications**, you would add a service worker, request notification permission, and optionally use Supabase or a cron job to trigger sends; that is not included in this minimal version.

---

**Cycle rules (default 28-day cycle)**  
- Ovulation = 14 days before next period.  
- Fertile window = 5 days before ovulation through ovulation day.  
- Luteal phase = ovulation day through the day before next period.

**Style:** 莫蘭迪色系（深灰、柔粉、米白），Tailwind，手機優先。圖標：lucide-react。
