import { sampleInputs } from "@/lib/data/sample";

const pnl = ["revenue", "cogs", "grossProfit", "commercialExpenses", "adminExpenses", "payroll", "rent", "ebitda", "depreciation", "ebit", "interestExpense", "netProfit"] as const;
const cash = ["operatingCashFlow", "capex", "financingCashFlow", "debtRepayment", "newDebt", "cashStart", "cashEnd"] as const;
const balance = ["cash", "accountsReceivable", "inventory", "fixedAssets", "accountsPayable", "shortTermDebt", "longTermDebt", "equity"] as const;

export default function UploadPage() {
  const current = sampleInputs[1];
  const previous = sampleInputs[0];
  return (
    <>
      <section className="page-head">
        <div>
          <h1>Загрузка данных</h1>
          <p>Два режима: ручной ввод ключевых показателей и загрузка `.xlsx` / `.csv` шаблона.</p>
        </div>
        <a className="button" href="/templates/financial_case_template.xlsx">Скачать sample template</a>
      </section>

      <section className="grid two">
        <div className="panel">
          <div className="panel-head"><h2>Ручной ввод</h2><span className="label info">2 периода</span></div>
          <div className="panel-body stack">
            <h3>P&L / BDR</h3>
            <div className="form-grid">{pnl.map((key) => <div className="field" key={key}><label>{key}</label><input defaultValue={String(current[key])} /></div>)}</div>
            <h3>Cash Flow / BDDS</h3>
            <div className="form-grid">{cash.map((key) => <div className="field" key={key}><label>{key}</label><input defaultValue={String(current[key])} /></div>)}</div>
            <h3>Balance</h3>
            <div className="form-grid">{balance.map((key) => <div className="field" key={key}><label>{key}</label><input defaultValue={String(current[key])} /></div>)}</div>
          </div>
        </div>

        <aside className="panel">
          <div className="panel-head"><h2>Файл</h2><span className="label medium">prototype</span></div>
          <div className="panel-body stack">
            <div className="field"><label>Загрузить `.xlsx` или `.csv`</label><input type="file" accept=".xlsx,.csv" /></div>
            <p>В этом MVP scaffold файл пока не парсится на сервере, но UI и template уже подготовлены под `xlsx`, `papaparse` и ручное исправление parsed preview.</p>
            <table className="table">
              <thead><tr><th>Metric</th><th>2025</th><th>2026 Q2 plan</th></tr></thead>
              <tbody>
                <tr><td>Revenue</td><td>{previous.revenue.toLocaleString("ru-RU")}</td><td>{current.revenue.toLocaleString("ru-RU")}</td></tr>
                <tr><td>EBITDA</td><td>{previous.ebitda.toLocaleString("ru-RU")}</td><td>{current.ebitda.toLocaleString("ru-RU")}</td></tr>
                <tr><td>Cash end</td><td>{previous.cashEnd.toLocaleString("ru-RU")}</td><td>{current.cashEnd.toLocaleString("ru-RU")}</td></tr>
              </tbody>
            </table>
            <a className="button primary" href="/cases/north-distribution-q2/analyze">Сохранить данные и перейти к анализу</a>
          </div>
        </aside>
      </section>
    </>
  );
}
