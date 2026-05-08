# Work Log Application

A professional work time tracking application with a Next.js frontend and Express + PostgreSQL backend.

## Stack

| Layer    | Technology                               |
|----------|------------------------------------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Recharts, Zustand |
| Backend  | Node.js, Express, Prisma ORM             |
| Database | PostgreSQL                               |

---

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

Or use an existing PostgreSQL instance and set the `DATABASE_URL` in `backend/.env`.

### 2. Backend Setup

```bash
cd backend
cp .env.example .env          # edit if needed
npm install
npx prisma db push            # create schema
node prisma/seed.js           # optional: seed sample data
npm run dev                   # starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                   # starts on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## Features

- **Dashboard** — Stats cards, live timer widget, recent activity, charts
- **Work Logs** — Full CRUD, filters (search, category, status, priority, date), sortable table, CSV export
- **Reports** — Daily / weekly / monthly breakdown, category charts, CSV/print export
- **Settings** — Category management (create, edit, delete, color, icon), keyboard shortcuts, theme toggle
- **Timer** — Start/stop/pause, keyboard shortcut (Space), auto-creates log on stop

## API Endpoints

```
GET    /api/logs              List logs (with filters & pagination)
POST   /api/logs              Create log
GET    /api/logs/:id          Get single log
PUT    /api/logs/:id          Update log
DELETE /api/logs/:id          Delete log
POST   /api/logs/export       Export as CSV

GET    /api/categories        List categories
POST   /api/categories        Create category
PUT    /api/categories/:id    Update category
DELETE /api/categories/:id    Delete category

GET    /api/stats             Aggregated statistics
GET    /api/reports/daily     Daily report
GET    /api/reports/weekly    Weekly report
GET    /api/reports/monthly   Monthly report
```

## Deployment

- **Frontend** → Vercel (`npm run build` → deploy)
- **Backend** → Railway / Render / Fly.io
- **Database** → Neon / Supabase / AWS RDS (set `DATABASE_URL`)
