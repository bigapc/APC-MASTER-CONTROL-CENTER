import { DAILY_OPERATION_CHECKLIST } from "@/lib/appConfig";
import { CheckSquare, Circle } from "lucide-react";

export default function ChecklistPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Daily Operations</div>
        <h1 className="mt-4 text-4xl font-black text-white">APC Daily Operational Checklist</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          A command-center readiness list for reviewing backend status, alerts, dispatch, reports, staff activity, and app health every day.
        </p>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Today&apos;s Readiness Tasks</h2>
        <div className="mt-6 grid gap-4">
          {DAILY_OPERATION_CHECKLIST.map((item, index) => (
            <div key={item} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-zinc-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#c1121f] shadow-sm">
                {index < 2 ? <CheckSquare size={20} /> : <Circle size={20} />}
              </div>
              <div>
                <p className="font-black text-zinc-950">{item}</p>
                <p className="mt-1 text-sm text-zinc-600">APC daily command review item #{index + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
