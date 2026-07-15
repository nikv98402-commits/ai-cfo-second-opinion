import { paidOffers } from "@/lib/data/sample";
import { isDatabaseConfigured, isSupabaseConfigured } from "@/lib/config/env";
import { createFounderCase } from "./actions";

const industries = ["Розница", "Дистрибуция", "Производство", "Услуги", "E-commerce", "Другое"];
const financeOwners = ["Главбух", "Экономист", "Финансовый менеджер", "Финансовый директор", "Внешний консультант", "Никто системно"];
const reports = ["БДР", "БДДС", "Баланс", "План-факт", "Кредитный график", "CAPEX-план", "Отчет по ДЗ/КЗ", "Отчет по запасам"];

export default function NewCasePage() {
  const persistenceReady = isSupabaseConfigured() && isDatabaseConfigured();

  return (
    <>
      <section className="page-head">
        <div>
          <h1>Новый платный разбор</h1>
          <p>Сначала выбираем коммерческий формат результата, затем собираем минимальный профиль и data request.</p>
        </div>
        <span className={`label ${persistenceReady ? "info" : "medium"}`}>
          {persistenceReady ? "persistent workspace" : "demo fallback"}
        </span>
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

      <form className="panel" action={createFounderCase}>
        <div className="panel-head">
          <h2>Профиль диагностического проекта</h2>
          <span className="label info">7-14 дней</span>
        </div>
        <div className="panel-body form-grid">
          <div className="field"><label>Название компании</label><input name="companyName" defaultValue="ООО Северная Дистрибуция" required /></div>
          <div className="field"><label>Отрасль</label><select name="industry" defaultValue="Дистрибуция">{industries.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field"><label>Годовая выручка</label><input name="annualRevenue" inputMode="numeric" defaultValue="1850000000" required /></div>
          <div className="field"><label>Количество сотрудников</label><input name="employeesCount" inputMode="numeric" defaultValue="420" required /></div>
          <div className="field"><label>Количество юрлиц</label><input name="legalEntitiesCount" inputMode="numeric" defaultValue="3" required /></div>
          <div className="field"><label>Кто отвечает за финансы</label><select name="financeOwner" defaultValue="Финансовый менеджер">{financeOwners.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="field"><label>Есть кредиты / лизинг</label><select name="hasDebt" defaultValue="true"><option value="true">Да</option><option value="false">Нет</option></select></div>
          <div className="field"><label>Есть CAPEX-план</label><select name="hasCapexPlan" defaultValue="true"><option value="true">Да</option><option value="false">Нет</option></select></div>
        </div>
        <div className="panel-body">
          <h2>Какие отчеты есть</h2>
          <div className="grid three" style={{ marginTop: 12 }}>
            {reports.map((item) => (
              <label className="metric" key={item}>
                <input name="reportsAvailable" value={item} type="checkbox" defaultChecked={item !== "План-факт"} /> {item}
              </label>
            ))}
          </div>
        </div>
        <div className="panel-body">
          {!persistenceReady ? (
            <div className="note" style={{ marginBottom: 12 }}>
              Пока Supabase/DATABASE env не настроены, кнопка ведет в demo data pack. После подключения базы она создаст приватный кейс собственника.
            </div>
          ) : null}
          <button className="primary" type="submit">Создать и перейти к данным</button>
        </div>
      </form>
    </>
  );
}
