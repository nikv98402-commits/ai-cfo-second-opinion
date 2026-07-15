import Link from "next/link";
import { decisionCards, diagnosticProjects, evidenceItems, sampleCase, sampleInputs } from "@/lib/data/sample";
import { analyzeCase } from "@/lib/finance/analysis";
import { formatMoney, formatPercent } from "@/lib/finance/metrics";
import { PrintButton } from "@/components/PrintButton";

export default function ReportPage() {
  const result = analyzeCase(sampleCase, sampleInputs);
  const project = diagnosticProjects[0];
  return (
    <>
      <section className="page-head">
        <div>
          <h1>Закрытый brief собственника</h1>
          <p>{sampleCase.companyName} · independent second opinion · confidence {project.confidence}% · expert review: нужны уточнения.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="button" download="ai-cfo-report.md" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(result.markdownReport)}`}>Скачать Markdown</a>
          <PrintButton />
          <Link className="button" href="/">Вернуться к кейсам</Link>
          <Link className="button primary" href={`/cases/${sampleCase.id}/analyze`}>Перезапустить анализ</Link>
        </div>
      </section>

      <section className="grid two">
        <article className="panel owner-brief">
          <div className="panel-head">
            <h2>Executive verdict</h2>
            <span className={`label ${result.riskLevel}`}>{result.riskLevel} · {result.riskScore}/100</span>
          </div>
          <div className="panel-body stack">
            <p>{result.executiveSummary}</p>
            <p>{result.ownerEducationBlock}</p>
            <div className="note">
              Не является заменой CFO или аудита. Это owner-side assurance: проверяем логику, данные, риски и вопросы к финансовой команде.
            </div>
          </div>
        </article>

        <aside className="panel">
          <div className="panel-head"><h2>Data quality</h2><span className="label info">{project.dataQuality}/100</span></div>
          <div className="panel-body grid">
            <div className="metric"><span>Gross margin</span><strong>{formatPercent(result.metrics.grossMargin)}</strong></div>
            <div className="metric"><span>EBITDA margin</span><strong>{formatPercent(result.metrics.ebitdaMargin)}</strong></div>
            <div className="metric"><span>FCF</span><strong>{formatMoney(result.metrics.fcf)}</strong></div>
            <div className="metric"><span>Expert status</span><strong>review</strong></div>
          </div>
        </aside>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head"><h2>Decision cards</h2><span className="label info">owner actions</span></div>
        <div className="panel-body decision-list">
          {decisionCards.map((card) => (
            <div className="decision-card" key={card.action}>
              <div>
                <strong>{card.action}</strong>
                <p>{card.impact}</p>
                <p className="muted">Owner: {card.owner} · обратимость: {card.reversibility}</p>
              </div>
              <span className="mono">{card.due}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head"><h2>Evidence trail</h2><span className="label info">source + formula</span></div>
        <div className="panel-body">
          <table className="table">
            <thead><tr><th>Вывод</th><th>Источник</th><th>Формула</th><th>Тип</th><th>Confidence</th></tr></thead>
            <tbody>
              {evidenceItems.map((item) => (
                <tr key={item.conclusion}>
                  <td><strong>{item.conclusion}</strong></td>
                  <td>{item.source}</td>
                  <td className="mono">{item.formula}</td>
                  <td>{item.type}</td>
                  <td>{item.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head"><h2>Красные флаги</h2><span className="label high">{result.redFlags.length}</span></div>
        <div className="panel-body">
          <table className="table">
            <thead><tr><th>Риск</th><th>Что это значит</th><th>Что сделать</th><th>Вопросы</th></tr></thead>
            <tbody>
              {result.redFlags.map((flag) => (
                <tr key={flag.id}>
                  <td><span className={`label ${flag.severity}`}>{flag.severity}</span><br />{flag.title}</td>
                  <td>{flag.explanation}<br /><span className="muted">{flag.evidence}</span></td>
                  <td>{flag.recommendation}</td>
                  <td>{flag.questionsToAsk.slice(0, 2).join(" / ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid two" style={{ marginTop: 16 }}>
        <article className="panel">
          <div className="panel-head"><h2>Зрелость финансовой функции</h2><span className="label medium">{result.financeMaturity.averageScore.toFixed(1)}/5</span></div>
          <div className="panel-body stack">
            <p>{result.financeMaturity.level}</p>
            {result.financeMaturity.blocks.map((block) => (
              <div className="metric" key={block.block}>
                <strong>{block.block}: {block.score}/5</strong>
                <p>{block.diagnosis}</p>
                <p className="muted">{block.recommendedNextStep}</p>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel" id="hiring">
          <div className="panel-head"><h2>Кого нанимать следующим</h2></div>
          <div className="panel-body stack">
            <span className="label info">{result.hiringRecommendation.role}</span>
            <p>{result.hiringRecommendation.whyNow}</p>
            <h3>Задачи</h3>
            <ul>{result.hiringRecommendation.keyResponsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>90 дней</h3>
            <ul>{result.hiringRecommendation.first90DaysGoals.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </aside>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-head"><h2>Вопросы финансовой команде</h2></div>
        <div className="panel-body">
          <ol>{result.questionsToFinanceTeam.map((question) => <li key={question}>{question}</li>)}</ol>
        </div>
      </section>
    </>
  );
}
