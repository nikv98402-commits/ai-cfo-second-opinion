import type { CaseProfile, FinanceMetrics, HiringRecommendation, RedFlag } from "@/lib/finance/types";

export function recommendHire(caseProfile: CaseProfile, metrics: FinanceMetrics, redFlags: RedFlag[]): HiringRecommendation {
  const hasDebtRisk = redFlags.some((flag) => flag.category === "debt" || flag.id.includes("dscr"));
  const hasCashRisk = redFlags.some((flag) => flag.category === "liquidity");
  const hasControlGap = redFlags.some((flag) => flag.category === "finance_maturity");
  const hasCapexRisk = redFlags.some((flag) => flag.category === "capex");

  if (caseProfile.hasDebt && (hasDebtRisk || hasCashRisk || metrics.dscr < 1.2)) {
    return {
      role: "Казначей / Treasury lead",
      whyNow: "Есть долг, слабая cash conversion и риск кассовых разрывов. CEO нужен платежный контур до найма стратегического CFO.",
      keyResponsibilities: ["13-недельный платежный календарь", "График долга и ковенанты", "Лимиты платежей и ДЗ", "Еженедельный cash committee"],
      expectedSalaryRange: "250-400 тыс. RUB gross / month",
      interviewQuestions: ["Как вы строите 13-недельный cash forecast?", "Как связываете DSCR с платежным календарем?", "Какие платежи блокируете первыми при cash gap?"],
      testTask: "Собрать cash forecast на 13 недель по данным БДДС, графику долга и ДЗ.",
      first90DaysGoals: ["Платежный календарь работает еженедельно", "Debt schedule связан с cash forecast", "CEO видит 3 cash сценария"]
    };
  }

  if (hasControlGap || caseProfile.annualRevenue > 1_000_000_000) {
    return {
      role: "Финансовый контролер / Head of Finance",
      whyNow: "Компания уже крупная, но финфункция не дает связку BDR, Cash Flow, Balance и план-факт.",
      keyResponsibilities: ["Месячное закрытие управленческой отчетности", "План-факт", "Контроль качества данных", "Управленческий баланс"],
      expectedSalaryRange: "300-550 тыс. RUB gross / month",
      interviewQuestions: ["Как вы внедряли plan-fact с нуля?", "Как проверяете связь P&L, Cash Flow и Balance?", "Какие ошибки чаще всего находите в управленке?"],
      testTask: "Найти несостыковки между BDR, BDDS и Balance за период.",
      first90DaysGoals: ["Единый пакет трех форм", "План-факт по ключевым статьям", "Список data quality проблем"]
    };
  }

  if (hasCapexRisk) {
    return {
      role: "FP&A аналитик",
      whyNow: "Есть CAPEX и сценарные решения, но нет достаточной аналитики ROI/WACC, скидок и operating leverage.",
      keyResponsibilities: ["CAPEX model", "Discount break-even", "Scenario planning", "Unit economics"],
      expectedSalaryRange: "220-380 тыс. RUB gross / month",
      interviewQuestions: ["Как считаете ROI vs WACC?", "Как моделируете скидку и break-even volume?", "Как объясняете сценарий CEO?"],
      testTask: "Построить сценарную модель скидки 12% и CAPEX проекта.",
      first90DaysGoals: ["3 ключевые модели решений", "Единая библиотека assumptions", "Шаблон investment memo"]
    };
  }

  return {
    role: "Не нанимать CFO сейчас",
    whyNow: "Сначала нужен базовый контур отчетности, контроля и казначейства; дорогой CFO будет закрывать операционные дыры.",
    keyResponsibilities: ["Закрыть базовую отчетность", "Назначить владельца cash flow", "Собрать план-факт"],
    expectedSalaryRange: "Сначала 180-350 тыс. RUB для контролера/аналитика",
    interviewQuestions: ["Кто будет владельцем данных?", "Какие отчеты обязательны каждый месяц?", "Какие решения нужно снять с CEO?"],
    testTask: "Собрать управленческий пакет за месяц и список несостыковок.",
    first90DaysGoals: ["BDR/BDDS/Balance пакет", "Платежный календарь", "Первые decision models"]
  };
}
