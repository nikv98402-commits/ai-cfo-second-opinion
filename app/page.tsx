import { caseList } from "@/lib/data/sample";

const riskClass = (score: number) => (score > 75 ? "critical" : score > 50 ? "high" : score > 25 ? "medium" : "low");

export default function DashboardPage() {
  return (
    <>
      <section className="page-head">
        <div>
          <h1>Финансовые разборы</h1>
          <p>Рабочий список кейсов second opinion по BDR, BDDS, CAPEX, кредитам и финансовой функции.</p>
        </div>
        <a className="button primary" href="/cases/new">Создать новый разбор</a>
      </section>

      <section className="grid">
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
                <a className="button primary" href={`/cases/${item.id}/report`}>Открыть отчет</a>
              </div>
            </article>
          ))
        )}
      </section>
    </>
  );
}
