# Design System — AI-CFO Second Opinion

## Product Context

- **What this is:** A SaaS workspace that gives CEOs, COOs, owners, and other non-financial C-level leaders a structured AI-CFO second opinion on financial decisions.
- **Who it's for:** Executives in growing Russian companies around 0.5-5B RUB revenue, especially distribution, wholesale, e-commerce, retail, and B2B services.
- **Space/industry:** B2B finance, executive decision support, financial maturity diagnostics, AI-assisted analysis.
- **Project type:** Web application / dashboard / operational finance tool.
- **Language model:** Russian is the primary/default product language; English is a complete duplicate locale across every workflow, state, report, prompt, and export.

## Aesthetic Direction

- **Direction:** Executive Finance Cockpit.
- **Decoration level:** Intentional, restrained, data-led.
- **Mood:** Calm, exacting, and quietly senior. The product should feel like a competent finance operator sitting next to the CEO, not like a startup landing page or a generic AI chatbot.
- **Reference behavior:** Dense operational products, banking dashboards, trading/treasury workspaces, and mature enterprise SaaS.

## Design Principles

1. **Decision first:** Every screen should answer what the user should check, decide, or provide next.
2. **Context visible:** Company baseline, maturity stage, data freshness, and missing data should stay near the user's active decision.
3. **Confidence is designed:** AI answers, diagnostics, and imported metrics must show confidence, assumptions, and source context.
4. **Dense but calm:** Prefer compact information layout, not visual noise.
5. **No shame:** Never make the user feel financially illiterate. The product explains and guides without school-like tone.
6. **No generic AI SaaS look:** Avoid purple gradients, centered hero blocks, decorative blobs, gradient CTAs, and icon-in-circle feature grids.

## Typography

- **Display / Page Titles:** Commissioner — structured, serious, strong Cyrillic support, distinctive without feeling decorative.
- **Body / UI:** IBM Plex Sans — clear in Cyrillic and Latin, strong for form labels, dense dashboards, and long explanations.
- **Data / Tables:** IBM Plex Mono — use for financial values, metric codes, imported column previews, and calculation snippets.
- **Code / Technical:** IBM Plex Mono.
- **Loading:** Google Fonts or self-hosted production assets.

Recommended font loading:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Commissioner:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;450;500;600;700&display=swap" rel="stylesheet">
```

Type scale:

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px | 16px | table metadata, helper text |
| `text-sm` | 14px | 20px | labels, compact body, table cells |
| `text-md` | 16px | 24px | primary body, chat answers |
| `text-lg` | 18px | 28px | panel headings |
| `text-xl` | 22px | 30px | page section headings |
| `text-2xl` | 28px | 36px | page titles |
| `text-3xl` | 36px | 44px | rare first-screen headline |

Rules:

1. Use tabular numbers for financial values.
2. Do not scale font size with viewport width.
3. Keep letter spacing at `0`.
4. Avoid hero-scale type inside dashboard panels.

## Color

### Approach

Restrained neutral base with teal primary action, blue-gray information, and clear risk colors. The palette should not read as purple, dark-blue-only, beige, brown/orange, or monochrome.

### Core Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `ink-900` | `#17201F` | primary text |
| `ink-700` | `#34413F` | secondary text |
| `ink-500` | `#65716F` | muted text |
| `paper-000` | `#FCFCFA` | app background |
| `paper-050` | `#F6F7F4` | subtle surface |
| `paper-100` | `#ECEFEB` | raised surface |
| `line-200` | `#D9DFDA` | borders |
| `line-300` | `#C4CDC7` | stronger borders |
| `teal-700` | `#0F6F64` | primary action |
| `teal-800` | `#0A554D` | primary hover |
| `slate-700` | `#40546A` | informational accent |
| `amber-600` | `#B97810` | medium risk |
| `red-650` | `#B3342B` | high risk |
| `green-650` | `#287A4D` | ok / low risk |
| `blue-650` | `#2E6E9E` | source links and info |

### Semantic Tokens

| State | Text | Background | Border |
|-------|------|------------|--------|
| Success | `#287A4D` | `#EAF5EE` | `#B8DCC4` |
| Warning | `#8A5B0B` | `#FFF4DC` | `#E8C06B` |
| Error | `#B3342B` | `#FCEBE9` | `#E6AAA4` |
| Info | `#2E6E9E` | `#EAF3FA` | `#B8D1E5` |
| Neutral | `#34413F` | `#F6F7F4` | `#D9DFDA` |

### Dark Mode

Dark mode is optional for MVP. If added, redesign surfaces instead of simply inverting colors. Reduce saturation 10-20%, keep risk labels readable, and preserve table contrast.

## Spacing

- **Base unit:** 4px.
- **Density:** Compact for dashboard/table surfaces, comfortable for onboarding and diagnostic flows.

| Token | Value |
|-------|-------|
| `space-2xs` | 2px |
| `space-xs` | 4px |
| `space-sm` | 8px |
| `space-md` | 16px |
| `space-lg` | 24px |
| `space-xl` | 32px |
| `space-2xl` | 48px |
| `space-3xl` | 64px |

Rules:

1. Tables and sidebars use 8-16px internal spacing.
2. Diagnostic forms use 16-24px vertical rhythm.
3. Avoid decorative whitespace that hides operational content.

## Layout

- **Approach:** Grid-disciplined operational layout.
- **Desktop:** persistent left sidebar, top bar, main workspace, right context rail.
- **Tablet:** collapsible sidebar, right context as slide-over.
- **Mobile:** bottom navigation, one primary task per screen, context as sheet.
- **Max content width:** no fixed marketing max width for app screens; use responsive grid regions.
- **Panel radius:** 6px.
- **Button radius:** 6px.
- **Input radius:** 6px.
- **Modal radius:** 8px.
- **Avoid:** rounded 16-24px SaaS blobs unless there is a clear component need.

