import type { APCUnit } from "@/lib/apcUnits";
import type { APCPriority } from "@/lib/priority";

export type APCEventType =
  | "operation.created" | "operation.updated" | "operation.requires_attention"
  | "project.created" | "project.updated" | "task.created" | "task.updated" | "task.blocked"
  | "incident.reported" | "incident.updated" | "incident.escalated" | "incident.resolved"
  | "integration.connected" | "integration.disconnected" | "integration.error"
  | "system.configuration_required" | "system.health_unavailable" | "system.integration_pending";
export type APCEventSeverity = "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "INFORMATIONAL";
export type APCEventStatus = "RECEIVED" | "VALIDATING" | "AUTHORIZED" | "REJECTED" | "ROUTED" | "PENDING_REVIEW" | "PROCESSED" | "FAILED";
export type APCEventSourceKind = "APC_UNIT" | "INTERNAL_SYSTEM";

export interface APCEventEnvelope {
  eventId: string;
  eventType: APCEventType;
  eventVersion: string;
  source: string;
  sourceKind: APCEventSourceKind;
  timestamp: string;
  correlationId: string | null;
  priority: APCPriority;
  severity: APCEventSeverity;
  status: APCEventStatus;
  relatedIncidentId: string | null;
  relatedProjectId: string | null;
  relatedTaskId: string | null;
  classification: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL";
  payload: Record<string, unknown>;
  metadata: Record<string, string>;
}

export type APCEvent = APCEventEnvelope & { sourceUnitId: APCUnit["id"] | null };

export interface EventGatewayResult<T> {
  ok: true;
  data: T;
}

export interface EventGatewayError {
  ok: false;
  error: "Unauthorized" | "Forbidden" | "InvalidEvent" | "UnknownSource" | "SourceAuthorizationNotConfigured" | "NotConfigured";
}
