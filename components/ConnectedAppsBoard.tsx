import { APP_REGISTRY } from "@/lib/appRegistry";

export default function ConnectedAppsBoard() {
  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Connected Platforms
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {APP_REGISTRY.map((app) => (
          <div
            key={app.id}
            className="rounded-xl bg-zinc-50 p-5"
          >
            <h3 className="font-black">
              {app.name}
            </h3>

            <p className="mt-2">
              Status: {app.status}
            </p>

            <button className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-white">
              Open Platform
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
