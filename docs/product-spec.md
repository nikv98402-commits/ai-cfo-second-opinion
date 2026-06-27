# Spec: AI-CFO Second Opinion MVP

## Context

Russian companies with roughly 0.5-5B RUB annual revenue often outgrow founder-led finance control before they build a mature finance function. The first buyer is not a CFO, but a CEO, COO, owner, or other non-financial C-level leader who faces a new decision or an emerging financial problem and needs a fast, structured second opinion.

The MVP should be a SaaS product with an AI assistant at the center. The first paid value is not generic financial education; it is decision support: "is this financial explanation, proposal, risk, discount, CAPEX, liquidity plan, or hiring move reasonable for my company stage?"

## Current State

This is a greenfield product spec. The current workspace contains no product code or existing architecture to extend. Verification date: 2026-06-27.

| Area | Current State | Implication |
|------|---------------|-------------|
| Product code | None found | Architecture can be defined from scratch |
| User data model | None found | MVP needs explicit company, user, questionnaire, uploaded file, and AI case models |
| Integrations | None found | Design integration-ready boundaries now, but do not build 1C/bank integrations in MVP |
| Primary workflow | User-provided concept | Convert into SaaS onboarding, chat, diagnostic report, and case history |

## Target Users

Primary users:

1. CEO/owner of a 0.5-5B RUB revenue company.
2. COO or commercial director responsible for operational decisions with financial consequences.
3. Other non-financial C-level leaders who need to challenge or understand finance-team recommendations.

Initial ICP priority:

1. Distribution, wholesale, e-commerce, and retail.
2. B2B services.
3. Other sectors later, including manufacturing, construction, development, agribusiness, and asset-heavy businesses.

## Problem Statement

The target user often has partial financial reporting, weak financial structure, and low confidence in interpreting finance-team output. They may have a bookkeeper, financial manager, or weak finance director, but lack a mature view across P&L, cash flow, balance sheet, working capital, debt, operating leverage, CAPEX, and return on invested capital.

The product must help the user:

1. Understand whether a specific financial decision or explanation is logical.
2. Detect risks hidden behind revenue growth, discounts, CAPEX, inventory, receivables, debt, or EBITDA.
3. Assess company financial maturity and missing finance-function blocks.
4. Learn financial reasoning in context, without feeling like they are taking a generic course.

## Product Positioning

Working positioning:

> AI-CFO second opinion for CEOs and COOs of growing companies: check financial decisions, understand risks, and know what finance function to build next.

Avoid positioning the MVP as:

- Financial literacy course.
- Replacement for a CFO.
- Accounting automation.
- BI dashboard.
- Full ERP/1C integration product.

## MVP Scope

### In Scope

1. SaaS onboarding for company profile and user role.
2. Guided questionnaire for financial maturity and risk baseline.
3. AI chat for second opinion on management decisions.
4. Manual input of key financial metrics.
5. Excel upload for management reports and simple tabular data.
6. Diagnostic report: maturity stage, risk map, missing finance-function blocks, and recommended next actions.
7. Case history: each user question becomes a structured decision case.
8. Integration-ready architecture with internal interfaces for future connectors.

### Out of Scope for MVP

1. Direct integration with 1C, banks, CRM, ERP, or marketplaces.
2. Automatic legal, tax, or investment advice.
3. Fully automated financial model generation.
4. Hiring marketplace for finance professionals.
5. Sector-specific deep models beyond the initial priority sectors.
6. Replacement of professional audit, CFO judgment, or board-level investment review.

## Core User Journey

1. User signs up and creates a company profile.
2. User selects role: CEO, owner, COO, commercial director, other.
3. User selects sector and company size band.
4. User completes a financial maturity questionnaire.
5. User enters or uploads basic financial metrics.
6. Product generates the first financial maturity and risk baseline.
7. User opens AI second opinion chat and asks a decision question.
8. AI asks follow-up questions if context is insufficient.
9. AI returns structured analysis, risk flags, financial logic, and recommended next steps.
10. The case is saved into the company's decision history.

## UX and Information Architecture

The product must open as the actual working application, not as a marketing landing page. The first screen after signup should help a CEO/COO answer: "What should I check or decide right now?"

### App Shell

Desktop layout:

```text
Top bar
  company switcher | period selector | data freshness | user menu

Left sidebar
  Overview
  Ask AI-CFO
  Diagnostics
  Uploads
  Decision Cases
  Finance Function Roadmap
  Settings

Main workspace
  context-aware page content

Right context rail
  company baseline
  maturity stage
  missing data
  recent risks
  source documents
```

Mobile layout:

```text
Top bar
  company | menu | new question

Main workspace
  one primary task at a time

Bottom navigation
  Overview | Ask | Cases | Uploads
```

The right context rail collapses into a "Context" sheet on tablet and mobile.

### First-Session Flow

The first session should not force a long questionnaire before value. Use progressive context collection:

1. First screen asks the user to choose one of three entry actions:
   - Ask about a decision.
   - Check financial maturity.
   - Upload a report.
