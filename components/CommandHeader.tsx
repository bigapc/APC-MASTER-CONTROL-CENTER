import LiveNotificationBell from "@/components/LiveNotificationBell";

export default function CommandHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 shadow-xl shadow-black/20 backdrop-blur sm:flex-row sm:items-center sm:justify-between md:px-8">
      <div className="space-y-1">
        <div className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200">
          Executive Operations Platform
        </div>

        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          APC Master Control Center
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <LiveNotificationBell />
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white">
          Super Admin
        </div>
      </div>
    </div>
  );
}
