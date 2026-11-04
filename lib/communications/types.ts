import type { APCUnit } from "@/lib/apcUnits";
import type { APCPriority } from "@/lib/priority";

export type CommunicationType = "DIRECT" | "UNIT_NOTICE" | "EXECUTIVE_NOTICE" | "ANNOUNCEMENT" | "OPERATIONAL" | "INCIDENT" | "ESCALATION" | "GOVERNANCE" | "TRAINING" | "SYSTEM";
export type CommunicationStatus = "DRAFT" | "READY" | "SENT" | "DELIVERED" | "READ" | "CANCELLED" | "FAILED" | "ARCHIVED" | "NOT_CONNECTED";
export type RecipientKind = "IDENTITY" | "PERSONNEL" | "APC_UNIT" | "DEPARTMENT" | "EXECUTIVE_GROUP" | "OPERATIONAL_GROUP";

export interface CommunicationRecipient {
  kind: RecipientKind;
  reference: string;
}

export interface APCCommunication {
  communicationId: string;
  subject: string;
  body: string;
  type: CommunicationType;
  priority: APCPriority;
  senderReference: string | null;
  recipients: readonly CommunicationRecipient[];
  unitId: APCUnit["id"] | null;
  relatedIncidentId: string | null;
  relatedWorkReference: string | null;
  relatedGovernanceReference: string | null;
  status: CommunicationStatus;
  createdAt: string | null;
  updatedAt: string | null;
}

export type CreateCommunicationInput = Omit<APCCommunication, "communicationId" | "createdAt" | "updatedAt" | "status"> & {
  communicationId?: string;
  status?: CommunicationStatus;
};

export interface CommunicationsSnapshot {
  communications: readonly APCCommunication[];
  sourceStatus: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
}

export interface CommunicationHistoryFilter {
  query?: string;
  type?: CommunicationType;
  priority?: APCPriority;
  status?: CommunicationStatus;
  unitId?: APCUnit["id"] | null;
}

export const EMPTY_COMMUNICATIONS_SNAPSHOT: CommunicationsSnapshot = {
  communications: [],
  sourceStatus: "LOCAL_DEVELOPMENT",
};

export function canTransitionCommunicationStatus(from: CommunicationStatus, to: CommunicationStatus) {
  const transitions: Record<CommunicationStatus, readonly CommunicationStatus[]> = {
    DRAFT: ["READY", "CANCELLED", "ARCHIVED"],
    READY: ["SENT", "CANCELLED", "ARCHIVED"],
    SENT: ["DELIVERED", "FAILED", "ARCHIVED"],
    DELIVERED: ["READ", "ARCHIVED"],
    READ: ["ARCHIVED"],
    CANCELLED: ["ARCHIVED"],
    FAILED: ["ARCHIVED"],
    ARCHIVED: [],
    NOT_CONNECTED: [],
  };
  return transitions[from].includes(to);
}

export function filterCommunicationHistory(communications: readonly APCCommunication[], filter: CommunicationHistoryFilter) {
  const query = filter.query?.trim().toLowerCase() ?? "";
  return communications.filter((communication) => {
    const searchable = [communication.subject, communication.body, ...communication.recipients.map((recipient) => recipient.reference)].join(" ").toLowerCase();
    return (!query || searchable.includes(query))
      && (!filter.type || communication.type === filter.type)
      && (!filter.priority || communication.priority === filter.priority)
      && (!filter.status || communication.status === filter.status)
      && (filter.unitId === undefined || communication.unitId === filter.unitId);
  });
}
