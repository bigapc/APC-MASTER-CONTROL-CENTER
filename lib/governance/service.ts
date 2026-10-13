import type { CurrentUser } from "@/lib/auth";
import { getGovernanceDataAdapter, getGovernanceSnapshot, type GovernanceDataAdapter } from "./adapter";
import { canPerformGovernanceOperation, type GovernanceOperation } from "./authorization";
import {
  canTransitionPolicyStatus,
  type APCPolicy,
  type APCPolicyAcknowledgment,
  type APCPolicyApproval,
  type APCPolicyVersion,
  type APCProcedure,
  type CreateAcknowledgmentInput,
  type CreateApprovalInput,
  type CreatePolicyInput,
  type CreatePolicyVersionInput,
  type CreateProcedureInput,
  type GovernanceSnapshot,
  type PolicyStatus,
} from "./types";
import { isCreateAcknowledgmentInput, isCreateApprovalInput, isCreatePolicyInput, isCreatePolicyVersionInput, isCreateProcedureInput } from "./validation";

export type GovernanceServiceResult<T> = { ok: true; data: T } | { ok: false; error: "Unauthorized" | "Forbidden" | "NotConfigured" | "NotFound" | "InvalidInput" | "InvalidTransition" };

function denied<T>(user: CurrentUser | null, operation: GovernanceOperation): GovernanceServiceResult<T> | null {
  if (!user) return { ok: false, error: "Unauthorized" };
  if (!canPerformGovernanceOperation(user, operation)) return { ok: false, error: "Forbidden" };
  return null;
}

function adapterOrDefault(adapter?: GovernanceDataAdapter) {
  return adapter ?? getGovernanceDataAdapter();
}

function normalizePolicyInput(input: CreatePolicyInput): CreatePolicyInput {
  return {
    ...input,
    description: input.description ?? null,
    ownerReference: input.ownerReference ?? null,
    apcUnitReference: input.apcUnitReference ?? input.unitId ?? null,
    version: input.version ?? null,
    effectiveDate: input.effectiveDate ?? null,
    reviewDate: input.reviewDate ?? null,
    approvalStatus: input.approvalStatus ?? "DRAFT",
    createdAt: input.createdAt ?? new Date().toISOString(),
    updatedAt: input.updatedAt ?? new Date().toISOString(),
    supersededPolicyReference: input.supersededPolicyReference ?? null,
  };
}

export async function getGovernance(user: CurrentUser | null, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<GovernanceSnapshot>> {
  const failure = denied<GovernanceSnapshot>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await getGovernanceSnapshot(adapterOrDefault(adapter)) };
}

export async function listPolicies(user: CurrentUser | null, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<readonly APCPolicy[]>> {
  const failure = denied<readonly APCPolicy[]>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await adapterOrDefault(adapter).listPolicies() };
}

export async function listProcedures(user: CurrentUser | null, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<readonly APCProcedure[]>> {
  const failure = denied<readonly APCProcedure[]>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await adapterOrDefault(adapter).listProcedures() };
}

export async function listAcknowledgments(user: CurrentUser | null, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<readonly APCPolicyAcknowledgment[]>> {
  const failure = denied<readonly APCPolicyAcknowledgment[]>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await adapterOrDefault(adapter).listAcknowledgments() };
}

