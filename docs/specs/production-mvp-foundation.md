# Production MVP Foundation: Vercel + Supabase + persisted founder workspace

## Context

The current AI-CFO Second Opinion app is a working Next.js prototype for Russian-speaking founders and CEOs. It demonstrates the founder dashboard, paid diagnostic pipeline, data pack upload/mapping, deterministic finance analysis, owner brief, and AI second-opinion chat.

The next product step is to turn the localhost prototype into a private production MVP that can be sent to a first client as a link. The first production user is a founder/CEO. Role-based collaboration, expert admin panels, consultant workspaces, and enterprise SSO are intentionally deferred.

## Current State

Verified on 2026-07-15.

| Area | Current implementation | Gap for production |
|---|---|---|
| Deployment | Local Next.js dev server, GitHub repo pushed | Needs Vercel production deployment |
| Auth | No auth | Needs email magic link |
| Database | Prisma schema exists, app still uses sample data | Needs Supabase Postgres persistence |
| File upload | Browser-side XLSX/CSV preview and mapping UI | Needs Supabase Storage upload and persisted metadata |
| Finance engine | Deterministic rules over sample case | Needs case-scoped persisted inputs |
| AI chat | `/api/ai/chat` with mock/OpenAI-compatible provider | Needs persisted chat messages per case and provider config in env |
| Owner brief | Static generated from sample analysis | Needs persisted analysis result and brief record |
| Security | Local prototype only | Needs RLS, storage access rules, env isolation, data retention policy |

## Product Decisions

| Decision | Choice | Rationale |
|---|---|---|
| First deployment | Vercel | Fastest path for Next.js public/private link from GitHub |
| Backend bundle | Supabase | Postgres, magic link auth, storage, and RLS in one product |
| First user | Founder/CEO | Matches wedge and avoids premature role complexity |
| Auth | Email magic link | No passwords, no SSO, low support burden |
| File storage | Supabase Storage | Simple path from authenticated user to private Excel files |
| AI provider | OpenAI-compatible adapter with mock fallback | Lets production run before Qwen3/vLLM infrastructure is stable |

## Proposed Architecture

```text
GitHub main
  -> Vercel project
      -> Next.js App Router
      -> Server actions / API routes
      -> AI provider adapter

Supabase project
  -> Auth magic link
  -> Postgres
  -> Storage bucket: case-files
  -> Row Level Security

AI runtime
  -> MOCK_AI=true fallback
  -> hosted OpenAI-compatible endpoint
  -> later Qwen3 via vLLM/llama.cpp
```

## Scope

### Included in Production MVP Foundation

1. Vercel deployment from GitHub `main`.
2. Supabase project configuration.
3. Magic-link authentication.
4. Founder-only access model.
5. Persisted companies/cases.
6. Persisted uploaded files metadata.
7. Private Supabase Storage bucket for source files.
8. Persisted mapping profiles and normalized finance model.
9. Persisted analysis results, evidence items, owner briefs, and chat messages.
10. Case-scoped AI chat that uses persisted context.
11. Environment variable strategy for `mock`, hosted OpenAI-compatible, and later Qwen3/vLLM.
12. Minimal audit/security controls for first paid pilots.

### Out of Scope

- CFO/consultant/admin roles.
- Expert reviewer internal dashboard.
- Billing automation and invoices.
- 1C, bank, ERP, marketplace integrations.
- Fine-tuning Qwen3.
- Multi-tenant organizations with multiple users.
- SSO/SAML.
- Real-time collaborative editing.

## Implementation Details

### Environment Variables

