export type DataMode = "demo" | "live";

export function getDataMode(): DataMode {
  const mode = process.env.NEXT_PUBLIC_DATA_MODE?.toLowerCase();
  return mode === "live" ? "live" : "demo";
}

export function isLiveMode() {
  return getDataMode() === "live";
}

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function getRuntimeModeLabel() {
  if (isLiveMode() && hasSupabaseConfig()) {
    return "Live Supabase Mode";
  }

  if (isLiveMode() && !hasSupabaseConfig()) {
    return "Live Mode Requested - Missing Supabase Keys";
  }

  return "Demo Mode";
}
