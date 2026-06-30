import { APP_CONFIG } from "@/lib/appConfig";
import { getDataMode, getRuntimeModeLabel, hasSupabaseConfig, isLiveMode } from "@/lib/dataMode";
import { getWebhookSecurityMode } from "@/lib/integrations/webhooks";

export type PlatformRuntimeStatus = {
  id: string;
  name: string;
  publicUrl: string;
  adminUrl: string;
  ready: boolean;
  missingEnvVars: string[];
  publicReachable: boolean;
  adminReachable: boolean;
  publicStatusCode: number | null;
  adminStatusCode: number | null;
  publicLatencyMs: number | null;
  adminLatencyMs: number | null;
  probeError: string | null;
};

type EndpointProbeResult = {
  reachable: boolean;
  statusCode: number | null;
  latencyMs: number | null;
  error: string | null;
};

const PLATFORM_ENV_KEYS: Record<string, {
  publicUrl: string;
  adminUrl: string;
  webhookSecret: string;
  serviceToken: string;
}> = {
  safeconnect: {
    publicUrl: "NEXT_PUBLIC_SAFECONNECT_PUBLIC_URL",
    adminUrl: "NEXT_PUBLIC_SAFECONNECT_ADMIN_URL",
    webhookSecret: "SAFECONNECT_WEBHOOK_SECRET",
    serviceToken: "SAFECONNECT_SERVICE_TOKEN",
  },
  communitysafeconnect: {
    publicUrl: "NEXT_PUBLIC_COMMUNITYSAFECONNECT_PUBLIC_URL",
    adminUrl: "NEXT_PUBLIC_COMMUNITYSAFECONNECT_ADMIN_URL",
    webhookSecret: "COMMUNITYSAFECONNECT_WEBHOOK_SECRET",
    serviceToken: "COMMUNITYSAFECONNECT_SERVICE_TOKEN",
  },
  csc_2_0: {
    publicUrl: "NEXT_PUBLIC_CSC_2_PUBLIC_URL",
    adminUrl: "NEXT_PUBLIC_CSC_2_ADMIN_URL",
    webhookSecret: "CSC_2_WEBHOOK_SECRET",
    serviceToken: "CSC_2_SERVICE_TOKEN",
  },
};

function isConfiguredUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "#") {
    return false;
  }

  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
}

async function probeUrl(url: string): Promise<EndpointProbeResult> {
  const controller = new AbortController();
  const startedAt = Date.now();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });

    return {
      reachable: response.ok,
      statusCode: response.status,
      latencyMs: Date.now() - startedAt,
      error: null,
    };
  } catch (error) {
    return {
      reachable: false,
      statusCode: null,
      latencyMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function probeSupabase(url: string | undefined): Promise<EndpointProbeResult> {
  const baseUrl = url?.trim();

  if (!baseUrl) {
    return {
      reachable: false,
      statusCode: null,
      latencyMs: null,
      error: "NEXT_PUBLIC_SUPABASE_URL is not configured",
    };
  }

  return probeUrl(`${baseUrl}/auth/v1/health`);
}

export async function getRuntimeStatus() {
  const supabaseUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const supabaseAnonConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const supabaseServiceRoleConfigured = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

  const missingBackendEnvVars = [
    ...(supabaseUrlConfigured ? [] : ["NEXT_PUBLIC_SUPABASE_URL"]),
    ...(supabaseAnonConfigured ? [] : ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]),
    ...(supabaseServiceRoleConfigured ? [] : ["SUPABASE_SERVICE_ROLE_KEY"]),
  ];

  const platformsBase = APP_CONFIG.apps.map((app) => {
    const envKeys = PLATFORM_ENV_KEYS[app.id];
    const hasPublicUrl = isConfiguredUrl(app.publicUrl);
    const hasAdminUrl = isConfiguredUrl(app.adminUrl);
    const hasWebhookSecret = Boolean(process.env[envKeys?.webhookSecret ?? ""]?.trim());
    const hasServiceToken = Boolean(process.env[envKeys?.serviceToken ?? ""]?.trim());
    const missingEnvVars = [
      ...(hasPublicUrl ? [] : [envKeys?.publicUrl ?? "NEXT_PUBLIC_PLATFORM_PUBLIC_URL"]),
      ...(hasAdminUrl ? [] : [envKeys?.adminUrl ?? "NEXT_PUBLIC_PLATFORM_ADMIN_URL"]),
      ...(hasWebhookSecret ? [] : [envKeys?.webhookSecret ?? "PLATFORM_WEBHOOK_SECRET"]),
      ...(hasServiceToken ? [] : [envKeys?.serviceToken ?? "PLATFORM_SERVICE_TOKEN"]),
    ];

    return {
      id: app.id,
      name: app.name,
      publicUrl: app.publicUrl,
      adminUrl: app.adminUrl,
      ready: hasPublicUrl && hasAdminUrl && hasWebhookSecret && hasServiceToken,
      missingEnvVars,
    };
  });

  const shouldProbeConnectivity = isLiveMode();
  const webhookSecurityMode = getWebhookSecurityMode();

  const [backendProbe, platforms] = await Promise.all([
    shouldProbeConnectivity ? probeSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL) : Promise.resolve({
      reachable: false,
      statusCode: null,
      latencyMs: null,
      error: "Connectivity probes run in live mode only",
    }),
    Promise.all(platformsBase.map(async (platform) => {
      if (!shouldProbeConnectivity || !platform.ready) {
        return {
          ...platform,
          publicReachable: false,
          adminReachable: false,
          publicStatusCode: null,
          adminStatusCode: null,
          publicLatencyMs: null,
          adminLatencyMs: null,
          probeError: !shouldProbeConnectivity
            ? "Connectivity probes run in live mode only"
            : "Platform URL is not configured",
        } satisfies PlatformRuntimeStatus;
      }

      const [publicProbe, adminProbe] = await Promise.all([
        probeUrl(platform.publicUrl),
        probeUrl(platform.adminUrl),
      ]);

      return {
        ...platform,
        publicReachable: publicProbe.reachable,
        adminReachable: adminProbe.reachable,
        publicStatusCode: publicProbe.statusCode,
        adminStatusCode: adminProbe.statusCode,
        publicLatencyMs: publicProbe.latencyMs,
        adminLatencyMs: adminProbe.latencyMs,
        probeError: publicProbe.error || adminProbe.error,
      } satisfies PlatformRuntimeStatus;
    })),
  ]);

  const platformsReachable = platforms.every((platform) => platform.publicReachable && platform.adminReachable);

  return {
    mode: getDataMode(),
    label: getRuntimeModeLabel(),
    liveRequested: isLiveMode(),
    supabaseConfigured: hasSupabaseConfig(),
    supabaseUrlConfigured,
    supabaseAnonConfigured,
    supabaseServiceRoleConfigured,
    missingBackendEnvVars,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured",
    ownerName: APP_CONFIG.ownerName,
    ownerEmail: APP_CONFIG.ownerEmail,
    backendReachable: backendProbe.reachable,
    backendStatusCode: backendProbe.statusCode,
    backendLatencyMs: backendProbe.latencyMs,
    backendProbeError: backendProbe.error,
    platforms,
    platformsConfigured: platforms.every((platform) => platform.ready),
    platformsReachable,
    platformCount: platforms.length,
    webhookSecurityMode,
    webhookLegacyHeaderEnabled: webhookSecurityMode === "compat-secret-header",
    liveReady: isLiveMode() && hasSupabaseConfig() && platforms.every((platform) => platform.ready) && backendProbe.reachable && platformsReachable,
  };
}
