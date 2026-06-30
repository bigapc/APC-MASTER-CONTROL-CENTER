import { getNotificationFeed } from "@/lib/dashboard/liveFeeds";

function priorityClass(priority: string) {
  if (priority === "High") return "apc-status apc-status-red";
  if (priority === "Medium") return "apc-status apc-status-yellow";
  return "apc-status apc-status-black";
}

export default function NotificationCenter() {
  const notificationCenterItems = getNotificationFeed(5);

  return (
    <div className="apc-card p-6">
      <h2 className="text-2xl font-black">
        Notifications
      </h2>

      <div className="mt-5 space-y-3">
        {notificationCenterItems.map((notification) => (
          <div
            key={notification.title}
            className="rounded-xl bg-zinc-50 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{notification.title}</p>
              <span className={priorityClass(notification.priority)}>
                {notification.priority}
              </span>
            </div>

            <p className="mt-1 text-sm text-zinc-500">{notification.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
