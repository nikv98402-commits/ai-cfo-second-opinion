import { sampleCase, sampleInputs } from "@/lib/data/sample";
import { analyzeCase } from "@/lib/finance/analysis";

export default function AnalyzePage() {
  const result = analyzeCase(sampleCase, sampleInputs);
  return (
    <>
      <section className="page-head">
        <div>
          <h1>Финансовое second opinion</h1>
          <p>Rule-based engine уже считает метрики, ищет красные флаги и готовит отчет без OpenAI API.</p>
        </div>
        <a className="button primary" href={`/cases/${sampleCase.id}/report`}>Открыть отчет</a>
      </section>

      <section className="grid two">
        <div className="panel">
          <div className="panel-head">
            <h2>Результат анализа</h2>
            <span className={`label ${result.riskLevel}`}>Risk {result.riskScore}/100</span>
          </div>
          <div className="panel-body">
            <p>{result.executiveSummary}</p>
          </div>
          <div className="panel-body grid three">
            <div className="metric"><span>FCF</span><strong>{result.metrics.fcf.toLocaleString("ru-RU")}</strong></div>
            <div className="metric"><span>CFO / EBITDA</span><strong>{result.metrics.cfoToEbitda.toFixed(2)}</strong></div>
            <div className="metric"><span>Net debt / EBITDA</span><strong>{result.metrics.netDebtToEbitda.toFixed(2)}</strong></div>
          </div>
        </div>

        <aside className="panel">
          <div className="panel-head"><h2>Следующий найм</h2></div>
          <div className="panel-body stack">
            <span className="label info">{result.hiringRecommendation.role}</span>
            <p>{result.hiringRecommendation.whyNow}</p>
            <a className="button" href={`/cases/${sampleCase.id}/report#hiring`}>Детали рекомендации</a>
          </div>
        </aside>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head"><h2>Красные флаги</h2><span>{result.redFlags.length}</span></div>
        <div className="panel-body">
          <table className="table">
            <thead><tr><th>Severity</th><th>Category</th><th>Flag</th><th>Evidence</th></tr></thead>
            <tbody>
              {result.redFlags.map((flag) => (
                <tr key={flag.id}>
                  <td><span className={`label ${flag.severity}`}>{flag.severity}</span></td>
                  <td>{flag.category}</td>
                  <td><strong>{flag.title}</strong><br />{flag.recommendation}</td>
                  <td>{flag.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
