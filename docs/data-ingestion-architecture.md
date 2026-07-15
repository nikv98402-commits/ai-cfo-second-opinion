# Data ingestion architecture for MVP testing

The MVP upload flow is a data room pipeline, not a single generic file input.

## Testing modes

1. Demo template
   - User downloads `public/templates/financial_case_template.xlsx`.
   - The workbook follows the product's normalized sheet structure.
   - This is the fastest path for investor demos and first paid pilots.

2. Manual input
   - User enters key metrics directly.
   - Useful when a founder has numbers in chat, PDF, or screenshots but no clean Excel yet.

3. Manual mapping
   - User uploads their own `.xlsx` or `.csv`.
   - The app reads sheet names, columns, and preview rows.
   - The app suggests mappings such as `Выручка -> revenue`.
   - User confirms the mapping before analysis.

4. AI-assisted parsing
   - Later step.
   - LLM proposes mapping and flags ambiguous fields.
   - Finance engine and user confirmation remain the source of truth.

## Data flow

```text
Case profile
-> Data pack slot
-> Uploaded raw file
-> Sheet and column preview
-> Mapping profile
-> Normalized finance model
-> Data quality checks
-> Finance engine
-> Evidence items
-> LLM owner brief / chat
```

## Data pack slots

Required for MVP:

- company questionnaire;
- BDR / P&L;
- BDDS / Cash Flow;
- balance;
- AR/AP aging;
- debt schedule.

Optional but high-value:

- CAPEX plan;
- sales channels, discounts, margin;
- manual key metrics.

## Storage model

Raw files remain evidence. The product does not use raw Excel as the source of truth.

The source of truth is the normalized model:

- `UploadedFile`;
- `MappingProfile`;
- `FinancialInput`;
- `WorkingCapitalAging`;
- `DebtSchedule`;
- `CapexPlan`;
- `SalesChannelMetric`;
- `EvidenceItem`;
- `AnalysisResult`;
- `OwnerBrief` later.

## LLM boundary

The LLM receives structured context, not arbitrary spreadsheets:

- normalized metrics;
- calculated ratios;
- evidence items;
- confidence limits;
- missing data;
- active decision question.

The LLM can explain, challenge, and draft the owner brief. It must not invent missing numbers or silently override the finance engine.
