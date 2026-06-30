import { ShieldCheck, UserPlus } from "lucide-react";
import { getWorkforceOversight } from "@/lib/workforce/oversight";

export default async function UsersPage() {
  const { workforce, summary } = await getWorkforceOversight();

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Admin Access</div>
        <h1 className="mt-4 text-4xl font-black text-white">Users, Roles & Permissions</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Monitor executives, managers, supervisors, dispatchers, and platform personnel across all three APC applications from one master control center.
        </p>
        <button className="apc-button-primary mt-6"><UserPlus size={17} /> Invite Admin</button>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        {[
          { label: "Managers", value: summary.managers },
          { label: "Supervisors", value: summary.supervisors },
          { label: "Operators", value: summary.operators },
          { label: "Active Staff", value: summary.activeStaff },
        ].map((role) => (
          <div key={role.label} className="apc-card p-5">
            <ShieldCheck className="text-[#c1121f]" />
            <p className="mt-4 text-lg font-black">{role.label}</p>
            <p className="mt-2 text-3xl font-black text-zinc-950">{role.value}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Unified staff visibility across SafeConnect, CommunitySafeConnect, and CSC 2.0.</p>
          </div>
        ))}
      </section>

      <section className="apc-card overflow-hidden p-0">
        <div className="border-b p-6">
          <h2 className="text-xl font-black">Unified Workforce Directory</h2>
          <p className="text-sm text-zinc-500">Cross-app personnel view with current role group, application access, and recent activity.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="apc-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role Group</th><th>Role</th><th>App Access</th><th>Activity</th><th>Status</th></tr>
            </thead>
            <tbody>
              {workforce.map((user) => (
                <tr key={user.id}>
                  <td className="font-black">{user.name}</td>
                  <td>{user.email ?? "Not connected"}</td>
                  <td>{user.oversightGroup}</td>
                  <td>{user.roleLabel}</td>
                  <td>{user.appAccess}</td>
                  <td>{user.activityCount > 0 ? `${user.activityCount} event(s), ${user.lastActivity}` : user.lastActivity}</td>
                  <td><span className={user.status === "Active" ? "apc-status apc-status-green" : user.status === "Monitoring" ? "apc-status apc-status-yellow" : "apc-status apc-status-black"}>{user.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
