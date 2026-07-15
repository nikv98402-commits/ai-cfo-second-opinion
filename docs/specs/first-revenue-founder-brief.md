---
status: design-reviewed
github_issue: https://github.com/nikv98402-commits/ai-cfo-second-opinion/issues/9
created_at: 2026-07-15
eng_reviewed_at: 2026-07-15
design_reviewed_at: 2026-07-15
source_docs:
  - docs/product-spec.md
  - docs/russian-founder-gtm.md
  - DESIGN.md
---

# Spec: First-Revenue Founder Brief MVP

## Context

The project already has a working AI-CFO prototype, but it is still closer to a demo than a sellable first-revenue workflow. The CEO/GTM review changed the product priority: for Russian-speaking founders, the paid wedge is not a generic AI chat or a finance dashboard, but an independent owner-side second opinion with evidence, data quality, red flags, questions for the finance team, and expert-review status.

This spec turns that GTM decision into an executable implementation epic. The goal is to make the product usable for 5 paid diagnostics at 75-150k RUB each, delivered in 7-14 days, while keeping the path to SaaS repeatability.

## Current State

Verification date: 2026-07-15.

| Area | Current state | Gap |
|---|---|---|
| App shell | Next.js app with dashboard, case creation, upload, analyze, and report routes | Routes use sample data and do not persist a paid diagnostic workflow |
| Dashboard | `app/page.tsx:1-111` renders sample cases and static chart previews | No paid pilot pipeline, diagnostic status, data-request status, or owner brief lifecycle |
| Upload | `app/cases/[id]/upload/page.tsx:1-52` renders manual fields and a file input | File input does not parse/store files; no data pack checklist, evidence trail, or data quality score |
| Report | `app/cases/[id]/report/page.tsx:1-102` renders red flags, maturity, hiring, questions, Markdown export | No 8-12 page founder brief structure, expert review status, diagnostic offer, or evidence drilldown |
| Analysis engine | `src/lib/finance/analysis.ts:10-73` calculates deterministic red flags from `sampleInputs` | No structured separation of verified fact, calculated metric, hypothesis, and action |
| Rules | `src/lib/finance/rules.ts` covers liquidity, profitability, leverage, CAPEX, debt, working capital, maturity | Rules produce text evidence, but not source references, confidence, or owner-facing decision cards |
| Types | `src/lib/finance/types.ts:22-155` defines case, financial input, red flags, maturity, hiring, analysis result | No models for diagnostic offer, uploaded documents, data quality checks, evidence items, expert review |
| Persistence | `prisma/schema.prisma:10-92` has `Case`, `FinancialInput`, `AnalysisResult` | Missing `DiagnosticProject`, `UploadedDocument`, `DataQualityCheck`, `EvidenceItem`, `FounderBrief`, `ExpertReview` |
| GTM strategy | `docs/russian-founder-gtm.md` defines first paid diagnostic, monthly owner brief, trigger review | Strategy is not translated into app states, data model, or implementation tasks |

## Proposed Change

Build the first-revenue founder brief workflow around one primary paid product:

> Founder Financial Second Opinion: a 7-14 day diagnostic for Russian-speaking founders of 0.5-5B RUB companies, priced at 75-150k RUB, producing an evidence-backed owner brief and questions for the finance team.

The implementation should add a real diagnostic workflow:

1. Create a diagnostic project for a company and paid offer type.
2. Collect the required data pack through checklist + manual upload metadata.
3. Parse/store structured financial inputs when possible.
4. Run data quality checks before analysis.
5. Generate an evidence-backed owner brief.
6. Mark expert review status.
7. Export the founder brief and use it in sales delivery.

## Engineering Review Verdict

Status: cleared with required amendments folded into this spec.

Key engineering decisions:

1. Keep SQLite and Prisma for this prototype, but treat enum-like fields as string columns validated by TypeScript/Zod because SQLite will not enforce product-state contracts for us.
2. Store uploaded-file metadata in this epic, not raw files. Raw file retention, encryption, deletion SLA, and object storage are separate security work.
3. Use server actions or route handlers as the mutation boundary. UI pages must not import Prisma directly.
4. Add a test runner before adding the diagnostic engine tests; current `package.json` has `typecheck`, `lint`, and `build`, but no `test` script.
5. Keep the existing `/cases/...` prototype routes working until `/diagnostics/...` reaches parity.

Critical gaps found and resolved in this revision:

| Gap | Risk | Resolution |
|---|---|---|
| Status fields were plain strings with no validation boundary | Invalid lifecycle states can enter the database silently | Add shared TypeScript constants, Zod schemas, and transition helper |
| File upload behavior was ambiguous | Implementation could accidentally store sensitive raw financial files without policy | Metadata-only for this epic; raw storage explicitly out of scope |
| No server-side data-access boundary | Pages/actions could couple UI directly to Prisma and make later auth/RBAC harder | Add `src/lib/diagnostics/repository.ts` and server actions |
| Tests were specified but no runner exists | Acceptance criteria could not be executed as written | Add Vitest setup to this epic |
| Evidence model lacked validation rules | High-risk conclusions could ship without proof | Add explicit validation gate before brief generation |

