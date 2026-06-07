const reports = [
  {
    id: "SC-1001",
    app: "SafeConnect",
    status: "Open",
  },
  {
    id: "CSC-2001",
    app: "CommunitySafeConnect",
    status: "Assigned",
  },
];

export default function ReportsTable() {
  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Unified Reports
      </h2>

      <table className="mt-5 w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Platform</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.app}</td>
              <td>{report.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