2. If the user chooses chat first, AI asks only the minimum context needed for that case.
3. After the first answer, the product prompts for the maturity questionnaire to improve answer quality.
4. If the user chooses diagnostic first, the product completes company profile and maturity questionnaire before chat.
5. If the user chooses upload first, the product guides them through file mapping and then suggests questions based on the uploaded data.

Recommended default: chat-first with progressive context. This matches the user's expectation that an AI product starts with a useful question, while still collecting structured data over time.

### Screen Map

| Screen | Primary User Question | Primary Action | Secondary Action |
|--------|-----------------------|----------------|------------------|
| Overview | What is financially risky right now? | Ask AI-CFO | Continue diagnostic |
| Ask AI-CFO | Can I trust this decision or explanation? | Submit question | Attach context |
| Diagnostic | How mature is our finance function? | Complete/update questionnaire | View roadmap |
| Uploads | Can I add real data safely? | Upload and map file | Review parsed metrics |
| Decision Cases | What have we already checked? | Open case | Compare similar cases |
| Roadmap | What finance capability do we build next? | Mark action complete | Assign owner |
| Settings | Who can see company data? | Manage access | Set retention |

### Overview Screen

The overview is not a BI dashboard. It is an executive risk cockpit.

Required modules:

1. **Next best action:** one clear recommendation, such as "Upload receivables aging to improve liquidity answers."
2. **Maturity stage:** Stage 0-4 with a short explanation.
3. **Top risks:** 3-5 ranked risks with confidence labels.
4. **Open decision cases:** latest unanswered or high-risk cases.
5. **Data freshness:** which reports are current, stale, or missing.
6. **Finance function gaps:** missing blocks such as treasury, FP&A, financial control.

Avoid generic KPI tiles unless each one has a decision consequence. "Revenue" alone is less useful than "Revenue grew while receivables days worsened."

### Ask AI-CFO Screen

The chat UI should be a case workspace, not a blank chatbot.

Required layout:

```text
Case header
  case title | case type | confidence | status

Question composer
  multiline input
  attach document/context
  choose case type optional
  submit

AI answer
  short answer
  assumptions
  P&L / cash flow / balance sheet logic
  calculations used
  key risks
  data needed
  questions for finance team
  recommended next action
  confidence and disclaimer

Context rail
  company baseline
  maturity stage
  attached metrics
  missing data
  source documents
```

The empty state must show 4-6 high-intent prompts, not generic suggestions:

- "Commercial team wants to give a discount. What should I check?"
- "Profit exists, but cash is tight. What can explain the gap?"
- "Finance team says budgeting will take six months. Is this normal?"
- "Should we hire a CFO now or strengthen treasury/FP&A first?"
- "Receivables are growing faster than revenue. How risky is this?"

### Diagnostic Screen

The diagnostic should feel like a serious health check, not a quiz.

Required UX:

1. 7 blocks shown as a vertical checklist: reporting, budgeting, treasury, working capital, margins, investment planning, finance team.
2. Each block has 3-7 questions, progress, and "why this matters" text.
3. User can skip unknown answers with "I don't know"; skipped answers lower confidence instead of blocking completion.
4. Final report shows maturity stage, top risks, missing blocks, and roadmap.
5. Report can be regenerated when new data is uploaded.

### Uploads Screen

The upload flow should reduce anxiety around messy Excel files.

Required steps:

1. Select file.
2. Preview sheets and first rows.
3. Choose report type.
4. Map required columns.
5. Validate periods, numeric values, and currency.
6. Confirm import.
7. Show parsed metrics and warnings.

The UI must never silently import ambiguous financial data.

### Decision Cases Screen

Decision history is a core product surface. It makes the app feel like an executive memory, not a one-off chat.

Required columns:

| Column | Purpose |
|--------|---------|
| Case title | Human-readable decision |
| Type | pricing, liquidity, CAPEX, hiring, reporting, debt, working capital, other |
| Status | needs data, answered, high risk, archived |
| Confidence | low, medium, high |
| Last updated | freshness |
| Linked data | documents/metrics used |

## Interaction States

| Feature | Loading | Empty | Error | Success | Partial |
|---------|---------|-------|-------|---------|---------|
| Overview | skeleton modules | "Start with a question, diagnostic, or upload" | show retry and support code | risk cockpit visible | show available modules and missing context |
| Ask AI-CFO | answer streaming or progress steps | prompt library and new case composer | answer failed, retry without losing draft | structured answer saved | follow-up questions shown before final answer |
| Diagnostic | block progress loading | first block ready | save failed, retry answer | maturity report generated | stage shown with low confidence |
| Uploads | parsing status by step | upload dropzone | parse failed with recoverable message | mapped metrics imported | warnings require user confirmation |
| Decision Cases | table skeleton | no cases yet, start first question | load failed, retry | searchable case list | filters show fewer cases |
| Roadmap | generating actions | no diagnostic yet | generation failed | 30/60/90 actions visible | some actions locked until more data |

