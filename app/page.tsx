import Link from "next/link";
import { caseList } from "@/lib/data/sample";

const riskClass = (score: number) => (score > 75 ? "critical" : score > 50 ? "high" : score > 25 ? "medium" : "low");

export default function DashboardPage() {
  const activeCase = caseList[0];

  return (
    <>
      <section className="page-head">
        <div>
          <h1>Финансовые разборы</h1>
          <p>Рабочий список кейсов second opinion по BDR, BDDS, CAPEX, кредитам и финансовой функции.</p>
        </div>
        <Link className="button primary" href="/cases/new">Создать новый разбор</Link>
      </section>

      <section className="dashboard-shell">
        {activeCase ? (
          <div className="kpi-row">
            <article className="kpi-card featured">
              <span>Revenue / год</span>
              <strong>{(activeCase.annualRevenue / 1_000_000_000).toFixed(1)} млрд</strong>
              <p>{activeCase.industry} · {activeCase.employeesCount} сотрудников</p>
            </article>
            <article className="kpi-card">
              <span>Risk score</span>
              <strong>{activeCase.riskScore}/100</strong>
              <div className="sparkline" />
            </article>
            <article className="kpi-card">
              <span>Отчеты</span>
              <strong>{activeCase.reportsAvailable.length}</strong>
              <p>BDR, BDDS, баланс, CAPEX</p>
            </article>
            <article className="kpi-card">
              <span>Юрлица</span>
              <strong>{activeCase.legalEntitiesCount}</strong>
              <p>Контур управленческого учета</p>
            </article>
          </div>
        ) : null}

        <div className="grid two">
          <article className="panel">
            <div className="panel-head">
              <h2>Revenue attainment</h2>
              <span className="label info">sample</span>
            </div>
            <div className="panel-body">
              <div className="bar-preview" aria-hidden="true">
                <span style={{ height: "28%" }} />
                <span style={{ height: "38%" }} />
                <span style={{ height: "46%" }} />
                <span style={{ height: "58%" }} />
                <span style={{ height: "68%" }} />
                <span style={{ height: "82%" }} />
                <span style={{ height: "92%" }} />
              </div>
            </div>
          </article>
          <article className="panel">
            <div className="panel-head">
              <h2>Net profit waterfall</h2>
              <span className="label medium">management view</span>
            </div>
            <div className="panel-body">
              <div className="waterfall" aria-hidden="true">
                <span style={{ height: "92%" }} />
                <span style={{ height: "68%" }} />
                <span style={{ height: "42%" }} />
                <span style={{ height: "54%" }} />
                <span style={{ height: "30%" }} />
                <span style={{ height: "47%" }} />
              </div>
            </div>
          </article>
        </div>

        {caseList.length === 0 ? (
          <div className="panel">
            <div className="panel-body">
              Создайте первый финансовый разбор и получите second opinion по БДР, БДДС, CAPEX, кредитам и финансовой функции.
            </div>
          </div>
        ) : (
          caseList.map((item) => (
            <article className="panel" key={item.id}>
              <div className="panel-head">
                <div>
                  <h2>{item.companyName}</h2>
                  <p>{item.industry} · {(item.annualRevenue / 1_000_000_000).toFixed(1)} млрд RUB · {item.employeesCount} сотрудников</p>
                </div>
                <span className={`label ${riskClass(item.riskScore)}`}>Risk {item.riskScore}/100</span>
              </div>
              <div className="panel-body grid three">
                <div className="metric"><span>Статус</span><strong>{item.status}</strong></div>
                <div className="metric"><span>Отчеты</span><strong>{item.reportsAvailable.length}</strong></div>
                <div className="metric"><span>Юрлица</span><strong>{item.legalEntitiesCount}</strong></div>
              </div>
              <div className="panel-body">
                <Link className="button primary" href={`/cases/${item.id}/report`}>Открыть отчет</Link>
              </div>
            </article>
          ))
        )}
      </section>
    </>
  );
}
