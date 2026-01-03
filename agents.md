# Cursor Agent Rules — Mobile‑First Expense Tracker (Free, Mom‑Friendly)

> This document defines **strict, non‑negotiable rules** for Cursor (or any AI agent) working on this repository.
> The goal is to build a **simple, mobile‑first personal expense tracker** for **two users (developer + mother)**.
> The app must remain **free, boring, reliable, and extremely easy to use**.

---

## 1. Product Goal (DO NOT FORGET)

* This app is primarily for a **non‑technical parent**.
* If something is powerful but confusing → **DO NOT BUILD IT**.
* Success metric:

  * A user can add an expense in **under 5 seconds without explanation**.

---

## 2. Core Constraints (ABSOLUTE)

* **Mobile‑first web app**
* Works on:

  * iOS Safari (PWA)
  * Android Chrome (PWA)
  * Desktop browsers (secondary)
* **100% free tier**
* **Deployed on Vercel**
* **Single codebase**
* **No paid services**
* **No background workers**
* **No scheduled cron jobs**
* **No push notifications**
* **No native app builds**

If any feature violates these → STOP.

---

## 3. Tech Stack (FIXED)

### Frontend

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui (ONLY component library allowed)

### Backend Logic (No Separate Backend App)

* Next.js Server Actions and/or Route Handlers
* Prisma ORM
* Vercel Postgres (free tier)

### Authentication

* Auth.js (NextAuth)
* Google OAuth ONLY
* No email/password

### Charts

* Recharts ONLY
* Minimal charts, mobile‑friendly

---

## 4. What “No Backend” Means Here

* ❌ No Express / NestJS / Fastify

* ❌ No standalone API service

* ❌ No background jobs

* ✅ Server Actions for DB writes

* ✅ Route Handlers for reads if needed

* ✅ Auth handled server‑side

Mental model:

> **Next.js IS the backend.**

---

## 5. Navigation (STRICT)

Bottom navigation with **exactly 3 tabs**:

* Home
* Add
* Summary

Rules:

* No Settings tab
* No Profile tab
* No hamburger menu
* No nested navigation

---

## 6. Screen‑by‑Screen Requirements

### 6.1 Home Screen

Purpose: quick awareness only.

Must show:

* Big text:

  * “Today: ₹X”
  * “This month: ₹Y”
* Last **3 expenses** (simple list)

Must NOT show:

* Charts
* Filters
* Tables
* Advanced stats

---

### 6.2 Add Expense Screen (MOST IMPORTANT)

Purpose: fastest possible expense logging.

Defaults:

* Date = today
* Category = last used
* Amount input auto‑focused
* Numeric keypad on mobile

UI Rules:

* Category selection via **big buttons**, not dropdowns
* Categories:

  * Food
  * Rent
  * Travel
  * Bills
  * Other
* Optional note field
* Single Save button

Forbidden:

* Validation popups
* Multi‑step forms
* Advanced options

---

### 6.3 Summary Screen

Purpose: light understanding, not analysis.

Must show:

* Pie chart: spending by category
* Toggle:

  * This Month
  * Last Month
* One simple insight text (e.g. “Most spent on Food”)

Rules:

* One chart at a time
* No dense legends
* No overwhelming data

---

## 7. Automatic (Recurring) Expenses

### User Language (IMPORTANT)

* Call them **“Automatic expenses”**
* NEVER use:

  * recurring
  * cadence
  * rules

User actions:

* “Skip this month”
* “Remove forever”

---

### Technical Rules (NON‑NEGOTIABLE)

* ❌ Do NOT pre‑generate future expenses
* ❌ Do NOT use cron jobs

Logic:

* On app open OR dashboard load:

  * Check active automatic expenses
  * If current month entry does not exist → create it

This logic must be **idempotent**.

---

## 8. Data Rules

Each expense must have:

* amount
* date
* category
* note (optional)
* source: manual | automatic

Rules:

* Users see ONLY their own data
* No shared accounts
* No admin mode

---

## 9. PWA Requirements

* Installable
* `manifest.json` present
* Icons:

  * 192x192
  * 512x512
* Standalone display mode

Offline:

* Read‑only allowed
* Writes fail gracefully

---

## 10. Accessibility & UX Rules

* Font size ≥ 16px
* Button height ≥ 44px
* High contrast
* No swipe‑to‑delete
* No long‑press actions
* Confirm before delete

