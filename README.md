# 週期小記 — Period Tracker

Minimal web app for menstrual cycle tracking: record periods, view cycle phases on a calendar, and get gentle daily health tips.

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
│   ├── Nav.tsx               # Bottom navigation
│   ├── PhaseBadge.tsx        # Phase label badge
│   └── CalendarGrid.tsx      # Month grid with phase colors
├── lib/
│   ├── supabase.ts           # Supabase client + get/add periods
│   ├── cycle.ts              # Cycle math: ovulation, fertile, luteal
│   ├── health-tips.ts        # Phase-based daily tips
│   └── types.ts              # Shared types
├── supabase/
│   └── schema.sql            # PostgreSQL schema for Supabase
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

## 4. Setup instructions

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
   - Open **SQL Editor** and run the contents of `supabase/schema.sql`. The schema includes an RLS policy so anonymous users can use the app with `user_id = null` (demo mode). For production with login, use the authenticated policy and pass `userId` from `auth.uid()`.

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

**Style:** Minimal, soft colors (Tailwind), mobile-first, friendly tone (zh-TW).
