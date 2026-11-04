import type { APCUnit } from "@/lib/apcUnits";

export type PolicyStatus = "DRAFT" | "UNDER_REVIEW" | "CHANGES_REQUESTED" | "PENDING_APPROVAL" | "APPROVED" | "ACTIVE" | "SUPERSEDED" | "ARCHIVED" | "RETIRED";
export type PolicyCategory = "CORPORATE_GOVERNANCE" | "OPERATIONS" | "PERSONNEL" | "ACCESS_SECURITY" | "AI_GOVERNANCE" | "INCIDENT_MANAGEMENT" | "COMMUNICATIONS" | "TRAINING" | "UNIT_OPERATIONS" | "DATA_INFORMATION" | "FINANCE" | "OTHER";
export type PolicyAcknowledgmentStatus = "NOT_REQUIRED" | "PENDING" | "ACKNOWLEDGED" | "EXPIRED" | "SUPERSEDED";
export type ApprovalStatus = "DRAFT" | "REVIEW" | "CHANGES_REQUESTED" | "APPROVAL" | "ACTIVATION";
export type ApprovalDecision = "PENDING" | "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";

export const POLICY_ACKNOWLEDGMENT_STATUSES: readonly PolicyAcknowledgmentStatus[] = ["NOT_REQUIRED", "PENDING", "ACKNOWLEDGED", "EXPIRED", "SUPERSEDED"] as const;

export interface APCPolicyVersion {
  versionId: string;
  policyId: string;
  version: string;
  status: PolicyStatus;
  contentReference: string;
  createdAt: string | null;
}

export interface APCPolicy {
  policyId: string;
  title: string;
  category: PolicyCategory;
  description: string | null;
  ownerReference: string | null;
  apcUnitReference: APCUnit["id"] | null;
  status: PolicyStatus;
  version: string | null;
  unitId: APCUnit["id"] | null;
  currentVersionId: string | null;
  effectiveDate: string | null;
  reviewDate: string | null;
  approvalStatus: ApprovalStatus;
  createdAt: string | null;
  updatedAt: string | null;
  supersededPolicyReference: string | null;
}

export interface APCPolicyApproval {
  approvalId: string;
  policyId: string;
  policyVersionId: string;
  reviewerReference: string;
  decision: ApprovalDecision;
  comments: string | null;
  createdAt: string | null;
  state: ApprovalStatus;
}

export interface APCProcedure {
  procedureId: string;
  title: string;
  policyId: string | null;
  apcUnitReference: APCUnit["id"] | null;
  unitId: APCUnit["id"] | null;
  department: string | null;
  operationalSteps: readonly string[];
  ownerReference: string | null;
  status: PolicyStatus;
  version: string | null;
  currentVersionId: string | null;
  reviewDate: string | null;
}

export interface APCPolicyAcknowledgment {
  acknowledgmentId: string;
  policyId: string;
  policyReference?: string | null;
  policyVersionId: string;
  userReference: string;
  identityReference?: string | null;
  status: PolicyAcknowledgmentStatus;
  acknowledgmentTimestamp: string | null;
  acknowledgedAt: string | null;
  metadata?: Readonly<Record<string, string>>;
}

export type CreatePolicyInput = {
  policyId?: string;
  title: string;
  category: PolicyCategory;
  description?: string | null;
  ownerReference?: string | null;
  apcUnitReference?: APCUnit["id"] | null;
  status: PolicyStatus;
  version?: string | null;
  unitId?: APCUnit["id"] | null;
  currentVersionId?: string | null;
  effectiveDate?: string | null;
  reviewDate?: string | null;
  approvalStatus?: ApprovalStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
  supersededPolicyReference?: string | null;
};

export type CreateProcedureInput = {
  procedureId?: string;
  title: string;
  policyId?: string | null;
  apcUnitReference?: APCUnit["id"] | null;
  unitId?: APCUnit["id"] | null;
  department?: string | null;
  operationalSteps?: readonly string[];
  ownerReference?: string | null;
  status?: PolicyStatus;
  version?: string | null;
  currentVersionId?: string | null;
  reviewDate?: string | null;
};

export type CreatePolicyVersionInput = Omit<APCPolicyVersion, "versionId"> & { versionId?: string };
export type CreateApprovalInput = Omit<APCPolicyApproval, "approvalId" | "createdAt"> & { approvalId?: string; createdAt?: string | null };
export type CreateAcknowledgmentInput = Pick<APCPolicyAcknowledgment, "policyId" | "policyVersionId" | "userReference"> & {
  metadata?: Readonly<Record<string, string>>;
};

export interface GovernanceSnapshot {
  policies: readonly APCPolicy[];
  procedures: readonly APCProcedure[];
  policyVersions: readonly APCPolicyVersion[];
  approvals: readonly APCPolicyApproval[];
  acknowledgments: readonly APCPolicyAcknowledgment[];
  sourceStatus: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
}

export const EMPTY_GOVERNANCE_SNAPSHOT: GovernanceSnapshot = {
  policies: [],
  procedures: [],
  policyVersions: [],
  approvals: [],
  acknowledgments: [],
  sourceStatus: "LOCAL_DEVELOPMENT",
};

export function isPolicyAcknowledgmentStatus(value: string): value is PolicyAcknowledgmentStatus {
  return POLICY_ACKNOWLEDGMENT_STATUSES.includes(value as PolicyAcknowledgmentStatus);
}

export function canTransitionPolicyStatus(from: PolicyStatus, to: PolicyStatus): boolean {
  const transitions: Record<PolicyStatus, readonly PolicyStatus[]> = {
    DRAFT: ["UNDER_REVIEW"],
    UNDER_REVIEW: ["DRAFT", "CHANGES_REQUESTED", "PENDING_APPROVAL"],
    CHANGES_REQUESTED: ["UNDER_REVIEW"],
    PENDING_APPROVAL: ["UNDER_REVIEW", "APPROVED"],
    APPROVED: ["ACTIVE"],
    ACTIVE: ["SUPERSEDED", "ARCHIVED", "RETIRED"],
    SUPERSEDED: ["ARCHIVED"],
    ARCHIVED: [],
    RETIRED: [],
  };
  return transitions[from].includes(to);
}