## Design Review Verdict

Initial score: 6/10. Final score after amendments: 8.5/10.

The plan is structurally strong, but before this review it over-specified backend workflow and under-specified the founder-facing trust experience. For a paid diagnostic, the UI must make the founder feel: "This is a serious confidential financial review, I know what is missing, I know what will be delivered, and I can use the brief in a real conversation with my finance team."

Design decisions added:

1. `/diagnostics` is a paid diagnostic pipeline, not a generic dashboard.
2. `/diagnostics/new` must sell/confirm the paid offer in product language before collecting fields.
3. `/data-pack` must feel like a calm due-diligence checklist, not a technical upload form.
4. `/quality` must translate data issues into decision confidence, not show abstract validation errors.
5. `/brief` must be an executive document with a sticky summary rail and evidence drilldowns.
6. Expert review is a visible trust badge near the executive verdict.
7. Russian copy is primary and must avoid shame or "financial literacy classroom" tone.

Design scorecard:

| Dimension | Before | After | Fix |
|---|---:|---:|---|
| Information architecture | 6 | 9 | Added paid diagnostic pipeline, stepper, and screen hierarchy |
| Founder emotional journey | 5 | 8 | Added trust cues, confidentiality copy, delivery promise, and non-shaming data gaps |
| Visual hierarchy | 6 | 8 | Added page-level layout rules, sticky summary rail, and evidence drilldowns |
| Interaction states | 5 | 8 | Added empty/loading/error/partial/success states per route |
| AI/trust design | 6 | 9 | Added fact/hypothesis/evidence language and expert-review badge rules |
| Responsive/accessibility | 6 | 8 | Added mobile route behavior and non-color status requirements |
| Content quality | 5 | 9 | Added Russian UI copy rules and concrete labels |

Unresolved design decisions: none for this epic. Visual exploration can continue later, but this plan is implementable.

## Child Issues

| # | Title | Priority | Effort | Dependencies |
|---|---|---:|---:|---|
| 1 | Add diagnostic project and paid-offer data model | Critical | 1-2 days | None |
| 2 | Build founder data pack checklist and upload metadata workflow | Critical | 2-3 days | #1 |
| 3 | Add data quality score and evidence item model | Critical | 2-3 days | #1, #2 |
| 4 | Generate owner brief from analysis + evidence | Critical | 2-3 days | #3 |
| 5 | Add expert review status and paid diagnostic dashboard states | High | 1-2 days | #1, #4 |
| 6 | Add trigger-review case types and decision cards | High | 2-3 days | #3, #4 |
| 7 | Add first-revenue analytics events | Medium | 1-2 days | #1-#5 |

## Dependency Graph

```text
#1 Diagnostic model
  ├─> #2 Data pack checklist/upload metadata
  │     └─> #3 Data quality + evidence items
  │           ├─> #4 Owner brief generation
  │           │     └─> #5 Expert review/dashboard states
  │           └─> #6 Trigger decision cards
  └─> #7 Revenue analytics
```

Sequencing rationale: persistence must come first because the current app is sample-data based. Data quality and evidence must precede the founder brief because the GTM promise is trust, not just narrative. Expert review should come after brief generation because it reviews a concrete artifact.

## Implementation Details

### 0. Test Runner and Validation Foundation

Before implementing diagnostic logic, add a test runner:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

Add `src/lib/diagnostics/constants.ts`:

```ts
export const OFFER_TYPES = ["diagnostic", "monitoring", "trigger_review"] as const;
export const DIAGNOSTIC_STATUSES = ["draft", "data_requested", "data_received", "analyzing", "expert_review", "delivered", "archived"] as const;
export const DOCUMENT_STATUSES = ["requested", "uploaded", "mapped", "parsed", "needs_clarification", "rejected"] as const;
export const DATA_QUALITY_STATUSES = ["pass", "warning", "fail", "not_applicable"] as const;
export const EVIDENCE_TYPES = ["verified_fact", "calculated_metric", "management_assumption", "ai_hypothesis"] as const;
export const EXPERT_REVIEW_STATUSES = ["not_reviewed", "needs_clarification", "reviewed", "blocked"] as const;
```

Add `src/lib/diagnostics/schema.ts` with Zod schemas for every create/update input. All server actions and repository writes must validate through these schemas.

### 0.1 Data Access Boundary

Create:

| File | Purpose |
|---|---|
| `src/lib/db/prisma.ts` | Singleton Prisma client |
| `src/lib/diagnostics/repository.ts` | CRUD/query functions for diagnostic projects and related records |
| `src/lib/diagnostics/actions.ts` | Server actions used by UI forms |
| `src/lib/diagnostics/fixtures.ts` | Demo diagnostic project and sample data |

Rule: React pages may call server actions or read helpers, but must not perform ad hoc Prisma writes.

