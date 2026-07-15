import { paidOffers } from "@/lib/data/sample";

const industries = ["Розница", "Дистрибуция", "Производство", "Услуги", "E-commerce", "Другое"];
const financeOwners = ["Главбух", "Экономист", "Финансовый менеджер", "Финансовый директор", "Внешний консультант", "Никто системно"];
const reports = ["БДР", "БДДС", "Баланс", "План-факт", "Кредитный график", "CAPEX-план", "Отчет по ДЗ/КЗ", "Отчет по запасам"];

export default function NewCasePage() {
  return (
    <>
      <section className="page-head">
        <div>
          <h1>Новый платный разбор</h1>
          <p>Сначала выбираем коммерческий формат результата, затем собираем минимальный профиль и data request.</p>
        </div>
        <a className="button" href="/cases/north-distribution-q2/upload">Перейти к загрузке</a>
      </section>

      <section className="grid three" style={{ marginBottom: 16 }}>
        {paidOffers.map((offer, index) => (
          <article className="panel" key={offer.name}>
            <div className="panel-head">
              <h2>{offer.name}</h2>
              {index === 1 ? <span className="label info">рекомендуется</span> : <span className="label medium">offer</span>}
            </div>
            <div className="panel-body stack">
              <div className="metric"><span>Цена</span><strong>{offer.price}</strong></div>
              <p>{offer.scope}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Профиль диагностического проекта</h2>
          <span className="label info">7-14 дней</span>
        </div>
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
