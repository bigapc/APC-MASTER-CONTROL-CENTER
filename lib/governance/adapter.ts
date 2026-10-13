import { createLocalGovernanceAdapter } from "./local-adapter";
import type { APCPolicy, APCPolicyAcknowledgment, APCPolicyApproval, APCPolicyVersion, APCProcedure, CreateAcknowledgmentInput, CreateApprovalInput, CreatePolicyInput, CreatePolicyVersionInput, CreateProcedureInput, GovernanceSnapshot, PolicyStatus } from "./types";

export interface GovernanceDataAdapter {
  readonly status: GovernanceSnapshot["sourceStatus"];
  listPolicies(): Promise<readonly APCPolicy[]>;
  listProcedures(): Promise<readonly APCProcedure[]>;
  listAcknowledgments(): Promise<readonly APCPolicyAcknowledgment[]>;
  listPolicyVersions(): Promise<readonly APCPolicyVersion[]>;
  listApprovals(): Promise<readonly APCPolicyApproval[]>;
  createPolicy(input: CreatePolicyInput): Promise<APCPolicy>;
  getPolicy(policyId: string): Promise<APCPolicy | null>;
  updatePolicy(policyId: string, input: Partial<APCPolicy>): Promise<APCPolicy | null>;
  transitionPolicy(policyId: string, status: PolicyStatus): Promise<APCPolicy | null>;
  createProcedure(input: CreateProcedureInput): Promise<APCProcedure>;
  getProcedure(procedureId: string): Promise<APCProcedure | null>;
  updateProcedure(procedureId: string, input: Partial<APCProcedure>): Promise<APCProcedure | null>;
  createPolicyVersion(input: CreatePolicyVersionInput): Promise<APCPolicyVersion>;
  getPolicyVersions(policyId: string): Promise<readonly APCPolicyVersion[]>;
  getCurrentPolicyVersion(policyId: string): Promise<APCPolicyVersion | null>;
  createApproval(input: CreateApprovalInput): Promise<APCPolicyApproval>;
  getApprovals(policyId: string): Promise<readonly APCPolicyApproval[]>;
  createAcknowledgment(input: CreateAcknowledgmentInput): Promise<APCPolicyAcknowledgment>;
  getAcknowledgments(policyId: string): Promise<readonly APCPolicyAcknowledgment[]>;
}

export const unavailableGovernanceAdapter: GovernanceDataAdapter = {
  status: "NOT_CONNECTED",
  async listPolicies() { return []; },
  async listProcedures() { return []; },
  async listAcknowledgments() { return []; },
  async listPolicyVersions() { return []; },
  async listApprovals() { return []; },
  async createPolicy() { throw new Error("Governance persistence is not connected"); },
  async getPolicy() { return null; },
  async updatePolicy() { return null; },
  async transitionPolicy() { return null; },
  async createProcedure() { throw new Error("Governance persistence is not connected"); },
  async getProcedure() { return null; },
  async updateProcedure() { return null; },
  async createPolicyVersion() { throw new Error("Governance persistence is not connected"); },
  async getPolicyVersions() { return []; },
  async getCurrentPolicyVersion() { return null; },
  async createApproval() { throw new Error("Governance persistence is not connected"); },
  async getApprovals() { return []; },
  async createAcknowledgment() { throw new Error("Governance persistence is not connected"); },
  async getAcknowledgments() { return []; },
};

export function getGovernanceDataAdapter(): GovernanceDataAdapter {
  return localGovernanceAdapter;
}

const localGovernanceAdapter = createLocalGovernanceAdapter();

export async function getGovernanceSnapshot(adapter = getGovernanceDataAdapter()): Promise<GovernanceSnapshot> {
  const [policies, procedures, policyVersions, approvals, acknowledgments] = await Promise.all([
    adapter.listPolicies(),
    adapter.listProcedures(),
    adapter.listPolicyVersions(),
    adapter.listApprovals(),
    adapter.listAcknowledgments(),
  ]);
  return { policies, procedures, policyVersions, approvals, acknowledgments, sourceStatus: adapter.status };
}