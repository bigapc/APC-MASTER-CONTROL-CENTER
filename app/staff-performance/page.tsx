import { STAFF_PERFORMANCE } from "@/lib/appConfig";
import { Trophy, UserCheck, Users } from "lucide-react";

export default function StaffPerformancePage() {
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
        <div className="apc-card p-6"><Users className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Tracked Staff Groups</p><p className="mt-3 text-4xl font-black">3</p></div>
        <div className="apc-card p-6"><UserCheck className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Completed Actions</p><p className="mt-3 text-4xl font-black">12</p></div>
        <div className="apc-card p-6"><Trophy className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Top Score</p><p className="mt-3 text-4xl font-black">98%</p></div>
      </section>

      <section className="apc-card overflow-hidden p-0">
        <div className="border-b p-6">
          <h2 className="text-2xl font-black">Performance Board</h2>
          <p className="mt-1 text-sm text-zinc-500">Demo records are staged until live staff records are connected.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="apc-table">
            <thead>
              <tr><th>Name</th><th>Role</th><th>App</th><th>Completed</th><th>Pending</th><th>Score</th></tr>
            </thead>
            <tbody>
              {STAFF_PERFORMANCE.map((staff) => (
                <tr key={staff.name}>
                  <td className="font-black">{staff.name}</td>
                  <td>{staff.role}</td>
                  <td>{staff.app}</td>
                  <td>{staff.completed}</td>
                  <td>{staff.pending}</td>
                  <td><span className="apc-status apc-status-black">{staff.score}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
