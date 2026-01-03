# Project Documentation — Mobile‑First Expense Tracker

This document contains **all recommended supporting files** bundled together for simplicity.
You may later split them into separate files if desired.

---

# 1. DEPLOYMENT.md

## Goal

Deploy the app **entirely on free tier**, using Vercel + Vercel Postgres + Google OAuth.

---

## One‑Time Human Steps (AI CANNOT DO THESE)

### Step 1: Create GitHub Repository

* Create a new GitHub repo
* Push the Next.js codebase

---

### Step 2: Create Vercel Project

1. Log in to Vercel
2. "Add New Project"
3. Import the GitHub repo
4. Framework: **Next.js**

---

### Step 3: Create Vercel Postgres Database

1. Go to Vercel Dashboard → Project → Storage
2. Add **Postgres** (Free Tier)
3. Vercel will auto‑inject:

   * POSTGRES_URL
   * POSTGRES_PRISMA_URL

---

### Step 4: Google OAuth Setup

1. Go to Google Cloud Console
2. Create OAuth Client (Web)
3. Authorized redirect URL:

   * https://<your‑vercel‑domain>/api/auth/callback/google
4. Copy:

   * GOOGLE_CLIENT_ID
   * GOOGLE_CLIENT_SECRET

---

### Step 5: Environment Variables (Vercel)

Add these in Vercel → Project → Environment Variables:

* GOOGLE_CLIENT_ID
* GOOGLE_CLIENT_SECRET
* NEXTAUTH_SECRET
* NEXTAUTH_URL

---

## Post‑Setup Flow

* `git push` → Vercel auto‑deploys
* Prisma migrations run via Vercel build
* No manual servers

---

# 2. PRISMA_SCHEMA.md

## Design Principles

* Simple
* Explicit
* No over‑normalization
* Optimized for monthly queries

---

## Models

### User

* id
* name
* email
* image

---

### Expense

* id
* userId
* amount
* date
* category
* note (optional)
* source: manual | automatic
* automaticExpenseId (nullable)

---

### AutomaticExpense

* id
* userId
* name
* amount
* category
* startMonth
* isActive

---

### SkippedAutomaticExpense

* id
* automaticExpenseId
* yearMonth (YYYY‑MM)

---

## Important Rules

* Expenses are created lazily
* No future rows
* No cron

---

# 3. FOLDER_STRUCTURE.md

## App Router Layout

```
app/
 ├─ layout.tsx
 ├─ page.tsx            (Home)
 ├─ add/
 │   └─ page.tsx        (Add Expense)
 ├─ summary/
 │   └─ page.tsx        (Summary)
 ├─ api/
 │   └─ auth/[...nextauth]/route.ts

components/
 ├─ navigation/
 ├─ expense/
 ├─ summary/

lib/
 ├─ db.ts
 ├─ auth.ts
 ├─ recurring.ts

prisma/
 └─ schema.prisma
```

---

## Rules

* No deeply nested folders
* No generic "utils" dumping
* Name files by purpose, not abstraction

---

# 4. UI_COPY_GUIDE.md

## Language Rules

* Use **plain English**
* Avoid finance jargon
* Avoid technical terms

---

## Approved Labels

* "Add Expense"
* "Today"
* "This Month"
* "Automatic Expenses"
* "Skip this month"
* "Remove forever"

---

## Forbidden Words

* recurring
* cadence
* rule
* configuration
* analytics

---

# 5. BUILD_ORDER.md

## Phase 1 — Foundation

* Next.js setup
* Tailwind + shadcn
* Auth.js (Google)
* Prisma + Postgres

---

## Phase 2 — Core UX

* Home screen totals
* Add Expense flow
* Expense list

---

## Phase 3 — Automatic Expenses

* Data model
* Lazy creation logic
* Skip / remove behavior

---

## Phase 4 — Summary

* Monthly aggregation
* Category pie chart

---

## Phase 5 — Polish

* PWA config
* Accessibility pass
* Mobile UX tuning

---

# 6. CURSOR_SESSION_PROMPTS.md

## Base Prompt (Use Every Session)

"""
Read agents.md first.
Follow it strictly.
Do not invent features.
If unclear, ask.
Optimize for a non‑technical parent user.
"""

---

## Debug Prompt

"""
Find the simplest possible fix.
Prefer readability over cleverness.
Explain only if asked.
"""

---

## Refactor Prompt

"""
Refactor only if it improves clarity or simplicity.
No abstractions without strong justification.
"""

---

# FINAL NOTE

If a feature makes the app more powerful **but less obvious**, it is wrong.

This app must feel calm, predictable, and boring — and that is intentional.
