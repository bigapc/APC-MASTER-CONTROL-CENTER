import { Activity } from "lucide-react";
import { getActivityFeed } from "@/lib/dashboard/liveFeeds";

export default async function ActivityFeed() {
  const activityFeedItems = await getActivityFeed(5);

  return (
    <div className="apc-card p-6">
      <div className="flex items-center gap-3">
        <Activity className="text-[#c1121f]" />
        <h2 className="text-2xl font-black">Activity Feed</h2>
      </div>

      <div className="mt-5 space-y-3">
        {activityFeedItems.map((item) => (
          <div key={item.id} className="rounded-xl bg-zinc-50 p-4">
            <p className="font-black">{item.title}</p>
            <p className="mt-1 text-sm text-zinc-600">{item.detail}</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
