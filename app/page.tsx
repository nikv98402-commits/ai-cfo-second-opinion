import Link from "next/link";
import { dataPack, decisionCards, diagnosticProjects, evidenceItems, paidOffers } from "@/lib/data/sample";

const statusLabel: Record<string, string> = {
  data_requested: "Данные запрошены",
  expert_review: "Экспертная проверка",
  delivered: "Доставлено"
};

const formatRub = (value: number) => `${(value / 1_000_000).toFixed(value >= 1_000_000 ? 0 : 1)} млн`;

export default function DashboardPage() {
  const activeProject = diagnosticProjects[0];
  const pipelineRub = diagnosticProjects.reduce((sum, item) => sum + item.priceRub, 0);
  const receivedCount = dataPack.filter((item) => item.status === "received").length;

  return (
    <>
      <section className="page-head">
        <div>
          <h1>Платные финансовые разборы</h1>
          <p>Owner-side assurance pipeline: data pack, качество данных, evidence trail, expert review и закрытый brief собственника.</p>
        </div>
        <Link className="button primary" href="/cases/new">Начать разбор 150k</Link>
      </section>

      <section className="dashboard-shell">
        <div className="kpi-row">
          <article className="kpi-card featured">
            <span>Pipeline первой выручки</span>
            <strong>{(pipelineRub / 1_000).toFixed(0)}k</strong>
            <p>3 paid diagnostics · цель 5 за 30 дней</p>
          </article>
          <article className="kpi-card">
            <span>Data readiness</span>
            <strong>{activeProject.dataQuality}/100</strong>
            <p>{receivedCount}/{dataPack.length} источников получено</p>
          </article>
          <article className="kpi-card">
            <span>Evidence coverage</span>
            <strong>100%</strong>
            <p>каждый вывод имеет источник и формулу</p>
          </article>
          <article className="kpi-card">
            <span>Expert review</span>
            <strong>2 ч</strong>
            <p>эскалация high-stakes выводов</p>
          </article>
        </div>

        <section className="grid diagnostic-layout">
          <aside className="panel">
            <div className="panel-head">
              <h2>Платные разборы</h2>
              <span className="label info">first revenue</span>
            </div>
            <div className="panel-body stack">
              {diagnosticProjects.map((item) => (
                <Link className="stage-card" href={`/cases/${item.id === activeProject.id ? activeProject.id : "north-distribution-q2"}/report`} key={item.id}>
                  <span className="label info">{statusLabel[item.status]}</span>
                  <strong>{item.companyName}</strong>
                  <span className="muted">{item.offer} · {(item.priceRub / 1_000).toFixed(0)}k RUB</span>
                  <span>{item.nextAction}</span>
                </Link>
              ))}
            </div>
          </aside>

          <main className="stack">
            <article className="panel owner-brief">
              <div className="panel-head">
                <div>
                  <h2>Закрытый brief собственника</h2>
                  <p>{activeProject.companyName} · confidence {activeProject.confidence}% · доступно 48 часов</p>
                </div>
                <Link className="button primary" href={`/cases/${activeProject.id}/report`}>Открыть brief</Link>
              </div>
              <div className="panel-body grid three">
                <div className="metric"><span>Деньги под риском</span><strong>{formatRub(activeProject.riskMoneyRub)}</strong></div>
                <div className="metric"><span>Decision cards</span><strong>{decisionCards.length}</strong></div>
                <div className="metric"><span>Вопросов CFO</span><strong>5</strong></div>
              </div>
              <div className="panel-body decision-list">
                {decisionCards.map((card) => (
                  <div className="decision-card" key={card.action}>
                    <div>
                      <strong>{card.action}</strong>
                      <p>{card.impact}</p>
                    </div>
                    <span className="mono">{card.due}</span>
                  </div>
                ))}
              </div>
            </article>

            <section className="stack">
              <article className="panel">
                <div className="panel-head"><h2>Evidence layer</h2><span className="label info">Datarails lesson</span></div>
                <div className="panel-body">
                  <table className="table">
                    <thead><tr><th>Вывод</th><th>Источник</th><th>Формула</th><th>Confidence</th></tr></thead>
                    <tbody>
                      {evidenceItems.map((item) => (
                        <tr key={item.conclusion}>
                          <td><strong>{item.conclusion}</strong><br /><span className="muted">{item.type}</span></td>
                          <td>{item.source}</td>
                          <td className="mono">{item.formula}</td>
                          <td>{item.confidence}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <aside className="panel expert-panel">
                <div className="panel-head"><h2>AI + Expert Review</h2><span className="label medium">Pilot lesson</span></div>
                <div className="panel-body stack">
                  <p>AI готовит draft, эксперт подключается только к конфликтам данных, необратимым решениям и существенному финансовому эффекту.</p>
                  {paidOffers.map((offer) => (
                    <div className="offer-tier" key={offer.name}>
                      <strong>{offer.name}</strong>
                      <span className="mono">{offer.price}</span>
                      <p>{offer.scope}</p>
                    </div>
                  ))}
                </div>
              </aside>
            </section>
          </main>

          <aside className="panel">
            <div className="panel-head"><h2>Data pack</h2><span className="label info">{receivedCount}/{dataPack.length}</span></div>
            <div className="panel-body stack">
              {dataPack.map((item) => (
                <div className={`data-row ${item.status}`} key={item.name}>
                  <strong>{item.name}</strong>
                  <span>{item.why}</span>
                  <span className="muted">{item.period}</span>
                </div>
              ))}
              <Link className="button" href={`/cases/${activeProject.id}/upload`}>Открыть data pack</Link>
            </div>
          </aside>
        </section>
      </section>
    </>
  );
}
