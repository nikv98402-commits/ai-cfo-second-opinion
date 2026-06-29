const industries = ["Розница", "Дистрибуция", "Производство", "Услуги", "E-commerce", "Другое"];
const financeOwners = ["Главбух", "Экономист", "Финансовый менеджер", "Финансовый директор", "Внешний консультант", "Никто системно"];
const reports = ["БДР", "БДДС", "Баланс", "План-факт", "Кредитный график", "CAPEX-план", "Отчет по ДЗ/КЗ", "Отчет по запасам"];

export default function NewCasePage() {
  return (
    <>
      <section className="page-head">
        <div>
          <h1>Создание кейса</h1>
          <p>Минимальный профиль компании, чтобы AI-CFO понимал масштаб, финконтур и контекст решения.</p>
        </div>
        <a className="button" href="/cases/north-distribution-q2/upload">Перейти к загрузке</a>
      </section>

      <section className="panel">
        <div className="panel-body form-grid">
          <div className="field"><label>Название компании</label><input defaultValue="ООО Северная Дистрибуция" /></div>
          <div className="field"><label>Отрасль</label><select defaultValue="Дистрибуция">{industries.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field"><label>Годовая выручка</label><input defaultValue="1850000000" /></div>
          <div className="field"><label>Количество сотрудников</label><input defaultValue="420" /></div>
          <div className="field"><label>Количество юрлиц</label><input defaultValue="3" /></div>
          <div className="field"><label>Кто отвечает за финансы</label><select defaultValue="Финансовый менеджер">{financeOwners.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field"><label>Есть кредиты / лизинг</label><select defaultValue="Да"><option>Да</option><option>Нет</option></select></div>
          <div className="field"><label>Есть CAPEX-план</label><select defaultValue="Да"><option>Да</option><option>Нет</option></select></div>
        </div>
        <div className="panel-body">
          <h2>Какие отчеты есть</h2>
          <div className="grid three" style={{ marginTop: 12 }}>
            {reports.map((item) => <label className="metric" key={item}><input type="checkbox" defaultChecked={item !== "План-факт"} /> {item}</label>)}
          </div>
        </div>
        <div className="panel-body">
          <a className="button primary" href="/cases/north-distribution-q2/upload">Создать и перейти к данным</a>
        </div>
      </section>
    </>
  );
}
