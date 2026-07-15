import { dataPack, sampleInputs } from "@/lib/data/sample";
import { DataPackUploader } from "@/components/DataPackUploader";

const pnl = ["revenue", "cogs", "grossProfit", "commercialExpenses", "adminExpenses", "payroll", "rent", "ebitda", "depreciation", "ebit", "interestExpense", "netProfit"] as const;
const cash = ["operatingCashFlow", "capex", "financingCashFlow", "debtRepayment", "newDebt", "cashStart", "cashEnd"] as const;
const balance = ["cash", "accountsReceivable", "inventory", "fixedAssets", "accountsPayable", "shortTermDebt", "longTermDebt", "equity"] as const;

interface UploadPageProps {
  params: Promise<{ id: string }>;
}

export default async function UploadPage({ params }: UploadPageProps) {
  const { id: caseId } = await params;
  const current = sampleInputs[1];
  const previous = sampleInputs[0];
  return (
    <>
      <section className="page-head">
        <div>
          <h1>Загрузка данных</h1>
          <p>Data pack для доказательного owner brief: что получено, чего не хватает и как это влияет на уверенность вывода.</p>
        </div>
        <a className="button" href="/templates/financial_case_template.xlsx">Скачать sample template</a>
      </section>

      <section className="panel" style={{ marginBottom: 16 }}>
        <div className="panel-head">
          <h2>Founder brief data pack</h2>
          <span className="label info">4 из 6 источников готовы</span>
        </div>
        <div className="panel-body grid three">
          {dataPack.map((item) => (
            <div className={`data-row ${item.status}`} key={item.name}>
              <strong>{item.name}</strong>
              <span>{item.why}</span>
              <span className="muted">{item.period}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid two">
        <div className="panel">
          <div className="panel-head"><h2>Ручной ввод</h2><span className="label info">2 периода</span></div>
          <div className="panel-body stack">
            <h3>БДР / P&L</h3>
            <div className="form-grid">{pnl.map((key) => <div className="field" key={key}><label>{key}</label><input defaultValue={String(current[key])} /></div>)}</div>
            <h3>БДДС / Cash Flow</h3>
            <div className="form-grid">{cash.map((key) => <div className="field" key={key}><label>{key}</label><input defaultValue={String(current[key])} /></div>)}</div>
            <h3>Balance</h3>
            <div className="form-grid">{balance.map((key) => <div className="field" key={key}><label>{key}</label><input defaultValue={String(current[key])} /></div>)}</div>
          </div>
        </div>

        <aside className="panel">
          <div className="panel-head"><h2>Demo template</h2><span className="label medium">fast path</span></div>
          <div className="panel-body stack">
            <p>Самый надежный сценарий тестирования: дать пользователю эталонный шаблон, получить структурированные листы и сразу запустить finance engine.</p>
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

      <section style={{ marginTop: 16 }}>
        <DataPackUploader caseId={caseId} />
      </section>
    </>
  );
}
