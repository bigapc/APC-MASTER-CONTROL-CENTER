import type { APCUnit } from "@/lib/apcUnits";
import type { APCPriority } from "@/lib/priority";

export type IncidentStatus = "REPORTED" | "UNDER_REVIEW" | "ACKNOWLEDGED" | "ESCALATED" | "IN_PROGRESS" | "AWAITING_APPROVAL" | "RESOLVED" | "CLOSED" | "CANCELLED";
export type IncidentSeverity = "CRITICAL" | "HIGH" | "MODERATE" | "LOW" | "INFORMATIONAL";
export type IncidentCategory = "OPERATIONAL" | "TECHNICAL" | "SECURITY" | "SAFETY" | "COMMUNICATIONS" | "PERSONNEL" | "CUSTOMER_CLIENT" | "SERVICE_DISRUPTION" | "SYSTEM_INTEGRATION" | "COMPLIANCE" | "OTHER";
export type IncidentEscalationStatus = "NOT_ESCALATED" | "ESCALATION_PENDING" | "ESCALATED";
export type IncidentResolutionStatus = "UNRESOLVED" | "RESOLUTION_PENDING" | "RESOLVED";

export interface APCIncident {
  incidentId: string;
  title: string;
  description: string;
  sourceUnitId: APCUnit["id"] | null;
  category: IncidentCategory;
  priority: APCPriority;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedByReference: string | null;
  assignedToReference: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  escalationStatus: IncidentEscalationStatus;
  resolutionStatus: IncidentResolutionStatus;
  approvalRequired: boolean;
  relatedWorkItemReference: string | null;
  relatedProjectReference: string | null;
}

export interface APCIncidentSnapshot {
  incidents: readonly APCIncident[];
  sourceStatus: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
}

export const EMPTY_INCIDENT_SNAPSHOT: APCIncidentSnapshot = {
  incidents: [],
  sourceStatus: "NOT_CONNECTED",
};
