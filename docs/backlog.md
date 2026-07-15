# Backlog

## Epic 0: First-Revenue Founder Brief

Source spec: [First-Revenue Founder Brief MVP](specs/first-revenue-founder-brief.md)

1. Add diagnostic project and paid-offer data model.
2. Build founder data pack checklist and upload metadata workflow.
3. Add data quality score and evidence item model.
4. Generate owner brief from analysis and evidence.
5. Add expert review status and paid diagnostic dashboard states.
6. Add trigger-review case types and decision cards.
7. Add first-revenue analytics events.

## Epic 1: Product Foundation

1. Define initial pricing and packaging.
2. Decide chat-first vs diagnostic-first onboarding.
3. Decide LLM provider and fallback model strategy.
4. Decide uploaded-file retention and deletion policy.
5. Decide whether MVP supports consultant multi-company accounts.
6. Confirm bilingual product policy: Russian primary, English full duplicate.

## Epic 2: UX and Design

1. Create wireframes for Overview, Ask AI-CFO, Diagnostic, Uploads, Decision Cases, Roadmap, and Settings.
2. Define app shell with sidebar, right context rail, mobile bottom navigation, and context drawer.
3. Define UI components for risk labels, confidence labels, AI answer blocks, upload mapping, questionnaire blocks, and case tables.
4. Create responsive behavior for desktop, tablet, and mobile.
5. Define accessibility checklist for keyboard navigation, ARIA landmarks, touch targets, and non-color risk indicators.
6. Create visual design system for a restrained B2B finance product.
7. Design language switcher placement and bilingual copy behavior for long labels and wrapped text.

## Epic 3: SaaS Foundation

1. Implement authentication.
2. Implement organizations and membership.
3. Implement role-based access control.
4. Implement tenant-scoped data access.
5. Implement audit logs.
6. Implement settings for data retention and deletion.

## Epic 4: Company Profile and Diagnostic

1. Implement company profile.
2. Implement financial maturity questionnaire.
3. Implement maturity scoring across reporting, budgeting, treasury, working capital, margins, investment planning, and finance team.
4. Generate diagnostic report with maturity stage, top risks, missing finance blocks, and 30/60/90-day roadmap.

## Epic 5: AI Second Opinion

1. Implement AI case model and decision history.
2. Implement LLM Gateway.
3. Implement prompt versioning.
4. Implement structured AI answer validation.
5. Implement guardrails and disclaimers.
6. Implement confidence and missing-data handling.
7. Implement feedback capture for answer quality.

## Epic 6: Financial Calculation Engine

1. Implement discount break-even volume uplift calculation.
2. Implement operating leverage sensitivity calculation.
3. Implement working capital pressure calculation.
4. Implement cash conversion warning calculation.
5. Implement CAPEX sanity check calculation.

## Epic 7: Excel and CSV Upload

1. Implement upload flow.
2. Implement async parsing.
3. Implement sheet and row preview.
4. Implement manual report-type and column mapping.
5. Implement validation and recoverable error states.
6. Store normalized financial metrics.
7. Prevent raw uploaded files from being sent directly to the LLM.

## Epic 8: Testing and Evaluation

1. Unit tests for maturity scoring.
2. Unit tests for financial calculations.
3. Unit tests for RBAC and tenant isolation.
4. Integration tests for signup, diagnostic, upload, chat, and case history.
5. E2E tests for CEO discount question, COO liquidity question, and finance-function hiring recommendation.
6. Accessibility tests for keyboard navigation and risk/confidence labels.
7. Golden AI-answer dataset for 20 common finance cases.

## Epic 9: Localization

1. Implement localization infrastructure with `ru` as default and `en` as complete duplicate locale.
2. Add user-level preferred locale and organization-level default locale.
3. Move all user-facing UI strings into translation resources.
4. Create Russian and English copy for navigation, onboarding, overview, chat, diagnostic, upload, cases, roadmap, settings, and all interaction states.
5. Create localized AI answer templates, follow-up question templates, disclaimers, and prompt-library examples.
6. Ensure AI answers are generated and saved in the active user locale.
7. Add missing-key and hardcoded-string checks.
8. Add Russian and English smoke tests for all MVP workflows.
