import { eventBus, type APCEvent } from "@/lib/events/eventBus";
import { notificationService, type NotificationItem } from "@/lib/services/notificationService";
import { auditService, type AuditRecord } from "@/lib/services/auditService";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emitNotification(
  title: string,
  message: string,
  level: NotificationItem["level"],
  source: string
) {
  const id = generateId();
  const timestamp = new Date().toISOString();

  const notification: NotificationItem = { id, title, message, level };
  notificationService.add(notification);

  const event: APCEvent = {
    id,
    type: "notification",
    source,
    timestamp,
    payload: notification,
  };
  eventBus.publish(event);
}

export function emitAuditEvent(
  action: string,
  actor: string,
  source: string,
  payload?: unknown
) {
  const id = generateId();
  const timestamp = new Date().toISOString();

  const record: AuditRecord = { id, action, actor, timestamp };
  auditService.add(record);

  const event: APCEvent = {
    id,
    type: "audit",
    source,
    timestamp,
    payload: payload ?? record,
  };
  eventBus.publish(event);
}

export function emitConnectorEvent(
  connectorId: string,
  eventType: string,
  actor: string,
  payload?: unknown
) {
  emitAuditEvent(`${connectorId}:${eventType}`, actor, connectorId, payload);
}

export function getLiveNotifications(): NotificationItem[] {
  return notificationService.getAll();
}

export function getLiveAuditLog(): AuditRecord[] {
  return auditService.getAll();
}

export function getLiveEvents(): APCEvent[] {
  return eventBus.getEvents();
}
