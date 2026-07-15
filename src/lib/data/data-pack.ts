export type DataPackSlotId =
  | "company_questionnaire"
  | "pnl"
  | "cash_flow"
  | "balance"
  | "ar_ap_aging"
  | "debt_schedule"
  | "capex_plan"
  | "sales_channels"
  | "manual_metrics";

export type NormalizedField =
  | "periodName"
  | "revenue"
  | "cogs"
  | "grossProfit"
  | "commercialExpenses"
  | "adminExpenses"
  | "payroll"
  | "rent"
  | "ebitda"
  | "netProfit"
  | "operatingCashFlow"
  | "capex"
  | "cashStart"
  | "cashEnd"
  | "cash"
  | "accountsReceivable"
  | "inventory"
  | "accountsPayable"
  | "shortTermDebt"
  | "longTermDebt"
  | "debtRepayment"
  | "newDebt"
  | "expectedCapexRoi"
  | "channelRevenue"
  | "channelGrossMargin"
  | "discountRate";

export interface DataPackSlot {
  id: DataPackSlotId;
  title: string;
  shortTitle: string;
  why: string;
  requiredForMvp: boolean;
  acceptedFormats: string;
  normalizedFields: NormalizedField[];
}

export interface MappingDictionaryItem {
  field: NormalizedField;
  labels: string[];
}

export const dataPackSlots: DataPackSlot[] = [
  {
    id: "company_questionnaire",
    title: "Анкета компании",
    shortTitle: "Анкета",
    why: "Контекст отрасли, масштаба, финансовой функции и управленческого вопроса.",
    requiredForMvp: true,
    acceptedFormats: ".xlsx,.csv,.json",
    normalizedFields: ["periodName"]
  },
  {
    id: "pnl",
    title: "Excel БДР / P&L",
    shortTitle: "БДР / P&L",
    why: "Выручка, валовая маржа, EBITDA, скидки, операционный рычаг.",
    requiredForMvp: true,
    acceptedFormats: ".xlsx,.csv",
    normalizedFields: ["periodName", "revenue", "cogs", "grossProfit", "commercialExpenses", "adminExpenses", "payroll", "rent", "ebitda", "netProfit"]
  },
  {
    id: "cash_flow",
    title: "БДДС / Cash Flow",
    shortTitle: "БДДС / Cash Flow",
    why: "Кассовый разрыв, операционный cash flow, CAPEX, financing cash flow.",
    requiredForMvp: true,
    acceptedFormats: ".xlsx,.csv",
    normalizedFields: ["periodName", "operatingCashFlow", "capex", "cashStart", "cashEnd"]
  },
  {
    id: "balance",
    title: "Баланс",
    shortTitle: "Баланс",
    why: "Деньги, ДЗ, запасы, кредиторка, долг и капитал.",
    requiredForMvp: true,
    acceptedFormats: ".xlsx,.csv",
    normalizedFields: ["periodName", "cash", "accountsReceivable", "inventory", "accountsPayable", "shortTermDebt", "longTermDebt"]
  },
  {
    id: "ar_ap_aging",
    title: "Aging ДЗ / кредиторки",
    shortTitle: "Aging ДЗ/КЗ",
    why: "DSO, просрочка, концентрация клиентов, риск ликвидности.",
    requiredForMvp: true,
    acceptedFormats: ".xlsx,.csv",
    normalizedFields: ["accountsReceivable", "accountsPayable"]
  },
  {
    id: "debt_schedule",
    title: "Кредитный график",
    shortTitle: "Debt schedule",
    why: "Debt service, DSCR, ковенанты, краткосрочная нагрузка.",
    requiredForMvp: true,
    acceptedFormats: ".xlsx,.csv",
    normalizedFields: ["debtRepayment", "newDebt", "shortTermDebt", "longTermDebt"]
  },
  {
    id: "capex_plan",
    title: "CAPEX-план",
    shortTitle: "CAPEX",
    why: "ROI vs WACC, источник финансирования, влияние на cash и прибыль.",
    requiredForMvp: false,
    acceptedFormats: ".xlsx,.csv",
    normalizedFields: ["capex", "expectedCapexRoi"]
  },
  {
    id: "sales_channels",
    title: "Каналы продаж, скидки, маржа",
    shortTitle: "Каналы",
    why: "Contribution margin, скидочная политика, риск ухода ниже fixed costs.",
    requiredForMvp: false,
    acceptedFormats: ".xlsx,.csv",
    normalizedFields: ["channelRevenue", "channelGrossMargin", "discountRate"]
  },
  {
    id: "manual_metrics",
    title: "Ручной ввод ключевых метрик",
    shortTitle: "Метрики",
    why: "Быстрый старт, если Excel еще не готов или данные нужно уточнить голосом.",
    requiredForMvp: false,
    acceptedFormats: "manual",
    normalizedFields: ["revenue", "ebitda", "cash", "accountsReceivable", "inventory"]
  }
];

