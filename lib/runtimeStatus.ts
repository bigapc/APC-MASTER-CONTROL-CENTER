import { APP_CONFIG } from "@/lib/appConfig";
import { getDataMode, getRuntimeModeLabel, hasSupabaseConfig, isLiveMode } from "@/lib/dataMode";

export type PlatformRuntimeStatus = {
  id: string;
  name: string;
  publicUrl: string;
  adminUrl: string;
  ready: boolean;
  missingEnvVars: string[];
};

const PLATFORM_ENV_KEYS: Record<string, { publicUrl: string; adminUrl: string }> = {
  safeconnect: {
    publicUrl: "NEXT_PUBLIC_SAFECONNECT_PUBLIC_URL",
    adminUrl: "NEXT_PUBLIC_SAFECONNECT_ADMIN_URL",
  },
  communitysafeconnect: {
    publicUrl: "NEXT_PUBLIC_COMMUNITYSAFECONNECT_PUBLIC_URL",
    adminUrl: "NEXT_PUBLIC_COMMUNITYSAFECONNECT_ADMIN_URL",
  },
  csc_2_0: {
    publicUrl: "NEXT_PUBLIC_CSC_2_PUBLIC_URL",
    adminUrl: "NEXT_PUBLIC_CSC_2_ADMIN_URL",
  },
};

function isConfiguredUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "#") {
    return false;
  }

  return trimmed.startsWith("http://") || trimmed.startsWith("https://");
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

  const platforms = APP_CONFIG.apps.map((app) => {
    const envKeys = PLATFORM_ENV_KEYS[app.id];
    const hasPublicUrl = isConfiguredUrl(app.publicUrl);
    const hasAdminUrl = isConfiguredUrl(app.adminUrl);
    const missingEnvVars = [
      ...(hasPublicUrl ? [] : [envKeys?.publicUrl ?? "NEXT_PUBLIC_PLATFORM_PUBLIC_URL"]),
      ...(hasAdminUrl ? [] : [envKeys?.adminUrl ?? "NEXT_PUBLIC_PLATFORM_ADMIN_URL"]),
    ];

    return {
      id: app.id,
      name: app.name,
      publicUrl: app.publicUrl,
      adminUrl: app.adminUrl,
      ready: hasPublicUrl && hasAdminUrl,
      missingEnvVars,
    } satisfies PlatformRuntimeStatus;
  });

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
    platforms,
    platformsConfigured: platforms.every((platform) => platform.ready),
    platformCount: platforms.length,
    liveReady: isLiveMode() && hasSupabaseConfig() && platforms.every((platform) => platform.ready),
  };
}
