import type { AnalysisResult, CaseProfile, FinancialInput, RedFlag } from "@/lib/finance/types";
import { calculateMetrics } from "@/lib/finance/metrics";
import { runRules } from "@/lib/finance/rules";
import { calculateRiskScore, riskLevelFromScore } from "@/lib/finance/risk-score";
import { evaluateMaturity } from "@/lib/finance/maturity";
import { recommendHire } from "@/lib/finance/hiring";

const category = (flags: RedFlag[], name: RedFlag["category"]) => flags.filter((flag) => flag.category === name);

export function analyzeCase(caseProfile: CaseProfile, inputs: FinancialInput[]): AnalysisResult {
  const current = inputs[inputs.length - 1];
  const previous = inputs.length > 1 ? inputs[inputs.length - 2] : undefined;
  const metrics = calculateMetrics(current, previous);
  const redFlags = runRules(caseProfile, current, previous, metrics);
  const riskScore = calculateRiskScore(redFlags);
  const riskLevel = riskLevelFromScore(riskScore);
  const financeMaturity = evaluateMaturity(caseProfile);
  const hiringRecommendation = recommendHire(caseProfile, metrics, redFlags);
  const questionsToFinanceTeam = Array.from(new Set(redFlags.flatMap((flag) => flag.questionsToAsk))).slice(0, 12);
  const criticalOrHigh = redFlags.filter((flag) => flag.severity === "critical" || flag.severity === "high");
  const executiveSummary = [
    `Risk score ${riskScore}/100 (${riskLevel}).`,
    criticalOrHigh.length
      ? `Главные зоны риска: ${criticalOrHigh.slice(0, 4).map((flag) => flag.title).join("; ")}.`
      : "Критических красных флагов не найдено, но требуется проверка качества данных.",
    `Следующий найм: ${hiringRecommendation.role}.`
  ].join(" ");
  const ownerEducationBlock =
    "Прибыль и cash могут расходиться: скидки и рост выручки улучшают BDR только тогда, когда contribution margin покрывает fixed costs, а дебиторка и запасы не замораживают больше денег, чем бизнес создает.";
  const nextActions = [
    "Собрать bridge EBITDA -> operating cash flow.",
    "Проверить DSO/DIO/DPO и лимиты оборотного капитала.",
    "Провести cash committee по ближайшим 13 неделям.",
    `Начать поиск роли: ${hiringRecommendation.role}.`
  ];

  const markdownReport = buildMarkdownReport({
    caseProfile,
    result: {
      riskScore,
      riskLevel,
      executiveSummary,
      metrics,
      redFlags,
      financeMaturity,
      hiringRecommendation,
      questionsToFinanceTeam,
      ownerEducationBlock,
      nextActions
    }
  });

  return {
    caseId: caseProfile.id,
    riskScore,
    riskLevel,
    executiveSummary,
    metrics,
    redFlags,
    liquidityRisks: category(redFlags, "liquidity"),
    operatingLeverageRisks: category(redFlags, "operating_leverage"),
    capexRisks: category(redFlags, "capex"),
    debtRisks: category(redFlags, "debt"),
    workingCapitalRisks: category(redFlags, "working_capital"),
    financeMaturity,
    hiringRecommendation,
    questionsToFinanceTeam,
    ownerEducationBlock,
    nextActions,
    markdownReport,
    createdAt: new Date().toISOString()
  };
}

function buildMarkdownReport({ caseProfile, result }: { caseProfile: CaseProfile; result: Omit<AnalysisResult, "caseId" | "createdAt" | "markdownReport" | "liquidityRisks" | "operatingLeverageRisks" | "capexRisks" | "debtRisks" | "workingCapitalRisks"> }) {
  const lines = [
    `# AI CFO Second Opinion: ${caseProfile.companyName}`,
    "",
    "## Executive summary",
    result.executiveSummary,
    "",
    "## Красные флаги",
    ...result.redFlags.map((flag) => `- **${flag.severity.toUpperCase()} / ${flag.category}:** ${flag.title}. ${flag.recommendation}`),
    "",
    "## Кого нанимать следующим",
    `**${result.hiringRecommendation.role}.** ${result.hiringRecommendation.whyNow}`,
    "",
    "## Вопросы финансовой команде",
    ...result.questionsToFinanceTeam.map((question, index) => `${index + 1}. ${question}`),
    "",
    "## Следующие действия",
    ...result.nextActions.map((action, index) => `${index + 1}. ${action}`)
  ];
  return lines.join("\n");
}
