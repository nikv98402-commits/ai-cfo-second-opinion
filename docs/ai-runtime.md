# AI runtime: Qwen3 + llama.cpp/vLLM

The MVP uses an OpenAI-compatible AI provider contract. This lets the product run with:

- `MOCK_AI=true` for deterministic investor demos with no external dependency.
- Qwen3 served locally through `llama.cpp`.
- Qwen3 served on GPU through `vLLM`.
- Any cloud endpoint that exposes `/v1/chat/completions`.

## Product boundary

The LLM is not the financial calculation engine.

The product split is:

1. Data pack: questionnaire, Excel, BDR/P&L, BDDS/Cash Flow, balance, debt schedule.
2. Finance engine: ratios, three-statement checks, cash gap, DSCR, margin sensitivity, ROI vs WACC.
3. Evidence layer: source, formula, confidence, missing data.
4. LLM layer: explanation, second opinion dialogue, founder brief, CFO questions.
5. Expert review: required for high-stakes conclusions.

## Environment

```bash
MOCK_AI=false
OPENAI_COMPATIBLE_BASE_URL=http://127.0.0.1:8080/v1
OPENAI_COMPATIBLE_API_KEY=
AI_MODEL=Qwen/Qwen3-8B
```

For mock mode:

```bash
MOCK_AI=true
```

## llama.cpp local demo

Run a Qwen3 GGUF model with an OpenAI-compatible server:

```bash
llama-server -m ./models/qwen3-8b.gguf --host 127.0.0.1 --port 8080
```

Then run the app:

```bash
npm run dev -- -p 4194 -H 127.0.0.1
```

## vLLM GPU demo

For a stronger demo on a GPU machine:

```bash
vllm serve Qwen/Qwen3-8B --host 127.0.0.1 --port 8080
```

The app talks to the same OpenAI-compatible endpoint, so no frontend change is needed.

## Current UI

The landing dashboard includes a dialogue chat. It calls:

```text
POST /api/ai/chat
```

The endpoint injects the active demo case, deterministic analysis, decision cards, and evidence items into the prompt. The answer must separate facts, calculations, assumptions, and recommendations.
