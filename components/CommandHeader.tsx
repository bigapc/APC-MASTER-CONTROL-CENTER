import LiveNotificationBell from "@/components/LiveNotificationBell";

export default function CommandHeader() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black">
          APC Master Control Center
        </h1>

        <p className="text-zinc-500">
          Executive Operations Platform
        </p>
      </div>

      <div className="flex items-center gap-3">
        <LiveNotificationBell />
        <div className="rounded-xl bg-red-700 px-4 py-2 text-white">
          Super Admin
        </div>
      </div>
    </div>
  );
}