Initial repository API:

```ts
export async function listDiagnosticProjects(): Promise<DiagnosticProjectSummary[]>;
export async function getDiagnosticProject(id: string): Promise<DiagnosticProjectDetail | null>;
export async function createDiagnosticProject(input: CreateDiagnosticProjectInput): Promise<{ id: string }>;
export async function updateDiagnosticStatus(id: string, nextStatus: DiagnosticStatus): Promise<void>;
export async function upsertUploadedDocument(input: UpsertUploadedDocumentInput): Promise<{ id: string }>;
export async function replaceDataQualityChecks(projectId: string, checks: DataQualityCheckInput[]): Promise<void>;
export async function replaceEvidenceItems(projectId: string, items: EvidenceItemInput[]): Promise<void>;
export async function createFounderBrief(input: CreateFounderBriefInput): Promise<{ id: string }>;
export async function updateExpertReview(input: UpdateExpertReviewInput): Promise<void>;
```

### 0.2 Status Transition Rules

Create `src/lib/diagnostics/status.ts`:

```ts
const allowedTransitions = {
  draft: ["data_requested", "archived"],
  data_requested: ["data_received", "archived"],
  data_received: ["analyzing", "data_requested", "archived"],
  analyzing: ["expert_review", "data_requested", "archived"],
  expert_review: ["delivered", "data_requested", "archived"],
  delivered: ["archived"],
  archived: []
} satisfies Record<DiagnosticStatus, DiagnosticStatus[]>;
```

Acceptance: invalid transitions throw a typed error and are covered by unit tests.

### 1. Prisma Schema

Extend `prisma/schema.prisma` with these models. Keep SQLite for MVP.

Implementation note: keep fields such as `offerType`, `status`, `reportType`, `evidenceType`, and `confidence` as `String` for SQLite compatibility, but validate every write through shared Zod schemas and constants.

```prisma
model DiagnosticProject {
  id                 String   @id @default(cuid())
  caseId             String
  case               Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  offerType          String   // diagnostic | monitoring | trigger_review
  priceRub           Int?
  buyerRole          String   // owner | ceo | coo | commercial_director | other
  trigger            String?  // cash_gap | discount | capex | debt | cfo_hiring | margin_drop | ar_inventory | budget | other
  status             String   // draft | data_requested | data_received | analyzing | expert_review | delivered | archived
  targetDeliveryDate DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  uploadedDocuments  UploadedDocument[]
  dataQualityChecks  DataQualityCheck[]
  evidenceItems      EvidenceItem[]
  founderBriefs      FounderBrief[]
  expertReviews      ExpertReview[]
}

model UploadedDocument {
  id                  String   @id @default(cuid())
  diagnosticProjectId String
  diagnosticProject   DiagnosticProject @relation(fields: [diagnosticProjectId], references: [id], onDelete: Cascade)
  fileName            String
  fileType            String
  reportType          String // pnl | cash_flow | balance | ar_ap | inventory | debt_schedule | capex_plan | org_chart | other
  periodLabel         String?
  status              String // requested | uploaded | mapped | parsed | needs_clarification | rejected
  missingReason       String?
  storageKey          String? // metadata only in this epic; raw file storage is out of scope
  originalRetained    Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model DataQualityCheck {
  id                  String   @id @default(cuid())
  diagnosticProjectId String
  diagnosticProject   DiagnosticProject @relation(fields: [diagnosticProjectId], references: [id], onDelete: Cascade)
  checkKey            String
  status              String // pass | warning | fail | not_applicable
  severity            String // low | medium | high | critical
  message             String
  affectedReportType  String?
  createdAt           DateTime @default(now())
}

model EvidenceItem {
  id                  String   @id @default(cuid())
  diagnosticProjectId String
  diagnosticProject   DiagnosticProject @relation(fields: [diagnosticProjectId], references: [id], onDelete: Cascade)
  conclusionKey       String
  evidenceType        String // verified_fact | calculated_metric | management_assumption | ai_hypothesis
  sourceDocumentId    String?
  sourceDocument      UploadedDocument? @relation(fields: [sourceDocumentId], references: [id], onDelete: SetNull)
  metricName          String?
  periodLabel         String?
  formula             String?
  value               Float?
  unit                String?
  confidence          String // low | medium | high
  explanation         String
  createdAt           DateTime @default(now())
}

model FounderBrief {
  id                  String   @id @default(cuid())
  diagnosticProjectId String
  diagnosticProject   DiagnosticProject @relation(fields: [diagnosticProjectId], references: [id], onDelete: Cascade)
  version             Int
  status              String // draft | ready_for_review | reviewed | delivered
  executiveVerdict    String
  riskRadar           Json
  decisionCards       Json
  questionsForFinance Json
  maturitySummary     Json
  nextActions30_60_90 Json
  markdownBody        String
  dataQualityScore    Int
  expertReviewStatus  String
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model ExpertReview {
  id                  String   @id @default(cuid())
  diagnosticProjectId String
  diagnosticProject   DiagnosticProject @relation(fields: [diagnosticProjectId], references: [id], onDelete: Cascade)
  reviewerName        String?
  status              String // not_reviewed | needs_clarification | reviewed | blocked
  notes               String?
  reviewedAt          DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}
```

