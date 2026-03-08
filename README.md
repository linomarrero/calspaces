# CalSpaces

Marketing site for **CalSpaces** — your time, restructured.

- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Supabase
- **Deploy:** Vercel

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).

2. In the SQL editor, run:

```sql
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

alter table waitlist enable row level security;

create policy "Allow anonymous insert"
  on waitlist for insert
  to anon
  with check (true);

create policy "Allow anonymous count"
  on waitlist for select
  to anon
  using (true);
```

3. In **Settings → API**: copy **Project URL** and **anon public** key.

4. Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deploy on Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Add the same env vars in **Project → Settings → Environment Variables**:  
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Deploy. The site will build and run without Supabase if env vars are missing (waitlist count shows 0, form shows an error on submit).

## Google Calendar integration

The product is designed to integrate with **Google Calendar**. When you build the CalSpaces app (backend or client):

1. **Google Cloud:** Create a project and enable the [Google Calendar API](https://developers.google.com/calendar/api/guides/overview).
2. **OAuth 2.0:** Use the Calendar API with OAuth consent so users can connect their Google account and grant read/write access to their calendars.
3. **Scopes:** Typical scopes for two-way sync: `https://www.googleapis.com/auth/calendar`, `https://www.googleapis.com/auth/calendar.events`.
4. **Env (for the app):** Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and optionally `GOOGLE_CALENDAR_REDIRECT_URI` to your app’s environment (not needed for this marketing site).

This repo is the marketing site only; the actual sync logic lives in your app. The site copy and features section already position CalSpaces as Google Calendar–integratable.

## License

Proprietary.