Production Vercel env:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
SUPABASE_STORAGE_BUCKET=case-files
MOCK_AI=false
AI_MODEL=
OPENAI_COMPATIBLE_BASE_URL=
OPENAI_COMPATIBLE_API_KEY=
```

Preview/staging env:

```bash
MOCK_AI=true
SUPABASE_STORAGE_BUCKET=case-files-preview
```

### Supabase Storage

Bucket:

```text
case-files
```

Storage layout:

```text
/users/{userId}/cases/{caseId}/raw/{uploadedFileId}/{originalName}
/users/{userId}/cases/{caseId}/exports/{briefId}.pdf
```

Rules:

1. User can only read/write files under their own `userId`.
2. Service role can process files server-side.
3. Public access is disabled.
4. Signed URLs expire within 15 minutes.

### Database Model

The current Prisma schema should be moved from local SQLite assumptions to Supabase Postgres. JSON string columns used for SQLite compatibility can become `Json` once Postgres is active.

Required models:

```prisma
model UserProfile {
  id        String   @id
  email     String   @unique
  fullName  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Company {
  id            String   @id @default(cuid())
  ownerId       String
  name          String
  industry      String
  annualRevenue Float?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Case {
  id          String   @id @default(cuid())
  ownerId     String
  companyId   String
  title       String
  status      String
  decisionQuestion String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Existing models to keep and make case-scoped:

```text
UploadedFile
MappingProfile
FinancialInput
WorkingCapitalAging
DebtSchedule
CapexPlan
SalesChannelMetric
EvidenceItem
AnalysisResult
```

New models:

```prisma
model OwnerBrief {
  id             String   @id @default(cuid())
  caseId         String
  status         String
  executiveVerdict String
  markdown       String
  confidence     Int
  reviewedByExpert Boolean @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model ChatMessage {
  id        String   @id @default(cuid())
  caseId    String
  role      String
  content   String
  model     String?
  provider  String?
  createdAt DateTime @default(now())
}
```

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/cases` | `POST` | Create case for authenticated founder |
| `/api/cases/:id` | `GET` | Load case workspace |
| `/api/cases/:id/uploads` | `POST` | Upload file to Supabase Storage and create `UploadedFile` |
| `/api/cases/:id/uploads/:fileId/mapping` | `POST` | Persist column mapping |
| `/api/cases/:id/analyze` | `POST` | Run deterministic finance engine |
| `/api/cases/:id/chat` | `POST` | Ask AI against persisted case context |
| `/api/cases/:id/brief` | `POST` | Generate/persist owner brief |

### Frontend Routes

| Route | Production behavior |
|---|---|
| `/login` | Magic link email entry |
| `/auth/callback` | Supabase auth callback |
| `/` | Redirect authenticated user to `/cases` |
| `/cases` | Founder case list |
| `/cases/new` | Create paid diagnostic case |
| `/cases/[id]/upload` | Upload data pack and mapping |
| `/cases/[id]/analyze` | Run analysis and review data quality |
| `/cases/[id]/report` | Owner brief |

### AI Runtime

Behavior:

```text
if AI endpoint works:
  use OpenAI-compatible provider
else:
  return controlled fallback answer with "AI endpoint unavailable"
```

The AI receives:

- case profile;
- normalized metrics;
- finance-engine outputs;
- evidence items;
- missing data;
- chat history for the case.

The AI must not receive:

- full raw Excel files;
- service role keys;
- unrelated users' data;
- unbounded database dumps.

## Milestones

### Milestone 1: Deployable Shell

1. Create Vercel project from GitHub.
2. Create Supabase project.
3. Add env vars to Vercel.
4. Add `/login` and `/auth/callback`.
5. Protect case routes.

Acceptance:

1. Unauthenticated user visiting `/cases` is redirected to `/login`.
2. Magic link signs user in.
3. Authenticated user reaches an empty case list.
4. Vercel production URL is shareable.

### Milestone 2: Persisted Cases

1. Add Supabase/Postgres Prisma connection.
2. Add `UserProfile`, `Company`, and production `Case` models.
3. Persist case creation from `/cases/new`.
4. Replace sample case list with database-backed case list.

Acceptance:

1. User can create a case.
2. Case remains after refresh and logout/login.
3. User cannot see another user's case.

### Milestone 3: Persisted Data Pack

1. Upload file to private Supabase Storage.
2. Store `UploadedFile` metadata.
3. Persist sheet names, detected columns, preview rows.
4. Persist `MappingProfile`.
5. Convert mapped data into normalized finance tables.

Acceptance:

1. User uploads `.xlsx` into BDR/P&L slot.
2. File appears as received after refresh.
3. Mapping survives refresh.
4. Raw file is not publicly accessible.

### Milestone 4: Case-Scoped Analysis and Brief

1. Run finance engine from persisted normalized data.
2. Persist `AnalysisResult`.
3. Persist `EvidenceItem`.
4. Generate `OwnerBrief`.
5. Render report from persisted result.

Acceptance:

1. User runs analysis for a real uploaded case.
2. Report page uses database result, not sample data.
3. Evidence table links each conclusion to uploaded file/source reference.

### Milestone 5: Case-Scoped AI Chat

1. Add `ChatMessage`.
2. Route `/api/cases/:id/chat` builds prompt from persisted case context.
3. Store user and assistant messages.
4. Keep existing provider fallback.

Acceptance:

1. Chat history survives refresh.
2. Answer references the active case.
3. If AI provider is unavailable, user receives controlled fallback instead of a crash.

## Testing Plan

| Layer | What | Count |
|---|---|---:|
| Unit | Finance mapping dictionary and normalization | +8 |
| Unit | AI provider fallback behavior | +4 |
| Integration | Magic link session guard for protected routes | +3 |
| Integration | Case create/read isolation by user | +4 |
| Integration | Upload file metadata + mapping persistence | +5 |
| Integration | Run analysis from persisted normalized input | +3 |
| E2E | Login -> create case -> upload file -> map -> analyze -> chat -> report | +1 |

## Security Requirements

1. Supabase RLS is enabled on all user-owned tables.
2. Storage bucket is private.
3. Service role key is never exposed to client bundle.
4. AI prompts include only current case context.
5. Uploaded file signed URLs expire in 15 minutes or less.
6. Production env uses `MOCK_AI=false`; preview may use `MOCK_AI=true`.
7. Logs must not include raw financial table contents.

## Rollback Plan

1. Vercel rollback to previous deployment.
2. Disable AI provider by setting `MOCK_AI=true`.
3. Revoke Supabase anon/service keys if leaked.
4. Keep migrations additive during MVP; rollback by reverting deployment and restoring previous schema backup.
5. Raw files remain in private storage and can be deleted by case ID.

## Effort Estimate

| Component | Estimate |
|---|---:|
| Vercel + Supabase setup | 0.5 day |
| Auth + route protection | 1 day |
| Prisma/Postgres schema migration | 1 day |
| Persisted case CRUD | 1 day |
| Supabase Storage upload | 1 day |
| Mapping persistence + normalized model write | 2 days |
| Case-scoped finance analysis | 1.5 days |
| Case-scoped AI chat persistence | 1 day |
| Owner brief persistence | 1 day |
| Security/RLS/testing pass | 1.5 days |
| Total | ~11.5 engineering days |

## Files Reference

| File | Change |
|---|---|
| `app/layout.tsx` | Add auth-aware shell or redirect behavior |
| `app/cases/new/page.tsx` | Persist case creation instead of sample navigation |
| `app/cases/[id]/upload/page.tsx` | Load persisted case/upload state |
| `src/components/DataPackUploader.tsx` | Replace browser-only state with API persistence |
| `app/api/ai/chat/route.ts` | Keep global demo route or redirect to case-scoped route |
| `src/lib/ai/provider.ts` | Keep provider abstraction and fallback |
| `src/lib/ai/owner-chat.ts` | Build prompt from persisted case context |
| `src/lib/data/data-pack.ts` | Keep slots and mapping dictionary |
| `src/lib/finance/analysis.ts` | Accept persisted normalized inputs |
| `prisma/schema.prisma` | Move to Postgres-ready production schema |
| `.env.example` | Add Supabase/Vercel production env vars |

## Definition of Done

1. Production Vercel URL is live.
2. Founder can sign in by email magic link.
3. Founder can create one case.
4. Founder can upload at least one `.xlsx` into a data pack slot.
5. Uploaded file is stored privately in Supabase Storage.
6. Mapping profile persists after refresh.
7. Analysis runs from persisted normalized data.
8. Chat answer uses active case context.
9. Owner brief renders from persisted analysis.
10. Another authenticated user cannot access the case, upload, chat, or brief.
11. `npm run typecheck`, `npm run build`, and Prisma validation pass.

## Related

- `docs/data-ingestion-architecture.md`
- `docs/ai-runtime.md`
- `docs/specs/first-revenue-founder-brief.md`
