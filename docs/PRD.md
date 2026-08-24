# PRD — Job Application & Interview Management System

Internal web app for a 3-person team managing remote US job applications, leads, interviews,
interview feedback, ratings, and team activity — replacing a manual Excel-based workflow.

## 1. Team & permissions

### Abdullah — `APPLICANT`
- Create, view, edit, archive applications
- Enter resume name and source manually
- Update application status
- Convert applications into leads
- Schedule interviews
- View leads/interviews and application activity

### Sara — `INTERVIEWER`
- View assigned / upcoming / past interviews
- View interview details
- Mark interview as completed
- Add interview feedback and ratings
- Update interview notes
- Not responsible for Abdullah's applications

### Umair — `ADMIN`
- Full access: all applications, leads, interviews, feedback, ratings, team activity, analytics
- Edit records where appropriate
- Manage users/settings if required

Implement proper role-based access control (RBAC) throughout.

## 2. Technology stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios, TanStack Query,
React Hook Form, Zod, Lucide React, Recharts. No plain JavaScript. Clean, modern, responsive
SaaS-style interface.

**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod. Proper REST
API, separated into routes / controllers / services / models / middleware / validators /
utilities / configuration.

## 3. Database

MongoDB Atlas — schema is intentionally flexible since the application/interview/feedback
workflow has optional fields.

Collections: `users`, `applications`, `interviews`, `feedback`, `activityLogs`.

**No separate `resumes` collection.** `resumeUsed` is a plain string stored directly on the
application document, e.g. `resumeUsed: "Pre-Sales Resume"`. Do not build resume management,
resume CRUD, a resume dropdown, or a resume upload system at this stage.

## 4. Authentication

- Login page: email + password
- JWT authentication, redirect to dashboard after login
- Passwords hashed with bcrypt, never stored or returned in plain text
- All private API routes protected by auth middleware
- Role-based authorization middleware
- Password hashes never exposed in API responses

## 5. Navigation (per role)

**Abdullah:** Dashboard · Applying Jobs · Jobs Applied · Leads & Interviews · Activity

**Sara:** Dashboard · My Interviews · Upcoming Interviews · Past Interviews · Pending Feedback
· Activity

**Umair:** Dashboard · Jobs Applied · Leads & Interviews · Analytics · Team Activity

## 6. Dashboards

**Abdullah:** Applications Today/This Week/This Month/Total, Leads Generated, Upcoming
Interviews, Recent Applications, Recent Activity, and a prominent **Start Today's Applying**
button.

**Sara:** Today's Interviews, Upcoming Interviews, Completed Interviews, Pending Feedback,
Average Rating, Recent Interview Activity.

**Umair:** Applications (Today/Week/Month/Total), Leads (Total/New/Interviews
Scheduled/Interviews Completed), Feedback (Pending/Average Rating), and Team Activity from
Abdullah and Sara.

## 7. Applying Jobs workflow (core workflow)

Abdullah applies to many jobs daily and needs this to be as fast as possible:

```
Dashboard → Applying Jobs → Today's Applying → Add Application → Save
→ immediately return to today's applications → Add another application
```

**Applying Jobs page** shows: Today's Applying, Start New Application, Today's Progress
(e.g. "Applications Today: 18", progress toward a target), and the application list.

**Add Application form fields:**
- Company Name (text)
- Job Title (text)
- Job Description URL (url)
- Job Location (text, e.g. "Remote - United States")
- Job Type (optional: Full-time / Part-time / Contract / Internship / Other)
- Source (text or simple select: LinkedIn, Indeed, Jobright, RemoteHunter, Glassdoor,
  Wellfound, Company Website, Other)
- **Resume Used** — plain text input, no dropdown, e.g. "Pre-Sales Resume" (see Rule 3 below)
- Application Date — defaults to today, editable
- Notes — optional text area

**Fast entry:** on save → success toast → return to Today's Applications →
**+ Add Application** stays immediately accessible → preserve today's date and (optionally)
the previous source as defaults → no forced multi-page navigation.

**Today's Applying** table: Company / Job Title / Source / Resume / Status, each row with
View / Edit / Archive.

**Mark Today's Applying Complete** — saves a completion timestamp for the day's session.
This must **not** block Abdullah from editing applications later.

## 8. Jobs Applied (history)

Full historical application database, grouped by date, with pagination.

**Search & filters** (server-side, combinable): Company Name, Job Title, Source, Resume Used,
Status, Date Range — all support partial matching.

## 9. Application status lifecycle

```
Applied → Follow-up → Response Received → Lead → Interview Scheduled
→ Interview Completed → Offer / Rejected / Withdrawn / No Response
```

Use visually distinct status badges. Authorized users can update status.

## 10. Application CRUD

- **Create / Read / Update** (company, job title, JD URL, location, job type, source,
  resume used, application date, status, notes)
- **Delete** — prefer soft-delete/archive over permanent deletion