export const mappingDictionary: MappingDictionaryItem[] = [
  { field: "periodName", labels: ["period", "период", "месяц", "квартал", "год", "date"] },
  { field: "revenue", labels: ["revenue", "sales", "выручка", "продажи", "оборот"] },
  { field: "cogs", labels: ["cogs", "себестоимость", "cost of goods", "прямая себестоимость"] },
  { field: "grossProfit", labels: ["gross profit", "валовая прибыль", "gross margin", "валовая маржа"] },
  { field: "commercialExpenses", labels: ["commercial", "коммерческие расходы", "selling expenses", "s&m"] },
  { field: "adminExpenses", labels: ["admin", "административные расходы", "g&a", "управленческие расходы"] },
  { field: "payroll", labels: ["payroll", "фот", "зарплата", "персонал"] },
  { field: "rent", labels: ["rent", "аренда"] },
  { field: "ebitda", labels: ["ebitda", "ебитда"] },
  { field: "netProfit", labels: ["net profit", "чистая прибыль", "net income"] },
  { field: "operatingCashFlow", labels: ["operating cash flow", "ocf", "операционный денежный поток", "операционный cash flow"] },
  { field: "capex", labels: ["capex", "капекс", "капитальные затраты", "инвестиции"] },
  { field: "cashStart", labels: ["cash start", "деньги на начало", "остаток дс начало"] },
  { field: "cashEnd", labels: ["cash end", "деньги на конец", "остаток дс конец"] },
  { field: "cash", labels: ["cash", "деньги", "денежные средства", "остаток дс"] },
  { field: "accountsReceivable", labels: ["accounts receivable", "ar", "дебиторка", "дз", "дебиторская задолженность"] },
  { field: "inventory", labels: ["inventory", "запасы", "товар", "склад"] },
  { field: "accountsPayable", labels: ["accounts payable", "ap", "кредиторка", "кз", "кредиторская задолженность"] },
  { field: "shortTermDebt", labels: ["short-term debt", "краткосрочный долг", "краткосрочные кредиты"] },
  { field: "longTermDebt", labels: ["long-term debt", "долгосрочный долг", "долгосрочные кредиты"] },
  { field: "debtRepayment", labels: ["debt repayment", "погашение долга", "платеж по кредиту"] },
  { field: "newDebt", labels: ["new debt", "новый долг", "привлечение кредита"] },
  { field: "expectedCapexRoi", labels: ["roi", "ожидаемый roi", "окупаемость", "irr"] },
  { field: "channelRevenue", labels: ["channel revenue", "выручка канал", "канал продаж"] },
  { field: "channelGrossMargin", labels: ["channel margin", "маржа канала", "contribution margin"] },
  { field: "discountRate", labels: ["discount", "скидка", "discount rate"] }
];

export function suggestFieldMapping(columnName: string, allowedFields: NormalizedField[]) {
  const normalized = columnName.trim().toLowerCase();
  return mappingDictionary.find((item) => allowedFields.includes(item.field) && item.labels.some((label) => normalized.includes(label)))?.field;
}
