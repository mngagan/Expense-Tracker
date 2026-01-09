# Expense Tracker

A simple, mobile-first personal expense tracker built for non-technical users.

## Features

- **Quick Expense Entry**: Add expenses in under 5 seconds
- **Automatic Expenses**: Set up monthly recurring expenses
- **Simple Summary**: View spending by category with easy-to-understand charts
- **Mobile-First**: Optimized for iOS Safari and Android Chrome (PWA)
- **Free Forever**: 100% free tier, no paid services

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + Vercel Postgres
- Auth.js (Google OAuth)
- Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy `.env.example` to `.env`):
```bash
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_prisma_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start development server:
```bash
npm run dev
```

## PWA Icons

Add the following icons to the `public/` directory:
- `icon-192x192.png` (192x192 pixels)
- `icon-512x512.png` (512x512 pixels)

## Project Structure

```
app/
  ├─ actions/          # Server Actions
  ├─ add/              # Add Expense page
  ├─ summary/          # Summary page
  └─ api/auth/         # Auth routes

components/
  ├─ navigation/     # Bottom navigation
  ├─ expense/         # Expense components
  └─ summary/         # Summary components

lib/
  ├─ auth.ts          # Auth configuration
  ├─ db.ts            # Prisma client
  ├─ env.ts           # Environment validation
  └─ recurring.ts     # Automatic expense logic
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run e2e tests

## Deployment

See `docs.md` for deployment instructions (Vercel + Vercel Postgres).

## License

Private project