## 11. Application details page

Shows all application fields plus `createdBy`, `createdAt`, `updatedAt`, an **Activity
Timeline** (e.g. "added application" → "status changed" → "converted to Lead"), and the
**Related Interview** if one exists.

## 12. Lead conversion → Interview scheduling

When a company responds positively, Abdullah can **Convert to Lead / Schedule Interview**.

**No duplicate job record is created.** The application remains the single source of truth
for company, job title, JD, source, and resume used.

**Interview fields:** Application ID, Interviewer, Interview Date, Interview Time, Timezone,
Interview Type, Meeting URL, Interview Status, Notes. Company/job/source/JD/resume are pulled
automatically from the linked application — Abdullah never re-enters them.

## 13. Leads & Interviews page

Tabs: **Upcoming**, **Today**, **Past**, **Pending Feedback** (completed interviews Sara
hasn't submitted feedback for yet).

**Filters:** Company, Job Title, Interviewer, Interview Status, Date, Date Range, Rating,
Feedback Status.

## 14. Interview details

Sara sees: Company, Job Title, JD link, Source, Resume Used, Interview Date/Time/Timezone,
Meeting Link, Interview Type, Interview Status, Applicant, Original Application.

## 15. Interview status

`Scheduled` · `Rescheduled` · `Completed` · `Cancelled` · `No Show`

Do not auto-complete interviews after their scheduled time unless a reliable rule is
explicitly implemented. Sara marks interviews **Completed** manually.

## 16. Interview feedback

Shown after Sara marks an interview completed, via **Add Feedback**:

- Overall Rating (1–5)
- Technical Performance (1–5)
- Communication (1–5)
- Knowledge / Experience (1–5)
- Lead Quality (1–5)
- Recommendation: Strong Lead / Good Lead / Average Lead / Weak Lead / Poor Lead
- Strengths (text)
- Weaknesses (text)
- Feedback Notes (text)
- Follow-up Required (yes/no)
- Additional Notes (text)

Every completed interview has a feedback status: **Feedback Pending** or **Feedback
Submitted**. Umair's dashboard surfaces "Pending Feedback: N", clicking through to the list.

## 17. Activity logs & Team Activity

Log key actions (application added, status changed, interview scheduled, interview completed,
feedback submitted, etc.) with: User ID, Action, Entity Type, Entity ID, Description,
Metadata, Timestamp.

Umair's **Team Activity** page shows a chronological timeline across Abdullah and Sara,
filterable by User, Action, Date, Entity.

## 18. Analytics (Umair)

**Applications:** per day/week/month, by source, by resume used, by status.

**Leads:** total, generated per day/week/month, application → lead conversion rate.

**Interviews:** scheduled, completed, cancelled, pending feedback, average rating, completion
rate.

Built with Recharts — simple, readable charts.

**KPI formulas:**
```
Lead Conversion Rate       = Total Leads / Total Applications × 100
Interview Conversion Rate  = Total Interviews / Total Applications × 100
Interview Completion Rate  = Completed Interviews / Scheduled Interviews × 100
Average Lead Rating        = Sum of Lead Ratings / Number of Rated Leads
```

## 19. Date & timezone handling

Store interview timestamps in UTC (`scheduledAt`), with a separate `timezone` field (e.g.
`"Asia/Karachi"`). Display converted to the viewing user appropriately. Application dates
respect the user's local/working date.

## 20. Notifications (initial scope: in-app only)

- Sara: "Interview today at 8:00 PM with ABC Technologies."
- Umair: "3 interviews are waiting for feedback."
- Abdullah: "Interview scheduled for ABC Technologies."

Email/WhatsApp notifications are a future feature, not part of this build.

## 21. Optional calendar page

Displays upcoming / completed / cancelled interviews; clicking one opens its details.

## 22. Database models

```
User
  _id, name, email, passwordHash, role, avatar, isActive, createdAt, updatedAt
  role ∈ { APPLICANT, INTERVIEWER, ADMIN }

Application
  _id, companyName, jobTitle, jobDescriptionUrl, location, jobType, source,
  resumeUsed (string, no resumeId), applicationDate, status, notes,
  createdBy, createdAt, updatedAt, archivedAt

Interview
  _id, applicationId, interviewerId, scheduledAt (UTC), timezone, interviewType,
  meetingUrl, status, notes, createdAt, updatedAt

Feedback
  _id, interviewId, submittedBy, overallRating, technicalRating, communicationRating,
  knowledgeRating, leadQualityRating, recommendation, strengths, weaknesses, notes,
  followUpRequired, submittedAt, updatedAt

ActivityLog
  _id, userId, action, entityType, entityId, description, metadata, createdAt
```

## 23. API structure

```
Auth        POST /api/auth/login
            POST /api/auth/logout
            GET  /api/auth/me

Applications GET    /api/applications           (pagination, search, filters — see below)
             POST   /api/applications
             GET    /api/applications/:id
             PATCH  /api/applications/:id
             DELETE /api/applications/:id        (soft-delete/archive)

Interviews  GET   /api/interviews
            POST  /api/interviews
            GET   /api/interviews/:id
            PATCH /api/interviews/:id

Feedback    POST  /api/interviews/:id/feedback
            PATCH /api/feedback/:id

Dashboard   GET /api/dashboard/summary
            GET /api/dashboard/analytics

Activity    GET /api/activity

Users       GET   /api/users
            PATCH /api/users/:id
```

**Query params example:**
```
GET /api/applications?page=1&limit=20
GET /api/applications?search=google
GET /api/applications?company=google&status=Applied&source=LinkedIn
GET /api/applications?startDate=2026-08-01&endDate=2026-08-24
```

## 24. MongoDB indexes

- **applications:** companyName, jobTitle, applicationDate, status, source, createdBy,
  resumeUsed
- **interviews:** applicationId, interviewerId, scheduledAt, status
- **activityLogs:** userId, createdAt

Use compound indexes where it makes sense.

## 25. Duplicate detection

When adding an application, check same company + same job title + same job URL. If a
possible duplicate exists, warn Abdullah ("Possible duplicate application found...") but
let him proceed if intentional.

## 26. Application status history

Don't lose status-change history — track it via `ActivityLog` or a dedicated status-history
structure, and surface it in the application's activity timeline.

## 27. UI & responsiveness

Modern SaaS dashboard: sidebar + top nav, cards, tables, responsive forms, modals, search
bars, filters, pagination, status badges, toasts, confirmation dialogs, loading/empty/error
states. Avoid excessive animation — prioritize usability and speed.

Must work on desktop, laptop, tablet, and mobile: tables become cards or horizontally
scrollable on small screens, forms stay easy to use, "Add Application" stays reachable.

## 28. Security

bcrypt password hashing, JWT auth, RBAC, request validation, MongoDB query sanitization,
CORS, login rate limiting, secure HTTP headers, environment variables (never committed),
proper error handling, no sensitive info in frontend source.

**Env vars**
```
# server/.env
MONGODB_URI=
JWT_SECRET=
CORS_ORIGIN=
PORT=

# client/.env
VITE_API_URL=
```
Provide `.env.example` files for both; never commit real credentials.

## 29. Project structure

```
project/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── context/
│       └── features/
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── validators/
│       ├── utils/
│       └── types/
├── README.md
└── .gitignore
```

## 30. Development phases

1. **Foundation** — React/TS/Vite/Tailwind, Express/TS/MongoDB, JWT auth, user roles
2. **Application Management** — dashboard, Today's Applying, Add Application, CRUD, Jobs
   Applied, search/filter/pagination, statuses
3. **Lead & Interview Management** — convert-to-lead, schedule interview, interview lists
   (upcoming/past), details, calendar
4. **Feedback** — mark completed, feedback form, ratings, recommendation, pending feedback
5. **Admin & Analytics** — Umair's dashboard, team activity, application/lead/interview
   analytics, conversion rates
6. **Polish** — responsive UI, loading/error states, notifications, duplicate detection,
   activity timeline, security, performance
7. **Deployment** — frontend on Vercel, backend on Render/Railway, database on MongoDB Atlas

## 31. Seed data

Dev users: Abdullah (APPLICANT), Sara (INTERVIEWER), Umair (ADMIN) with temporary dev
passwords (must be changed before production). Plus sample applications, interviews,
feedback, and activity logs so dashboards can be tested immediately.

## 32. Business rules (non-negotiable)

1. An interview must always be connected to an existing application.
2. Never duplicate company/job/JD/resume data when creating an interview — pull it from the
   application.
3. `resumeUsed` is manually entered plain text. No resume dropdown, management, or collection.
4. Only authorized users can access or modify information (RBAC everywhere).
5. Sara gives interview feedback but does not manage Abdullah's application workflow.
6. Umair can see the entire system.
7. Prefer archiving over permanently deleting important records.
8. All important actions are logged.

## 33. Explicitly out of scope for now

Keep the architecture extensible for these, but do not build them yet: LinkedIn / Indeed /
Jobright integrations, automatic job importing, email/Gmail integration, WhatsApp
notifications, Google Calendar integration, automated interview reminders, AI lead-quality
analysis, AI job/resume matching, automated reports, resume file management.

## 34. Final deliverables checklist

React + TypeScript frontend with Tailwind · Node/Express + TypeScript backend ·
MongoDB/Mongoose · JWT auth + RBAC · Abdullah's application workflow · daily application
tracking · Jobs Applied history with search/filter/pagination · application CRUD · lead
conversion · interview scheduling · Sara's interview dashboard · interview feedback/ratings ·
Umair's admin dashboard · team activity · analytics · activity logs · duplicate detection ·
responsive design · seed data · `.env.example` · README · deployment instructions.
