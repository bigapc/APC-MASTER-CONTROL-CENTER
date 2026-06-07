export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  level: "info" | "warning" | "critical";
}

export const notificationService = {
  notifications: [] as NotificationItem[],

  add(notification: NotificationItem) {
    this.notifications.push(notification);
  },

  getAll() {
    return this.notifications;
  },

  clear() {
    this.notifications = [];
  },
};
