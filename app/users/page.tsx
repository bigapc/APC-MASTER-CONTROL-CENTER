export default function UsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-950">Unified Users</h1>
      <p className="mt-2 text-slate-600">
        User and admin access across all APC apps will be managed here.
      </p>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow">
        <p className="text-slate-500">No users connected yet.</p>
      </div>
    </div>
  );
}