export async function getAcknowledgments(user: CurrentUser | null, policyId: string, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<readonly APCPolicyAcknowledgment[]>> {
  const failure = denied<readonly APCPolicyAcknowledgment[]>(user, "view");
  return failure ?? { ok: true, data: await adapterOrDefault(adapter).getAcknowledgments(policyId) };
}

export async function createPolicy(user: CurrentUser | null, input: CreatePolicyInput, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicy>> {
  const failure = denied<APCPolicy>(user, "create_policy");
  if (failure) return failure;
  if (!isCreatePolicyInput(input)) return { ok: false, error: "InvalidInput" };
  const normalized = normalizePolicyInput(input);
  if (normalized.status !== "DRAFT") return { ok: false, error: "InvalidTransition" };
  return { ok: true, data: await adapterOrDefault(adapter).createPolicy(normalized) };
}

export async function getPolicy(user: CurrentUser | null, policyId: string, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicy | null>> {
  const failure = denied<APCPolicy | null>(user, "view");
  return failure ?? { ok: true, data: await adapterOrDefault(adapter).getPolicy(policyId) };
}

export async function updatePolicy(user: CurrentUser | null, policyId: string, input: Partial<APCPolicy>, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicy | null>> {
  const failure = denied<APCPolicy | null>(user, "update_policy");
  if (failure) return failure;
  const persistence = adapterOrDefault(adapter);
  if (input.status) {
    const policy = await persistence.getPolicy(policyId);
    if (!policy) return { ok: false, error: "NotFound" };
    if (input.status !== policy.status) return transitionPolicy(user, policyId, input.status, persistence);
  }
  return { ok: true, data: await persistence.updatePolicy(policyId, input) };
}

export async function createProcedure(user: CurrentUser | null, input: CreateProcedureInput, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCProcedure>> {
  const failure = denied<APCProcedure>(user, "create_policy");
  if (failure) return failure;
  if (!isCreateProcedureInput(input)) return { ok: false, error: "InvalidInput" };
  return { ok: true, data: await adapterOrDefault(adapter).createProcedure({
    ...input,
    apcUnitReference: input.apcUnitReference ?? input.unitId ?? null,
    department: input.department ?? null,
    operationalSteps: input.operationalSteps ?? [],
    ownerReference: input.ownerReference ?? null,
    status: input.status ?? "DRAFT",
    version: input.version ?? null,
    reviewDate: input.reviewDate ?? null,
  }) };
}

export async function getProcedure(user: CurrentUser | null, procedureId: string, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCProcedure | null>> {
  const failure = denied<APCProcedure | null>(user, "view");
  return failure ?? { ok: true, data: await adapterOrDefault(adapter).getProcedure(procedureId) };
}

export async function updateProcedure(user: CurrentUser | null, procedureId: string, input: Partial<APCProcedure>, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCProcedure | null>> {
  const failure = denied<APCProcedure | null>(user, "update_policy");
  return failure ?? { ok: true, data: await adapterOrDefault(adapter).updateProcedure(procedureId, input) };
}

export async function createPolicyVersion(user: CurrentUser | null, input: CreatePolicyVersionInput, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicyVersion>> {
  const failure = denied<APCPolicyVersion>(user, "create_policy");
  if (failure) return failure;
  if (!isCreatePolicyVersionInput(input)) return { ok: false, error: "InvalidInput" };
  if (input.status === "ACTIVE") return { ok: false, error: "InvalidTransition" };
  const persistence = adapterOrDefault(adapter);
  if (!await persistence.getPolicy(input.policyId)) return { ok: false, error: "NotFound" };
  return { ok: true, data: await persistence.createPolicyVersion(input) };
}

export async function getPolicyVersions(user: CurrentUser | null, policyId: string, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<readonly APCPolicyVersion[]>> {
  const failure = denied<readonly APCPolicyVersion[]>(user, "view");
  return failure ?? { ok: true, data: await adapterOrDefault(adapter).getPolicyVersions(policyId) };
}

export async function getCurrentPolicyVersion(user: CurrentUser | null, policyId: string, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicyVersion | null>> {
  const failure = denied<APCPolicyVersion | null>(user, "view");
  return failure ?? { ok: true, data: await adapterOrDefault(adapter).getCurrentPolicyVersion(policyId) };
}

export async function transitionPolicy(user: CurrentUser | null, policyId: string, status: PolicyStatus, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicy | null>> {
  const operation = status === "ACTIVE" ? "activate_policy" : status === "APPROVED" ? "approve_policy" : "update_policy";
  const failure = denied<APCPolicy | null>(user, operation);
  if (failure) return failure;
  const persistence = adapterOrDefault(adapter);
  const policy = await persistence.getPolicy(policyId);
  if (!policy) return { ok: false, error: "NotFound" };
  if (!canTransitionPolicyStatus(policy.status, status)) return { ok: false, error: "InvalidTransition" };
  return { ok: true, data: await persistence.transitionPolicy(policyId, status) };
}

export async function createApproval(user: CurrentUser | null, input: CreateApprovalInput, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicyApproval>> {
  const failure = denied<APCPolicyApproval>(user, "approve_policy");
  if (failure) return failure;
  if (!isCreateApprovalInput(input) || input.reviewerReference !== user?.id) return { ok: false, error: "InvalidInput" };
  const persistence = adapterOrDefault(adapter);
  const policy = await persistence.getPolicy(input.policyId);
  if (!policy) return { ok: false, error: "NotFound" };
  if (policy.status !== "PENDING_APPROVAL") return { ok: false, error: "InvalidTransition" };
  if (!(await persistence.getPolicyVersions(input.policyId)).some((version) => version.versionId === input.policyVersionId)) return { ok: false, error: "NotFound" };
  return { ok: true, data: await persistence.createApproval(input) };
}

export async function createAcknowledgment(user: CurrentUser | null, input: CreateAcknowledgmentInput, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicyAcknowledgment>> {
  const failure = denied<APCPolicyAcknowledgment>(user, "acknowledge_policy");
  if (failure) return failure;
  if (!isCreateAcknowledgmentInput(input) || input.userReference !== user?.id) return { ok: false, error: "InvalidInput" };
  const persistence = adapterOrDefault(adapter);
  const policy = await persistence.getPolicy(input.policyId);
  if (!policy) return { ok: false, error: "NotFound" };
  const version = (await persistence.getPolicyVersions(input.policyId)).find((item) => item.versionId === input.policyVersionId);
  if (!version) return { ok: false, error: "NotFound" };
  return { ok: true, data: await persistence.createAcknowledgment(input) };
}

export async function approvePolicyRecord(user: CurrentUser | null, policyId: string, input: CreateApprovalInput, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicyApproval | null>> {
  const failure = denied<APCPolicyApproval | null>(user, "approve_policy");
  if (failure) return failure;
  if (!isCreateApprovalInput(input) || input.policyId !== policyId || input.reviewerReference !== user?.id) return { ok: false, error: "InvalidInput" };
  if (input.decision !== "APPROVED") return { ok: false, error: "InvalidTransition" };
  const persistence = adapterOrDefault(adapter);
  const policy = await persistence.getPolicy(policyId);
  if (!policy) return { ok: false, error: "NotFound" };
  if (policy.status !== "PENDING_APPROVAL") return { ok: false, error: "InvalidTransition" };
  if (!(await persistence.getPolicyVersions(policyId)).some((version) => version.versionId === input.policyVersionId)) return { ok: false, error: "NotFound" };
  const approval = await persistence.createApproval({ ...input, policyId, reviewerReference: user.id, state: "APPROVAL" });
  await persistence.transitionPolicy(policyId, "APPROVED");
  return { ok: true, data: approval };
}

export async function activatePolicyRecord(user: CurrentUser | null, policyId: string, adapter?: GovernanceDataAdapter): Promise<GovernanceServiceResult<APCPolicy | null>> {
  const failure = denied<APCPolicy | null>(user, "activate_policy");
  if (failure) return failure;
  const persistence = adapterOrDefault(adapter);
  const policy = await persistence.getPolicy(policyId);
  if (!policy) return { ok: false, error: "NotFound" };
  if (policy.status !== "APPROVED") return { ok: false, error: "InvalidTransition" };
  return { ok: true, data: await persistence.transitionPolicy(policyId, "ACTIVE") };
}
