# AI-CFO Second Opinion

AI-CFO Second Opinion is a SaaS product concept for CEOs, COOs, owners, and other non-financial C-level leaders in growing companies who need a fast second opinion on financial decisions.

The product focuses on Russian small and mid-sized companies around 0.5-5B RUB annual revenue, especially distribution, wholesale, e-commerce, retail, and B2B services.

The product is bilingual from day one: Russian is the primary language, and English is a complete duplicate for every user-facing workflow, screen, report, prompt, answer, export, and support/error state.

## Core Idea

Many companies at this stage already have real financial complexity: revenue growth, receivables, inventory, discounts, CAPEX, loans, cash gaps, and management reporting. But their finance function often still behaves like accounting plus Excel, not strategic finance.

The product helps a non-financial executive answer questions like:

- Is this discount safe, or will it destroy margin?
- Why do we have profit but no cash?
- Is CAPEX-driven profit decline actually bad?
- Should we hire a CFO now, or first strengthen treasury and FP&A?
- Are receivables growing into a liquidity risk?
- Is our finance team building the right reporting and control system?

## Working MVP Prototype

This repository now contains a working Next.js prototype, not only a static showcase. The current app runs in `MOCK_AI=true` mode and uses deterministic rule-based analysis, so it works without an OpenAI API key.

Current prototype scope:

1. Executive dashboard with a sample case.
2. Case creation flow.
3. Upload/mapping page with an Excel template.
4. Automatic finance analysis for liquidity, margin, CAPEX, debt, working capital, operating leverage, and finance maturity.
5. Owner-friendly report with red flags, questions for the finance team, maturity score, hiring recommendation, and Markdown export.
6. Prisma data model prepared for persisted cases, inputs, and analysis results.
7. Architecture prepared for future 1C, bank, ERP, marketplace, and AI-provider integrations.
8. Full Russian/English duplication is a product requirement; Russian is the default language.

## Run Locally

```bash
npm install
npm run dev -- -p 4190 -H 127.0.0.1
```

Open [http://127.0.0.1:4190](http://127.0.0.1:4190).

Useful routes:

- `/` - dashboard
- `/cases/new` - create a case
- `/cases/north-distribution-q2/upload` - upload and mapping workflow
- `/cases/north-distribution-q2/analyze` - rule-based analysis
- `/cases/north-distribution-q2/report` - executive report and Markdown export

Sample upload template:

- `public/templates/financial_case_template.xlsx`

## Quality Checks

```bash
npm run typecheck
npm run build
```

## Product Positioning

AI-CFO second opinion for CEOs and COOs of growing companies: check financial decisions, understand risks, and know what finance function to build next.

## Key Documents

- [Product Spec](docs/product-spec.md)
- [Russian Founder GTM and First Revenue Plan](docs/russian-founder-gtm.md)
- [First-Revenue Founder Brief Spec](docs/specs/first-revenue-founder-brief.md)
- [Backlog](docs/backlog.md)
- [Design System](DESIGN.md)
- [Finalized Prototype](docs/finalized-prototype.html)
- [Design Preview](docs/design-preview.html)

## Status

Working MVP scaffold. The next product step is wiring persisted case creation/upload parsing into the Prisma model, then adding the bilingual content catalog and the first real second-opinion chat flow.
