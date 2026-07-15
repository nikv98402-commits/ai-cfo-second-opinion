# Design System — AI-CFO Second Opinion

## Product Context

- **What this is:** An owner-side financial second opinion workspace for Russian-speaking founders and CEOs who need an evidence-backed view of liquidity, margin, working capital, debt, CAPEX, and finance-function maturity.
- **Who it's for:** Russian-speaking owners, CEOs, COOs, and commercial directors of companies around 0.5-5B RUB revenue, with first focus on distribution, wholesale, e-commerce, retail, and B2B services.
- **First paid product:** Founder Financial Second Opinion: 75-150k RUB, 7-14 days, 8-12 page owner brief, data quality score, evidence trail, finance-team questions, and expert review status.
- **Project type:** B2B finance web application, paid diagnostic pipeline, executive document workspace.
- **Language model:** Russian is the primary/default UI language. English must remain a full duplicate locale, but the first-revenue workflow optimizes for Russian founder comprehension.

## Aesthetic Direction

- **Direction:** Quiet Owner Assurance.
- **Decoration level:** Restrained, structural, data-led.
- **Mood:** Calm, exacting, confidential, senior. It should feel closer to a private investment memo and treasury dashboard than a SaaS landing page.
- **Reference behavior:** Pigment-style financial density, Rillet/Zenly-style calm surfaces, banking dashboard precision, board-pack clarity.
- **Anti-direction:** No AI chatbot chrome, no educational-course vibe, no marketing hero, no purple gradients, no bubbly generic SaaS cards.

## Core Design Principles

1. **Paid workflow first:** The diagnostics area is a revenue pipeline, not a generic dashboard.
2. **Trust before cleverness:** Show data quality, source, formula, period, confidence, and expert review before asking for belief.
3. **Founder-readable, finance-grade:** A non-financial CEO should understand the conclusion, while a CFO can trace the evidence.
4. **No shame:** Missing reports are framed as confidence limits, not founder incompetence.
5. **One next action:** Every screen must make the next operational step obvious.
6. **Document quality matters:** The owner brief should feel like something a founder can forward, print, discuss, and pay for.

## Typography

- **Display / Page Titles:** Commissioner — serious, structured, good Cyrillic, distinctive without becoming editorial.
- **Body / UI:** IBM Plex Sans — clear in Russian and English, strong for dense operational UI.
- **Data / Tables:** IBM Plex Mono — tabular numbers, formulas, metric codes, imported source labels.
- **Code / Technical:** IBM Plex Mono.
- **Loading:** Google Fonts in prototype; self-host fonts before production if compliance/privacy requires it.

Recommended font loading:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Commissioner:wght@500;600;700&family=IBM+Plex+Sans:wght@400;450;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Type scale:

| Token | Size | Line Height | Usage |
|---|---:|---:|---|
| `text-xs` | 12px | 16px | status metadata, source labels |
| `text-sm` | 14px | 20px | tables, form labels, checklist rows |
| `text-md` | 16px | 24px | body copy, brief paragraphs |
| `text-lg` | 18px | 26px | panel headings |
| `text-xl` | 22px | 30px | section headings |
| `text-2xl` | 28px | 36px | page titles |
| `text-3xl` | 36px | 44px | rare offer-level heading |

Rules:

1. Use tabular numbers for all financial values.
2. Keep letter spacing at `0`.
3. Do not scale font size with viewport width.
4. Avoid hero-scale typography inside operational screens.
5. Long Russian labels must wrap cleanly without resizing containers.

## Color

### Palette Strategy

Use at most three identity colors:

1. **Cloud Dancer** as the main material color: calm, soft white, document-grade surface.
2. **Deep Navy** as the authority color: text, primary actions, high-emphasis metrics.
3. **Treasury Teal** as the constructive action color: readiness, verified evidence, active states.

Semantic red/amber/green are allowed only for risk/status communication, not as brand colors.

### Core Tokens

| Token | Hex | Usage |
|---|---|---|
| `cloud-000` | `#F4F2ED` | Pantone-inspired Cloud Dancer app background |
| `cloud-050` | `#FAF9F6` | primary cards, document surfaces |
| `cloud-100` | `#E8E4DA` | raised neutral surfaces |
| `navy-900` | `#123752` | primary text, primary action, executive emphasis |
| `navy-700` | `#31546B` | secondary text |
| `navy-500` | `#6B7F8B` | muted text |
| `navy-100` | `#DCE5E9` | borders and quiet fills |
| `teal-700` | `#2B9E83` | active state, verified evidence, positive progress |
| `teal-100` | `#DDF2EB` | low-intensity teal fill |
| `line-200` | `#D8D5CC` | default borders |
| `line-300` | `#BFB9AD` | stronger dividers |

### Semantic Tokens

