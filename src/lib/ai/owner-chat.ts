import { decisionCards, evidenceItems, sampleCase, sampleInputs } from "@/lib/data/sample";
import { analyzeCase } from "@/lib/finance/analysis";
import type { ChatMessage } from "@/lib/ai/provider";

const analysis = analyzeCase(sampleCase, sampleInputs);

export function buildOwnerChatMessages(userMessage: string, history: ChatMessage[] = []): ChatMessage[] {
  return [
    {
      role: "system",
      content: [
        "You are AI-CFO Second Opinion for Russian-speaking founders and non-financial C-level leaders.",
        "Russian is the primary language. English is a full duplicate only when the user asks for it.",
        "Your job is second opinion on management finance decisions for companies around 0.5-5B RUB revenue.",
        "Never invent numbers. Separate facts, deterministic calculations, assumptions, and recommendations.",
        "High-stakes conclusions must say that expert review is required.",
        "Use concise executive language. Avoid generic financial education unless it helps the decision."
      ].join(" ")
    },
    {
      role: "user",
      content: buildContextPrompt(userMessage)
    },
    ...history.slice(-6),
    { role: "user", content: userMessage }
  ];
}

function buildContextPrompt(userMessage: string) {
  const current = sampleInputs[sampleInputs.length - 1];
  return [
    "Context for the active demo case:",
    `Company: ${sampleCase.companyName}. Industry: ${sampleCase.industry}. Annual revenue: ${sampleCase.annualRevenue} RUB.`,
    `Latest period: ${current.periodName}. Revenue: ${current.revenue} RUB. EBITDA: ${current.ebitda} RUB. Net profit: ${current.netProfit} RUB. Operating cash flow: ${current.operatingCashFlow} RUB. Cash: ${current.cash} RUB.`,
    `Risk score: ${analysis.riskScore}/100 (${analysis.riskLevel}). Finance maturity: ${analysis.financeMaturity.averageScore}/100.`,
    `Hiring recommendation: ${analysis.hiringRecommendation.role}.`,
    `Decision cards: ${decisionCards.map((card) => `${card.action} (${card.impact})`).join("; ")}.`,
    `Evidence: ${evidenceItems.map((item) => `${item.conclusion}; source=${item.source}; formula=${item.formula}; confidence=${item.confidence}%`).join(" | ")}.`,
    "The user's new question follows. Answer as a CFO second-opinion assistant, not as an accountant.",
    userMessage
  ].join("\n");
}
