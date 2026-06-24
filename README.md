# AI-Triage — Student Support Centre

An AI-powered student support triage system for UK universities. Students submit queries through a clean form; Google Gemini classifies each one and routes it to the right team automatically. Staff manage cases through a protected dashboard with real-time filters, drawer details, and status updates.

---

## Features

- **AI triage** — Gemini 2.5 Flash classifies urgency, category, and disposition in under 5 seconds
- **Safeguarding detection** — crisis keywords trigger immediate escalation with emergency resources
- **Prompt injection & spam guard** — flags and blocks malicious or irrelevant submissions
- **Inline clarification flow** — if AI needs more context, it asks one follow-up question; the student answers in the same session and a single combined case is created
- **Staff dashboard** — JWT-authenticated, filterable by urgency and status, mobile-responsive
- **Case management** — staff can update status (new → in progress → resolved) from a slide-in drawer
- **Resolved case view** — separate view for closed cases with full history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 (App Router, TypeScript, Turbopack) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Base UI variant) |
| AI | Google Gemini 2.5 Flash via `@google/generative-ai` v0.24.1 |
| Database | Neon PostgreSQL (serverless) |
| ORM | Prisma 5.22.0 |
| Auth | JWT (`jose` v6) + bcrypt (`bcryptjs` v3) |
| Runtime | React 19, Node.js 18+ |

---

## App Flow

```
Student fills form
       │
       ▼
POST /api/triage
       │
       ├── Spam check ──────────────────► SpamScreen (politely blocked)
       │
       ├── Injection flag detected ─────► Escalate (staff review)
       │
       ├── Crisis keywords found ───────► CrisisScreen (999 / Samaritans shown)
       │
       └── Gemini 2.5 Flash triage
                  │
                  ├── disposition: handle_now ──► AI answer shown to student
                  │
                  ├── disposition: clarify ─────► Student answers inline
                  │                                Combined message re-triaged
                  │                                → loops back into triage
                  │
                  └── disposition: escalate ────► Case saved to DB
                                                   Visible in staff dashboard
```

**Staff dashboard flow:**

```
/login ──► JWT verified ──► /dashboard
                                 │
                                 ├── Filter pills: All / Critical / High / Medium / Low / Safeguarding / Resolved
                                 │
                                 ├── Click any row ──► Drawer opens
                                 │                        • Full case detail
                                 │                        • AI reasoning & confidence score
                                 │                        • Staff summary
                                 │                        • Status update (new → in progress → resolved)
                                 │
                                 └── Sign out ──► Cookie cleared ──► /login
```

---

## Database Schema

```prisma
model Staff {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String                          // bcrypt hash
  name      String
  role      String   @default("staff")
  createdAt DateTime @default(now())
}

model Request {
  id         String   @id @default(cuid())
  name       String
  email      String
  university String
  course     String
  year       String
  message    String   @db.Text
  createdAt  DateTime @default(now())
  case       Case?
}

model TriageResult {
  id              String   @id @default(cuid())
  category        String
  urgency         String   // low | medium | high | critical
  safeguarding    Boolean
  disposition     String   // handle_now | clarify | escalate
  confidence      Float
  reasoning       String   @db.Text
  rawAiResponse   String   @db.Text
  validatedOutput String   @db.Text
  injectionFlag   Boolean
  spamFlag        Boolean
  createdAt       DateTime @default(now())
  case            Case?
}

model Case {
  id              String       @id @default(cuid())
  status          String       @default("new")  // new | in_progress | resolved
  studentReply    String?      @db.Text
  staffSummary    String?      @db.Text
  clarifyQuestion String?      @db.Text
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  request         Request      @relation(...)
  triage          TriageResult @relation(...)
}
```

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/triage` | Run AI triage on a student submission and save the case |
| `GET` | `/api/cases` | Return all cases ordered by latest first |
| `PATCH` | `/api/cases/[id]/status` | Update case status |
| `POST` | `/api/auth/login` | Validate credentials, issue `auth_token` httpOnly cookie (24 h) |
| `POST` | `/api/auth/logout` | Clear `auth_token` cookie |
| `POST` | `/api/auth/setup` | Create the first staff account — permanently locked after first use |

---

## Installation

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier is enough)
- A [Google AI Studio](https://aistudio.google.com) API key

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ai-triage.git
cd ai-triage
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
GEMINI_API_KEY="your-google-ai-studio-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-long-random-secret-string"
```

> Generate a secure JWT secret with: `openssl rand -base64 32`

### 4. Push the database schema

```bash
npx prisma db push
```

### 5. Start the development server

```bash
npm run dev
```

The app is now running at `http://localhost:3000`.

### 6. Create the first staff account

Run this once — the endpoint locks itself permanently after first use:

```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@university.ac.uk","password":"YourPassword"}'
```

Then go to `http://localhost:3000/login` and sign in.

---

## Project Structure