Also add to `Case`:

```prisma
diagnosticProjects DiagnosticProject[]
```

### 2. TypeScript Types

Create `src/lib/diagnostics/types.ts`:

```ts
export type OfferType = "diagnostic" | "monitoring" | "trigger_review";
export type DiagnosticStatus = "draft" | "data_requested" | "data_received" | "analyzing" | "expert_review" | "delivered" | "archived";
export type DataQualityStatus = "pass" | "warning" | "fail" | "not_applicable";
export type EvidenceType = "verified_fact" | "calculated_metric" | "management_assumption" | "ai_hypothesis";
export type ExpertReviewStatus = "not_reviewed" | "needs_clarification" | "reviewed" | "blocked";

export interface DataPackRequirement {
  reportType: "pnl" | "cash_flow" | "balance" | "ar_ap" | "inventory" | "debt_schedule" | "capex_plan" | "org_chart";
  requiredFor: OfferType[];
  labelRu: string;
  whyItMattersRu: string;
}
```

Also define `CreateDiagnosticProjectInput`, `UpsertUploadedDocumentInput`, `DataQualityCheckInput`, `EvidenceItemInput`, `CreateFounderBriefInput`, and `UpdateExpertReviewInput` in `src/lib/diagnostics/schema.ts` via `z.infer`.

### 3. Data Pack Requirements

Create `src/lib/diagnostics/data-pack.ts` with this initial checklist:

| Report | Required for diagnostic | Required for trigger review | Why |
|---|---|---|---|
| BDR/P&L 12-24 months | Yes | Yes | Margin, fixed cost, operating leverage |
| BDDS/cash flow or bank cash movement | Yes | cash_gap, debt, capex | Profit-to-cash bridge |
| Balance sheet | Yes if available | debt, capex, cash_gap | Debt, working capital, equity |
| AR/AP aging | Yes for trade/e-commerce/retail | ar_inventory, cash_gap | DSO/DPO and liquidity risk |
| Inventory summary | Yes for trade/e-commerce/retail | ar_inventory, margin_drop | DIO and frozen cash |
| Debt schedule | If has debt | debt, cash_gap | DSCR, covenant, repayment pressure |
| CAPEX/project plan | If has CAPEX | capex | ROI, WACC, payback |
| Finance org chart | Yes | cfo_hiring | Maturity and hiring recommendation |

### 4. Data Quality Checks

Create `src/lib/diagnostics/data-quality.ts`.

Required checks:

1. `required_reports_present`: required report types exist for selected offer/trigger.
2. `periods_consistent`: all reports use the same period labels or can be mapped.
3. `numeric_values_present`: required numeric fields are not empty.
4. `cash_bridge_available`: if profit/cash mismatch is analyzed, CFO or cash movement exists.
5. `debt_schedule_available`: if debt exists, schedule exists or warning is shown.
6. `working_capital_available`: if trade/e-commerce/retail, AR/inventory data exists or confidence drops.
7. `capex_roi_available`: if CAPEX plan exists, ROI/payback/WACC fields exist or warning is shown.
8. `balance_equation_plausible`: assets/liabilities/equity consistency when balance data exists.

Scoring:

```ts
score = Math.max(0, 100 - critical * 30 - high * 18 - medium * 8 - low * 3)
```

Labels:

- `80-100`: decision-grade.
- `60-79`: usable with warnings.
- `40-59`: low confidence.
- `<40`: not decision-grade.

The data quality engine must return both aggregate score and individual checks:

```ts
export interface DataQualityResult {
  score: number;
  label: "decision_grade" | "usable_with_warnings" | "low_confidence" | "not_decision_grade";
  checks: DataQualityCheckInput[];
  blockingReasons: string[];
}
```

Brief generation must be blocked when:

- score is below 40;
- any `critical` check has status `fail`;
- there are no evidence items for high/critical conclusions.

### 5. Evidence Trail

Extend analysis output so every material conclusion can point to evidence:

```ts
export interface EvidenceBackedConclusion {
  key: string;
  title: string;
  conclusion: string;
  severity: "low" | "medium" | "high" | "critical";
  evidenceItemIds: string[];
  confidence: "low" | "medium" | "high";
  contradictedBy?: string[];
  recommendedAction: string;
}
```

Rules:

- No high/critical conclusion can be shown in the owner brief without at least one `EvidenceItem`.
- AI-generated hypotheses must be labeled `ai_hypothesis` and cannot be presented as verified fact.
- Missing data should lower confidence and create a question for the finance team, not silently disappear.

Add `src/lib/diagnostics/evidence.ts`:

```ts
export function validateEvidenceCoverage(conclusions: EvidenceBackedConclusion[], evidenceItems: EvidenceItemInput[]): EvidenceCoverageResult;
```

