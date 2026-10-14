import { APC_UNITS } from "@/lib/apcUnits";
import { eventBus } from "./eventBus";
import type { APCEventEnvelope, EventGatewayError, EventGatewayResult } from "./gatewayTypes";

const INTERNAL_SOURCES = new Set(["apc-master-control-center", "apc-system"]);
const EVENT_TYPES = new Set([
  "operation.created", "operation.updated", "operation.requires_attention",
  "project.created", "project.updated", "task.created", "task.updated", "task.blocked",
  "incident.reported", "incident.updated", "incident.escalated", "incident.resolved",
  "integration.connected", "integration.disconnected", "integration.error",
  "system.configuration_required", "system.health_unavailable", "system.integration_pending",
]);

export function validateEventEnvelope(value: unknown): EventGatewayResult<APCEventEnvelope> | EventGatewayError {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, error: "InvalidEvent" };
  const event = value as Partial<APCEventEnvelope>;
  if (!event.eventId || !event.eventType || !event.eventVersion || !event.source || !event.sourceKind || !event.timestamp || !event.classification || !event.payload || typeof event.payload !== "object" || Array.isArray(event.payload)) {
    return { ok: false, error: "InvalidEvent" };
  }
  if (!EVENT_TYPES.has(event.eventType) || !["APC_UNIT", "INTERNAL_SYSTEM"].includes(event.sourceKind)) {
    return { ok: false, error: "InvalidEvent" };
  }
  const sourceIsUnit = APC_UNITS.some((unit) => unit.id === event.source);
  const sourceIsInternal = INTERNAL_SOURCES.has(event.source);
  const sourceKnown = sourceIsUnit || sourceIsInternal;
  if (!sourceKnown) return { ok: false, error: "UnknownSource" };
  if ((sourceIsUnit && event.sourceKind !== "APC_UNIT") || (sourceIsInternal && event.sourceKind !== "INTERNAL_SYSTEM")) {
    return { ok: false, error: "InvalidEvent" };
  }
  return { ok: true, data: event as APCEventEnvelope };
}

export function isRecognizedEventSource(source: string) {
  return APC_UNITS.some((unit) => unit.id === source) || INTERNAL_SOURCES.has(source);
}

export function routeEvent(event: APCEventEnvelope) {
  eventBus.publish({ id: event.eventId, type: event.eventType, source: event.source, timestamp: event.timestamp, payload: event.payload });
  return "PENDING_REVIEW" as const;
}
