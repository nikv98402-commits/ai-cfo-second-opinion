import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim();
  const next = String(formData.get("next") || "/");
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") || new URL(request.url).origin;
  const supabase = await createSupabaseServerClient();

  if (!supabase) redirect("/login?error=supabase_not_configured");
  if (!email) redirect("/login?error=email_required");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect(`/login?sent=1&next=${encodeURIComponent(next)}`);
}
