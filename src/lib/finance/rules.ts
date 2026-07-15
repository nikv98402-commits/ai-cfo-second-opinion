import type { CaseProfile, FinanceMetrics, FinancialInput, RedFlag } from "@/lib/finance/types";
import { metricDelta } from "@/lib/finance/metrics";

function flag(flag: RedFlag): RedFlag {
  return flag;
}

export function runRules(caseProfile: CaseProfile, current: FinancialInput, previous: FinancialInput | undefined, metrics: FinanceMetrics): RedFlag[] {
  const flags: RedFlag[] = [];
  const monthlyFixedCosts = metrics.fixedCostProxy / 12;
  const revenueGrew = previous ? current.revenue > previous.revenue : false;
  const ebitdaMarginDelta = previous ? current.ebitda / current.revenue - previous.ebitda / previous.revenue : 0;
  const grossMarginDelta = previous ? current.grossProfit / current.revenue - previous.grossProfit / previous.revenue : 0;
  const arInventoryGrowth = previous
    ? current.accountsReceivable + current.inventory > previous.accountsReceivable + previous.inventory
    : false;

  if (metrics.fcf < 0 && current.cashEnd < current.cashStart) {
    flags.push(flag({
      id: "liquidity-negative-fcf-cash-drop",
      title: "FCF отрицательный, cash падает",
      severity: "high",
      category: "liquidity",
      explanation: "Компания финансирует рост или CAPEX за счет денежных остатков и долга.",
      evidence: `FCF ${metrics.fcf.toLocaleString("ru-RU")} RUB; cash change ${metrics.cashChange.toLocaleString("ru-RU")} RUB.`,
      recommendation: "Собрать платежный календарь и bridge EBITDA -> operating cash flow.",
      questionsToAsk: ["Какие платежи критичны в ближайшие 14 дней?", "Какая часть FCF связана с CAPEX?"]
    }));
  }

  if (metrics.cfoToEbitda < 0.5) {
    flags.push(flag({
      id: "liquidity-cfo-ebitda-low",
      title: "Прибыль плохо конвертируется в деньги",
      severity: "high",
      category: "liquidity",
      explanation: "Операционный денежный поток меньше половины EBITDA.",
      evidence: `CFO / EBITDA = ${metrics.cfoToEbitda.toFixed(2)}.`,
      recommendation: "Проверить ДЗ, запасы, авансы поставщикам и условия оплаты.",
      questionsToAsk: ["Как изменились DSO/DIO/DPO?", "Какая сумма зависла в просроченной ДЗ?"]
    }));
  }

  if (current.cashEnd < monthlyFixedCosts * 2) {
    flags.push(flag({
      id: "liquidity-low-runway",
      title: "Низкий запас ликвидности",
      severity: "critical",
      category: "liquidity",
      explanation: "Денег меньше чем на два месяца фиксированных расходов.",
      evidence: `Cash end ${current.cashEnd.toLocaleString("ru-RU")} RUB; 2x monthly fixed costs ${(monthlyFixedCosts * 2).toLocaleString("ru-RU")} RUB.`,
      recommendation: "Утвердить недельный платежный календарь и лимиты платежей.",
      questionsToAsk: ["Какие платежи можно перенести?", "Есть ли доступные кредитные линии?"]
    }));
  }

  if (current.operatingCashFlow < current.debtRepayment) {
    flags.push(flag({
      id: "liquidity-ocf-below-debt-service",
      title: "OCF не покрывает выплаты по долгу",
      severity: "high",
      category: "liquidity",
      explanation: "Операционный денежный поток ниже выплат по кредитам.",
      evidence: `OCF ${current.operatingCashFlow.toLocaleString("ru-RU")} RUB; debt repayment ${current.debtRepayment.toLocaleString("ru-RU")} RUB.`,
      recommendation: "Проверить DSCR, график долга и ковенанты.",
      questionsToAsk: ["Какие выплаты по долгу в следующие 90 дней?", "Есть ли риск нарушения ковенант?"]
    }));
  }

  if (revenueGrew && ebitdaMarginDelta < 0) {
    flags.push(flag({
      id: "profitability-growth-margin-down",
      title: "Выручка растет, EBITDA margin падает",
      severity: ebitdaMarginDelta < -0.03 ? "high" : "medium",
      category: "profitability",
      explanation: "Рост может быть куплен скидками, расходами или неэффективным масштабированием.",
      evidence: `EBITDA margin delta ${(ebitdaMarginDelta * 100).toFixed(1)} pp.`,
      recommendation: "Разложить рост по валовой марже, скидкам и fixed cost.",
      questionsToAsk: ["Какая contribution margin по новым продажам?", "Какие расходы выросли быстрее выручки?"]
    }));
  }

  if (grossMarginDelta < -0.03) {
    flags.push(flag({
      id: "profitability-gross-margin-drop",
      title: "Валовая маржа упала больше чем на 3 п.п.",
      severity: "high",
      category: "profitability",
      explanation: "Падение валовой маржи быстро съедает EBITDA при высокой доле фиксированных расходов.",
      evidence: `Gross margin delta ${(grossMarginDelta * 100).toFixed(1)} pp.`,
      recommendation: "Проверить скидки, закупочные цены, логистику и микс продаж.",
      questionsToAsk: ["Какие SKU/каналы дали падение маржи?", "Была ли промо-акция без break-even модели?"]
    }));
  }

  if (metrics.sgaRatio > 0.35 && ["retail", "distribution", "ecommerce"].includes(caseProfile.industry)) {
    flags.push(flag({
      id: "profitability-sga-high",
      title: "SG&A ratio высокий для торговой модели",
      severity: "medium",
      category: "profitability",
      explanation: "Коммерческие и административные расходы создают давление на операционный рычаг.",
      evidence: `SG&A / revenue = ${(metrics.sgaRatio * 100).toFixed(1)}%.`,
      recommendation: "Проверить структуру расходов и точки операционного leverage.",
      questionsToAsk: ["Какие расходы fixed, а какие variable?", "Что будет с EBITDA при -10% выручки?"]
    }));
  }

  if (metrics.fixedCostRatio > 0.3) {
    flags.push(flag({
      id: "operating-leverage-fixed-cost-high",
      title: "Высокая чувствительность к падению выручки",
      severity: "high",
      category: "operating_leverage",
      explanation: "Fixed cost proxy выше 30% выручки.",
      evidence: `Fixed cost ratio ${(metrics.fixedCostRatio * 100).toFixed(1)}%.`,
      recommendation: "Смоделировать EBITDA при -5% и -10% выручки.",
      questionsToAsk: ["Какие fixed costs можно сделать variable?", "Какой минимальный объем продаж для безубыточности?"]
    }));
  }

  if (metrics.ebitdaSensitivity10 < 0) {
    flags.push(flag({
      id: "operating-leverage-ebitda-negative-at-10-drop",
      title: "EBITDA становится отрицательной при -10% выручки",
      severity: "critical",
      category: "operating_leverage",
      explanation: "Операционный рычаг может резко увести компанию в убыток.",
      evidence: `EBITDA at -10% revenue ${metrics.ebitdaSensitivity10.toLocaleString("ru-RU")} RUB.`,
      recommendation: "Запретить скидки/рост расходов без сценарной модели.",
      questionsToAsk: ["Какая точка безубыточности?", "Есть ли план сокращения fixed costs?"]
    }));
  }

  if (metrics.capexToEbitda > 1) {
    flags.push(flag({
      id: "capex-above-ebitda",
      title: "CAPEX выше EBITDA",
      severity: "high",
      category: "capex",
      explanation: "Инвестиционная программа перегружает внутренний денежный поток.",
      evidence: `CAPEX / EBITDA = ${metrics.capexToEbitda.toFixed(2)}.`,
      recommendation: "Проверить payback, ROI, WACC и источники финансирования.",
      questionsToAsk: ["Какой payback period?", "Что будет с FCF после CAPEX?"]
    }));
  }

  if (current.hasOwnProperty("expectedCapexRoi") && metrics.roiVsWaccGap !== undefined && metrics.roiVsWaccGap <= 0 && caseProfile.hasDebt) {
    flags.push(flag({
      id: "capex-roi-below-wacc-with-debt",
      title: "ROI CAPEX не покрывает WACC при долговом финансировании",
      severity: "critical",
      category: "capex",
      explanation: "Проект может уничтожать стоимость и ухудшать долговую нагрузку.",
      evidence: `ROI - WACC = ${(metrics.roiVsWaccGap * 100).toFixed(1)} pp.`,
      recommendation: "Не утверждать CAPEX без пересчета economics и financing plan.",
      questionsToAsk: ["Какие cash flows проекта?", "Какой hurdle rate утвержден?"]
    }));
  }

  if (metrics.netDebtToEbitda > 3) {
    flags.push(flag({
      id: "debt-net-debt-ebitda-high",
      title: "Net debt / EBITDA выше 3",
      severity: "high",
      category: "debt",
      explanation: "Долговая нагрузка находится в зоне повышенного риска.",
      evidence: `Net debt / EBITDA = ${metrics.netDebtToEbitda.toFixed(2)}.`,
      recommendation: "Проверить ковенанты и план deleverage.",
      questionsToAsk: ["Какие ковенанты?", "Какая EBITDA используется банком?"]
    }));
  }

  if (metrics.interestCoverage < 2) {
    flags.push(flag({
      id: "debt-interest-coverage-low",
      title: "Interest coverage ниже 2",
      severity: "high",
      category: "debt",
      explanation: "EBIT слабо покрывает процентные расходы.",
      evidence: `Interest coverage = ${metrics.interestCoverage.toFixed(2)}.`,
      recommendation: "Проверить стоимость долга и стресс-сценарий ставки.",
      questionsToAsk: ["Какая средняя ставка по долгу?", "Есть ли плавающая ставка?"]
    }));
  }

  if (metrics.dscr < 1.2) {
    flags.push(flag({
      id: "debt-dscr-low",
      title: "DSCR ниже 1.2",
      severity: "high",
      category: "debt",
      explanation: "Операционный cash flow недостаточен для комфортного обслуживания долга.",
      evidence: `DSCR = ${metrics.dscr.toFixed(2)}.`,
      recommendation: "Согласовать платежный календарь с графиком долга.",
      questionsToAsk: ["Какие платежи по кредитам в ближайший квартал?", "Есть ли запас по ковенантам?"]
    }));
  }

  if (arInventoryGrowth && revenueGrew && previous) {
    const arInventoryDelta = metricDelta(current.accountsReceivable + current.inventory, previous.accountsReceivable + previous.inventory);
    const revenueDelta = metricDelta(current.revenue, previous.revenue);
    if (arInventoryDelta / Math.max(previous.accountsReceivable + previous.inventory, 1) > revenueDelta / Math.max(previous.revenue, 1)) {
      flags.push(flag({
        id: "working-capital-ar-inventory-faster-than-revenue",
        title: "ДЗ и запасы растут быстрее выручки",
        severity: "high",
        category: "working_capital",
        explanation: "Рост может замораживать деньги быстрее, чем создает прибыль.",
        evidence: `AR+Inventory delta ${arInventoryDelta.toLocaleString("ru-RU")} RUB.`,
        recommendation: "Проверить DSO, DIO и лимиты оборотного капитала.",
        questionsToAsk: ["Какие лимиты ДЗ по клиентам?", "Какая оборачиваемость запасов по категориям?"]
      }));
    }
  }

  if (caseProfile.annualRevenue > 800_000_000 && !caseProfile.reportsAvailable.includes("cash_flow")) {
    flags.push(flag({
      id: "maturity-no-cash-flow",
      title: "Нет БДДС при выручке выше 800 млн RUB",
      severity: "high",
      category: "finance_maturity",
      explanation: "Компания уже слишком крупная для управления только через P&L.",
      evidence: `Revenue ${caseProfile.annualRevenue.toLocaleString("ru-RU")} RUB.`,
      recommendation: "Внедрить БДДС и платежный календарь.",
      questionsToAsk: ["Кто владеет платежным календарем?", "Как часто обновляется БДДС?"]
    }));
  }

  if (caseProfile.annualRevenue > 1_000_000_000 && !caseProfile.reportsAvailable.includes("variance")) {
    flags.push(flag({
      id: "maturity-no-variance",
      title: "Нет регулярного план-факта при выручке выше 1 млрд RUB",
      severity: "high",
      category: "finance_maturity",
      explanation: "Без variance analysis собственник не видит управляемость бизнеса.",
      evidence: "План-факт не отмечен среди доступных отчетов.",
      recommendation: "Поставить ежемесячный план-факт по БДР, БДДС и Balance.",
      questionsToAsk: ["Какие отклонения разбираются ежемесячно?", "Кто владелец план-факта?"]
    }));
  }

  if (caseProfile.annualRevenue > 1_000_000_000 && caseProfile.financeOwner === "chief_accountant") {
    flags.push(flag({
      id: "maturity-chief-accountant-only",
      title: "Финансы ведет только главный бухгалтер",
      severity: "critical",
      category: "finance_maturity",
      explanation: "Бухгалтерский контур не заменяет управленческую финфункцию.",
      evidence: "Finance owner = chief_accountant.",
      recommendation: "Нанять финансового контролера / Head of Finance до CFO-уровня.",
      questionsToAsk: ["Кто отвечает за cash flow?", "Кто моделирует управленческие решения?"]
    }));
  }

  return flags;
}
