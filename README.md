# Company CRM

Internal job application & interview management system for a 3-person team — replaces a
manual, Excel-based workflow for tracking job applications, leads, interviews, feedback, and
team activity.

- `client/` — React + TypeScript + Vite + Tailwind CSS frontend
- `server/` — Node + Express + TypeScript backend (MongoDB via Mongoose)
- `docs/` — product requirements (`PRD.md`), architecture (`ARCHITECTURE.md`), the hard rules
  (`CLAUDE.md`), and the build prompt sequence (`PROMPTS.md`)

## Roles

- **Applicant** — logs applications, tracks status, converts applications into leads/interviews.
- **Interviewer** — views assigned interviews, marks them completed, submits feedback.
- **Admin** — full visibility: all applications, leads, interviews, feedback, analytics, team activity.

## Prerequisites

- Node.js 20+
- A MongoDB connection string (MongoDB Atlas or a local instance)

## Setup

```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Configure environment variables (see below)
cp server/.env.example server/.env
cp client/.env.example client/.env
# then fill in the real values

# 3. Seed the three dev users (requires MONGODB_URI to be reachable)
cd server && npm run seed

# 4. Run both apps in development (from their respective folders, in separate terminals)
cd server && npm run dev   # http://localhost:4000
cd client && npm run dev   # http://localhost:5173
```

The seed script creates three accounts, all with the temporary password `ChangeMe123!` —
**change these before any real/production use**:

| Role | Email |
|---|---|
| Applicant | `abdullah@companycrm.dev` |
| Interviewer | `sara@companycrm.dev` |
| Admin | `umair@companycrm.dev` |

## Environment variables

**`server/.env`**

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (Atlas `mongodb+srv://...` or local `mongodb://...`) |
| `JWT_SECRET` | Secret used to sign/verify auth tokens — use a long random string |
| `CORS_ORIGIN` | Allowed frontend origin(s), comma-separated (e.g. `http://localhost:5173`) |
| `PORT` | Port the API listens on (default `4000`) |

**`client/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (e.g. `http://localhost:4000`) |

Never commit real values for these — only the `.env.example` files (with empty/placeholder
values) are tracked in git.

## Scripts

**`server/`**

| Script | Purpose |
|---|---|
| `npm run dev` | Start the API in watch mode (`tsx watch`) |
| `npm run build` | Type-check and compile to `dist/` |
| `npm start` | Run the compiled build (`dist/server.js`) |
| `npm run seed` | Create/update the three dev users |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

**`client/`**

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Preview a production build locally |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

## Security notes

- Passwords are bcrypt-hashed; password hashes are never returned by any API response
  (stripped globally via the `User` model's `toJSON` transform).
- Authentication is JWT-based (`Authorization: Bearer <token>`); every route except
  `POST /api/auth/login` requires a valid token, and role-based authorization is enforced
  per-route.
- Request bodies/query strings are validated with Zod schemas before touching the database;
  request bodies and route params are additionally sanitized to strip Mongo operator keys
  (`$...`) and dotted paths as defense-in-depth.
- `POST /api/auth/login` is rate-limited (10 attempts / 15 minutes per IP).
- Secure HTTP headers are set via `helmet`; CORS is restricted to `CORS_ORIGIN`.

## Deployment

Target setup: frontend on **Vercel**, backend on **Render** (or Railway), database on
**MongoDB Atlas**. Deploy the backend first — the frontend needs its live URL.

### 1. MongoDB Atlas

Already in use during development. For production:

- Confirm **Network Access** allows connections from your backend host. Render's free tier
  doesn't have a fixed outbound IP, so the simplest option is allowing `0.0.0.0/0` (any IP) —
  acceptable here since the connection is still authenticated (username/password) and this is
  a small internal tool; a paid Render plan with a static outbound IP lets you scope this down
  instead.
- Use a dedicated database user for production, not a personal/admin Atlas login.

### 2. Backend — Render

1. New **Web Service** → connect this repo.
2. **Root Directory**: `server`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. Add environment variables (Render dashboard → Environment):

   | Variable | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string (different from any dev value) |
   | `CORS_ORIGIN` | your Vercel URL, e.g. `https://your-app.vercel.app` — update after step 3 |
   | `PORT` | Render sets this automatically; leave unset or match Render's provided value |

6. Deploy, then note the resulting service URL (e.g. `https://company-crm-api.onrender.com`) —
   the frontend needs it next. Confirm `GET /api/health` responds on that URL.
7. Run the seed script once against production (locally, with `MONGODB_URI` pointed at Atlas):
   `cd server && npm run seed` — then **change the three dev passwords immediately** through
   the app; they're only meant as temporary placeholders.

### 3. Frontend — Vercel

1. New Project → import this repo.
2. **Root Directory**: `client` (Vercel auto-detects the Vite framework preset from there;
   `client/vercel.json` adds the SPA rewrite so client-side routes like `/applications/:id`
   don't 404 on a direct load/refresh).
3. Environment variable:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | the Render backend URL from step 2.6 |

4. Deploy, then note the resulting URL (e.g. `https://your-app.vercel.app`).

### 4. Close the loop

Go back to Render and set `CORS_ORIGIN` to the real Vercel URL from step 3 (comma-separate
multiple origins if you need both a production and a preview domain), then redeploy the
backend so the new CORS setting takes effect. Log in from the deployed frontend to confirm
end-to-end connectivity.
