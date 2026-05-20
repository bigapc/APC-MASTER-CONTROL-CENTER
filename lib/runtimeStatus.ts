import { APP_CONFIG } from "@/lib/appConfig";
import { getDataMode, getRuntimeModeLabel, hasSupabaseConfig, isLiveMode } from "@/lib/dataMode";

export async function getRuntimeStatus() {
  return {
    mode: getDataMode(),
    label: getRuntimeModeLabel(),
    liveRequested: isLiveMode(),
    supabaseConfigured: hasSupabaseConfig(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured",
    ownerName: APP_CONFIG.ownerName,
    ownerEmail: APP_CONFIG.ownerEmail,
  };
}
