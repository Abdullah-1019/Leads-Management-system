# Prompt sequence for Claude Code

How to use this: open Claude Code in the empty project folder (with `CLAUDE.md` and
`docs/PRD.md` already in place), and paste these prompts **one at a time, in order**. Review
what Claude Code produces before moving to the next prompt — commit after each working step.
Don't paste the whole file at once.

---

## Phase 0 — Analysis before any code

**Prompt 0.1**
```
Read CLAUDE.md and docs/PRD.md in this repo fully before doing anything else.

Before writing any implementation code, produce docs/ARCHITECTURE.md covering:
1. Database architecture and entity relationships
   (Application → Lead/Interview → Feedback, with ActivityLog cutting across all of them)
2. API architecture (resources, endpoints, request/response shapes)
3. Authentication & authorization strategy (JWT flow, role middleware)
4. Role/permission matrix (APPLICANT / INTERVIEWER / ADMIN × resource × action)
5. Page/route structure per role (frontend)
6. Frontend component structure (folders under client/src)
7. Backend folder structure (folders under server/src)
8. MongoDB indexes (which fields, single vs compound)

Follow the hard rules in CLAUDE.md exactly (resumeUsed as a plain string, no resume
collection, interviews always linked to an application, etc.). Do not write any
implementation code yet — stop after the document and wait for my review.
```

Review `docs/ARCHITECTURE.md`, request changes if needed, then move on.

---

## Phase 1 — Foundation

**Prompt 1.1**
```
Scaffold the project structure described in docs/PRD.md §29 (project layout) and
docs/ARCHITECTURE.md: client/ (React + TypeScript + Vite + Tailwind) and server/
(Node + Express + TypeScript). Set up package.json, tsconfig, Tailwind config, ESLint/Prettier,
and a root README stub. Don't build any features yet — just a running "hello world" on both
sides (client dev server + server health-check endpoint).
```

**Prompt 1.2**
```
Set up the backend config layer: MongoDB/Mongoose connection using MONGODB_URI, environment
variable loading, CORS configured from CORS_ORIGIN, centralized error handling middleware, and
server/.env.example with the variables from PRD §28.
```

**Prompt 1.3**
```
Implement authentication per PRD §4 and §22 (User model): User model with bcrypt password
hashing, POST /api/auth/login, GET /api/auth/me, JWT issuing/verification, an auth middleware
that protects private routes, and a role-based authorization middleware for APPLICANT /
INTERVIEWER / ADMIN. Never return passwordHash in any response.
```

**Prompt 1.4**
```
Build the frontend auth flow: login page (email + password), an auth context/hook storing the
JWT, an Axios instance that attaches the token, protected route wrapper components, and
role-aware redirect to /dashboard after login. Style it as a clean, modern SaaS login screen
per PRD §27.
```

**Prompt 1.5**
```
Write a seed script (server/src seed or a scripts/ folder) that creates the three dev users —
Abdullah (APPLICANT), Sara (INTERVIEWER), Umair (ADMIN) — with temporary passwords, per PRD
§31. Print a clear warning that these must be changed before production. Add an npm script to
run it.
```

---

## Phase 2 — Application management

**Prompt 2.1**
```
Implement the Application model and indexes exactly per PRD §22 and §24 — remember
resumeUsed is a plain string, no resumeId, no resumes collection. Add the status enum from
PRD §9.
```

**Prompt 2.2**
```
Build the Applications REST API (PRD §23): full CRUD, server-side pagination, search
(partial-match on company/title), and combinable filters (company, jobTitle, source,
resumeUsed, status, date range) per PRD §8 and §23's query param examples. DELETE should
archive (soft-delete), not hard-delete, per PRD §32 rule 7. Add duplicate detection per
PRD §25 (same company + job title + JD URL) that returns a warning, not a hard block.
```

**Prompt 2.3**
```
Build the "Applying Jobs" workflow for Abdullah (PRD §7): the Applying Jobs page with Today's
Applying, Today's Progress, and a fast Add Application form (fields per PRD §7). On save:
show a success toast, return to Today's Applications, keep + Add Application immediately
reachable, and default the date/source as described. Add "Mark Today's Applying Complete"
(PRD §7) — it must not block later edits. Surface the duplicate-detection warning from the API
in the form.
```

**Prompt 2.4**
```
Build the Jobs Applied page (PRD §8): full history grouped by date, paginated, with the
search/filter panel (company, job title, source, resume used, status, date range), all
server-side.
```

