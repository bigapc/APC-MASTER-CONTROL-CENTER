import type { GovernanceDataAdapter } from "./adapter";
import type {
  APCPolicy,
  APCPolicyAcknowledgment,
  APCPolicyApproval,
  APCPolicyVersion,
  APCProcedure,
  CreateAcknowledgmentInput,
  CreateApprovalInput,
  CreatePolicyInput,
  CreatePolicyVersionInput,
  CreateProcedureInput,
  GovernanceSnapshot,
  PolicyStatus,
} from "./types";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export class LocalGovernanceAdapter implements GovernanceDataAdapter {
  readonly status = "LOCAL_DEVELOPMENT" as const;
  private readonly policies: APCPolicy[] = [];
  private readonly procedures: APCProcedure[] = [];
  private readonly versions: APCPolicyVersion[] = [];
  private readonly approvals: APCPolicyApproval[] = [];
  private readonly acknowledgments: APCPolicyAcknowledgment[] = [];

  async listPolicies() { return [...this.policies]; }
  async getPolicy(policyId: string) { return this.policies.find((policy) => policy.policyId === policyId) ?? null; }
  async createPolicy(input: CreatePolicyInput) {
    const createdAt = input.createdAt ?? new Date().toISOString();
    const policy: APCPolicy = {
      policyId: input.policyId ?? createId("policy"),
      title: input.title,
      category: input.category,
      description: input.description ?? null,
      ownerReference: input.ownerReference ?? null,
      apcUnitReference: input.apcUnitReference ?? input.unitId ?? null,
      status: input.status,
      version: input.version ?? null,
      unitId: input.unitId ?? input.apcUnitReference ?? null,
      currentVersionId: input.currentVersionId ?? null,
      effectiveDate: input.effectiveDate ?? null,
      reviewDate: input.reviewDate ?? null,
      approvalStatus: input.approvalStatus ?? "DRAFT",
      createdAt,
      updatedAt: input.updatedAt ?? createdAt,
      supersededPolicyReference: input.supersededPolicyReference ?? null,
    };
    this.policies.push(policy);
    return policy;
  }
  async updatePolicy(policyId: string, input: Partial<APCPolicy>) {
    const index = this.policies.findIndex((policy) => policy.policyId === policyId);
    if (index < 0) return null;
    this.policies[index] = { ...this.policies[index], ...input, policyId };
    return this.policies[index];
  }
  async transitionPolicy(policyId: string, status: PolicyStatus) {
    return this.updatePolicy(policyId, { status });
  }

  async listProcedures() { return [...this.procedures]; }
  async listPolicyVersions() { return [...this.versions]; }
  async getProcedure(procedureId: string) { return this.procedures.find((procedure) => procedure.procedureId === procedureId) ?? null; }
  async createProcedure(input: CreateProcedureInput) {
    const procedure: APCProcedure = {
      procedureId: input.procedureId ?? createId("procedure"),
      title: input.title,
      policyId: input.policyId ?? null,
      apcUnitReference: input.apcUnitReference ?? input.unitId ?? null,
      unitId: input.unitId ?? input.apcUnitReference ?? null,
      department: input.department ?? null,
      operationalSteps: [...(input.operationalSteps ?? [])],
      ownerReference: input.ownerReference ?? null,
      status: input.status ?? "DRAFT",
      version: input.version ?? null,
      currentVersionId: input.currentVersionId ?? null,
      reviewDate: input.reviewDate ?? null,
    };
    this.procedures.push(procedure);
    return procedure;
  }
  async updateProcedure(procedureId: string, input: Partial<APCProcedure>) {
    const index = this.procedures.findIndex((procedure) => procedure.procedureId === procedureId);
    if (index < 0) return null;
    this.procedures[index] = { ...this.procedures[index], ...input, procedureId };
    return this.procedures[index];
  }

  async createPolicyVersion(input: CreatePolicyVersionInput) {
    if (input.status === "ACTIVE") throw new Error("Policy versions require service-controlled activation");
    const version = { ...input, versionId: input.versionId ?? createId("version") };
    this.versions.push(version);
    return version;
  }
  async getPolicyVersions(policyId: string) { return this.versions.filter((version) => version.policyId === policyId); }
  async getCurrentPolicyVersion(policyId: string) {
    const policy = await this.getPolicy(policyId);
    return policy?.currentVersionId ? this.versions.find((version) => version.versionId === policy.currentVersionId) ?? null : null;
  }

  async createApproval(input: CreateApprovalInput) {
    const approval = { ...input, approvalId: input.approvalId ?? createId("approval"), createdAt: input.createdAt ?? new Date().toISOString() };
    this.approvals.push(approval);
    return approval;
  }
  async getApprovals(policyId: string) { return this.approvals.filter((approval) => approval.policyId === policyId); }
  async listApprovals() { return [...this.approvals]; }

  async createAcknowledgment(input: CreateAcknowledgmentInput) {
    const timestamp = new Date().toISOString();
    const acknowledgment: APCPolicyAcknowledgment = {
      ...input,
      acknowledgmentId: createId("acknowledgment"),
      policyReference: input.policyId,
      identityReference: input.userReference,
      status: "ACKNOWLEDGED",
      acknowledgmentTimestamp: timestamp,
      acknowledgedAt: timestamp,
    };
    this.acknowledgments.push(acknowledgment);
    return acknowledgment;
  }
  async listAcknowledgments() { return [...this.acknowledgments]; }
  async getAcknowledgments(policyId: string) { return this.acknowledgments.filter((acknowledgment) => acknowledgment.policyId === policyId); }

  async getSnapshot(): Promise<GovernanceSnapshot> {
    return {
      policies: await this.listPolicies(),
      procedures: await this.listProcedures(),
      policyVersions: await this.listPolicyVersions(),
      approvals: await this.listApprovals(),
      acknowledgments: await this.listAcknowledgments(),
      sourceStatus: this.status,
    };
  }
}

export function createLocalGovernanceAdapter() {
  return new LocalGovernanceAdapter();
}