Required behavior:

- `critical` and `high` conclusions require at least one evidence item.
- `medium` conclusions without evidence are allowed only with `confidence: "low"`.
- `ai_hypothesis` evidence cannot be the only evidence for `critical` conclusions.
- Contradictory evidence should not block generation, but must be listed in the brief.

### 6. Owner Brief Structure

The owner brief should be generated as Markdown first, then rendered in UI.

Required sections:

1. `Executive verdict`: one-page answer for founder.
2. `What changed`: top 3 movements.
3. `Risk radar`: liquidity, margin, working capital, debt, CAPEX, maturity.
4. `Data quality`: score, missing reports, limits of conclusions.
5. `Evidence-backed conclusions`: each with source/period/formula/confidence.
6. `Decision cards`: action, owner, deadline, estimated financial effect, reversibility.
7. `Questions for finance team`: 10 questions and what a sufficient answer looks like.
8. `Finance maturity and hiring`: next finance role and 90-day goals.
9. `30/60/90-day action plan`.
10. `Disclaimer`: decision support, not financial/legal/tax/investment advice.

### 7. UI Routes

Add or update routes:

| Route | Purpose |
|---|---|
| `/diagnostics` | list diagnostic projects and paid pipeline status |
| `/diagnostics/new` | create founder diagnostic or trigger review |
| `/diagnostics/[id]/data-pack` | checklist, upload metadata, missing data |
| `/diagnostics/[id]/quality` | data quality score and checks |
| `/diagnostics/[id]/brief` | owner brief |
| `/diagnostics/[id]/review` | expert review status and notes |

Keep existing `/cases/...` routes working during migration.

Navigation update:

- Add `/diagnostics` to `app/layout.tsx` sidebar.
- Keep current `/cases/...` links under a "Prototype sample" section until diagnostics pages cover the same report flow.

Route implementation order:

1. `/diagnostics` with fixture-backed summaries.
2. `/diagnostics/new` with server action-backed creation.
3. `/diagnostics/[id]/data-pack` with checklist and metadata updates.
4. `/diagnostics/[id]/quality` with deterministic checks.
5. `/diagnostics/[id]/brief` with generated Markdown.
6. `/diagnostics/[id]/review` with expert-review update form.

### 7.1 Information Architecture and Page Contracts

The diagnostics area is the first-revenue workspace. It should not look like a generic case list.

#### `/diagnostics`

Primary question: "Какие платные разборы сейчас в работе и что мешает доставке?"

Layout:

```text
Page header
  title: Платные разборы
  primary action: Новый разбор
  secondary: Открыть демо

Pipeline summary
  Draft / Data requested / Analyzing / Expert review / Delivered

Diagnostic table
  Company | Offer | Trigger | Status | Data quality | Expert review | Delivery date | Next action

Right rail or top panel
  First revenue target: 5 paid diagnostics
  Conversion: diagnostic -> monitoring
```

Required UI states:

| State | Behavior |
|---|---|
| Empty | Show one demo project and CTA `Создать первый платный разбор` |
| Loading | Skeleton table with 5 rows and muted pipeline cards |
| Error | Preserve CTA, show retry, and do not hide navigation |
| Partial | If quality/review is missing, show `Не рассчитано` with next action |

#### `/diagnostics/new`

Primary question: "Какой paid offer мы продаем этому фаундеру?"

The screen must start with offer cards, not a raw form.

Offer cards:

1. `Founder Financial Second Opinion` — 75-150k RUB, 7-14 days.
2. `Monthly Owner Brief` — 75-300k RUB/month.
3. `Trigger Review` — 100-300k RUB per event.

Required fields after offer selection:

- company name;
- buyer role;
- industry;
- revenue band;
- trigger;
- target delivery date;
- price;
- notes/context.

Primary CTA: `Создать разбор и запросить данные`.

#### `/diagnostics/[id]/data-pack`

Primary question: "Каких данных хватает для доказательного вывода, а чего не хватает?"

Layout:

```text
Header
  company | offer | delivery date | status

Left/main
  Data pack checklist grouped by BDR/P&L, Cash, Balance, Working capital, Debt, CAPEX, Finance team

Right rail
  Data readiness score
  Missing critical documents
  What founder should send next
  Confidentiality note
```

Each checklist row must show:

- report name;
- required/optional;
- why it matters;
- status;
- period;
- last update;
- action.

Do not use a plain file input as the central UI. File metadata is a status object in the checklist.

#### `/diagnostics/[id]/quality`

Primary question: "Можно ли уже принимать решение на этих данных?"

Required visual model:

- large data quality score;
- label: `Decision-grade`, `Usable with warnings`, `Low confidence`, `Not decision-grade`;
- grouped checks by severity;
- "What this limits" explanation;
- "What to request next" list.

Avoid raw validation language like "field missing" without business meaning. Use: "Не хватает БДДС, поэтому выводы о кассовом разрыве будут низкой уверенности."

#### `/diagnostics/[id]/brief`

