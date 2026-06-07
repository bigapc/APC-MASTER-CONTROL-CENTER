import { APP_REGISTRY } from "@/lib/appRegistry";

function statusClass(status: string) {
  if (status === "healthy") return "apc-status apc-status-green";
  if (status === "monitoring") return "apc-status apc-status-yellow";
  return "apc-status apc-status-red";
}

export default function PlatformStatusBoard() {
  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Platform Status Board
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {APP_REGISTRY.map((app) => (
          <div
            key={app.id}
            className="rounded-xl bg-zinc-50 p-5"
            style={{ borderLeft: `4px solid ${app.color}` }}
          >
            <h3 className="font-black">
              {app.name}
            </h3>

            <div className="mt-2">
              <span className={statusClass(app.status)}>{app.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