All user-entered drafts must survive transient errors and page refreshes where feasible.

## User Journey and Emotional Arc

| Step | User Does | User Feels | Product Must Do |
|------|-----------|------------|-----------------|
| Arrives | Opens app with a financial concern | Uncertain, possibly defensive | Offer useful entry actions without judging their finance maturity |
| First question | Asks about a decision | Wants fast clarity | Answer quickly, state assumptions, ask only necessary follow-ups |
| Follow-up | Sees missing data | Slightly exposed | Explain why the missing data matters and offer simple ways to provide it |
| First answer | Reads second opinion | Relief plus caution | Separate short answer from deeper reasoning and next actions |
| Diagnostic | Completes maturity check | Curious but time-constrained | Show progress, allow unknown answers, return a concrete roadmap |
| Upload | Adds Excel data | Worried about confidentiality and messiness | Preview, validate, and confirm before import |
| Return visit | Opens old cases | Wants continuity | Show decision history, data freshness, and changed risk signals |

Tone: calm, direct, and executive. Avoid shame, school-like language, or "you lack financial literacy" framing.

## Visual Design Direction

This is an operational B2B finance product. The interface should be restrained, dense, and scannable.

Visual principles:

1. Prefer tables, lists, segmented controls, status labels, and compact panels over large marketing cards.
2. Use neutral surfaces with a limited accent system for risk and confidence.
3. Avoid purple/blue gradients, oversized hero sections, decorative blobs, 3-column feature grids, and generic AI SaaS visuals.
4. Use icons only for recognizable actions such as upload, search, filter, settings, download, warning, and check.
5. Use cards only for individual repeated items or bounded tools; do not nest cards inside cards.
6. Keep finance terms precise: BDR/P&L, BDDS/Cash Flow, balance sheet, DSO, DPO, margin, CAPEX, WACC.

Recommended palette:

| Role | Color Direction |
|------|-----------------|
| Base | off-white or very light gray |
| Text | near-black, high contrast |
| Lines | neutral gray |
| Primary action | deep teal or graphite |
| Risk high | red |
| Risk medium | amber |
| Risk low/ok | green |
| Informational | blue-gray |

Typography:

1. Use a sober sans-serif suitable for tables and Cyrillic.
2. Keep dashboard headings compact.
3. Use tabular numbers for financial values.
4. Do not use viewport-scaled font sizes.

## Responsive and Accessibility Requirements

Desktop:

1. Persistent sidebar and right context rail.
2. Chat and answer can sit side by side with context.
3. Tables support horizontal density without truncating critical columns.

Tablet:

1. Sidebar collapses to icon rail or drawer.
2. Context rail becomes a slide-over panel.
3. Upload mapping uses stacked preview and mapping controls.

Mobile:

1. Bottom navigation for Overview, Ask, Cases, Uploads.
2. One primary task per screen.
3. Chat composer fixed at bottom only when it does not cover answer content.
4. Tables become list rows with the most important fields first.

Accessibility:

1. Minimum touch target: 44px.
2. Keyboard navigation for chat composer, upload mapping, questionnaire, tables, filters, and dialogs.
3. Visible focus states.
4. ARIA landmarks for navigation, main content, complementary context rail, and dialogs.
5. Color contrast: WCAG AA minimum for all text and controls.
6. Risk and confidence cannot rely on color alone; include labels and icons.

## Key MVP Features

### 1. Company Profile

Capture:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Company name | string | Yes | Can be short internal name |
| Industry | enum | Yes | Distribution/wholesale, e-commerce, retail, B2B services, other |
| Annual revenue band | enum | Yes | 0-0.5B, 0.5-1B, 1-3B, 3-5B, 5B+ RUB |
| Employee count band | enum | No | Helps infer organizational maturity |
| User role | enum | Yes | CEO, owner, COO, commercial director, other C-level |
| Finance team composition | multi-select | Yes | Bookkeeper, financial manager, controller, treasury, FP&A, CFO |
| Reporting stack | multi-select | Yes | Excel, 1C, BI, ERP, bank statements, none |

### 2. Financial Maturity Questionnaire

The questionnaire should score maturity across seven blocks:

| Block | Example Questions |
|-------|-------------------|
| Reporting | Does the company have monthly P&L, cash flow, and balance sheet? |
| Budgeting | Is there a rolling budget/forecast and variance analysis? |
| Treasury | Is payment calendar managed daily/weekly? |
| Working capital | Are receivables, payables, and inventory tracked with aging? |
| Unit economics/margins | Are discounts, gross margin, contribution margin, and operating leverage analyzed? |
| Investment planning | Are CAPEX and projects evaluated via ROI, payback, WACC, or hurdle rate? |
| Finance team | Are roles separated across accounting, FP&A, treasury, control, and CFO-level strategy? |

Output maturity stages:

1. Stage 0: Accounting-only finance.
2. Stage 1: Basic management reporting.
3. Stage 2: Reporting plus budget/control.
4. Stage 3: Structured finance function.
5. Stage 4: Strategic finance and capital allocation.

