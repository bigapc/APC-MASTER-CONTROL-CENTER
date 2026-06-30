import { getRuntimeStatus } from "@/lib/runtimeStatus";
import { isPreviewBypassEnabled } from "@/lib/security/previewMode";

export type LaunchGate = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export async function getLaunchReadiness() {
  const runtime = await getRuntimeStatus();
  const previewBypass = isPreviewBypassEnabled();

  const gates: LaunchGate[] = [
    {
      id: "mode-live",
      label: "Runtime mode is live",
      passed: runtime.liveRequested,
      detail: runtime.liveRequested
        ? "Live mode requested"
        : "Set NEXT_PUBLIC_DATA_MODE=live for launch",
    },
    {
      id: "auth-enforced",
      label: "Authentication enforcement enabled",
      passed: !previewBypass,
      detail: previewBypass
        ? "Set APC_PREVIEW_BYPASS_AUTH=false before launch"
        : "Auth and role guards are active",
    },
    {
      id: "backend-env",
      label: "Backend credentials configured",
      passed: runtime.missingBackendEnvVars.length === 0,
      detail:
        runtime.missingBackendEnvVars.length === 0
          ? "Supabase env keys are configured"
          : `Missing env: ${runtime.missingBackendEnvVars.join(", ")}`,
    },
    {
      id: "backend-reachable",
      label: "Backend endpoint reachable",
      passed: runtime.backendReachable,
      detail: runtime.backendReachable
        ? `HTTP ${runtime.backendStatusCode ?? "n/a"} (${runtime.backendLatencyMs ?? "n/a"} ms)`
        : runtime.backendProbeError ?? "Backend probe failed",
    },
    {
      id: "platform-config",
      label: "Platform URLs configured",
      passed: runtime.platformsConfigured,
      detail: runtime.platformsConfigured
        ? "All platform public/admin URLs configured"
        : "One or more platform URLs are missing",
    },
    {
      id: "platform-reachable",
      label: "Platform endpoints reachable",
      passed: runtime.platformsReachable,
      detail: runtime.platformsReachable
        ? "All platform endpoints reachable"
        : "One or more platform endpoints are unreachable",
    },
  ];

  const passedCount = gates.filter((gate) => gate.passed).length;
  const failedCount = gates.length - passedCount;
  const launchReady = failedCount === 0;

  return {
    runtime,
    previewBypass,
    gates,
    passedCount,
    failedCount,
    launchReady,
  };
}