| State | Text | Background | Border |
|---|---|---|---|
| Verified / OK | `#237A64` | `#DDF2EB` | `#A9D8CA` |
| Warning | `#8A5B0B` | `#FFF3D8` | `#E8C06B` |
| High risk | `#A83B35` | `#FCEBE8` | `#E0A29C` |
| Info | `#31546B` | `#EAF1F4` | `#BBCBD3` |
| Blocked | `#123752` | `#DCE5E9` | `#9FB4C0` |

Rules:

1. Primary CTA uses `navy-900`, not teal.
2. Teal means progress, verified evidence, active tab, or "ready".
3. Cloud surfaces should not become beige-heavy; use navy lines/text to keep the product crisp.
4. Risk and confidence never rely on color alone: always include text and icon.
5. Do not use purple, violet, blue-purple, or gradient CTA patterns.

## Layout

### App Shell

Desktop:

- left sidebar: persistent navigation;
- top bar: company, project status, data freshness, user menu;
- main workspace: route-specific working area;
- right rail: contextual summary when the page benefits from it.

Tablet:

- sidebar collapses;
- right rail becomes top summary panel.

Mobile:

- one primary task per screen;
- diagnostic list becomes stacked rows;
- brief summary rail becomes collapsible `Итог` panel.

### Diagnostic Route Layouts

| Route | Primary Layout | Right/Secondary Area |
|---|---|---|
| `/diagnostics` | pipeline summary + diagnostic table | first revenue target panel |
| `/diagnostics/new` | offer cards followed by form | offer promise and scope |
| `/diagnostics/[id]/data-pack` | grouped checklist | readiness score + missing critical data |
| `/diagnostics/[id]/quality` | score + grouped checks | what this limits + what to request next |
| `/diagnostics/[id]/brief` | executive document | sticky summary rail |
| `/diagnostics/[id]/review` | review form/status | founder-facing badge preview |

### Radius and Shape

| Element | Radius |
|---|---:|
| Panels | 8px |
| Buttons | 6px |
| Inputs | 6px |
| Tables | 6px |
| Modals | 8px |
| Pills | 999px |

Avoid large rounded "friendly" SaaS cards. This is a financial control product, not a consumer onboarding app.

## Spacing

- **Base unit:** 4px.
- **Density:** Compact for dashboard/table/checklist surfaces; comfortable for brief reading.

| Token | Value |
|---|---:|
| `space-2xs` | 2px |
| `space-xs` | 4px |
| `space-sm` | 8px |
| `space-md` | 16px |
| `space-lg` | 24px |
| `space-xl` | 32px |
| `space-2xl` | 48px |

Rules:

1. Checklist rows use 12-16px vertical padding.
2. Tables use 8-12px cell padding.
3. Brief sections use 24-32px vertical separation.
4. Right rails use 16px internal spacing and compact headings.

## Core Components

### DiagnosticStatusBadge

Shows diagnostic lifecycle state with text and icon.

| Status | Russian Label |
|---|---|
| `draft` | `Черновик` |
| `data_requested` | `Данные запрошены` |
| `data_received` | `Данные получены` |
| `analyzing` | `Идет анализ` |
| `expert_review` | `Экспертная проверка` |
| `delivered` | `Доставлено` |
| `archived` | `Архив` |

### DataQualityMeter

Shows:

- numeric score;
- label;
- one sentence explaining decision confidence;
- top blocking reason if any.

Labels:

| Score | Label |
|---:|---|
| 80-100 | `Достаточно для решения` |
| 60-79 | `Можно использовать с оговорками` |
| 40-59 | `Низкая уверенность` |
| 0-39 | `Недостаточно для решения` |

### DataPackChecklist

Grouped checklist for BDR/P&L, Cash, Balance, Working capital, Debt, CAPEX, Finance team.

Each row must include:

- report name;
- required/optional status;
- why it matters;
- current status;
- period;
- last update;
- action.

Do not center the workflow around a naked file input.

### EvidenceDisclosure

Collapsed:

- conclusion title;
- severity;
- confidence;
- one-sentence conclusion.

Expanded:

- source document;
- period;
- formula;
- value;
- evidence type: `verified fact`, `calculated metric`, `management assumption`, `AI hypothesis`.

### ExpertReviewBadge

Founder-facing trust badge near executive verdict.

| Internal Status | Founder Label |
|---|---|
| `not_reviewed` | `AI draft, эксперт еще не проверил` |
| `needs_clarification` | `Нужны уточнения по данным` |
| `reviewed` | `Проверено финансовым экспертом` |
| `blocked` | `Нельзя использовать для решения` |

### DecisionCard

Each decision card contains:

- action;
- owner;
- deadline;
- estimated impact on EBITDA, FCF, working capital, or risk;
- reversibility;
- evidence link.

