# the list ✦

A shared recommendation board for a small friend group.

## Quick start

### 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and paste + run the contents of `supabase-schema.sql`
3. Go to **Database → Replication** and enable Realtime for the `recommendations` table
4. Copy your project URL and anon key from **Settings → API**

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy

```bash
npm run build
```

Then upload the `dist/` folder to Vercel, Netlify, or any static host.
Set the same environment variables in your host's settings.

## How it works

- No accounts or passwords — just pick your name on first visit (saved to localStorage)
- Add recipes, music, books, links, or anything with a URL
- Heart ♥ things you like (one like per person, tracked in localStorage)
- Updates appear in real-time for everyone via Supabase Realtime
