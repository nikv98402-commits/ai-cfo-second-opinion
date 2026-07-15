import { NextResponse } from "next/server";
import { getRuntimeReadiness } from "@/lib/config/env";

export const dynamic = "force-dynamic";

export function GET() {
  const readiness = getRuntimeReadiness();

  return NextResponse.json(
    {
      status: readiness.ok ? "ok" : "degraded",
      service: "ai-cfo-second-opinion",
      timestamp: new Date().toISOString(),
      readiness
    },
    {
      status: readiness.ok ? 200 : 503,
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
