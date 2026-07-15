import type { Metadata } from "next";
import Link from "next/link";
import { AppSidebar } from "@/components/AppSidebar";
import { getAiRuntimeStatus } from "@/lib/ai/provider";
import { isSupabaseConfigured } from "@/lib/config/env";
import { getCurrentUser } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-CFO Second Opinion",
  description: "Working prototype for executive finance second opinion"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const aiRuntime = getAiRuntimeStatus();
  const user = await getCurrentUser();
  const supabaseReady = isSupabaseConfigured();

  return (
    <html lang="ru">
      <body>
        <div className="shell">
          <header className="topbar">
            <div className="brand">
              <span className="mark">CF</span>
              <span>AI-CFO Second Opinion</span>
            </div>
            <div className="topbar-actions">
              <div className="muted">RU primary / EN duplicate ready</div>
              {user ? (
                <form action="/auth/logout" method="post" className="auth-inline">
                  <span className="label info">{user.email}</span>
                  <button type="submit">Выйти</button>
                </form>
              ) : (
                <Link className="button" href="/login">{supabaseReady ? "Войти" : "Demo mode"}</Link>
              )}
            </div>
          </header>
          <AppSidebar
            aiProvider={aiRuntime.provider}
            aiModel={aiRuntime.model}
            workspaceMode={supabaseReady ? "supabase-ready" : "demo-open"}
          />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
