import type { CaseProfile, FinancialInput } from "@/lib/finance/types";

export const sampleCase: CaseProfile = {
  id: "north-distribution-q2",
  companyName: "ООО Северная Дистрибуция",
  industry: "distribution",
  annualRevenue: 1_850_000_000,
  employeesCount: 420,
  legalEntitiesCount: 3,
  hasDebt: true,
  hasCapexPlan: true,
  financeOwner: "finance_manager",
  reportsAvailable: ["pnl", "cash_flow", "balance", "variance", "debt_schedule", "ar_ap", "inventory"],
  createdAt: "2026-06-27T10:00:00.000Z",
  updatedAt: "2026-06-27T10:00:00.000Z"
};

export const sampleInputs: FinancialInput[] = [
  {
    periodName: "2025",
    revenue: 1_520_000_000,
    cogs: 1_064_000_000,
    grossProfit: 456_000_000,
    commercialExpenses: 132_000_000,
    adminExpenses: 91_000_000,
    payroll: 118_000_000,
    rent: 46_000_000,
    ebitda: 160_000_000,
    depreciation: 34_000_000,
    ebit: 126_000_000,
    interestExpense: 28_000_000,
    netProfit: 77_000_000,
    operatingCashFlow: 112_000_000,
    capex: 82_000_000,
    financingCashFlow: 24_000_000,
    debtRepayment: 46_000_000,
    newDebt: 70_000_000,
    cashStart: 58_000_000,
    cashEnd: 112_000_000,
    cash: 112_000_000,
    accountsReceivable: 210_000_000,
    inventory: 260_000_000,
    fixedAssets: 380_000_000,
    accountsPayable: 172_000_000,
    shortTermDebt: 95_000_000,
    longTermDebt: 240_000_000,
    equity: 310_000_000,
    avgDebtRate: 0.15,
    wacc: 0.18,
    expectedCapexRoi: 0.22,
    dso: 50,
    dio: 89,
    dpo: 59
  },
  {
    periodName: "2026 Q2 plan",
    revenue: 1_850_000_000,
    cogs: 1_350_500_000,
    grossProfit: 499_500_000,
    commercialExpenses: 178_000_000,
    adminExpenses: 126_000_000,
    payroll: 156_000_000,
    rent: 64_000_000,
    ebitda: 118_000_000,
    depreciation: 48_000_000,
    ebit: 70_000_000,
    interestExpense: 42_000_000,
    netProfit: 22_000_000,
    operatingCashFlow: 41_000_000,
    capex: 170_000_000,
    financingCashFlow: 120_000_000,
    debtRepayment: 68_000_000,
    newDebt: 188_000_000,
    cashStart: 112_000_000,
    cashEnd: 35_000_000,
    cash: 35_000_000,
    accountsReceivable: 355_000_000,
    inventory: 420_000_000,
    fixedAssets: 570_000_000,
    accountsPayable: 220_000_000,
    shortTermDebt: 190_000_000,
    longTermDebt: 380_000_000,
    equity: 332_000_000,
    avgDebtRate: 0.17,
    wacc: 0.19,
    expectedCapexRoi: 0.16,
    dso: 70,
    dio: 114,
    dpo: 59
  }
];

export const caseList = [
  {
    ...sampleCase,
    status: "analyzed",
    riskScore: 88
  }
];
