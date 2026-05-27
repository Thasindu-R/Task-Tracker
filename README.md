# TaskTracker

TaskTracker is a full-stack task management web app. Sign in with Supabase Auth, organise work on a Kanban-style board, and use the dashboard to see counts and overdue tasks at a glance. The UI is built with atomic design and works on mobile and desktop.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Auth)
- Prisma (PostgreSQL)
- Tailwind CSS
- shadcn/ui

## Features

- Authentication (sign up, login, logout)
- Task board with To Do / In Progress / Done columns
- Create, edit, delete tasks with priority and due date
- Dashboard with task counts and overdue highlights
- Fully responsive (mobile and desktop)

## Local Setup

1. Clone the repo
2. `cd task-tracker`
3. `npm install`
4. Copy `.env.example` to `.env.local` and fill in values:
   - Windows: `copy .env.example .env.local`
   - macOS/Linux: `cp .env.example .env.local`
5. `npx prisma generate`
6. `npx prisma db push` (use `DIRECT_URL` as `DATABASE_URL` if the pooler connection hangs)
7. `npm run dev`
8. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Where to find |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for client-side Supabase | Supabase → Project Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-only; keep secret) | Supabase → Project Settings → API → `service_role` key |
| `DATABASE_URL` | PostgreSQL connection string (pooler, port 6543) | Supabase → Project Settings → Database → Connection string → URI (Session pooler) |
| `DIRECT_URL` | Direct PostgreSQL connection (migrations / `db push`) | Supabase → Project Settings → Database → Connection string → URI (Direct connection) |

## Project Structure

The app lives in `task-tracker/` and follows **atomic design** under `src/components/`:

```
src/components/
├── atoms/        # Smallest UI pieces (Button, Input, Badge, Label, Avatar)
├── molecules/    # Simple combinations (TaskCard, FormField, SearchBar, PriorityBadge)
├── organisms/    # Larger sections (Navbar, Sidebar, TaskBoard, TaskForm, DashboardStats)
├── templates/    # Page layouts (AuthLayout, DashboardLayout)
└── pages/        # Feature screens (LoginPage, SignupPage, DashboardPage, TasksPage)
```

| Level | Role |
| --- | --- |
| **atoms** | Single-purpose, reusable controls with no business logic |
| **molecules** | Small groups of atoms that form one UI pattern |
| **organisms** | Distinct sections of the interface (header, board, forms) |
| **templates** | Layout shells that arrange organisms on a page |
| **pages** | Route-level screens wired to hooks and API data |

Next.js App Router routes live in `app/`; shared logic is in `src/hooks/`, `src/lib/`, and `src/types/`. API routes are under `app/api/`.

## Deployment (Vercel)

1. Push the repo to GitHub
2. [vercel.com](https://vercel.com) → **New Project** → import the repo
3. Set **Root Directory** to `task-tracker`
4. Add all five environment variables from `.env.local` in Vercel project settings
5. In Supabase → **Authentication** → **URL Configuration**:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** `https://your-app.vercel.app/api/auth/callback` and `http://localhost:3000/api/auth/callback`
6. Deploy and verify login, task creation, and a clean browser console

## Known Limitations

- Kanban columns are display-only; status is changed via the edit task form (no drag-and-drop)
- `CANCELLED` status exists in the schema/API but is not shown as a board column
- Google OAuth is implemented in `useAuth` but not wired to the login UI
- No password reset / forgot-password flow
- No automated test suite
- Sign-up may require email confirmation depending on your Supabase Auth settings
- Root repo contains an extra `package-lock.json`; set Vercel root to `task-tracker` to avoid build warnings
