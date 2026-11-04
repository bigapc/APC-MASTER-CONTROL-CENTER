import { isLiveMode } from "@/lib/dataMode";

export function isPreviewBypassEnabled() {
  if (process.env.NODE_ENV !== "development" || isLiveMode()) {
    return false;
  }

  const value = process.env.APC_PREVIEW_BYPASS_AUTH?.trim().toLowerCase();

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return false;
}
