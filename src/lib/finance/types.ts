export type Industry = "retail" | "distribution" | "manufacturing" | "services" | "ecommerce" | "other";
export type RiskSeverity = "low" | "medium" | "high" | "critical";
export type RiskLevel = RiskSeverity;
export type FinanceOwner =
  | "chief_accountant"
  | "economist"
  | "finance_manager"
  | "cfo"
  | "external_consultant"
  | "nobody";

export type ReportKey =
  | "pnl"
  | "cash_flow"
  | "balance"
  | "variance"
  | "debt_schedule"
  | "capex_plan"
  | "ar_ap"
  | "inventory";

export interface CaseProfile {
  id: string;
  companyName: string;
  industry: Industry;
  annualRevenue: number;
  employeesCount: number;
  legalEntitiesCount: number;
  hasDebt: boolean;
  hasCapexPlan: boolean;
  financeOwner: FinanceOwner;
  reportsAvailable: ReportKey[];
  createdAt: string;
  updatedAt: string;
}

export interface FinancialInput {
  periodName: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  commercialExpenses: number;
  adminExpenses: number;
  payroll: number;
  rent: number;
  ebitda: number;
  depreciation: number;
  ebit: number;
  interestExpense: number;
  netProfit: number;
  operatingCashFlow: number;
  capex: number;
  financingCashFlow: number;
  debtRepayment: number;
  newDebt: number;
  cashStart: number;
  cashEnd: number;
  cash: number;
  accountsReceivable: number;
  inventory: number;
  fixedAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  equity: number;
  avgDebtRate?: number;
  wacc?: number;
  expectedCapexRoi?: number;
  dso?: number;
  dio?: number;
  dpo?: number;
}

export interface FinanceMetrics {
  grossMargin: number;
  ebitdaMargin: number;
  ebitMargin: number;
  netProfitMargin: number;
  sgaRatio: number;
  payrollRatio: number;
  rentRatio: number;
  cfoToEbitda: number;
  fcf: number;
  fcfMargin: number;
  cashChange: number;
  netWorkingCapital: number;
  nwcToRevenue: number;
  cashConversionCycle?: number;
  totalDebt: number;
  netDebt: number;
  netDebtToEbitda: number;
  interestCoverage: number;
  dscr: number;
  capexToRevenue: number;
  capexToEbitda: number;
  roiVsWaccGap?: number;
  fixedCostProxy: number;
  fixedCostRatio: number;
  ebitdaSensitivity5: number;
  ebitdaSensitivity10: number;
}

export interface RedFlag {
  id: string;
  title: string;
  severity: RiskSeverity;
  category: "liquidity" | "profitability" | "operating_leverage" | "capex" | "debt" | "working_capital" | "finance_maturity";
  explanation: string;
  evidence: string;
  recommendation: string;
  questionsToAsk: string[];
}

export interface MaturityBlock {
  block: string;
  score: number;
  diagnosis: string;
  missingCapabilities: string[];
  recommendedNextStep: string;
}

export interface HiringRecommendation {
  role: string;
  whyNow: string;
  keyResponsibilities: string[];
  expectedSalaryRange: string;
  interviewQuestions: string[];
  testTask: string;
  first90DaysGoals: string[];
}

export interface AnalysisResult {
  caseId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  executiveSummary: string;
  metrics: FinanceMetrics;
  redFlags: RedFlag[];
  liquidityRisks: RedFlag[];
  operatingLeverageRisks: RedFlag[];
  capexRisks: RedFlag[];
  debtRisks: RedFlag[];
  workingCapitalRisks: RedFlag[];
  financeMaturity: {
    averageScore: number;
    level: string;
    blocks: MaturityBlock[];
  };
  hiringRecommendation: HiringRecommendation;
  questionsToFinanceTeam: string[];
  ownerEducationBlock: string;
  nextActions: string[];
  markdownReport: string;
  createdAt: string;
}