### BriefSectionNav

Sticky desktop rail for long owner brief:

1. Executive verdict.
2. What changed.
3. Risk radar.
4. Data quality.
5. Evidence.
6. Decision cards.
7. Questions for finance.
8. 30/60/90 plan.

On mobile this becomes a collapsible `Итог` panel.

## Screen Contracts

### Diagnostics List

Primary question: `Какие платные разборы сейчас в работе и что мешает доставке?`

Must show:

1. Pipeline summary.
2. Diagnostic table/list.
3. Next action per project.
4. Data quality and expert review status.
5. First revenue progress: target 5 paid diagnostics.

### New Diagnostic

Primary question: `Какой paid offer мы продаем этому фаундеру?`

Starts with offer cards:

1. Founder Financial Second Opinion — 75-150k RUB, 7-14 days.
2. Monthly Owner Brief — 75-300k RUB/month.
3. Trigger Review — 100-300k RUB/event.

Only after offer selection show the form.

### Data Pack

Primary question: `Каких данных хватает для доказательного вывода, а чего не хватает?`

Must feel like due diligence, not uploading homework.

### Data Quality

Primary question: `Можно ли уже принимать решение на этих данных?`

Translate technical gaps into business limits:

- Bad: `field missing`.
- Good: `Не хватает БДДС, поэтому выводы о кассовом разрыве будут низкой уверенности.`

### Founder Brief

Primary question: `Что собственнику нужно понять и сделать?`

Must read as an executive memo:

1. Executive verdict.
2. What changed.
3. Risk radar.
4. Data quality.
5. Evidence-backed conclusions.
6. Decision cards.
7. Questions for finance team.
8. Finance maturity and hiring.
9. 30/60/90 plan.
10. Disclaimer.

## Content Voice

Tone:

- calm;
- senior;
- specific;
- non-judgmental;
- decision-oriented.

Preferred Russian phrases:

| Use | Avoid |
|---|---|
| `Не хватает данных для уверенного вывода` | `Данные плохие` |
| `Это снижает уверенность` | `Вы не предоставили` |
| `Что запросить у финансовой команды` | `Что они не сделали` |
| `Достаточно для решения` | `ОК` |
| `Можно использовать с оговорками` | `Почти нормально` |

Avoid:

- school-like language;
- "financial literacy" shaming;
- generic AI reassurance;
- hype words;
- long legalistic disclaimers in primary reading flow.

## Motion

- **Approach:** minimal-functional.
- **Duration:** micro 75ms, short 160ms, medium 240ms.
- **Easing:** ease-out for enter, ease-in for exit, ease-in-out for movement.

Allowed:

1. Disclosure open/close.
2. Drawer open/close.
3. Row hover.
4. Checklist status transitions.
5. Toast enter/exit.

Avoid expressive animation and scroll choreography.

## Accessibility

Target WCAG 2.2 AA.

Requirements:

1. Touch targets at least 44px.
2. Visible focus states.
3. Keyboard navigation for checklist rows, evidence disclosures, segmented controls, tables, and export actions.
4. Status/risk/confidence labels include text and icon, not color only.
5. Normal text contrast at least 4.5:1.
6. Brief navigation must not trap focus.
7. Tables convert to stacked list rows on mobile.

## Localization

Russian is the default locale. English must duplicate the same information architecture and section order later.

Rules:

1. Build layouts for long English and Russian text.
2. Keep finance aliases where useful: `BDR / P&L`, `BDDS / Cash Flow`, `DSO`, `DIO`, `DPO`, `CAPEX`, `WACC`.
3. Do not generate labels ad hoc from AI output; labels are product copy.
4. AI answers and founder briefs should use the same section order in both languages.

## Preview Artifact

The current design consultation preview is:

- [Design System Preview](docs/design-system-preview.html)

It shows realistic diagnostics list, data pack, data quality, and founder brief surfaces using this design system.

## Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-06-27 | Use Executive Finance Cockpit as the initial direction | The product handles sensitive financial decisions and needs seriousness over flash |
| 2026-06-27 | Use Commissioner + IBM Plex Sans + IBM Plex Mono | Strong Cyrillic support, readable dense UI, tabular financial values |
| 2026-07-15 | Shift direction to Quiet Owner Assurance | First revenue depends on trust in a paid founder brief, not just dashboard competence |
| 2026-07-15 | Use Cloud Dancer-inspired base, deep navy, and treasury teal | Pantone 2026 gives a calm document surface; navy adds authority; teal marks verified progress |
| 2026-07-15 | Make expert review a visible founder-facing badge | Expert verification is part of the paid trust model |
| 2026-07-15 | Treat data quality as a first-class UI surface | Founders pay to know whether the numbers are decision-grade |