### 3. AI Second Opinion Chat

The chat should handle natural-language business questions such as:

- "The finance director says a 12% discount will increase revenue. Is this safe?"
- "We have accounting profit, but no cash. What should I check?"
- "We are buying warehouse equipment and will show lower profit. Is that bad?"
- "Should we hire a CFO or first build treasury and FP&A?"
- "Our receivables are growing faster than revenue. Is that dangerous?"
- "Is it normal that budgeting implementation takes six months?"

Each answer must follow a standard structure:

1. Short answer.
2. What assumptions are being made.
3. Financial logic across P&L, cash flow, and balance sheet.
4. Key risks.
5. Data needed to improve confidence.
6. Questions to ask the finance team.
7. Recommended next action.
8. Confidence level.

### 4. Excel Upload

MVP upload support:

1. `.xlsx` and `.csv`.
2. Manual mapping of sheets/columns to report type.
3. Supported report types:
   - P&L / BDR.
   - Cash flow / BDDS.
   - Balance sheet.
   - Receivables aging.
   - Payables aging.
   - Inventory summary.
4. Store normalized extracted rows and the original uploaded file metadata.

MVP does not need perfect automatic recognition. It should allow manual correction before analysis.

### 5. Diagnostic Report

The report should include:

1. Financial maturity stage.
2. Top 5 financial risks.
3. Missing finance-function blocks.
4. Recommended next hires or role upgrades.
5. Reports the company should maintain monthly.
6. Decisions that should not be made without a model.
7. Suggested 30/60/90-day finance-function roadmap.

## AI Guardrails

The product must clearly state that it provides business decision support, not legal, tax, audit, investment, or accounting certification.

The AI must:

1. Ask for missing context instead of inventing numbers.
2. Show assumptions explicitly.
3. Distinguish facts from inferred risks.
4. Avoid definitive claims when data is incomplete.
5. Recommend consulting a qualified professional for legal, tax, audit, investment, debt restructuring, insolvency, or regulated matters.
6. Never guarantee business outcomes.

## Architecture Requirements

The MVP should be architected as a modular SaaS with these domains:

| Domain | Responsibility |
|--------|----------------|
| Identity and access | Users, organizations, roles |
| Company profile | Company attributes and finance maturity inputs |
| Documents | Uploaded Excel/CSV files and parsed tables |
| Financial metrics | Normalized metrics and time periods |
| AI cases | Chat questions, context, answers, confidence, and decision history |
| Diagnostics | Maturity scoring and risk reports |
| Integrations | Future connector boundary for 1C, banks, ERP, marketplaces |
| Audit/security | Logs, permissions, data retention |

Recommended MVP architecture:

```text
Web App
  -> API Backend
     -> Auth / Organization / RBAC
     -> Company Profile Service
     -> Questionnaire Service
     -> Document Import Service
     -> Financial Metrics Service
     -> AI Case Service
     -> Diagnostic Report Service
     -> Audit Log Service

API Backend
  -> Postgres
  -> Object Storage for uploaded originals
  -> Background Worker Queue
  -> LLM Gateway

Background Workers
  -> Excel/CSV parsing
  -> metric normalization
  -> diagnostic report generation
  -> AI answer evaluation jobs
```

Implementation recommendation: start as a modular monolith, not microservices. The first engineering goal is strong domain boundaries and clean data contracts, not distributed infrastructure.

Integration boundary should exist from day one:

```text
ExternalConnector
  -> fetchRawData(companyId, period)
  -> normalize(rawData)
  -> validate(normalizedData)
  -> writeToFinancialMetrics(companyId, normalizedData)
```

MVP connectors:

1. Manual questionnaire connector.
2. Excel/CSV upload connector.

Future connectors:

1. 1C.
2. Bank APIs.
3. CRM/ERP.
4. Marketplace/e-commerce platforms.
5. BI/data warehouse.

## Data Flow

### First Diagnostic Flow

```text
User signup
  -> create Organization
  -> complete Company Profile
  -> complete Financial Maturity Questionnaire
  -> optionally upload Excel/CSV
  -> normalize FinancialMetric records
  -> run maturity scoring
  -> generate DiagnosticReport
  -> show stage, risks, missing finance blocks, and 30/60/90 roadmap
```

### AI Second Opinion Flow

```text
User asks question
  -> classify case type
  -> retrieve company profile, maturity stage, available metrics, uploaded context
  -> check whether required context is sufficient
  -> if insufficient: ask follow-up questions
  -> if sufficient: produce structured answer JSON
  -> validate answer schema and guardrails
  -> save AiCase and AiAnswer
  -> show answer plus confidence and disclaimer
```

### Excel/CSV Import Flow

```text
Upload file
  -> virus/malware scan or managed storage scan
  -> store original file in object storage
  -> create UploadedDocument(status=uploaded)
  -> parse sheets/columns in background worker
  -> user maps report type and columns
  -> validate required columns and numeric formats
  -> write normalized FinancialMetric records
  -> mark UploadedDocument(status=parsed)
```