Primary question: "Что собственнику нужно понять и сделать?"

Layout:

```text
Document header
  company | period | offer | delivery status | expert review badge

Sticky summary rail
  risk score
  data quality
  expert review status
  top 3 actions
  download markdown

Main document
  executive verdict
  what changed
  risk radar
  data quality
  evidence-backed conclusions
  decision cards
  questions for finance team
  maturity and hiring
  30/60/90 plan
  disclaimer
```

Evidence-backed conclusions must be expandable:

- collapsed: title, severity, confidence, one-sentence conclusion;
- expanded: source document, period, formula, value, assumption/hypothesis label.

#### `/diagnostics/[id]/review`

Primary question: "Можно ли показывать этот brief собственнику?"

Required controls:

- expert review status segmented control;
- reviewer name;
- review notes;
- blocking issues;
- timestamp.

Founder-facing badge labels:

| Internal status | Founder-facing label |
|---|---|
| `not_reviewed` | `AI draft, эксперт еще не проверил` |
| `needs_clarification` | `Нужны уточнения по данным` |
| `reviewed` | `Проверено финансовым экспертом` |
| `blocked` | `Нельзя использовать для решения` |

### 7.2 Component Requirements

Add or reuse these components:

| Component | Purpose |
|---|---|
| `DiagnosticStatusBadge` | Status label with text + icon, not color-only |
| `DataQualityMeter` | Score + label + short explanation |
| `DataPackChecklist` | Grouped checklist for required reports |
| `EvidenceDisclosure` | Expandable evidence detail for conclusions |
| `ExpertReviewBadge` | Founder-visible trust badge |
| `DecisionCard` | Action, owner, deadline, financial effect, reversibility |
| `BriefSectionNav` | Sticky rail for long owner brief |

Component rules:

- Cards may be used for individual diagnostic projects and decision cards, but do not nest cards inside cards.
- Data tables must right-align numbers and use tabular figures.
- Status/risk/confidence labels must include text and icon.
- The primary action per page must be visually singular.
- Use restrained `Cloud Dancer`/navy/teal palette from current app direction; risk states may use semantic red/amber/green as status colors only.

### 7.3 Russian UX Copy

Primary copy must be Russian. English can be added later as duplicate locale, but layout must be built so English labels can fit.

Required Russian labels:

| Concept | Label |
|---|---|
| Diagnostic list | `Платные разборы` |
| New diagnostic | `Новый разбор` |
| Data pack | `Пакет данных` |
| Data quality | `Качество данных` |
| Evidence trail | `Доказательная база` |
| Owner brief | `Бриф собственника` |
| Expert review | `Экспертная проверка` |
| Decision-grade | `Достаточно для решения` |
| Usable with warnings | `Можно использовать с оговорками` |
| Low confidence | `Низкая уверенность` |
| Not decision-grade | `Недостаточно для решения` |
| What to request next | `Что запросить дальше` |
| Questions for finance team | `Вопросы финансовой команде` |

Tone rules:

- Say `не хватает данных для уверенного вывода`, not `данные плохие`.
- Say `это снижает уверенность`, not `вы не предоставили`.
- Say `что запросить у финансовой команды`, not `что они не сделали`.
- Avoid school-like wording such as `урок`, `тест на грамотность`, `вы должны знать`.

### 7.4 Mobile and Responsive Behavior

Desktop:

- left sidebar persists;
- brief uses main document + sticky summary rail;
- data pack uses checklist + right rail.

Tablet:

- right rail becomes top summary panel;
- evidence disclosure remains inline.

Mobile:

- one primary task per screen;
- diagnostic table becomes list rows;
- sticky summary rail becomes a collapsible `Итог` panel at top;
- data pack checklist groups are collapsible;
- Markdown download remains visible at bottom of brief.

Accessibility:

- all checklist rows must be keyboard reachable;
- disclosure buttons require visible focus states;
- status labels cannot rely on color alone;
- touch targets at least 44px;
- brief section navigation must not trap focus.

### 8. Analytics Events

Create simple event constants in `src/lib/diagnostics/events.ts`:

```ts
diagnostic_created
data_pack_completed
data_quality_generated
owner_brief_generated
expert_review_marked
brief_delivered
diagnostic_converted_to_monitoring
```

For MVP, events can be logged to console or a local `AnalyticsEvent` Prisma model if implementation time allows. Do not block core workflow on analytics infrastructure.

### 9. Seed/Demo Data

Add a deterministic demo diagnostic project so the UI works immediately after checkout:

| File | Purpose |
|---|---|
| `src/lib/diagnostics/fixtures.ts` | In-memory fallback demo data |
| `prisma/seed.ts` | Optional SQLite seed once persistence is wired |

Acceptance: if the database is empty, `/diagnostics` can still show one demo project clearly labeled `demo`.

## Acceptance Criteria

