# AGENTS.md — AI Agent Instructions

This file tells any AI agent exactly how to work on this project.
Read this entire file before doing anything else.

---

## WHAT THIS PROJECT IS

A backend API built with Next.js App Router deployed on Vercel.
It connects to an existing Supabase Postgres database.
There is no frontend — this project serves JSON only.

---

## TECH STACK

| Tool | Purpose |
|---|---|
| Next.js 14 App Router | API routes framework |
| Drizzle ORM | Type-safe database queries |
| Supabase | Postgres database + auth |
| TypeScript | Language — strict mode |
| Vercel | Deployment |

---

## ABSOLUTE RULES — NEVER BREAK THESE

1. Never hardcode secrets, URLs, passwords, or keys anywhere in code
2. Never commit .env.local or any file containing real secrets
3. Always use process.env for environment variables
4. Every API route must return NextResponse.json() — never crash, never return HTML
5. Never use `any` as a TypeScript type — find the correct type
6. Never use @ts-ignore — fix the actual error
7. Never run drizzle-kit push — always use drizzle-kit migrate
8. Never modify the database schema without explicit user confirmation
9. Never skip tests — prove everything works before asking for confirmation
10. Never move to the next step until the current step is tested and confirmed

---

## ENVIRONMENT VARIABLES

All secrets live in .env.local locally and Vercel dashboard in production.

Required variables:
- DATABASE_URL — Supabase pooler URL, port 6543, with ?pgbouncer=true
- SUPABASE_URL — Project URL from Supabase dashboard
- SUPABASE_ANON_KEY — Public anon key from Supabase dashboard
- SUPABASE_SERVICE_KEY — Service role key from Supabase dashboard

Where to find them:
- SUPABASE_URL: Supabase Dashboard → Project Settings → API → Project URL
- SUPABASE_ANON_KEY: Supabase Dashboard → Project Settings → API → anon public
- SUPABASE_SERVICE_KEY: Supabase Dashboard → Project Settings → API → service_role
- DATABASE_URL: Supabase Dashboard → Project Settings → Database → URI → change port to 6543 → add ?pgbouncer=true

Correct DATABASE_URL format:
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true

---

## ENVIRONMENT VARIABLE PATTERN

Use this exact pattern every single time you read an env variable:

const value = process.env.VARIABLE_NAME
if (!value) {
  return NextResponse.json(
    { status: "error", message: "Missing VARIABLE_NAME environment variable" },
    { status: 500 }
  )
}

---

## FOLDER STRUCTURE