### UI Copy & Language Rules

* Use **plain English** (no finance jargon, no technical terms)
* Approved labels:
  * "Add Expense"
  * "Today"
  * "This Month"
  * "Automatic Expenses"
  * "Skip this month"
  * "Remove forever"
* Forbidden words:
  * recurring
  * cadence
  * rule
  * configuration
  * analytics
* All user-facing text must be simple and clear
* If a parent wouldn't understand it → rewrite it

---

## 11. What NOT to Build (ABSOLUTELY FORBIDDEN)

* Budgets (unless explicitly requested later)
* Notifications
* Bank integrations
* AI insights
* Multi‑currency
* Role management
* Animations beyond subtle transitions

If tempted → STOP.

---

## 12. Hallucination Prevention Rules

The agent MUST:

* Ask questions when unclear
* Never invent:

  * APIs
  * Business logic
  * UX flows
  * Edge cases

If unsure → ASK FIRST.

---

## 13. Code Quality Rules

* TypeScript everywhere
* Tailwind only (no inline styles)
* Follow shadcn/ui patterns
* No premature abstractions
* Keep files small and readable
* Strict TypeScript (`strict: true` in tsconfig.json)
* No `any` types (use `unknown` if needed, then narrow)
* Define types for all API responses and Server Action returns
* Use Prisma-generated types for database models
* Create shared types in `/types/` directory
* One component per file
* Co-locate related files (e.g., component and its test)

---

## 14. Server Actions & API Patterns

### Server Actions Rules

* All Server Actions must:
  * Use `"use server"` directive at the top of the file
  * Validate user authentication first (get session, check user exists)
  * Validate all input data (amount > 0, valid date, valid category)
  * Return consistent format: `{ success: boolean, error?: string, data?: T }`
  * Never throw unhandled exceptions (wrap in try-catch)
* Keep Server Actions in `/app/actions/` directory
* Name files by action: `add-expense.ts`, `delete-expense.ts`
* One Server Action per file (unless closely related)

### Route Handlers Rules

* Use Route Handlers only for reads if Server Components cannot handle it
* Always validate authentication
* Return JSON with consistent error format
* Keep in `/app/api/` directory

---

## 15. Database & Prisma Rules

* All Prisma queries MUST include `where: { userId }` for user-scoped data
* Never expose raw Prisma client (use helper functions in `/lib/db.ts`)
* Use transactions for multi-step operations (e.g., create expense + update automatic expense)
* Migrations must be backward-compatible when possible
* Always run `prisma generate` after schema changes
* Never use string concatenation for queries (use Prisma parameterized queries)
* Optimize for monthly queries (as per Prisma schema design)
* Expenses are created lazily (no pre-generation of future expenses)
* No future rows in database

---

## 16. Error Handling & User Feedback

* Server Actions must return `{ success: boolean, error?: string }` format
* Never show technical error messages to users:
  * ❌ "Database connection failed"
  * ❌ "Prisma error: Unique constraint violation"
  * ❌ Stack traces or API error codes
* ✅ Use simple, actionable messages:
  * "Could not save expense. Please try again."
  * "Expense not found."
  * "Something went wrong. Please try again later."
* All database operations must be wrapped in try-catch
* Client-side errors should fail gracefully (no crashes, no blank screens)
* Show errors inline in forms, not in popups or toasts
* Clear error messages when user starts typing again

---

## 17. Form Validation & Loading States

### Validation Rules

* Client-side: Basic validation (required fields, number format, date range)
* Server-side: ALL validation (security-critical, never trust client)
* Show validation errors inline below the field
* Disable submit button while processing
* Clear error messages when user starts typing again
* No validation popups or modals

### Loading States

* Show loading indicators for all async operations
* Use skeleton screens for data fetching (not spinners)
* Disable buttons during submission
* No loading states for instant operations (< 100ms)
* Loading state should match the content shape (skeleton)

---

## 18. Data Fetching Patterns

* Use Server Components by default (Next.js App Router)
* Fetch data directly in Server Components using `async/await`
* Only use Client Components when interactivity is required
* No `useEffect` for data fetching
* No client-side data fetching libraries (SWR, React Query, etc.)
* Lazy load charts (Recharts) only when Summary screen is viewed
* Use React Server Components to reduce client bundle size

