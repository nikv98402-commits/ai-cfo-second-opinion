---
status: ready-for-implementation
github_issue: https://github.com/nikv98402-commits/ai-cfo-second-opinion/issues/9
created_at: 2026-07-15
source_docs:
  - docs/product-spec.md
  - docs/russian-founder-gtm.md
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

### 1. Prisma Schema

Extend `prisma/schema.prisma` with these models. Keep SQLite for MVP.

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
  storageKey          String?
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
15. `npm run typecheck`, `npm run lint`, and `npm run build` pass.

## Testing Plan

| Layer | What | Count |
|---|---|---:|
| Unit | Data pack requirements by offer type and trigger | +8 |
| Unit | Data quality scoring with pass/warning/fail combinations | +10 |
| Unit | Evidence-backed conclusion validation | +6 |
| Unit | Founder brief markdown section generation | +6 |
| Unit | Diagnostic status transition helper | +6 |
| Integration | Create diagnostic -> complete data pack -> generate quality score | +2 |
| Integration | Analysis result -> evidence items -> owner brief | +2 |
| Integration | Expert review status update appears on brief | +2 |
| E2E | Founder creates paid diagnostic and reaches data-pack screen | +1 |
| E2E | Founder opens generated brief and downloads Markdown | +1 |
| Regression | Existing `/cases/...` sample routes still respond | +3 |

## Files Reference

| File | Change |
|---|---|
| `prisma/schema.prisma:10` | Add diagnostic project, upload, quality, evidence, brief, review models |
| `src/lib/finance/types.ts:103` | Add evidence-backed conclusion types or compose from diagnostics types |
| `src/lib/finance/analysis.ts:10` | Return evidence-compatible analysis payload |
| `src/lib/finance/rules.ts` | Add stable `conclusionKey` mapping and evidence references |
| `app/page.tsx:6` | Keep dashboard but later point to real diagnostic projects |
| `app/cases/[id]/upload/page.tsx:7` | Preserve old page while adding `/diagnostics/[id]/data-pack` |
| `app/cases/[id]/report/page.tsx:7` | Preserve old report while adding owner brief route |
| `docs/russian-founder-gtm.md` | Source of GTM and pricing assumptions |
| `docs/product-spec.md` | Source of broader product requirements |

## Out of Scope

- Direct 1C, bank, ERP, marketplace, or email integrations.
- Real payment processing.
- Full auth and multi-tenant RBAC beyond existing prototype constraints.
- PDF export; Markdown export is enough for this issue.
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
| Diagnostic types and data pack rules | 0.5-1 day |
| Data quality engine | 1 day |
| Evidence model and validation | 1 day |
| Founder brief generator | 1 day |
| Diagnostic routes and UI | 2-3 days |
| Expert review UI/status | 0.5-1 day |
| Tests and build verification | 1-2 days |

Total: 7-11 engineering days for one developer, assuming the current prototype remains single-user and local SQLite.

## What's Working Well: Do Not Touch

- Keep deterministic finance rules. They are the right trust foundation.
- Keep Markdown export. It matches first paid diagnostic delivery.
- Keep the restrained fintech dashboard visual direction.
- Keep Russian as the default language for this first-revenue wedge.
- Keep integrations out of scope until paid diagnostics prove repeat demand.

## Open Decisions

1. Whether first implementation should use local SQLite only or add hosted Postgres immediately.
2. Whether uploaded raw files are retained or only metadata/parsed rows are stored.
3. Whether expert review is an internal admin-only state or visible to the founder as a trust badge.
4. Whether first paid pilots need PDF export or Markdown/print is enough.

Recommendation: choose SQLite/local prototype, retain uploaded-file metadata but not raw file storage in the first pass, make expert review visible, and defer PDF until a paid customer explicitly needs it.
