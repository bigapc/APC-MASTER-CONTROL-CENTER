import { DEMO_REPORTS } from "@/lib/appConfig";
import { FileText, Filter, Plus } from "lucide-react";

function priorityClass(priority: string) {
  if (priority === "High") return "apc-status apc-status-red";
  if (priority === "Medium") return "apc-status apc-status-yellow";
  return "apc-status apc-status-green";
}

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Unified Reports Center</div>
        <h1 className="mt-4 text-4xl font-black text-white">Reports Across All APC Apps</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Review safety requests, community concerns, dispatcher follow-ups, and priority cases from one executive control screen.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="apc-button-primary"><Plus size={17} /> New Report</button>
          <button className="apc-button-secondary"><Filter size={17} /> Filter Reports</button>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="apc-card p-6"><p className="text-sm font-bold text-zinc-500">Open Reports</p><p className="mt-3 text-4xl font-black">3</p></div>
        <div className="apc-card p-6"><p className="text-sm font-bold text-zinc-500">High Priority</p><p className="mt-3 text-4xl font-black">1</p></div>
        <div className="apc-card p-6"><p className="text-sm font-bold text-zinc-500">Awaiting Assignment</p><p className="mt-3 text-4xl font-black">1</p></div>
      </section>

      <section className="apc-card overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b p-6">
          <FileText className="text-[#c1121f]" />
          <div>
            <h2 className="text-xl font-black">Report Queue</h2>
            <p className="text-sm text-zinc-500">Demo rows are shown until Supabase is connected.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="apc-table">
            <thead>
              <tr><th>Report ID</th><th>Application</th><th>Type</th><th>Priority</th><th>Status</th><th>Submitted By</th><th>Assigned To</th><th>Created</th></tr>
            </thead>
            <tbody>
              {DEMO_REPORTS.map((report) => (
                <tr key={report.id}>
                  <td className="font-mono font-bold">{report.id}</td>
                  <td className="font-bold">{report.app}</td>
                  <td>{report.type}</td>
                  <td><span className={priorityClass(report.priority)}>{report.priority}</span></td>
                  <td>{report.status}</td>
                  <td>{report.submittedBy}</td>
                  <td>{report.assignedTo}</td>
                  <td>{report.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
