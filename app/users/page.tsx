import { DEMO_USERS } from "@/lib/appConfig";
import { ShieldCheck, UserPlus } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Admin Access</div>
        <h1 className="mt-4 text-4xl font-black text-white">Users, Roles & Permissions</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Control who can access SafeConnect, CommunitySafeConnect, CSC 2.0, and the APC Master Control Center.
        </p>
        <button className="apc-button-primary mt-6"><UserPlus size={17} /> Invite Admin</button>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        {["Super Admin", "App Admin", "Dispatcher", "Viewer"].map((role) => (
          <div key={role} className="apc-card p-5">
            <ShieldCheck className="text-[#c1121f]" />
            <p className="mt-4 text-lg font-black">{role}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Role prepared for APC permission architecture.</p>
          </div>
        ))}
      </section>

      <section className="apc-card overflow-hidden p-0">
        <div className="border-b p-6">
          <h2 className="text-xl font-black">Admin Directory</h2>
          <p className="text-sm text-zinc-500">Demo users are shown until authentication is connected.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="apc-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>App Access</th><th>Status</th></tr>
            </thead>
            <tbody>
              {DEMO_USERS.map((user) => (
                <tr key={user.email}>
                  <td className="font-black">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.access}</td>
                  <td><span className={user.status === "Active" ? "apc-status apc-status-green" : "apc-status apc-status-yellow"}>{user.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