Import must be asynchronous. Large or messy Excel files should not block the main request thread.

## LLM Gateway and Prompt Architecture

All model calls must go through a single LLM Gateway module. Product code must not call an LLM provider directly from controllers, UI handlers, import jobs, or scoring logic.

LLM Gateway responsibilities:

1. Build the prompt from a versioned prompt template.
2. Attach company context and financial metrics using a strict context object.
3. Enforce maximum context size and redact irrelevant raw file content.
4. Request structured JSON output.
5. Validate the response against the AI answer schema.
6. Run guardrail checks before saving or showing the answer.
7. Store model name, prompt version, answer version, token usage, latency, and confidence.

Prompt inputs should be explicit:

```json
{
  "user_role": "CEO | owner | COO | commercial_director | other",
  "industry": "distribution | wholesale | ecommerce | retail | b2b_services | other",
  "revenue_band": "string",
  "maturity_stage": "stage_0 | stage_1 | stage_2 | stage_3 | stage_4",
  "case_type": "pricing | liquidity | capex | hiring | reporting | debt | working_capital | other",
  "user_question": "string",
  "available_metrics": [],
  "uploaded_context_summary": [],
  "known_missing_data": []
}
```

The first implementation should use deterministic app-side calculations for simple finance formulas and ask the LLM to explain the result, not invent the calculation.

## Financial Calculation Engine

The MVP needs a small deterministic calculation engine for recurring financial checks. These calculations should be covered by unit tests and referenced by AI answers.

Required MVP calculations:

| Calculation | Inputs | Output |
|-------------|--------|--------|
| Discount break-even volume uplift | current revenue, gross margin, discount percent, variable cost rate | required volume uplift to preserve gross profit |
| Operating leverage sensitivity | contribution margin, fixed costs, revenue change | EBITDA/profit sensitivity |
| Working capital pressure | revenue growth, DSO, DPO, inventory days | cash locked in receivables/inventory |
| Cash conversion warning | EBITDA/profit, operating cash flow, receivables, inventory, payables | gap between accounting profit and cash |
| CAPEX sanity check | CAPEX, expected incremental cash flow, payback period, optional WACC | simple payback/ROI warning |

AI answers may explain these calculations, but the source of numeric truth should be the calculation engine.

## Security, Privacy, and Compliance

Financial data must be treated as sensitive business data from day one.

MVP security requirements:

1. Strict organization-level tenancy: every query touching company data must be scoped by `organization_id`.
2. Role-based access control: owner, admin, member, readonly.
3. Encryption in transit and at rest for database and object storage.
4. Uploaded file access through signed URLs or backend-mediated downloads only.
5. Audit logs for login, upload, delete, AI answer generation, organization membership changes, and report export.
6. Configurable retention policy for uploaded originals and parsed data.
7. User-initiated deletion of uploaded files and AI cases.
8. No training on customer data unless explicitly opted in by organization owner.
9. Secrets managed through environment/secret manager, never stored in code or uploaded documents.
10. Separate production, staging, and development environments.

Important implementation rule: do not send full raw Excel files to the LLM. Parse and summarize only the mapped fields needed for the current case.

## Observability and Operations

Track the product as both a SaaS and an AI decision-support system.

Required MVP telemetry:

| Metric | Why |
|--------|-----|
| Signup to first diagnostic completion | Measures onboarding friction |
| First chat question completion | Measures core value activation |
| AI follow-up rate | Shows how often user context is insufficient |
| AI answer validation failure rate | Catches schema/prompt drift |
| Upload parse failure rate | Catches Excel import quality issues |
| Case type distribution | Shows which decision jobs users actually value |
| Time to first answer | Must feel fast enough for executive use |
| User feedback on AI answer | Builds evaluation dataset |

Operational requirements:

1. Sentry or equivalent error tracking.
2. Structured logs with organization and user IDs, but no raw financial values in logs.
3. Background worker retry policy for imports and report generation.
4. Admin-only failed-import inspection view.
5. Rate limits for chat and upload endpoints.

## Engineering Review Findings

1. **CRITICAL GAP: AI answer quality cannot rely on prompts alone.** The spec now requires deterministic calculations for common finance cases, structured answer validation, prompt versioning, and an evaluation dataset.
2. **CRITICAL GAP: financial data is sensitive and multi-tenant.** The spec now requires organization scoping, RBAC, audit logs, encryption, and no raw Excel file transmission to the LLM.
3. **WARNING: direct integrations are future scope but must not leak into MVP complexity.** The spec keeps connector interfaces now, but limits MVP connectors to questionnaire and Excel/CSV.
4. **WARNING: Excel upload is a product surface, not a utility method.** The spec now requires async parsing, manual mapping, validation, and parse failure handling.
5. **OK: modular monolith is the right first architecture.** Microservices would slow down MVP learning without solving an immediate scaling problem.

## Suggested Data Model

### User

