// lib/config/envCheck.ts
// Called at startup (e.g. in instrumentation.ts or the root layout) to warn
// about missing required environment variables. Never throws — only logs.
// Keeps the app runnable in demo mode even when keys are absent.

interface EnvVar {
  name: string;
  required: boolean;
  liveOnly?: boolean;
  secret?: boolean;
}

const ENV_VARS: EnvVar[] = [
  { name: "NEXT_PUBLIC_DATA_MODE", required: true },
  { name: "NEXT_PUBLIC_APP_NAME", required: true },
  { name: "NEXT_PUBLIC_APP_ORIGIN", required: false },
  { name: "APC_SESSION_SECRET", required: false, secret: true },
  // Live-mode only
  { name: "NEXT_PUBLIC_SUPABASE_URL", required: false, liveOnly: true },
  { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: false, liveOnly: true, secret: true },
  { name: "SUPABASE_SERVICE_ROLE_KEY", required: false, liveOnly: true, secret: true },
  { name: "GITHUB_TOKEN", required: false, secret: true },
  { name: "UPSTASH_REDIS_REST_URL", required: false },
  { name: "UPSTASH_REDIS_REST_TOKEN", required: false, secret: true },
  { name: "KV_REST_API_URL", required: false },
  { name: "KV_REST_API_TOKEN", required: false, secret: true },
];

export interface EnvCheckResult {
  ok: boolean;
  missing: string[];
  warnings: string[];
}

export function checkEnv(): EnvCheckResult {
  const isLive = process.env.NEXT_PUBLIC_DATA_MODE === "live";
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const v of ENV_VARS) {
    const value = process.env[v.name]?.trim();
    const isLiveRequired = v.liveOnly && isLive;

    if ((v.required || isLiveRequired) && !value) {
      missing.push(v.name);
    } else if (!value && !v.secret) {
      warnings.push(`${v.name} is not set (optional)`);
    }
  }

  if (process.env.NODE_ENV === "production" && !process.env.APC_SESSION_SECRET?.trim()) {
    missing.push("APC_SESSION_SECRET");
  }

  const hasUpstash = Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
  const hasVercelKv = Boolean(
    process.env.KV_REST_API_URL?.trim() && process.env.KV_REST_API_TOKEN?.trim()
  );

  if (!hasUpstash && !hasVercelKv) {
    warnings.push("Shared rate limit backend is not set (optional)");
  }

  return { ok: missing.length === 0, missing, warnings };
}

export function logEnvCheck(): void {
  if (process.env.NODE_ENV === "production") return; // silent in prod

  const result = checkEnv();

  if (result.missing.length > 0) {
    console.warn(
      `[APC] Missing required env vars: ${result.missing.join(", ")}\n` +
        `Copy .env.example to .env.local and fill in the values.`
    );
  }

  if (result.warnings.length > 0) {
    console.info(`[APC] Optional env vars not set: ${result.warnings.map((w) => w.split(" ")[0]).join(", ")}`);
  }
}