1. A user can create a diagnostic project with offer type `diagnostic`, buyer role, price, trigger, and target delivery date.
2. A diagnostic project has a status lifecycle: `draft -> data_requested -> data_received -> analyzing -> expert_review -> delivered`.
3. `/diagnostics` shows at least company name, offer type, status, target delivery date, data quality score, and expert review status.
4. `/diagnostics/[id]/data-pack` shows the required report checklist for the selected offer/trigger.
5. Each data-pack item can be marked `requested`, `uploaded`, `mapped`, `parsed`, `needs_clarification`, or `rejected`.
6. The app calculates a data quality score from deterministic checks.
7. Missing critical reports lower data quality and appear as explicit warnings.
8. Each high/critical owner-brief conclusion references at least one evidence item.
9. Evidence items distinguish `verified_fact`, `calculated_metric`, `management_assumption`, and `ai_hypothesis`.
10. Founder brief includes all 10 required sections listed above.
11. Founder brief can be exported as Markdown.
12. Expert review status can be marked as `not_reviewed`, `needs_clarification`, `reviewed`, or `blocked`.
13. Delivered brief displays expert review status visibly near the executive verdict.
14. Existing sample case report at `/cases/north-distribution-q2/report` still renders.
15. Invalid diagnostic status transitions are rejected by unit tests.
16. Server actions validate inputs with Zod before repository writes.
17. Raw uploaded file contents are not persisted by this epic; only metadata/status is stored.
18. Empty database state still renders a demo diagnostic project or a clear empty state without crashing.
19. `/diagnostics/new` starts with offer selection cards before showing the form fields.
20. `/diagnostics/[id]/data-pack` shows grouped checklist rows with `why it matters` copy for each required report.
21. `/diagnostics/[id]/quality` translates technical data gaps into business confidence explanations.
22. `/diagnostics/[id]/brief` has a sticky desktop summary rail and a mobile collapsible summary panel.
23. High/critical evidence-backed conclusions are expandable and show source/period/formula/confidence.
24. Expert review status is visible near the executive verdict using founder-facing Russian labels.
25. All status/risk/confidence labels include text plus an icon or explicit label and do not rely on color alone.
26. Mobile layouts for diagnostic list, data pack, quality, and brief do not require horizontal scrolling for core actions.
27. `npm run typecheck`, `npm run lint`, `npm run test`, and `npm run build` pass.

## Testing Plan

| Layer | What | Count |
|---|---|---:|
| Unit | Data pack requirements by offer type and trigger | +8 |
| Unit | Data quality scoring with pass/warning/fail combinations | +10 |
| Unit | Evidence-backed conclusion validation | +6 |
| Unit | Founder brief markdown section generation | +6 |
| Unit | Diagnostic status transition helper | +6 |
| Unit | Zod schemas reject invalid statuses/report types | +8 |
| Unit | Brief generation blocks low data-quality inputs | +4 |
| Integration | Create diagnostic -> complete data pack -> generate quality score | +2 |
| Integration | Analysis result -> evidence items -> owner brief | +2 |
| Integration | Expert review status update appears on brief | +2 |
| E2E | Founder creates paid diagnostic and reaches data-pack screen | +1 |
| E2E | Founder opens generated brief and downloads Markdown | +1 |
| E2E | Mobile founder opens brief, expands evidence, and sees expert review status | +1 |
| Accessibility | Keyboard navigation through data pack checklist and evidence disclosures | +3 |
| Accessibility | Non-color status/risk/confidence labels | +3 |
| Visual QA | Desktop and mobile screenshots for diagnostics list, data pack, quality, brief | +8 |
| Regression | Existing `/cases/...` sample routes still respond | +3 |

## Files Reference