| Field | Type |
|-------|------|
| id | uuid |
| email | string |
| name | string |
| role | enum |
| created_at | datetime |

### Organization

| Field | Type |
|-------|------|
| id | uuid |
| name | string |
| industry | enum |
| revenue_band | enum |
| employee_count_band | enum |
| created_at | datetime |

### OrganizationMember

| Field | Type |
|-------|------|
| organization_id | uuid |
| user_id | uuid |
| access_role | enum: owner, admin, member, readonly |

### PromptTemplate

| Field | Type |
|-------|------|
| id | uuid |
| name | string |
| version | string |
| template_text | text |
| status | enum: draft, active, retired |
| created_at | datetime |

### FinancialMetric

| Field | Type |
|-------|------|
| id | uuid |
| organization_id | uuid |
| period_start | date |
| period_end | date |
| metric_name | enum/string |
| value | decimal |
| currency | string |
| source | enum: manual, questionnaire, upload, integration |
| confidence | enum: low, medium, high |
| source_document_id | uuid/null |
| created_at | datetime |

### UploadedDocument

| Field | Type |
|-------|------|
| id | uuid |
| organization_id | uuid |
| file_name | string |
| file_type | enum |
| report_type | enum |
| status | enum: uploaded, mapped, parsed, failed |
| storage_key | string |
| parse_error | text/null |
| created_at | datetime |

### AiCase

| Field | Type |
|-------|------|
| id | uuid |
| organization_id | uuid |
| user_id | uuid |
| title | string |
| user_question | text |
| case_type | enum: pricing, liquidity, capex, hiring, reporting, debt, working_capital, other |
| status | enum: draft, answered, needs_more_data |
| created_at | datetime |

### AiAnswer

| Field | Type |
|-------|------|
| id | uuid |
| ai_case_id | uuid |
| answer_json | json |
| model | string |
| prompt_template_id | uuid |
| prompt_version | string |
| confidence | enum: low, medium, high |
| validation_status | enum: valid, invalid, blocked |
| token_usage | json |
| latency_ms | integer |
| created_at | datetime |

### DiagnosticReport

| Field | Type |
|-------|------|
| id | uuid |
| organization_id | uuid |
| maturity_stage | enum |
| score_by_block | json |
| top_risks | json |
| recommendations | json |
| created_at | datetime |

### AuditLog

| Field | Type |
|-------|------|
| id | uuid |
| organization_id | uuid |
| user_id | uuid/null |
| event_type | enum |
| entity_type | string |
| entity_id | uuid/null |
| metadata | json |
| created_at | datetime |

## Prioritized Recommendations

### Critical

1. Build the second-opinion chat and standard answer structure first because this is the sharpest paid job-to-be-done.
2. Build the questionnaire and maturity report because the AI needs baseline context to avoid generic advice.
3. Store every chat as a structured case because the product's memory and future value depend on decision history.
4. Implement LLM Gateway, answer schema validation, prompt versioning, and guardrails before any customer-facing AI release.
5. Implement organization-level RBAC and audit logs before accepting real company data.

### High

1. Add Excel/CSV upload with manual mapping to support real financial context without heavy integrations.
2. Add maturity-stage-specific recommendations for finance-function hiring and role design.
3. Add guardrails and disclaimers before real financial-data workflows.
4. Add deterministic finance calculators for discount, working capital, cash conversion, and CAPEX cases.

### Medium

1. Add industry-specific templates for distribution, wholesale, e-commerce, retail, and B2B services.
2. Add simple scenario calculators for discounts, working capital, CAPEX, and cash gaps.
3. Add exportable PDF reports for owners, boards, and finance-team discussions.

### Low

1. Add direct integrations with 1C, banks, ERP, and marketplaces after MVP validation.
2. Add finance-professional marketplace or implementation partner network.
3. Add advanced BI dashboards.

## Acceptance Criteria

1. A new user can create an organization, select role, industry, revenue band, and finance-team composition.
2. A user can complete the financial maturity questionnaire and receive a maturity stage from Stage 0 to Stage 4.
3. A user can ask an AI second-opinion question and receive an answer with all required sections: short answer, assumptions, three-statement logic, risks, needed data, questions for finance team, next action, and confidence.
4. The AI asks follow-up questions when the user question lacks required context.
5. A user can upload `.xlsx` or `.csv`, manually classify report type, and map at least date/period, metric name, and value fields.
6. Uploaded financial data can be attached as context to an AI case.
7. Each AI case is saved and visible in company decision history.
8. A diagnostic report shows maturity stage, top 5 risks, missing finance-function blocks, and 30/60/90-day roadmap.
9. The product displays a clear decision-support disclaimer before AI answers involving finance, debt, CAPEX, tax, or investment-like topics.
10. No MVP workflow requires direct integration with 1C, banks, ERP, or marketplaces.
11. All AI answers are generated through the LLM Gateway and saved with model, prompt version, schema validation status, token usage, and latency.
12. Organization data cannot be accessed across tenants by users from another organization.
13. Uploaded raw files are not sent directly to the LLM; only mapped and summarized context is eligible for model context.
14. Discount, operating leverage, working capital, cash conversion, and CAPEX calculations are performed by deterministic app code and covered by unit tests.
15. Failed imports show a recoverable status and do not create partial financial metrics unless the user confirms a valid mapping.
16. The first post-signup screen offers three entry actions: ask about a decision, check financial maturity, or upload a report.
17. The Ask AI-CFO screen works as a case workspace with header, composer, structured answer, and context rail.
18. Every major feature has loading, empty, error, success, and partial states.
19. Mobile navigation exposes Overview, Ask, Cases, and Uploads without requiring desktop-only layout.
20. Risk and confidence indicators include text labels and do not rely on color alone.

