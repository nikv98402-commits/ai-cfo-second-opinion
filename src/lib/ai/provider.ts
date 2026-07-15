import type { AnalysisResult } from "@/lib/finance/types";

export type AiProviderName = "mock" | "openai-compatible";
export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatCompletionInput {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatCompletionResult {
  content: string;
  provider: AiProviderName;
  model: string;
}

export interface AiRuntimeStatus {
  provider: AiProviderName;
  model: string;
  baseUrl?: string;
  isMock: boolean;
  financeBoundary: string;
}

export interface AiProvider {
  generateExecutiveSummary(input: AnalysisResult): Promise<string>;
  generateOwnerEducationBlock(input: AnalysisResult): Promise<string>;
  generateQuestionsToFinanceTeam(input: AnalysisResult): Promise<string[]>;
  generateNextActions(input: AnalysisResult): Promise<string[]>;
  completeChat(input: ChatCompletionInput): Promise<ChatCompletionResult>;
}

class MockAiProvider implements AiProvider {
  async generateExecutiveSummary(input: AnalysisResult) {
    return input.executiveSummary;
  }

  async generateOwnerEducationBlock(input: AnalysisResult) {
    return input.ownerEducationBlock;
  }

  async generateQuestionsToFinanceTeam(input: AnalysisResult) {
    return input.questionsToFinanceTeam;
  }

  async generateNextActions(input: AnalysisResult) {
    return input.nextActions;
  }

  async completeChat(input: ChatCompletionInput): Promise<ChatCompletionResult> {
    const lastUserMessage = [...input.messages].reverse().find((message) => message.role === "user")?.content || "";
    return {
      provider: "mock",
      model: "deterministic-demo",
      content: buildMockChatAnswer(lastUserMessage)
    };
  }
}

class OpenAiCompatibleProvider implements AiProvider {
  private readonly apiKey = process.env.OPENAI_COMPATIBLE_API_KEY || process.env.OPENAI_API_KEY;
  private readonly baseUrl = normalizeBaseUrl(process.env.OPENAI_COMPATIBLE_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1");
  private readonly model = process.env.AI_MODEL || process.env.OPENAI_MODEL || "Qwen/Qwen3-8B";

  private async call(input: ChatCompletionInput): Promise<ChatCompletionResult> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    if (this.apiKey) headers.Authorization = `Bearer ${this.apiKey}`;

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: input.model || this.model,
        messages: input.messages,
        temperature: input.temperature ?? 0.2,
        max_tokens: input.maxTokens ?? 900
      })
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      throw new Error(`AI provider failed: ${response.status}${details ? ` ${details.slice(0, 240)}` : ""}`);
    }

    const json = await response.json();
    return {
      provider: "openai-compatible",
      model: input.model || this.model,
      content: json.choices?.[0]?.message?.content || ""
    };
  }

  async completeChat(input: ChatCompletionInput): Promise<ChatCompletionResult> {
    return this.call(input);
  }

  async generateExecutiveSummary(input: AnalysisResult) {
    return this.call(buildSinglePrompt(`Summarize this finance analysis for a CEO:\n${input.markdownReport}`)).then((result) => result.content);
  }

  async generateOwnerEducationBlock(input: AnalysisResult) {
    return this.call(buildSinglePrompt(`Explain the core finance logic simply for an owner:\n${input.markdownReport}`)).then((result) => result.content);
  }

  async generateQuestionsToFinanceTeam(input: AnalysisResult) {
    const text = await this.call(buildSinglePrompt(`Generate 8 sharp questions to the finance team:\n${input.markdownReport}`)).then((result) => result.content);
    return text.split("\n").map((line) => line.replace(/^[-\d. ]+/, "").trim()).filter(Boolean).slice(0, 8);
  }

  async generateNextActions(input: AnalysisResult) {
    const text = await this.call(buildSinglePrompt(`Generate 5 next actions for the CEO:\n${input.markdownReport}`)).then((result) => result.content);
    return text.split("\n").map((line) => line.replace(/^[-\d. ]+/, "").trim()).filter(Boolean).slice(0, 5);
  }
}

export function getAiProvider(): AiProvider {
  const provider = getAiProviderName();
  if (provider === "mock") return new MockAiProvider();
  return new OpenAiCompatibleProvider();
}

export function getAiRuntimeStatus(): AiRuntimeStatus {
  const provider = getAiProviderName();
  return {
    provider,
    isMock: provider === "mock",
    model: provider === "mock" ? "deterministic-demo" : process.env.AI_MODEL || process.env.OPENAI_MODEL || "Qwen/Qwen3-8B",
    baseUrl: provider === "mock" ? undefined : process.env.OPENAI_COMPATIBLE_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    financeBoundary: "LLM explains and challenges; calculations, ratios, evidence and confidence are deterministic."
  };
}

export function getAiProviderName(): AiProviderName {
  if (process.env.MOCK_AI !== "false") return "mock";
  return "openai-compatible";
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

function buildSinglePrompt(prompt: string): ChatCompletionInput {
  return {
    messages: [
      {
        role: "system",
        content:
          "You are an AI CFO second-opinion assistant for Russian-speaking founders. Give concise executive finance analysis in Russian. Never invent numbers; state assumptions and missing data."
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  };
}

function buildMockChatAnswer(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("скид") || lower.includes("margin") || lower.includes("марж")) {
    return [
      "В демо-режиме я бы проверил скидку через contribution margin, а не только через рост выручки.",
      "1. Посчитать валовую маржу по каналу после логистики, комиссий и маркетинга.",
      "2. Сравнить ее с постоянными расходами и операционным рычагом.",
      "3. Если скидка уводит канал ниже contribution margin, решение стоит остановить или ограничить тестом.",
      "Для high-stakes вывода нужен экспертный review и исходные данные по каналам."
    ].join("\n");
  }
  if (lower.includes("cash") || lower.includes("день") || lower.includes("ликвид")) {
    return [
      "Первый фокус - не прибыль, а 13-недельная ликвидность.",
      "Я бы попросил БДДС, bank-client сверку, aging ДЗ, график долга и план платежей.",
      "Дальше finance engine считает cash bridge, DSO/DIO/DPO, DSCR и размер кассового разрыва. LLM только объясняет выводы собственнику."
    ].join("\n");
  }
  if (lower.includes("нан") || lower.includes("cfo") || lower.includes("финанс")) {
    return [
      "На этой стадии не всегда нужен дорогой CFO первым наймом.",
      "Если главная боль - ликвидность и платежный календарь, сначала нужен сильный казначей/финансовый контролер.",
      "Если боль - план-факт, маржинальность по каналам и сценарии, нужен FP&A lead. CFO имеет смысл, когда уже есть базовая отчетность и нужен капитал, M&A или сложная структура группы."
    ].join("\n");
  }
  return [
    "Я могу дать second opinion, но буду разделять три слоя: факты из data pack, расчеты finance engine и управленческую интерпретацию.",
    "Для надежного вывода пришлите контекст решения, сумму эффекта, период, БДР/БДДС/баланс или хотя бы ключевые метрики. High-stakes решения должны идти через expert review."
  ].join("\n");
}
