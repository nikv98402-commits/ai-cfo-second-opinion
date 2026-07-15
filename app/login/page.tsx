import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/config/env";

interface LoginPageProps {
  searchParams: Promise<{
    sent?: string;
    error?: string;
    next?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabaseReady = isSupabaseConfigured();

  return (
    <section className="auth-page">
      <article className="panel auth-card">
        <div className="panel-head">
          <div>
            <h1>Вход для собственника</h1>
            <p>Magic link по email. Без пароля и корпоративного SSO на первом MVP.</p>
          </div>
          <span className={`label ${supabaseReady ? "info" : "medium"}`}>{supabaseReady ? "Supabase ready" : "demo mode"}</span>
        </div>
        <form className="panel-body stack" action="/auth/login" method="post">
          <input type="hidden" name="next" value={params.next || "/"} />
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" placeholder="founder@company.ru" required disabled={!supabaseReady} />
          </div>
          {params.sent ? <div className="note">Ссылка отправлена. Проверьте почту и вернитесь в workspace после подтверждения.</div> : null}
          {params.error ? <div className="note danger">Не удалось отправить ссылку: {params.error}</div> : null}
          {!supabaseReady ? (
            <div className="note">
              Supabase env еще не настроены, поэтому production auth выключен. Прототип открыт в demo mode.
            </div>
          ) : null}
          <button className="primary" type="submit" disabled={!supabaseReady}>Получить magic link</button>
          <Link className="button" href="/">Вернуться в demo workspace</Link>
        </form>
      </article>
    </section>
  );
}
