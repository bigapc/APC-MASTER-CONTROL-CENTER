import type { APCUnit } from "@/lib/apcUnits";
import type { UserRole } from "@/lib/roles";

export type AccountStatus = "INVITED" | "PENDING_ACTIVATION" | "ACTIVE" | "SUSPENDED" | "DEACTIVATED" | "ARCHIVED";
export type AccessRequestStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED" | "CANCELLED";
export type UnitAccessScope = "VIEW" | "PARTICIPATE" | "MANAGE" | "ADMINISTER";
export type AssignmentStatus = "PENDING" | "ACTIVE" | "REMOVED";

export interface APCIdentity {
  userId: string;
  displayName: string;
  emailReference: string | null;
  accountStatus: AccountStatus;
  identitySource: "SUPABASE" | "APPROVED_IDENTITY_PROVIDER" | "LOCAL_DEVELOPMENT";
  createdAt: string | null;
  updatedAt: string | null;
  lastAuthenticatedAt: string | null;
  deactivatedAt: string | null;
}

export interface APCAccessRequest {
  requestId: string;
  requestingIdentityReference: string;
  requestedUnitId: APCUnit["id"] | null;
  requestedApplicationRole: UserRole | null;
  requestedAccessScope: UnitAccessScope;
  requestReason: string;
  status: AccessRequestStatus;
  reviewerReference: string | null;
  createdAt: string | null;
  decisionAt: string | null;
}

export interface APCUnitAccessGrant {
  identityReference: string;
  unitId: APCUnit["id"];
  accessScope: UnitAccessScope;
  applicationRole: UserRole | null;
  approvalReference: string | null;
  assignmentStatus: AssignmentStatus;
}

export interface APCAccessAuditRecord {
  auditId: string;
  actorIdentityReference: string;
  actionType: "ROLE_ASSIGNED" | "ROLE_REMOVED" | "UNIT_ACCESS_ASSIGNED" | "UNIT_ACCESS_REMOVED" | "IDENTITY_DEACTIVATED" | "IDENTITY_REACTIVATED" | "ACCESS_REQUEST_REVIEWED";
  targetIdentityReference: string;
  previousAuthorizationState: string | null;
  newAuthorizationState: string | null;
  timestamp: string | null;
  relatedApprovalReference: string | null;
  reasonReference: string | null;
}

export interface AccessSnapshot {
  identities: readonly APCIdentity[];
  requests: readonly APCAccessRequest[];
  unitAccess: readonly APCUnitAccessGrant[];
  audit: readonly APCAccessAuditRecord[];
  sourceStatus: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
}

export const EMPTY_ACCESS_SNAPSHOT: AccessSnapshot = {
  identities: [],
  requests: [],
  unitAccess: [],
  audit: [],
  sourceStatus: "NOT_CONNECTED",
};

export const ACCOUNT_STATUSES: readonly AccountStatus[] = ["INVITED", "PENDING_ACTIVATION", "ACTIVE", "SUSPENDED", "DEACTIVATED", "ARCHIVED"];
export const ACCESS_REQUEST_STATUSES: readonly AccessRequestStatus[] = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "CHANGES_REQUESTED", "REJECTED", "CANCELLED"];
