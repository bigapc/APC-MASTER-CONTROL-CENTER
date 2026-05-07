import { APP_CONFIG } from "@/lib/appConfig";

export default function AppsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Connected Apps</h1>

      <p className="mt-2 text-slate-600">
        Manage which APC applications connect to the master control center.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow">
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4">App Name</th>
                <th className="p-4">App ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {APP_CONFIG.apps.map((app) => (
                <tr key={app.id} className="border-t">
                  <td className="p-4 font-semibold text-slate-950">{app.name}</td>
                  <td className="p-4 font-mono text-slate-600">{app.id}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{app.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}