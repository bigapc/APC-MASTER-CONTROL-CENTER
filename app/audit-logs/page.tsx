import { Clock, Shield } from "lucide-react";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import DataSourceBadge from "@/components/DataSourceBadge";
import DatasetSourceList from "@/components/DatasetSourceList";
import { getAuditTimelineItemsWithSource } from "@/lib/supabaseAdapter";
import LiveAuditFeed from "@/components/LiveAuditFeed";

export default async function AuditLogsPage() {
  const auditTimelineItemsResult = await getAuditTimelineItemsWithSource();
  const auditTimelineItems = auditTimelineItemsResult.data;

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Activity Monitoring</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <DatasetSourceList
          className="mt-4 border-white/20 bg-white/5"
          title="Audit Dataset Sources"
          statuses={[auditTimelineItemsResult.status]}
        />

        <h1 className="mt-4 text-4xl font-black text-white">Audit Logs Center</h1>

        <p className="mt-4 text-zinc-300">
          Permanent record of APC activity, changes and platform events.
        </p>
        <p className="mt-3 text-zinc-400">{APC_COMMAND.mission}</p>
      </section>

      <section className="apc-card p-6">
        <h2 className="flex items-center gap-3 text-2xl font-black">
          <Shield className="text-[#c1121f]" />
          Activity Timeline
        </h2>

        <div className="mt-5 space-y-4">
          {auditTimelineItems.map((log) => (
            <div key={`${log.action}-${log.time}`} className="rounded-xl bg-zinc-50 p-5">
              <p className="font-black">{log.action}</p>

              <div className="mt-2 flex gap-4 text-sm text-zinc-600">
                <span>{log.user}</span>

                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {log.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <LiveAuditFeed limit={30} />
      </section>
    </div>
  );
}