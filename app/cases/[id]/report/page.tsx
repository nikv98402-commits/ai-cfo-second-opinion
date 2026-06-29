import Link from "next/link";
import { sampleCase, sampleInputs } from "@/lib/data/sample";
import { analyzeCase } from "@/lib/finance/analysis";
import { formatMoney, formatPercent } from "@/lib/finance/metrics";
import { PrintButton } from "@/components/PrintButton";

export default function ReportPage() {
  const result = analyzeCase(sampleCase, sampleInputs);
  return (
    <>
      <section className="page-head">
        <div>
          <h1>Отчет: {sampleCase.companyName}</h1>
          <p>Second opinion по ликвидности, марже, CAPEX, долгу, оборотному капиталу и зрелости финфункции.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a className="button" download="ai-cfo-report.md" href={`data:text/markdown;charset=utf-8,${encodeURIComponent(result.markdownReport)}`}>Скачать Markdown</a>
          <PrintButton />
          <Link className="button" href="/">Вернуться к кейсам</Link>
          <Link className="button primary" href={`/cases/${sampleCase.id}/analyze`}>Перезапустить анализ</Link>
        </div>
      </section>

      <section className="grid two">
        <article className="panel">
          <div className="panel-head">
            <h2>Executive summary</h2>
            <span className={`label ${result.riskLevel}`}>{result.riskLevel} · {result.riskScore}/100</span>
          </div>
          <div className="panel-body stack">
            <p>{result.executiveSummary}</p>
            <p>{result.ownerEducationBlock}</p>
          </div>
        </article>

        <aside className="panel">
          <div className="panel-head"><h2>Ключевые метрики</h2></div>
          <div className="panel-body grid">
            <div className="metric"><span>Gross margin</span><strong>{formatPercent(result.metrics.grossMargin)}</strong></div>
            <div className="metric"><span>EBITDA margin</span><strong>{formatPercent(result.metrics.ebitdaMargin)}</strong></div>
            <div className="metric"><span>FCF</span><strong>{formatMoney(result.metrics.fcf)}</strong></div>
            <div className="metric"><span>DSCR</span><strong>{result.metrics.dscr.toFixed(2)}</strong></div>
          </div>
        </aside>
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