```
ai-triage/
├── app/
│   ├── page.tsx                    # Student submission form
│   ├── submitted/page.tsx          # Post-submission outcome screens
│   ├── login/page.tsx              # Staff login page
│   ├── dashboard/page.tsx          # Staff case management dashboard
│   └── api/
│       ├── triage/route.ts         # AI triage — core logic
│       ├── cases/route.ts          # Fetch all cases
│       ├── cases/[id]/
│       │   └── status/route.ts     # Update case status
│       └── auth/
│           ├── login/route.ts      # Issue JWT cookie
│           ├── logout/route.ts     # Clear JWT cookie
│           └── setup/route.ts      # One-time staff account setup
├── lib/
│   └── prisma.ts                   # Prisma client singleton
├── prisma/
│   └── schema.prisma               # Database models
├── middleware.ts                   # JWT route protection
└── components/
    └── ui/                         # shadcn/ui base components
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens |
| `NEXT_PUBLIC_APP_URL` | No | Base URL (used for metadata) |

---

## Triage Categories

| Category | Examples |
|---|---|
| `academic` | Missed deadlines, grade disputes, tutor contact, plagiarism |
| `financial` | Hardship fund, fee queries, bursaries, unexpected costs |
| `visa_immigration` | CAS, right to remain, extensions — **always escalated** |
| `housing` | Tenancy disputes, deposit protection, accommodation issues |
| `health_wellbeing` | Mental health, counselling, stress, low mood |
| `other` | Anything that doesn't fit the above categories |

---

## Safeguarding Rules

These protections are enforced in code regardless of what the AI returns:

| Trigger | Action |
|---|---|
| Crisis keywords (e.g. "harm myself", "end it all") | `safeguarding: true`, `urgency: critical`, `disposition: escalate` |
| Any visa or immigration query | `disposition: escalate` — must reach a qualified adviser |
| Prompt injection pattern detected | `disposition: escalate`, `injectionFlag: true` — flagged for staff review |
| AI confidence < 0.55 on a `handle_now` result | Downgraded to `clarify` — student asked one follow-up question |

---

## Scripts

```bash
npm run dev       # Start development server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npx prisma db push       # Sync schema to database
npx prisma studio        # Open Prisma visual explorer
```

---

## Production Checklist

- [ ] Set `JWT_SECRET` to a cryptographically random value
- [ ] Ensure `NODE_ENV=production` — auth cookie becomes `Secure` automatically
- [ ] Run `npx prisma generate` after any schema changes before deploying
- [ ] The `/api/auth/setup` endpoint is permanently locked after first staff account creation
- [ ] Rotate `GEMINI_API_KEY` if it was ever exposed

---

## Submission Questions

### If this served 50 organisations and 10,000 requests a day, what in your design would you change?

The first bottleneck would be the synchronous AI call inside the POST handler. At that volume, triage needs to move into a background queue (BullMQ + Redis, or Vercel Queue) so the form submission returns instantly and Gemini runs async — the student gets a "received" confirmation while the AI works. A webhook or polling endpoint then delivers the result. This also decouples retries and rate-limit handling from the request cycle.

The database would need indices on `urgency`, `status`, `safeguarding`, and `createdAt` for the dashboard queries to stay fast. The Neon pooled connection string already helps, but at 10k req/day a dedicated connection pooler (PgBouncer) in front of Postgres becomes worthwhile.

Multi-tenancy would require a `Organisation` model with tenant IDs on every table, row-level security in PostgreSQL enforced at the DB layer (not just in application code), and per-organisation API keys and JWT signing secrets. A single shared Gemini key would hit free-tier limits immediately — each org would need its own key or the platform would need a paid quota with per-org cost tracking.

Finally, the current triage prompt is a single pass. At scale it makes sense to split into a cheap fast classifier (category + urgency) and a second richer pass only for cases routed to `handle_now`, reducing the per-request cost and latency for the majority of escalated cases.

---

### This is real students' personal and welfare data. What would you do differently for privacy and safety in a production version?

Message content should be encrypted at rest — either PostgreSQL column-level encryption or application-level encryption before writing to the database, so a DB breach does not expose raw welfare disclosures. Logs must never contain message text in plain form; structured logging should record event types and case IDs only.

A formal data retention policy is needed: cases should be automatically purged or anonymised after a defined period (e.g. 12 months) under GDPR, with a documented lawful basis for processing. The intake form needs a privacy notice explaining what is collected, why, and for how long, with a link to a full privacy policy before the student submits.

Staff access should be role-controlled with an immutable audit log — who viewed which case and when — because welfare cases are sensitive even for staff. Non-production environments (staging, local dev) should use fully anonymised seed data, never copies of real submissions. The AI call itself sends message content to Google's API; in production this requires a data processing agreement with Google and consideration of whether any content should be redacted before it leaves the organisation's infrastructure.

---

### In two or three sentences, explain how the tool decides what to escalate.

Every message is first scanned for signs of crisis or danger — words suggesting self-harm, immediate risk, or distress — and if any are found the case goes straight to a person with emergency contact numbers shown to the student at once, without waiting for the AI or asking any questions. For everything else, the AI reads the message and decides: if it can answer confidently using the approved resource library it does so directly, if the message is too vague to act on safely it asks one targeted follow-up question, and if it involves immigration or anything genuinely complex it sends the case to the staff queue. Any message that looks like spam or a deliberate attempt to manipulate the system is caught by a separate filter and handled separately, before the AI is even called.

---

## License

MIT