| File | Change |
|---|---|
| `prisma/schema.prisma:10` | Add diagnostic project, upload, quality, evidence, brief, review models |
| `package.json` | Add `test` and `test:watch` scripts plus Vitest |
| `src/lib/db/prisma.ts` | Add Prisma singleton |
| `src/lib/diagnostics/constants.ts` | Add enum-like constants |
| `src/lib/diagnostics/schema.ts` | Add Zod input schemas |
| `src/lib/diagnostics/repository.ts` | Add diagnostic persistence boundary |
| `src/lib/diagnostics/actions.ts` | Add server actions for UI mutations |
| `src/lib/diagnostics/status.ts` | Add lifecycle transition validation |
| `src/lib/diagnostics/data-quality.ts` | Add deterministic data-quality engine |
| `src/lib/diagnostics/evidence.ts` | Add evidence coverage validation |
| `src/lib/diagnostics/brief.ts` | Add founder brief generation |
| `src/lib/diagnostics/fixtures.ts` | Add demo project fallback |
| `src/lib/finance/types.ts:103` | Add evidence-backed conclusion types or compose from diagnostics types |
| `src/lib/finance/analysis.ts:10` | Return evidence-compatible analysis payload |
| `src/lib/finance/rules.ts` | Add stable `conclusionKey` mapping and evidence references |
| `app/page.tsx:6` | Keep dashboard but later point to real diagnostic projects |
| `app/layout.tsx:21` | Add diagnostics navigation while preserving prototype links |
| `app/diagnostics/page.tsx` | New diagnostic project list |
| `app/diagnostics/new/page.tsx` | New diagnostic creation flow |
| `app/diagnostics/[id]/data-pack/page.tsx` | New checklist/upload metadata flow |
| `app/diagnostics/[id]/quality/page.tsx` | New data quality view |
| `app/diagnostics/[id]/brief/page.tsx` | New founder brief view |
| `app/diagnostics/[id]/review/page.tsx` | New expert review status view |
| `src/components/diagnostics/DiagnosticStatusBadge.tsx` | New status badge |
| `src/components/diagnostics/DataQualityMeter.tsx` | New data quality score component |
| `src/components/diagnostics/DataPackChecklist.tsx` | New grouped checklist |
| `src/components/diagnostics/EvidenceDisclosure.tsx` | New evidence drilldown |
| `src/components/diagnostics/ExpertReviewBadge.tsx` | New trust badge |
| `src/components/diagnostics/DecisionCard.tsx` | New decision action card |
| `src/components/diagnostics/BriefSectionNav.tsx` | New brief navigation/summary rail |
| `app/globals.css` | Add diagnostics layout, sticky rail, mobile collapsible summary, badges |
| `app/cases/[id]/upload/page.tsx:7` | Preserve old page while adding `/diagnostics/[id]/data-pack` |
| `app/cases/[id]/report/page.tsx:7` | Preserve old report while adding owner brief route |
| `docs/russian-founder-gtm.md` | Source of GTM and pricing assumptions |
| `docs/product-spec.md` | Source of broader product requirements |

## Out of Scope

- Direct 1C, bank, ERP, marketplace, or email integrations.
- Real payment processing.
- Full auth and multi-tenant RBAC beyond existing prototype constraints.
- PDF export; Markdown export is enough for this issue.
- Raw uploaded-file storage, encryption, virus scanning, deletion SLA, and object storage.
- Full bilingual implementation; keep architecture compatible, but Russian founder workflow is primary for first revenue.
- Replacing expert review with autonomous AI approval.
- Building a consultant/partner portal.

## Rollback Plan

This work is additive. If the diagnostic workflow is unstable:

1. Hide `/diagnostics` links from navigation.
2. Keep existing `/cases/...` sample prototype routes.
3. Revert Prisma migration before real customer data is entered.
4. Keep generated Markdown briefs as export artifacts; they do not require runtime dependencies.

## Effort Estimate

| Component | Estimate |
|---|---:|
| Prisma schema and generated client | 0.5-1 day |
| Vitest setup, constants, schemas, and status transitions | 0.5-1 day |
| Diagnostic types and data pack rules | 0.5-1 day |
| Repository/actions boundary | 1 day |
| Data quality engine | 1 day |
| Evidence model and validation | 1 day |
| Founder brief generator | 1 day |
| Diagnostic routes and UI | 2-3 days |
| Diagnostic component states, responsive behavior, and accessibility polish | 1-2 days |
| Expert review UI/status | 0.5-1 day |
| Tests and build verification | 1-2 days |

Total: 9.5-15 engineering days for one developer, assuming the current prototype remains single-user and local SQLite.

## What's Working Well: Do Not Touch

- Keep deterministic finance rules. They are the right trust foundation.
- Keep Markdown export. It matches first paid diagnostic delivery.
- Keep the restrained fintech dashboard visual direction.
- Keep Russian as the default language for this first-revenue wedge.
- Keep integrations out of scope until paid diagnostics prove repeat demand.
- Keep the interface operational and dense; do not turn the first-revenue flow into a marketing landing page.
- Keep founder-facing language calm, senior, and non-judgmental.

## Open Decisions

Resolved by engineering review for this epic:

1. Use local SQLite for the first implementation.
2. Store uploaded-file metadata only; do not retain raw file contents in this epic.
3. Make expert review visible as a founder-facing trust badge.
4. Use Markdown/print export; defer PDF until a paid customer explicitly needs it.

Remaining open decisions for later epics:

1. Hosted Postgres migration timing.
2. Raw file retention policy, encryption details, deletion SLA, and malware scanning.
3. Auth/RBAC boundary for multi-user customer access.

## Design Review Report

| Review | Score | Status | Findings |
|---|---:|---|---|
| Information architecture | 9/10 | Clear | Diagnostics area now has a paid workflow hierarchy and route contracts |
| Interaction states | 8/10 | Clear | Empty/loading/error/partial states added for core routes |
| Visual hierarchy | 8/10 | Clear | Brief, data pack, and quality pages now have explicit layouts |
| Trust design | 9/10 | Clear | Evidence, data confidence, and expert review are visible product surfaces |
| Responsive/accessibility | 8/10 | Clear | Mobile behavior and non-color status requirements added |
| Content voice | 9/10 | Clear | Russian labels and anti-shame copy rules added |

Verdict: design plan cleared for implementation. No unresolved design decisions for this epic.
