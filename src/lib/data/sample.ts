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

export const diagnosticProjects = [
  {
    id: "north-distribution-q2",
    companyName: "ООО Северная Дистрибуция",
    offer: "Founder Financial Second Opinion",
    priceRub: 150_000,
    status: "data_requested",
    owner: "CEO",
    dueDate: "19 июля",
    dataQuality: 78,
    confidence: 78,
    expertReview: "needs_clarification",
    nextAction: "Запросить aging ДЗ и сверку банк-клиент",
    riskMoneyRub: 42_000_000
  },
  {
    id: "retail-pro-margin",
    companyName: "Retail Pro",
    offer: "Trigger Review: скидочная политика",
    priceRub: 90_000,
    status: "expert_review",
    owner: "COO",
    dueDate: "17 июля",
    dataQuality: 84,
    confidence: 82,
    expertReview: "reviewing",
    nextAction: "Проверить contribution margin по каналам",
    riskMoneyRub: 18_000_000
  },
  {
    id: "b2b-service-cash",
    companyName: "B2B Сервис Групп",
    offer: "Monthly Owner Brief",
    priceRub: 120_000,
    status: "delivered",
    owner: "Founder",
    dueDate: "доставлено",
    dataQuality: 91,
    confidence: 88,
    expertReview: "reviewed",
    nextAction: "Перевести в recurring monitoring",
    riskMoneyRub: 12_000_000
  }
];

export const dataPack = [
  { name: "БДР / P&L", status: "received", why: "Маржа, EBITDA, скидки, операционный рычаг", period: "2025 + 2026 Q2 plan" },
  { name: "БДДС / Cash Flow", status: "received", why: "Кассовый разрыв, CAPEX, debt service", period: "2025 + 2026 Q2 plan" },
  { name: "Баланс", status: "received", why: "ДЗ, запасы, долг, капитал", period: "2025 + 2026 Q2 plan" },
  { name: "Aging ДЗ", status: "missing", why: "Нужен для проверки DSO и риска ликвидности", period: "последние 90 дней" },
  { name: "Сверка банк-клиент", status: "blocked", why: "Без нее cash bridge ниже уверенности", period: "июнь 2026" },
  { name: "Кредитный график", status: "received", why: "DSCR, ковенанты, нагрузка по долгу", period: "12 месяцев" }
];

export const evidenceItems = [
  {
    conclusion: "ДЗ создает кассовый риск в ближайшие 45 дней",
    source: "БДДС_Jun.xlsx / Aging request",
    formula: "DSO = AR / Revenue * 30",
    confidence: 82,
    type: "calculated metric"
  },
  {
    conclusion: "Скидка 12% в канале B ниже contribution margin",
    source: "P&L channel view",
    formula: "GM - logistics - marketplace fee - marketing",
    confidence: 74,
    type: "AI hypothesis"
  },
  {
    conclusion: "CAPEX снижает прибыль сейчас, но не проходит ROI hurdle",
    source: "CAPEX plan + loan schedule",
    formula: "ROI 16% < WACC 19%",
    confidence: 68,
    type: "management assumption"
  }
];

export const decisionCards = [
  {
    action: "Остановить скидку 12% в канале B",
    owner: "COO",
    due: "14 дней",
    impact: "+8,4 млн руб. EBITDA за квартал",
    reversibility: "обратимо"
  },
  {
    action: "Ввести weekly cash committee",
    owner: "CEO + финансы",
    due: "7 дней",
    impact: "снижение кассового разрыва на 35 млн руб.",
    reversibility: "обратимо"
  },
  {
    action: "Нанять казначея до большого CFO",
    owner: "CEO",
    due: "30 дней",
    impact: "еженедельный контроль ликвидности и долгового календаря",
    reversibility: "средне"
  }
];

export const paidOffers = [
  { name: "Software draft", price: "75k", scope: "data quality + AI draft owner brief" },
  { name: "Expert review", price: "150k", scope: "verified founder brief + questions for CFO" },
  { name: "Board/CFO advisory", price: "300k+", scope: "решения, внедрение, recurring monitoring" }
];
