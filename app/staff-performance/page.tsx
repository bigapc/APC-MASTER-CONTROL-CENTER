import { Trophy, UserCheck, Users } from "lucide-react";
import { getWorkforceOversight } from "@/lib/workforce/oversight";

function scoreLabel(activityCount: number, status: string) {
  if (status === "Pending Setup") {
    return "Pending Setup";
  }

  if (activityCount >= 5) {
    return "98%";
  }

  if (activityCount >= 2) {
    return "86%";
  }

  return "72%";
}

export default async function StaffPerformancePage() {
  const { workforce, summary } = await getWorkforceOversight();
  const topScore = workforce.length > 0 ? scoreLabel(workforce[0].activityCount, workforce[0].status) : "n/a";

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Staff Performance</div>
        <h1 className="mt-4 text-4xl font-black text-white">APC Staff Performance Tracking</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Track role readiness, completed tasks, pending work, and operational performance across APC apps.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="apc-card p-6"><Users className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Tracked Staff</p><p className="mt-3 text-4xl font-black">{summary.totalStaff}</p></div>
        <div className="apc-card p-6"><UserCheck className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Observed Actions</p><p className="mt-3 text-4xl font-black">{summary.totalActivities}</p></div>
        <div className="apc-card p-6"><Trophy className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Top Score</p><p className="mt-3 text-4xl font-black">{topScore}</p></div>
      </section>

      <section className="apc-card overflow-hidden p-0">
        <div className="border-b p-6">
          <h2 className="text-2xl font-black">Performance Board</h2>
          <p className="mt-1 text-sm text-zinc-500">Live cross-app oversight for executives, managers, supervisors, and operational staff.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="apc-table">
            <thead>
              <tr><th>Name</th><th>Role</th><th>Oversight Group</th><th>App Access</th><th>Completed</th><th>Pending</th><th>Score</th></tr>
            </thead>
            <tbody>
              {workforce.map((staff) => (
                <tr key={staff.id}>
                  <td className="font-black">{staff.name}</td>
                  <td>{staff.roleLabel}</td>
                  <td>{staff.oversightGroup}</td>
                  <td>{staff.appAccess}</td>
                  <td>{staff.activityCount}</td>
                  <td>{staff.status === "Active" ? 0 : 1}</td>
                  <td><span className="apc-status apc-status-black">{scoreLabel(staff.activityCount, staff.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