---

## 19. Environment Variables

### Required Variables

* `POSTGRES_URL` (Vercel auto-injects)
* `POSTGRES_PRISMA_URL` (Vercel auto-injects)
* `NEXTAUTH_SECRET`
* `NEXTAUTH_URL`
* `GOOGLE_CLIENT_ID`
* `GOOGLE_CLIENT_SECRET`

### Rules

* Use `.env.example` file (never commit `.env`)
* All env vars must be typed and validated (use `zod` or similar)
* Create `/lib/env.ts` for centralized env validation
* Never hardcode secrets or API keys
* Assume env vars exist (agent cannot create cloud resources)

---

## 20. Security Rules

* Sanitize all user inputs
* Validate data on server (never trust client)
* Use Prisma parameterized queries (never string concatenation)
* Protect all routes with authentication middleware
* No sensitive data in client-side code
* Use HTTPS only (Vercel handles this automatically)
* All database queries must be user-scoped (prevent data leakage)

---

## 21. File Organization

### Directory Structure

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
 ├─ actions/            (Server Actions)
 │   ├─ add-expense.ts
 │   └─ delete-expense.ts

components/
 ├─ navigation/
 ├─ expense/
 ├─ summary/

lib/
 ├─ db.ts               (Prisma client wrapper)
 ├─ auth.ts             (Auth helpers)
 ├─ recurring.ts        (Automatic expense logic)
 ├─ env.ts              (Environment validation)

types/
 └─ index.ts            (Shared TypeScript types)

prisma/
 └─ schema.prisma
```

### Rules

* No deeply nested folders (max 2-3 levels)
* No generic "utils" dumping (name files by purpose)
* Name files by purpose, not abstraction
* Server Actions: `/app/actions/`
* Server Components: `/app/` (pages)
* Client Components: `/components/`
* Shared utilities: `/lib/`
* Types: `/types/`

---

## 22. Testing Requirements

* Write tests for:
  * Server Actions (unit tests)
  * Critical user flows (e2e tests for: add expense, view summary)
* Use Vitest for unit tests
* Use Playwright for e2e tests
* Tests must run in CI (GitHub Actions)
* Aim for >80% coverage on business logic
* Test files: `*.test.ts` or `*.spec.ts`
* Co-locate test files with source files

---

## 23. Performance & Dependencies

### Dependencies Rules

* Minimize dependencies (check if Next.js/React provides it first)
* Before adding a package, document why it's needed
* Pin exact versions in `package.json` (no `^` or `~`)
* No dev dependencies in production builds
* Review dependencies regularly for security updates

### Performance Rules

* Optimize images (use Next.js Image component)
* Keep bundle size minimal (monitor with `next build`)
* Use React Server Components to reduce client bundle
* No unnecessary re-renders (use React.memo only when needed)
* Lazy load heavy components (charts) only when needed

---

## 24. Logging & Git Rules

### Logging Rules

* No `console.log` in production code
* Use structured logging for errors (server-side only)
* Log user actions for debugging (amount, category, date - no PII)
* Remove all debug code before committing
* Never log sensitive data (passwords, tokens, full user objects)

### Git Rules

* Commit messages: Clear, descriptive (e.g., "Add expense form validation")
* One logical change per commit
* Never commit:
  * `.env` files
  * `node_modules/`
  * Build artifacts (`/.next/`, `/dist/`)
  * Database files
  * IDE config files (unless project-specific)

---

## 25. Deployment Rules

### Manual Steps (Human‑Only)

The human will:

1. Create Vercel project
2. Add Vercel Postgres (free tier)
3. Create Google OAuth credentials
4. Add env vars in Vercel

The agent MUST:

* Assume env vars exist
* NEVER claim it can create cloud resources

---

## 26. Code Review Checklist

Before marking code as complete, verify:

* [ ] No `any` types
* [ ] All errors handled gracefully
* [ ] User-facing text is simple and clear
* [ ] Mobile-responsive (tested on small screen)
* [ ] No console.logs
* [ ] Server Actions validate user auth
* [ ] Database queries are user-scoped
* [ ] Loading states implemented
* [ ] Form validation (client + server)
* [ ] TypeScript strict mode passes

---

## 27. Final Rule

> **Be boring. Be correct. Be simple.**

If a decision helps developers but hurts a parent user → reject it.