## Component Rules

### App Shell

- Left navigation stays visible on desktop.
- Top bar contains company switcher, period selector, data freshness, and user menu.
- Right rail contains company baseline, maturity stage, missing data, recent risks, and source documents.

### Buttons

- Primary buttons use `teal-700`.
- Secondary buttons are neutral outline.
- Ghost buttons are text/icon only.
- Use icons for upload, search, filter, settings, download, warning, check, and close.
- Do not use gradient buttons.

### Risk and Confidence Labels

Risk and confidence must never rely on color alone.

Required label shape:

```text
High risk    red border + text + warning icon
Medium risk  amber border + text + warning icon
Low risk     green border + text + check icon
Low confidence  neutral border + text + info icon
```

### AI Answer Blocks

AI answers use a predictable structure:

1. Short answer.
2. Assumptions.
3. P&L / cash flow / balance sheet logic.
4. Calculations used.
5. Key risks.
6. Data needed.
7. Questions for finance team.
8. Recommended next action.
9. Confidence and disclaimer.

Use collapsible sections only after the short answer and risk summary are visible.

### Tables

- Use sticky headers for long tables.
- Use IBM Plex Mono for financial values.
- Align numbers right.
- Never truncate critical values without tooltip or expansion.
- On mobile, convert rows into stacked list items.

### Upload Mapping

The upload mapping UI must show:

1. Sheet preview.
2. Report type selector.
3. Required column mapping.
4. Validation warnings.
5. Confirm import step.

Never silently import ambiguous data.

## Motion

- **Approach:** Minimal-functional.
- **Duration:** micro 75ms, short 160ms, medium 240ms.
- **Easing:** standard ease-out for enter, ease-in for exit, ease-in-out for movement.

Allowed:

1. Row hover.
2. Drawer open/close.
3. Toast enter/exit.
4. Progress transitions in upload and diagnostic flows.
5. AI answer streaming with reduced-motion fallback.

Avoid expressive motion, scroll choreography, or decorative animation.

## Accessibility

Target WCAG 2.2 AA.

Requirements:

1. Minimum touch target: 44px.
2. Visible focus states for all interactive controls.
3. Keyboard navigation for app shell, chat composer, questionnaire, upload mapping, tables, filters, and dialogs.
4. ARIA landmarks for navigation, main content, complementary context rail, and dialogs.
5. Risk and confidence labels include text and icon, not color only.
6. Normal text contrast target: at least 4.5:1.
7. Large text contrast target: at least 3:1.
8. Do not trap focus in drawers or modals.

## Content Voice

### Localization

The design system must support full Russian and English parity from the first UI build.

Rules:

1. Every component state must have Russian and English copy before it is considered ready.
2. Russian is the default locale; English must never lag as a partial or admin-only translation.
3. Language switching belongs in user/account settings and can also appear in unauthenticated onboarding.
4. UI layouts must tolerate English labels that are longer than Russian and Russian explanatory text that wraps across more lines.
5. Do not mix languages inside the same sentence except for accepted finance abbreviations and aliases such as "BDR / P&L", "BDDS / Cash Flow", "DSO", "CAPEX", and "WACC".
6. Risk labels, confidence labels, diagnostic stages, upload warnings, and AI answer headings need explicit translations, not generated ad hoc by the LLM.
7. AI answer templates should preserve the same section order in both languages.

Tone:

- Calm.
- Direct.
- Executive.
- Specific.
- Non-judgmental.

Avoid:

- "You lack financial literacy."
- "Just learn finance."
- Generic AI reassurance.
- Hype words.
- School-like quizzes.

Preferred language:

- "What this means."
- "What may be risky."
- "What data would improve confidence."
- "Questions to ask your finance team."
- "Recommended next action."

## Screen Guidance

### Overview

Executive risk cockpit, not BI dashboard.

Must show:

1. Next best action.
2. Maturity stage.
3. Top risks.
4. Open decision cases.
5. Data freshness.
6. Finance function gaps.

### Ask AI-CFO

Case workspace, not blank chatbot.

Must show:

1. Case header.
2. Question composer.
3. Structured answer.
4. Attached context.
5. Missing data.
6. Source documents.

### Diagnostic

Serious health check, not gamified quiz.

Must show:

1. Seven finance blocks.
2. Progress per block.
3. "Why this matters."
4. "I don't know" option.
5. Confidence impact.

### Uploads

Trust-building import workflow.

Must show:

1. File preview.
2. Sheet selection.
3. Report type mapping.
4. Column mapping.
5. Validation.
6. Confirm import.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-27 | Use Executive Finance Cockpit as the initial aesthetic direction | The product handles sensitive financial decisions for CEOs/COOs and needs to feel serious, operational, and trustworthy |
| 2026-06-27 | Use Commissioner + IBM Plex Sans + IBM Plex Mono | Strong Cyrillic support, clear dashboard readability, and tabular finance values without overused default SaaS typography |
| 2026-06-27 | Use restrained neutral palette with teal primary and semantic risk colors | Supports dense B2B finance workflows without generic AI SaaS purple/gradient patterns |
| 2026-06-27 | Prefer chat-first progressive context | Users expect useful AI interaction quickly, while the product can collect structured diagnostic context over time |
| 2026-06-27 | Make Russian primary and English a full duplicate locale | The target market is Russian-speaking, but the product and AI workflows must be ready for bilingual executives, investors, partners, and future expansion |