**Prompt 2.5**
```
Build the Application details page (PRD §11): all fields, createdBy/createdAt/updatedAt, an
activity timeline (status changes, conversions), and a link to the related interview if one
exists. Wire status changes and application creation into ActivityLog per PRD §32 rule 8.
```

---

## Phase 3 — Lead & interview management

**Prompt 3.1**
```
Implement the Interview model and indexes (PRD §22, §24). Build the "Convert to Lead /
Schedule Interview" flow from an application (PRD §12): it must create an interview linked via
applicationId, and must NOT duplicate company/job/JD/source/resume data — those are read from
the linked application, per PRD §32 rule 2.
```

**Prompt 3.2**
```
Build the Interviews API (PRD §23) with the status lifecycle from PRD §15
(Scheduled/Rescheduled/Completed/Cancelled/No Show). Do not auto-complete interviews after
their scheduled time.
```

**Prompt 3.3**
```
Build the "Leads & Interviews" page (PRD §13) with Upcoming / Today / Past / Pending Feedback
tabs, and the filter set from PRD §13 (company, job title, interviewer, status, date/date
range, rating, feedback status).
```

**Prompt 3.4**
```
Build the Interview details page for Sara (PRD §14), showing everything pulled from the
linked application plus interview-specific fields. Then build the optional calendar page
(PRD §21) showing upcoming/completed/cancelled interviews, click-through to details.
```

---

## Phase 4 — Feedback

**Prompt 4.1**
```
Implement the Feedback model and API (PRD §22, §23): POST /api/interviews/:id/feedback and
PATCH /api/feedback/:id, with the rating fields and recommendation enum from PRD §16.
```

**Prompt 4.2**
```
Build "Mark Interview Completed" for Sara and the Add Feedback form (PRD §16) with all fields:
five 1-5 ratings, recommendation, strengths, weaknesses, feedback notes, follow-up required,
additional notes.
```

**Prompt 4.3**
```
Implement feedback status tracking per PRD §16 — every completed interview is Feedback
Pending or Feedback Submitted — and wire it into the "Pending Feedback" tab (Phase 3) and
into Umair's dashboard count (used in Phase 5).
```

---

## Phase 5 — Admin & analytics

**Prompt 5.1**
```
Build the three role-specific dashboards from PRD §6: Abdullah's (with the "Start Today's
Applying" button), Sara's, and Umair's. Use GET /api/dashboard/summary for the numbers.
```

**Prompt 5.2**
```
Make sure ActivityLog entries are created for every important action listed in PRD §17
(application added, status changed, interview scheduled, interview completed, feedback
submitted, etc.). Build Umair's Team Activity page: chronological timeline, filterable by
user, action, date, entity, via GET /api/activity.
```

**Prompt 5.3**
```
Build the Analytics page (PRD §18) for Umair using Recharts: application analytics (per
day/week/month, by source, by resume used, by status), lead analytics, interview analytics,
and the KPI formulas exactly as given in PRD §18. Back it with GET /api/dashboard/analytics.
```

---

## Phase 6 — Polish

**Prompt 6.1**
```
Do a responsiveness and UI-states pass per PRD §27: mobile/tablet layouts (tables → cards or
horizontal scroll on small screens), loading states, empty states, error states, toasts, and
confirmation dialogs across the whole app. Keep animations minimal.
```

**Prompt 6.2**
```
Implement simple in-app notifications per PRD §20 (interview reminders for Sara, pending
feedback count for Umair, interview-scheduled notice for Abdullah). No email/WhatsApp yet.
```

**Prompt 6.3**
```
Do a security pass per PRD §28: request validation coverage, Mongo query sanitization, CORS
config check, login rate limiting, secure HTTP headers, confirm no secrets are committed, and
confirm password hashes are never returned anywhere. Then write the root README.md (setup,
scripts, env vars) and deployment instructions.
```

---

## Phase 7 — Deployment

**Prompt 7.1**
```
Prepare the app for deployment per PRD §30 Phase 7: frontend on Vercel, backend on
Render/Railway, database on MongoDB Atlas. Add any needed build configs (vercel.json, build
scripts), document the exact env vars each platform needs, and add step-by-step deployment
instructions to README.md.
```

---

## Tips while running this

- If Claude Code drifts from a hard rule (e.g. adds a resume dropdown), point it back at the
  relevant line in `CLAUDE.md` rather than re-explaining from scratch.
- Commit after each numbered prompt so you can roll back a bad step without losing earlier
  work.
- If a phase produces more than you can review at once, ask Claude Code to pause after each
  sub-piece (e.g. "model first, then API, then UI") instead of running a whole phase in one go.
