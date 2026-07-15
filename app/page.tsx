import Link from "next/link";
import { OwnerAiChat } from "@/components/OwnerAiChat";
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
      <section className="product-head">
        <div className="product-title">
          <span className="label info">Founder Financial Second Opinion</span>
          <h1>AI-CFO для собственника, который хочет проверить финансовое решение до ошибки</h1>
          <p>
            Диалоговый second opinion, data pack, deterministic finance engine, evidence trail и экспертная проверка в одном закрытом workspace.
          </p>
        </div>
        <div className="product-actions">
          <div className="locale-switch" aria-label="Language status">
            <strong>RU</strong>
            <span>EN mirror ready</span>
          </div>
          <Link className="button primary" href="/cases/new">Начать разбор 150k</Link>
        </div>
      </section>

      <section className="assurance-strip">
        <div>
          <span>Первый платный результат</span>
          <strong>Закрытый brief собственника за 7-14 дней</strong>
        </div>
        <div>
          <span>Ключевой сценарий</span>
          <strong>Проверить скидку, CAPEX, cash gap или найм финансиста</strong>
        </div>
        <div>
          <span>Trust boundary</span>
          <strong>LLM объясняет, finance engine считает, эксперт подтверждает</strong>
        </div>
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
              <h2>Revenue pipeline</h2>
              <span className="label info">first revenue</span>
            </div>
            <div className="panel-body stack">
              {diagnosticProjects.map((item) => (
                <Link className="stage-card" href={`/cases/${item.id === activeProject.id ? activeProject.id : "north-distribution-q2"}/report`} key={item.id}>
                  <div className="stage-card-top">
                    <span className="label info">{statusLabel[item.status]}</span>
                    <span className="mono">{(item.priceRub / 1_000).toFixed(0)}k</span>
                  </div>
                  <strong>{item.companyName}</strong>
                  <span className="muted">{item.offer}</span>
                  <span>{item.nextAction}</span>
                  <div className="confidence-line">
                    <span>confidence {item.confidence}%</span>
                    <span>{item.dueDate}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

          <main className="stack">
            <OwnerAiChat />

            <article className="panel owner-brief">
              <div className="panel-head">
                <div>
                  <h2>Закрытый brief собственника</h2>
                  <p>{activeProject.companyName} · confidence {activeProject.confidence}% · доступно 48 часов</p>
                </div>
                <Link className="button primary" href={`/cases/${activeProject.id}/report`}>Открыть brief</Link>
              </div>
              <div className="brief-verdict">
                <span className="label medium">Executive verdict</span>
                <strong>Не продолжать скидку 12% без проверки contribution margin и 13-недельного cash bridge.</strong>
                <p>Риск в деньгах: {formatRub(activeProject.riskMoneyRub)}. Вывод можно использовать с оговорками: не хватает aging ДЗ и сверки банк-клиент.</p>
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
                <div className="panel-head"><h2>Платный контур</h2><span className="label medium">AI + expert</span></div>
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
              <div className="readiness-meter">
                <div>
                  <strong>{activeProject.dataQuality}/100</strong>
                  <span>Можно использовать с оговорками</span>
                </div>
                <div className="meter-track"><span style={{ width: `${activeProject.dataQuality}%` }} /></div>
              </div>
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

        <section className="operating-model">
          {[
            ["01", "Data pack", "Анкета, Excel, БДР, БДДС, баланс, debt schedule"],
            ["02", "Finance engine", "DSO/DIO/DPO, cash bridge, DSCR, ROI vs WACC"],
            ["03", "Evidence layer", "Источник, формула, период, confidence и ограничения"],
            ["04", "LLM brief", "Qwen3 формирует объяснение и вопросы для C-level"],
            ["05", "Expert review", "Финансовый эксперт подтверждает high-stakes выводы"]
          ].map(([step, title, text]) => (
            <article className="model-step" key={step}>
              <span className="mono">{step}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </section>
      </section>
    </>
  );
}
