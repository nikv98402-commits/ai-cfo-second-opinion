import type { FinanceMetrics, FinancialInput } from "@/lib/finance/types";

const safeDiv = (a: number, b: number) => (b === 0 ? 0 : a / b);

export function calculateMetrics(input: FinancialInput, previous?: FinancialInput): FinanceMetrics {
  const totalDebt = input.shortTermDebt + input.longTermDebt;
  const netDebt = totalDebt - input.cash;
  const netWorkingCapital = input.accountsReceivable + input.inventory - input.accountsPayable;
  const fixedCostProxy = input.payroll + input.rent + input.adminExpenses;

  const variableCostProxy = input.cogs + input.commercialExpenses;
  const ebitdaAtRevenueDrop = (drop: number) => {
    const revenueAfterDrop = input.revenue * (1 - drop);
    const variableCostAfterDrop = variableCostProxy * (1 - drop);
    return revenueAfterDrop - variableCostAfterDrop - fixedCostProxy;
  };

  return {
    grossMargin: safeDiv(input.grossProfit, input.revenue),
    ebitdaMargin: safeDiv(input.ebitda, input.revenue),
    ebitMargin: safeDiv(input.ebit, input.revenue),
    netProfitMargin: safeDiv(input.netProfit, input.revenue),
    sgaRatio: safeDiv(input.commercialExpenses + input.adminExpenses, input.revenue),
    payrollRatio: safeDiv(input.payroll, input.revenue),
    rentRatio: safeDiv(input.rent, input.revenue),
    cfoToEbitda: safeDiv(input.operatingCashFlow, input.ebitda),
    fcf: input.operatingCashFlow - input.capex,
    fcfMargin: safeDiv(input.operatingCashFlow - input.capex, input.revenue),
    cashChange: input.cashEnd - input.cashStart,
    netWorkingCapital,
    nwcToRevenue: safeDiv(netWorkingCapital, input.revenue),
    cashConversionCycle:
      input.dso !== undefined && input.dio !== undefined && input.dpo !== undefined
        ? input.dso + input.dio - input.dpo
        : undefined,
    totalDebt,
    netDebt,
    netDebtToEbitda: safeDiv(netDebt, input.ebitda),
    interestCoverage: safeDiv(input.ebit, input.interestExpense),
    dscr: safeDiv(input.operatingCashFlow, input.debtRepayment),
    capexToRevenue: safeDiv(input.capex, input.revenue),
    capexToEbitda: safeDiv(input.capex, input.ebitda),
    roiVsWaccGap:
      input.expectedCapexRoi !== undefined && input.wacc !== undefined
        ? input.expectedCapexRoi - input.wacc
        : undefined,
    fixedCostProxy,
    fixedCostRatio: safeDiv(fixedCostProxy, input.revenue),
    ebitdaSensitivity5: ebitdaAtRevenueDrop(0.05),
    ebitdaSensitivity10: ebitdaAtRevenueDrop(0.1)
  };
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    notation: "compact",
    maximumFractionDigits: 1,
    style: "currency",
    currency: "RUB"
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "percent",
    maximumFractionDigits: 1
  }).format(value);
}

export function metricDelta(current: number, previous?: number) {
  if (previous === undefined) return 0;
  return current - previous;
}
