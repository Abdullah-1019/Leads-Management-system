# Company CRM — Job Application & Interview Management System

## What this is
An internal full-stack web app for a 3-person team that replaces a manual, Excel-based
workflow for tracking job applications, leads, interviews, feedback, and team activity.

It should feel like a lightweight internal ATS + Job Application CRM — not a commercial product.
Do not over-engineer it.

## Team & roles
- **Abdullah — `APPLICANT`**: searches jobs, logs applications, updates them as companies
  respond, converts applications into leads/interviews.
- **Sara — `INTERVIEWER`**: views assigned interviews, conducts them, marks them completed,
  submits feedback and ratings. Sara does **not** manage Abdullah's applications.
- **Umair — `ADMIN`**: full visibility — all applications, leads, interviews, feedback,
  analytics, team activity. Can edit records and manage users/settings.

## Tech stack
**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios, TanStack Query,
React Hook Form, Zod, Lucide React, Recharts. No plain JavaScript.

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod.
Layered as: routes → controllers → services → models, plus middleware, validators, utils, config.

**Database:** MongoDB Atlas. Collections: `users`, `applications`, `interviews`, `feedback`,
`activityLogs`. No `resumes` collection.

## Hard rules — do not violate these
1. `resumeUsed` is a **plain string** on the Application document (e.g. `"Pre-Sales Resume"`).
   Never build a resume collection, `resumeId`, dropdown, or resume management/upload system.
   Abdullah types the resume name manually.
2. An Interview always references an existing Application via `applicationId`. Company, job
   title, JD link, source, and resume come from the linked application — never re-entered.
3. Sara's surface is interviews + feedback only — she is not given application-management
   permissions.
4. Prefer archive / soft-delete over hard delete for Applications.
5. Every important action (application added, status changed, interview scheduled, interview
   completed, feedback submitted, etc.) gets an `ActivityLog` entry.
6. Interview timestamps are stored in UTC in `scheduledAt`, plus a separate `timezone` field
   (e.g. `"Asia/Karachi"`). Convert for display.
7. All list endpoints (applications, interviews, activity) use server-side pagination and
   filtering. Never ship a full collection to the frontend.
8. No secrets committed to git — use `.env.example` files, real values stay local.
9. Passwords are bcrypt-hashed; password hashes are never returned by the API.

## Where the detail lives
- Full requirements, data model, and API spec: `docs/PRD.md`
- The exact sequence of prompts to build this with Claude Code, phase by phase:
  `docs/PROMPTS.md`

## Working style in this repo
- Build strictly phase by phase, per `docs/PROMPTS.md` — don't jump ahead to a later phase's
  features while implementing an earlier one.
- Before writing code for a new phase, briefly restate what you're about to build and check
  it against the hard rules above and the relevant PRD section.
- When a request conflicts with a hard rule above (e.g. "add a resume dropdown"), flag the
  conflict instead of silently implementing it.
