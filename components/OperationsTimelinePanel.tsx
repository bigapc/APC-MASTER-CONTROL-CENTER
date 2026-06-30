import { History } from "lucide-react";
import { getOperationsTimeline } from "@/lib/dashboard/liveFeeds";
import OperationAcknowledgeButton from "@/components/OperationAcknowledgeButton";

export default async function OperationsTimelinePanel() {
  const timeline = await getOperationsTimeline(10);

  return (
    <div className="apc-card p-6">
      <div className="flex items-center gap-3">
        <History className="text-[#c1121f]" />
        <h2 className="text-2xl font-black">Operations Timeline</h2>
      </div>

      <p className="mt-2 text-sm text-zinc-600">
        Live action history with acknowledgements for operator tracking.
      </p>

      <div className="mt-5 space-y-3">
        {timeline.map((item) => (
          <div key={item.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-black text-zinc-900">{item.action}</p>
                <p className="mt-1 text-sm text-zinc-600">Actor: {item.actor}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Source: {item.source}
                </p>
                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-400">{item.time}</p>
              </div>

              <OperationAcknowledgeButton operationId={item.id} acknowledged={item.acknowledged} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
