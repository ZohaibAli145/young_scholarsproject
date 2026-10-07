# Young Scholars Grammar Secondary School — Office Records

React + Material UI office records app: students, teachers, fees, salaries,
expenses, and a dashboard with pending-fee / pending-salary reports and
month-over-month revenue.

## Run it locally

```bash
npm install
npm run dev
```

It opens at `http://localhost:5173`. Without a database connected, it runs
in **demo mode** with a couple of sample rows so you can click through the UI
immediately — an orange "Database not connected" chip shows in the top bar.

## Connect the database (Supabase / PostgreSQL)

1. Create a free project at https://supabase.com.
2. Open **SQL Editor** in your Supabase project and run the contents of
   `supabase-schema.sql` (creates the 5 tables + basic security policies).
3. In Supabase, go to **Project Settings → API** and copy the **Project URL**
   and **anon public key**.
4. Copy `.env.example` to `.env` and paste them in:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. Restart `npm run dev`. The app now reads/writes real data, live across
   anyone with the link (realtime updates included).

## Deploying for the client

- Push this folder to a GitHub repo.
- Deploy on **Vercel** or **Netlify** (auto-detects Vite) — add the two
  `VITE_SUPABASE_*` environment variables in the host's dashboard.
- Takes a few minutes; you get a live URL you can hand to the school.

## Adding a login screen

Right now anyone with the link and the Supabase keys can read/write data.
For a real client handover, add Supabase Auth (email/password or magic
link) — ask and this can be scaffolded in too; the RLS policies in
`supabase-schema.sql` already gate writes to `authenticated` users, so
login is the missing piece, not a schema change.

## Project structure

```
src/
  theme.js              light/dark MUI theme (navy + gold)
  supabaseClient.js      Supabase client + "is DB configured" flag
  useTable.js             generic Supabase CRUD + realtime hook
  App.jsx                 shell: sidebar, top bar, theme toggle, page switch
  components/
    Sidebar.jsx
    StatCard.jsx
  pages/
    Dashboard.jsx
    Students.jsx
    Teachers.jsx
    Fees.jsx
    Salaries.jsx
    Expenses.jsx
```
