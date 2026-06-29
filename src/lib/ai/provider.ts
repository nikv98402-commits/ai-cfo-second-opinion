import type { AnalysisResult } from "@/lib/finance/types";

export interface AiProvider {
  generateExecutiveSummary(input: AnalysisResult): Promise<string>;
  generateOwnerEducationBlock(input: AnalysisResult): Promise<string>;
  generateQuestionsToFinanceTeam(input: AnalysisResult): Promise<string[]>;
  generateNextActions(input: AnalysisResult): Promise<string[]>;
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
}

class OpenAiProvider implements AiProvider {
  private readonly apiKey = process.env.OPENAI_API_KEY;

  private async call(prompt: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI CFO second-opinion assistant. Give concise executive finance analysis in Russian. Never invent numbers; state assumptions and missing data."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const json = await response.json();
    return json.choices?.[0]?.message?.content || "";
  }

  async generateExecutiveSummary(input: AnalysisResult) {
    return this.call(`Summarize this finance analysis for a CEO:\n${input.markdownReport}`);
  }

  async generateOwnerEducationBlock(input: AnalysisResult) {
    return this.call(`Explain the core finance logic simply for an owner:\n${input.markdownReport}`);
  }

  async generateQuestionsToFinanceTeam(input: AnalysisResult) {
    const text = await this.call(`Generate 8 sharp questions to the finance team:\n${input.markdownReport}`);
    return text.split("\n").map((line) => line.replace(/^[-\d. ]+/, "").trim()).filter(Boolean).slice(0, 8);
  }

  async generateNextActions(input: AnalysisResult) {
    const text = await this.call(`Generate 5 next actions for the CEO:\n${input.markdownReport}`);
    return text.split("\n").map((line) => line.replace(/^[-\d. ]+/, "").trim()).filter(Boolean).slice(0, 5);
  }
}

export function getAiProvider(): AiProvider {
  const mock = process.env.MOCK_AI !== "false";
  if (mock) return new MockAiProvider();
  return new OpenAiProvider();
}