## Testing Plan

| Layer | What | Count |
|-------|------|-------|
| Unit | Maturity scoring rules by questionnaire block | +14 |
| Unit | Case classification for pricing, liquidity, CAPEX, hiring, working capital | +10 |
| Unit | AI answer schema validation | +8 |
| Unit | Excel/CSV mapping validation | +8 |
| Unit | Discount, operating leverage, working capital, cash conversion, CAPEX calculators | +20 |
| Unit | RBAC and organization-scoped query guards | +12 |
| Integration | Signup -> company profile -> questionnaire -> diagnostic report | +3 |
| Integration | Upload file -> map columns -> attach to AI case | +3 |
| Integration | Ask chat question -> receive structured answer -> save case | +4 |
| Integration | Failed upload parse -> user sees recoverable error -> no metrics written | +2 |
| Integration | Cross-organization access attempt is rejected | +4 |
| E2E | CEO asks discount-risk question with baseline company data | +1 |
| E2E | COO uploads receivables file and asks liquidity question | +1 |
| E2E | User receives finance-function hiring recommendation | +1 |
| E2E | First-session chat-first journey completes without full questionnaire | +1 |
| E2E | User completes diagnostic-first journey and receives roadmap | +1 |
| E2E | Mobile user opens case, reads context, and submits follow-up | +1 |
| Accessibility | Keyboard navigation across app shell, chat, upload mapping, questionnaire | +5 |
| Accessibility | Risk/confidence labels pass contrast and non-color requirements | +4 |
| Evaluation | Golden AI-answer dataset for 20 common finance cases | +20 |

## Example AI Answer Contract

```json
{
  "short_answer": "string",
  "assumptions": ["string"],
  "three_statement_logic": {
    "profit_and_loss": "string",
    "cash_flow": "string",
    "balance_sheet": "string"
  },
  "key_risks": ["string"],
  "data_needed": ["string"],
  "questions_for_finance_team": ["string"],
  "recommended_next_action": ["string"],
  "confidence": "low | medium | high",
  "disclaimer": "string"
}
```

## Example First Use Case

User question:

> Our commercial team wants to give a 12% discount to grow revenue by 20%. Is this safe?

Expected behavior:

1. AI asks for gross margin, variable costs, fixed costs, current EBITDA margin, expected volume growth, payment terms, and inventory impact if missing.
2. AI explains how discount affects contribution margin and operating leverage.
3. AI warns that revenue growth can reduce profit and cash if margin compression, receivables, and inventory grow faster than contribution profit.
4. AI gives a break-even volume uplift calculation if enough data exists.
5. AI suggests what to ask commercial and finance teams before approving.

## Effort Estimate

| Component | Estimate |
|-----------|----------|
| Product discovery and prompt/answer contract | 2-4 days |
| UX flows and wireframes | 3-5 days |
| Auth, organization, and profile | 3-5 days |
| Questionnaire and scoring engine | 4-6 days |
| AI case/chat backend | 5-8 days |
| AI prompt orchestration and guardrails | 5-8 days |
| Excel/CSV upload and manual mapping | 5-8 days |
| Diagnostic report | 4-6 days |
| Case history UI | 2-4 days |
| Testing and security hardening | 5-8 days |
| Design system and responsive UI states | 5-8 days |

Total MVP engineering estimate: roughly 6-10 weeks for a small team after design decisions are finalized.

Engineering review adjustment: with secure multi-tenancy, LLM Gateway, deterministic calculators, async import, and AI evaluation included, a realistic MVP is closer to 8-12 weeks for a small team. A 6-week build is possible only if UI polish, PDF export, and advanced upload handling are deferred.

Design review adjustment: with a proper app shell, first-session flows, upload mapping states, mobile behavior, accessibility, and a non-generic B2B visual system, design and frontend scope should not be treated as incidental. If the team wants a shippable executive-grade product, reserve at least 2-3 dedicated weeks for UX/UI design, component states, and responsive QA inside the broader MVP timeline.

## Rollback Plan

Because MVP starts without live integrations, rollback is straightforward:

1. Disable AI chat entry point if answer quality or guardrails fail.
2. Keep questionnaire and diagnostic report available as non-AI workflows.
3. Disable file upload independently if parsing/mapping has defects.
4. Preserve uploaded documents and cases unless user requests deletion.
5. Revert product release without affecting external systems because no 1C, bank, ERP, or marketplace writes exist in MVP.

