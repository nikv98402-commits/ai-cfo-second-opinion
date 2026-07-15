import type { CaseProfile, MaturityBlock } from "@/lib/finance/types";

function block(block: string, score: number, diagnosis: string, missingCapabilities: string[], recommendedNextStep: string): MaturityBlock {
  return { block, score, diagnosis, missingCapabilities, recommendedNextStep };
}

export function evaluateMaturity(caseProfile: CaseProfile) {
  const reports = new Set(caseProfile.reportsAvailable);
  const blocks: MaturityBlock[] = [
    block(
      "Accounting / учет",
      caseProfile.financeOwner === "nobody" ? 1 : 3,
      "Базовый учет есть, но он не равен управленческой финансовой функции.",
      caseProfile.financeOwner === "nobody" ? ["Ответственный за учет"] : [],
      "Разделить учет и управленческие финансы."
    ),
    block(
      "Management reporting / управленческая отчетность",
      reports.has("pnl") && reports.has("cash_flow") && reports.has("balance") ? 3.5 : 2,
      "Три формы отчетности должны быть связаны между собой.",
      ["Единая модель БДР / БДДС / Balance", "Data freshness policy"],
      "Собрать ежемесячный пакет трех форм."
    ),
    block(
      "Treasury / казначейство",
      reports.has("cash_flow") ? 2.5 : 1,
      "Казначейство пока выглядит как отчетность, а не управляемый платежный контур.",
      ["Платежный календарь", "Лимиты платежей", "Debt service calendar"],
      "Внедрить 13-недельный платежный календарь."
    ),
    block(
      "Budgeting / бюджетирование",
      reports.has("variance") ? 3 : 1.5,
      "План-факт нужен для контроля маржи, расходов и cash.",
      reports.has("variance") ? ["Rolling forecast"] : ["План-факт", "ЦФО", "Rolling forecast"],
      "Запустить минимальный forecast и ежемесячный plan-fact."
    ),
    block(
      "FP&A / аналитика",
      caseProfile.hasCapexPlan ? 2.5 : 1.5,
      "Аналитика должна отвечать на решения, а не только объяснять прошлое.",
      ["Scenario modeling", "Unit economics", "Discount break-even"],
      "Добавить сценарные модели по скидкам, CAPEX и working capital."
    ),
    block(
      "Financial control / финконтроль",
      reports.has("variance") ? 2.8 : 1.5,
      "Финконтроль пока неполный: нужна регулярная проверка отклонений и качества данных.",
      ["Контроль данных", "Variance ownership", "Closing calendar"],
      "Назначить владельца закрытия периода и план-факта."
    ),
    block(
      "Investment planning / инвестиционное планирование",
      caseProfile.hasCapexPlan ? 2 : 1,
      "CAPEX есть, но нужен инвестиционный контур ROI/WACC/payback.",
      ["Investment committee", "ROI vs WACC", "Post-investment review"],
      "Не утверждать CAPEX без hurdle rate и payback."
    ),
    block(
      "Debt management / управление долгом",
      caseProfile.hasDebt ? 2 : 3,
      "При долге нужен отдельный контроль ковенант, DSCR и графика платежей.",
      caseProfile.hasDebt ? ["Covenant tracker", "DSCR forecast", "Refinancing calendar"] : [],
      "Связать debt schedule с платежным календарем."
    )
  ];

  const averageScore = blocks.reduce((sum, item) => sum + item.score, 0) / blocks.length;
  const level =
    averageScore <= 1.5
      ? "хаотичная финансовая функция"
      : averageScore <= 2.5
        ? "базовая финансовая функция"
        : averageScore <= 3.5
          ? "переходная финансовая функция"
          : averageScore <= 4.5
            ? "зрелая финансовая функция"
            : "advanced finance function";

  return { averageScore, level, blocks };
}
