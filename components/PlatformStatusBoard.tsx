import { APP_CONFIG } from "@/lib/appConfig";
import { getRuntimeStatus } from "@/lib/runtimeStatus";
import { getPlatformHealth } from "@/lib/integrations/platformConnector";

function statusClass(status: string) {
  if (status === "healthy") return "apc-status apc-status-green";
  if (status === "monitoring") return "apc-status apc-status-yellow";
  return "apc-status apc-status-red";
}

function normalizeStatus(runtimeReady: boolean, connectorStatus?: string) {
  if (!runtimeReady) {
    return "offline";
  }

  if (connectorStatus === "healthy") {
    return "healthy";
  }

  if (connectorStatus === "monitoring" || connectorStatus === "warning") {
    return "monitoring";
  }

  return "offline";
}

export default async function PlatformStatusBoard() {
  const [runtime, health] = await Promise.all([getRuntimeStatus(), getPlatformHealth()]);

  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Platform Status Board
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {APP_CONFIG.apps.map((app) => {
          const runtimeEntry = runtime.platforms.find((platform) => platform.id === app.id);
          const healthEntry = health.find((item) => item.appId === app.id);
          const status = normalizeStatus(Boolean(runtimeEntry?.publicReachable && runtimeEntry?.adminReachable), healthEntry?.status);

          return (
            <div
              key={app.id}
              className="rounded-xl bg-zinc-50 p-5"
              style={{ borderLeft: "4px solid #c1121f" }}
            >
              <h3 className="font-black">
                {app.name}
              </h3>

              <div className="mt-2">
                <span className={statusClass(status)}>{status}</span>
              </div>

              <p className="mt-3 text-xs font-bold text-zinc-600">
                Reachability: {runtimeEntry?.publicReachable && runtimeEntry?.adminReachable ? "public/admin online" : "pending or unreachable"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
