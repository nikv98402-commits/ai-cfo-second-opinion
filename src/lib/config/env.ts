import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());

const runtimeEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MOCK_AI: z.enum(["true", "false"]).default("true"),
  AI_MODEL: z.string().min(1).default("Qwen/Qwen3-8B"),
  OPENAI_COMPATIBLE_BASE_URL: optionalUrl,
  OPENAI_COMPATIBLE_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET: z.string().min(1).default("case-files"),
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional()
});

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

export interface RuntimeReadiness {
  ok: boolean;
  environment: RuntimeEnv["NODE_ENV"];
  ai: {
    provider: "mock" | "openai-compatible";
    model: string;
    configured: boolean;
  };
  supabase: {
    configured: boolean;
    storageBucket: string;
  };
  database: {
    configured: boolean;
  };
  missing: string[];
}

export function getRuntimeEnv(): RuntimeEnv {
  return runtimeEnvSchema.parse(process.env);
}

export function getRuntimeReadiness(): RuntimeReadiness {
  const env = getRuntimeEnv();
  const missing: string[] = [];
  const aiProvider = env.MOCK_AI === "false" ? "openai-compatible" : "mock";

  if (aiProvider === "openai-compatible") {
    if (!env.OPENAI_COMPATIBLE_BASE_URL) missing.push("OPENAI_COMPATIBLE_BASE_URL");
    if (!env.OPENAI_COMPATIBLE_API_KEY) missing.push("OPENAI_COMPATIBLE_API_KEY");
  }

  const supabaseVars = [
    ["NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", env.NEXT_PUBLIC_SUPABASE_ANON_KEY],
    ["SUPABASE_SERVICE_ROLE_KEY", env.SUPABASE_SERVICE_ROLE_KEY]
  ] as const;

  for (const [name, value] of supabaseVars) {
    if (!value) missing.push(name);
  }

  if (!env.DATABASE_URL) missing.push("DATABASE_URL");

  return {
    ok: missing.length === 0,
    environment: env.NODE_ENV,
    ai: {
      provider: aiProvider,
      model: env.AI_MODEL,
      configured: aiProvider === "mock" || (!missing.includes("OPENAI_COMPATIBLE_BASE_URL") && !missing.includes("OPENAI_COMPATIBLE_API_KEY"))
    },
    supabase: {
      configured: supabaseVars.every(([, value]) => Boolean(value)),
      storageBucket: env.SUPABASE_STORAGE_BUCKET
    },
    database: {
      configured: Boolean(env.DATABASE_URL)
    },
    missing
  };
}

export function isSupabaseConfigured() {
  const env = getRuntimeEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