zamproject-backend/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── health/route.ts              ← GET /api/health
│   │       ├── test-db/route.ts             ← GET /api/test-db
│   │       ├── members/route.ts             ← GET /api/members
│   │       ├── badges/route.ts              ← GET /api/badges
│   │       ├── notifications/route.ts       ← GET /api/notifications
│   │       ├── event-bookings/route.ts      ← GET /api/event-bookings
│   │       ├── upgrade-requests/route.ts    ← GET /api/upgrade-requests
│   │       └── profit-distributions/route.ts
│   ├── db/
│   │   ├── index.ts                         ← Drizzle db instance
│   │   ├── schema.ts                        ← All 7 table definitions
│   │   └── migrations/                      ← Generated SQL migrations
│   ├── lib/
│   │   ├── supabase.ts                      ← Supabase anon client factory
│   │   └── supabase-admin.ts                ← Supabase admin client factory
│   ├── middleware.ts                         ← CORS for all /api/* routes
│   └── jobs/
│       └── README.md                        ← Placeholder for background jobs
├── .env.local                               ← Real secrets — never commit
├── .env.example                             ← Empty keys — always commit
├── .gitignore                               ← Must include .env.local
├── drizzle.config.ts                        ← Drizzle config — env vars only
├── next.config.ts                           ← Next.js config
├── vercel.json                              ← Vercel deployment config
├── package.json                             ← Scripts and dependencies
├── tsconfig.json                            ← TypeScript strict mode
├── AGENTS.md                                ← This file
├── CLAUDE.md                                ← Claude-specific instructions
└── README.md                                ← Human setup guide

---

## DATABASE SCHEMA

7 tables. Do not modify without explicit user confirmation.

### badges
- id: uuid, primary key, default gen_random_uuid()
- name: text, not null
- tier_required: text, not null
- description: text, nullable
- icon_url: text, nullable
- allows_event_booking: boolean, not null, default false
- allows_guest_pass: boolean, not null, default false
- created_at: timestamptz, not null, default now()

### members
- id: uuid, primary key, default gen_random_uuid()
- auth_user_id: uuid, nullable, references auth.users(id)
- badge_id: uuid, nullable, references badges(id)
- email: text, not null
- name: text, not null
- tier: text, not null, default 'Explorer'
- status: text, not null, default 'INACTIVE'
- role: text, not null, default 'member'
- clearance: text, not null, default 'INTERNAL'
- title: text, nullable
- location: text, nullable
- member_since: date, nullable
- avatar_url: text, nullable
- display_level: text, not null, default 'Level 1 Applicant'
- created_at: timestamptz, not null, default now()
- updated_at: timestamptz, not null, default now()

### upgrade_requests
- id: uuid, primary key, default gen_random_uuid()
- member_id: uuid, not null, references members(id)
- reviewed_by: uuid, nullable, references members(id)
- from_tier: text, not null
- to_tier: text, not null
- status: text, not null, default 'PENDING'
- payment_reference: text, nullable
- payment_verified: boolean, not null, default false
- admin_notes: text, nullable
- reviewed_at: timestamptz, nullable
- created_at: timestamptz, not null, default now()
- updated_at: timestamptz, not null, default now()

### tier_change_history
- id: uuid, primary key, default gen_random_uuid()
- member_id: uuid, not null, references members(id)
- changed_by: uuid, nullable, references members(id)
- previous_tier: text, not null
- new_tier: text, not null
- changed_at: timestamptz, not null, default now()

### profit_distributions
- id: uuid, primary key, default gen_random_uuid()
- member_id: uuid, not null, references members(id)
- amount: numeric, not null
- period_month: date, not null
- tier_at_time: text, not null
- status: text, not null, default 'PENDING'
- paid_at: timestamptz, nullable
- notes: text, nullable
- created_at: timestamptz, not null, default now()

### notifications
- id: uuid, primary key, default gen_random_uuid()
- member_id: uuid, not null, references members(id)
- type: text, not null
- title: text, not null
- message: text, not null
- read: boolean, not null, default false
- created_at: timestamptz, not null, default now()

### event_bookings
- id: uuid, primary key, default gen_random_uuid()
- member_id: uuid, not null, references members(id)
- event_name: text, not null
- event_date: date, not null
- includes_guest_pass: boolean, not null, default false
- booking_status: text, not null, default 'CONFIRMED'
- booked_at: timestamptz, not null, default now()

---

## DRIZZLE RULES

- Schema file: src/db/schema.ts
- Connection file: src/db/index.ts
- Config file: drizzle.config.ts
- Migrations folder: src/db/migrations/
- Always import db from src/db/index.ts
- Always import tables from src/db/schema.ts
- Never mix Drizzle and Supabase SDK in the same route
- Use Drizzle for: complex queries, joins, type-safe operations
- Use Supabase SDK for: auth operations only

Migration commands in order:
1. npm run db:generate   ← creates SQL files in migrations/
2. Review the SQL file   ← show it to the user before applying
3. npm run db:migrate    ← applies migration to Supabase
4. Test every table      ← run a SELECT on each table

---

## API ROUTE PATTERN

Use this exact pattern for every route:

import { NextResponse } from "next/server"
import { db } from "@/db/index"
import { tableName } from "@/db/schema"

// GET /api/route-name — description of what this does
export async function GET(): Promise<NextResponse> {
  try {
    const result = await db.select().from(tableName)
    return NextResponse.json({ status: "ok", data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    )
  }
}

---

## RESPONSE FORMAT

Every response must follow one of these two formats:

Success:
{ "status": "ok", "data": ... }

Error:
{ "status": "error", "message": "clear explanation of what went wrong" }

Never return anything else. Never return plain text. Never return HTML.

---

## SCRIPTS

| Command | What it does |
|---|---|
| npm run dev | Start local server on port 3000 |
| npm run build | Build for production |
| npm run type-check | Check TypeScript — must return zero errors |
| npm run db:generate | Generate SQL migration files from schema |
| npm run db:migrate | Apply migrations to the database |
| npm run db:studio | Open Drizzle Studio to browse the database |

---

## STEP STRUCTURE — FOLLOW THIS FOR EVERY TASK

1. Say what you are about to do and why
2. Show the code or file contents before creating it
3. Create or edit the file
4. Run npm run type-check — fix all errors before continuing
5. Run the relevant test and show the exact terminal output
6. Only then ask for confirmation to continue

---

## TESTING CHECKLIST — RUN BEFORE EVERY CONFIRMATION

- [ ] npm run type-check returns zero errors
- [ ] npm run dev starts without crashing
- [ ] curl http://localhost:3000/api/health returns { "status": "ok" }
- [ ] curl http://localhost:3000/api/test-db returns { "status": "ok" } or a clear error message
- [ ] No route returns HTML or crashes the server

---

## CURRENT PROJECT STATUS

Update this section after every completed phase.

Phase 1 — Database: IN PROGRESS
- [ ] schema.ts written with all 7 tables
- [ ] Migration generated
- [ ] Migration applied to Supabase
- [ ] All 7 tables confirmed to exist

Phase 2 — API Routes: NOT STARTED
- [ ] health route working
- [ ] test-db route working
- [ ] All placeholder routes returning clean JSON
- [ ] Full local test passing

Phase 3 — Deploy: NOT STARTED
- [ ] type-check passing
- [ ] build passing
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] All routes tested on live URL
