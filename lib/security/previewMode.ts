export function isPreviewBypassEnabled() {
  const value = process.env.APC_PREVIEW_BYPASS_AUTH?.trim().toLowerCase();

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  // Default on in non-production so preview remains frictionless.
  return process.env.NODE_ENV !== "production";
}