## Do Not Touch / Preserve

1. Keep the user as a non-financial executive; do not pivot the MVP toward professional CFO tooling first.
2. Keep chat as the primary interaction model because users already understand LLM-style chat.
3. Keep integrations in the architecture, but not in the first implementation scope.
4. Keep education contextual inside answers rather than building a standalone course as the first product.

## Open Decisions

1. Exact pricing model: per company, per user, per case, or diagnostic-first upsell.
2. Whether to require onboarding questionnaire before first chat or allow chat-first with progressive context collection.
3. Whether the first public product should include PDF report export.
4. Whether AI answers should cite a built-in finance knowledge base or only reason from structured prompts and uploaded data.
5. Security posture for uploaded financial documents: retention period, encryption details, and deletion SLA.
6. Initial LLM provider and fallback model strategy.
7. Whether uploaded originals are retained by default or deleted after parsing.
8. Whether first release supports multi-company users such as consultants, or only one organization per account.
9. Whether product copy should use Russian finance terms only or dual Russian/English terms such as BDR/P&L and BDDS/Cash Flow.
10. Whether the initial default path is chat-first with progressive context or diagnostic-first with structured onboarding. Design review recommends chat-first.
11. Whether PDF/report export is hidden until after diagnostic completion or visible as a disabled future action.

## Recommended Next Issues

1. Design onboarding and first chat UX for CEO/COO second-opinion workflow.
2. Define financial maturity questionnaire and scoring rubric.
3. Design AI answer prompt contract, guardrails, and evaluation dataset.
4. Implement greenfield SaaS foundation: auth, organization, profile, cases.
5. Implement Excel/CSV upload and manual mapping.
6. Build diagnostic report and 30/60/90-day roadmap generator.
7. Implement deterministic finance calculation engine for the first five case types.
8. Implement LLM Gateway, prompt versioning, structured output validation, and AI answer telemetry.
9. Implement tenant isolation, RBAC, audit logs, and data retention controls.
10. Create wireframes for Overview, Ask AI-CFO, Diagnostic, Uploads, Decision Cases, and mobile navigation.
11. Define UI component states for forms, upload mapping, AI answer blocks, risk labels, confidence labels, and case table.
12. Build responsive app shell and accessibility checklist before high-fidelity UI.

## Engineering Review Report

| Review Area | Status | Findings |
|-------------|--------|----------|
| Architecture | CLEAR WITH UPDATES | Modular monolith, explicit service domains, async imports, and future connector boundary are now specified |
| AI Reliability | CLEAR WITH UPDATES | LLM Gateway, prompt versioning, structured output validation, deterministic finance calculators, and evaluation dataset are now required |
| Data Model | CLEAR WITH UPDATES | Added prompt templates, upload storage metadata, answer telemetry, validation status, and audit logs |
| Security | CLEAR WITH UPDATES | Added tenant isolation, RBAC, encryption, audit logging, retention, deletion, and no-training-by-default requirements |
| Performance/Ops | CLEAR WITH UPDATES | Added background workers, retry policy, rate limits, error tracking, and AI/upload observability |
| Tests | CLEAR WITH UPDATES | Expanded unit, integration, E2E, and AI evaluation coverage |

Verdict: Engineering plan is ready for implementation as a greenfield MVP spec after the updates above. No blocking architecture gaps remain, but pricing, first-chat onboarding behavior, LLM provider strategy, uploaded-file retention, consultant multi-company support, and terminology strategy remain product decisions before final build planning.

## Design Review Report

No `DESIGN.md` or existing product UI was available in this workspace, so design decisions were calibrated against universal B2B SaaS and operational-tool principles.

| Pass | Initial Score | Final Score | Fix Applied |
|------|---------------|-------------|-------------|
| Information Architecture | 3/10 | 8/10 | Added app shell, navigation, right context rail, screen map, and first-session flow |
| Interaction States | 2/10 | 8/10 | Added loading, empty, error, success, and partial states for core features |
| User Journey and Emotional Arc | 4/10 | 8/10 | Added CEO/COO emotional journey, trust-building moments, and anti-shame tone |
| AI Slop Risk | 5/10 | 8/10 | Reframed UI as operational finance cockpit, not generic AI chat or marketing SaaS |
| Design System Alignment | 2/10 | 7/10 | Added visual direction, palette roles, typography, icon/card rules; full design system still needed |
| Responsive and Accessibility | 2/10 | 8/10 | Added desktop/tablet/mobile behavior, keyboard, ARIA, contrast, touch target, and non-color risk requirements |
| Unresolved Decisions | 4/10 | 7/10 | Added design-impacting open decisions and recommended chat-first progressive context |

Design verdict: Ready for wireframes and first interactive prototype. The remaining design gap is not product structure; it is visual system specificity. Run design exploration or create a dedicated design system before high-fidelity frontend build.
