import type {
  ApprovalDecision,
  ApprovalStatus,
  CreateAcknowledgmentInput,
  CreateApprovalInput,
  CreatePolicyInput,
  CreatePolicyVersionInput,
  CreateProcedureInput,
  PolicyAcknowledgmentStatus,
  PolicyCategory,
  PolicyStatus,
} from "./types";
import { APC_UNITS } from "@/lib/apcUnits";

const POLICY_STATUSES: readonly PolicyStatus[] = ["DRAFT", "UNDER_REVIEW", "CHANGES_REQUESTED", "PENDING_APPROVAL", "APPROVED", "ACTIVE", "SUPERSEDED", "ARCHIVED", "RETIRED"];
const POLICY_CATEGORIES: readonly PolicyCategory[] = ["CORPORATE_GOVERNANCE", "OPERATIONS", "PERSONNEL", "ACCESS_SECURITY", "AI_GOVERNANCE", "INCIDENT_MANAGEMENT", "COMMUNICATIONS", "TRAINING", "UNIT_OPERATIONS", "DATA_INFORMATION", "FINANCE", "OTHER"];
const APPROVAL_STATUSES: readonly ApprovalStatus[] = ["DRAFT", "REVIEW", "CHANGES_REQUESTED", "APPROVAL", "ACTIVATION"];
const APPROVAL_DECISIONS: readonly ApprovalDecision[] = ["PENDING", "APPROVED", "REJECTED", "CHANGES_REQUESTED"];
const ACKNOWLEDGMENT_STATUSES: readonly PolicyAcknowledgmentStatus[] = ["NOT_REQUIRED", "PENDING", "ACKNOWLEDGED", "EXPIRED", "SUPERSEDED"];

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function optionalString(value: Record<string, unknown>, key: string, nullable = false): boolean {
  return !(key in value) || isNonEmptyString(value[key]) || (nullable && value[key] === null);
}

function optionalText(value: Record<string, unknown>, key: string): boolean {
  return !(key in value) || typeof value[key] === "string" || value[key] === null;
}

function optionalUnitReference(value: Record<string, unknown>, key: string): boolean {
  return !(key in value) || value[key] === null || (typeof value[key] === "string" && APC_UNITS.some((unit) => unit.id === value[key]));
}

export function isStringRecord(value: unknown): value is Readonly<Record<string, string>> {
  return isRecord(value) && Object.values(value).every((entry) => typeof entry === "string");
}

export function isCreatePolicyInput(value: unknown): value is CreatePolicyInput {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.title)
    && POLICY_CATEGORIES.includes(value.category as PolicyCategory)
    && POLICY_STATUSES.includes(value.status as PolicyStatus)
    && optionalString(value, "policyId")
    && optionalText(value, "description")
    && optionalString(value, "ownerReference", true)
    && optionalUnitReference(value, "apcUnitReference")
    && optionalString(value, "version", true)
    && optionalUnitReference(value, "unitId")
    && optionalString(value, "currentVersionId", true)
    && optionalString(value, "effectiveDate", true)
    && optionalString(value, "reviewDate", true)
    && (!("approvalStatus" in value) || APPROVAL_STATUSES.includes(value.approvalStatus as ApprovalStatus))
    && optionalString(value, "createdAt", true)
    && optionalString(value, "updatedAt", true)
    && optionalString(value, "supersededPolicyReference", true);
}

export function isCreateProcedureInput(value: unknown): value is CreateProcedureInput {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.title)
    && optionalString(value, "procedureId")
    && optionalString(value, "policyId", true)
    && optionalUnitReference(value, "apcUnitReference")
    && optionalUnitReference(value, "unitId")
    && optionalText(value, "department")
    && (!("operationalSteps" in value) || (Array.isArray(value.operationalSteps) && value.operationalSteps.every((step) => typeof step === "string")))
    && optionalString(value, "ownerReference", true)
    && (!("status" in value) || POLICY_STATUSES.includes(value.status as PolicyStatus))
    && optionalString(value, "version", true)
    && optionalString(value, "currentVersionId", true)
    && optionalString(value, "reviewDate", true);
}

export function isCreatePolicyVersionInput(value: unknown): value is CreatePolicyVersionInput {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.policyId)
    && isNonEmptyString(value.version)
    && POLICY_STATUSES.includes(value.status as PolicyStatus)
    && isNonEmptyString(value.contentReference)
    && optionalString(value, "versionId")
    && optionalString(value, "createdAt", true);
}

export function isCreateApprovalInput(value: unknown): value is CreateApprovalInput {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.policyId)
    && isNonEmptyString(value.policyVersionId)
    && isNonEmptyString(value.reviewerReference)
    && APPROVAL_DECISIONS.includes(value.decision as ApprovalDecision)
    && optionalText(value, "comments")
    && APPROVAL_STATUSES.includes(value.state as ApprovalStatus)
    && optionalString(value, "approvalId")
    && optionalString(value, "createdAt", true);
}

export function isCreateAcknowledgmentInput(value: unknown): value is CreateAcknowledgmentInput {
  if (!isRecord(value)) return false;
  const allowedKeys = new Set(["policyId", "policyVersionId", "userReference", "metadata"]);
  return Object.keys(value).every((key) => allowedKeys.has(key))
    && isNonEmptyString(value.policyId)
    && isNonEmptyString(value.policyVersionId)
    && isNonEmptyString(value.userReference)
    && (!("metadata" in value) || isStringRecord(value.metadata));
}

export function isAcknowledgmentStatus(value: unknown): value is PolicyAcknowledgmentStatus {
  return typeof value === "string" && ACKNOWLEDGMENT_STATUSES.includes(value as PolicyAcknowledgmentStatus);
}
