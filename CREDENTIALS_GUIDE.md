# How to Get Credentials for Expense Tracker

This guide explains where to get each credential needed for the app.

---

## 1. Google OAuth Credentials

### Where to Get:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google+ API** (or **Google Identity API**)
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. Choose **Web application**
7. Configure:
   - **Name**: Expense Tracker (or any name)
   - **Authorized redirect URIs**: 
     - For local: `http://localhost:3000/api/auth/callback/google`
     - For production: `https://your-vercel-domain.vercel.app/api/auth/callback/google`
8. Click **Create**
9. Copy:
   - **Client ID** → `GOOGLE_CLIENT_ID`
   - **Client secret** → `GOOGLE_CLIENT_SECRET`

### Quick Link:
- [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)

---

## 2. Vercel Postgres Credentials

### Where to Get:
1. Deploy your project to Vercel (or create a new project)
2. Go to your **Vercel Dashboard** → Select your project
3. Go to **Storage** tab
4. Click **Create Database** → Select **Postgres** (Free tier)
5. Vercel will automatically inject these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
6. To view them:
   - Go to **Settings** → **Environment Variables**
   - They'll be listed there (you can copy them for local development)

### For Local Development:
- You can use a local Postgres database, or
- Copy the values from Vercel's environment variables (they work for local too)

---

## 3. NextAuth Secret

### Where to Get:
Generate it yourself using one of these methods:

**Option 1: OpenSSL (Recommended)**
```bash
openssl rand -base64 32
```

**Option 2: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

**Option 3: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Use the output as your `NEXTAUTH_SECRET` value.

---

## 4. NextAuth URL

### For Local Development:
```
NEXTAUTH_URL=http://localhost:3000
```

### For Production (Vercel):
```
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

Replace `your-vercel-domain` with your actual Vercel deployment URL.

---

## Setup Steps

### Local Development:
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in all the values in `.env.local`
3. Make sure `.env.local` is in `.gitignore` (it should be by default)

### Production (Vercel):
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add each variable:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (generate one)
   - `NEXTAUTH_URL` (your Vercel domain)
3. `POSTGRES_URL` and `POSTGRES_PRISMA_URL` are auto-added when you create the Postgres database

---

## Quick Checklist

- [ ] Google OAuth credentials created
- [ ] Google redirect URI configured (local + production)
- [ ] Vercel Postgres database created
- [ ] NextAuth secret generated
- [ ] All environment variables added to `.env.local` (local) or Vercel (production)

---

## Troubleshooting

**"Missing or invalid environment variables" error:**
- Make sure all variables are set in `.env.local` (local) or Vercel (production)
- Check for typos in variable names
- Restart your dev server after adding variables

**Google OAuth not working:**
- Verify redirect URI matches exactly (including `http://` vs `https://`)
- Check that Google+ API is enabled in Google Cloud Console
- Make sure you're using the correct Client ID and Secret

**Database connection issues:**
- Verify `POSTGRES_URL` and `POSTGRES_PRISMA_URL` are correct
- Check that Vercel Postgres database is active
- Run `npx prisma generate` after setting up database

