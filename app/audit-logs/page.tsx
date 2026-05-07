export default function AuditLogsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Audit Logs</h1>
      <p className="mt-2 text-slate-600">
        Admin actions and system activity will be tracked here.
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow">
        <p className="text-slate-500">No audit logs connected yet.</p>
      </div>
    </div>
  );
}