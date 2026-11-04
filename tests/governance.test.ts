import assert from "node:assert/strict";
import test from "node:test";
import { canPerformGovernanceOperation } from "../lib/governance/authorization.ts";
import { APC_UNITS } from "../lib/apcUnits.ts";
import { unavailableGovernanceAdapter } from "../lib/governance/adapter.ts";
import { createLocalGovernanceAdapter } from "../lib/governance/local-adapter.ts";
import { activatePolicyRecord, approvePolicyRecord, createAcknowledgment, createApproval, createPolicy, createPolicyVersion, createProcedure, getGovernance, getPolicy, transitionPolicy, updatePolicy } from "../lib/governance/service.ts";
import { canTransitionPolicyStatus } from "../lib/governance/types.ts";
import { isCreateAcknowledgmentInput, isCreateApprovalInput, isCreatePolicyInput, isCreatePolicyVersionInput, isCreateProcedureInput } from "../lib/governance/validation.ts";

const user = (role: "super_admin" | "dispatcher") => ({ id: role, name: role, email: `${role}@example.test`, role });

function dataOf<T>(result: { ok: true; data: T } | { ok: false; error: string }): T {
  if (result.ok === false) throw new Error(result.error);
  return result.data;
}

test("unauthenticated governance operations are denied before adapter access", async () => {
  assert.equal(canPerformGovernanceOperation(null, "view"), false);
  assert.deepEqual(await getGovernance(null), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await approvePolicyRecord(null, "missing", { policyId: "missing", policyVersionId: "version", reviewerReference: "unknown", decision: "APPROVED", comments: null, state: "APPROVAL" }), { ok: false, error: "Unauthorized" });
});

test("ordinary users cannot approve or activate policies", async () => {
  const dispatcher = user("dispatcher");
  assert.equal(canPerformGovernanceOperation(dispatcher, "approve_policy"), false);
  assert.equal(canPerformGovernanceOperation(dispatcher, "activate_policy"), false);
  assert.deepEqual(await approvePolicyRecord(dispatcher, "missing", { policyId: "missing", policyVersionId: "version", reviewerReference: dispatcher.id, decision: "APPROVED", comments: null, state: "APPROVAL" }), { ok: false, error: "Forbidden" });
  assert.deepEqual(await activatePolicyRecord(dispatcher, "missing"), { ok: false, error: "Forbidden" });
});

test("super_admin authority still requires persistence and valid lifecycle state", async () => {
  const owner = user("super_admin");
  assert.equal(canPerformGovernanceOperation(owner, "approve_policy"), true);
  assert.deepEqual(await approvePolicyRecord(owner, "missing", { policyId: "missing", policyVersionId: "version", reviewerReference: owner.id, decision: "APPROVED", comments: null, state: "APPROVAL" }), { ok: false, error: "NotFound" });
  assert.deepEqual(await activatePolicyRecord(owner, "missing"), { ok: false, error: "NotFound" });
});

test("acknowledgment does not grant application permissions", async () => {
  const dispatcher = user("dispatcher");
  assert.equal(canPerformGovernanceOperation(dispatcher, "acknowledge_policy"), true);
  assert.equal(canPerformGovernanceOperation(dispatcher, "activate_policy"), false);
  const adapter = createLocalGovernanceAdapter();
  const policy = await createPolicy(user("super_admin"), { title: "Acknowledgment policy", category: "OTHER", status: "DRAFT" }, adapter);
  assert.equal(policy.ok, true);
  if (!policy.ok) return;
  const version = await createPolicyVersion(user("super_admin"), { policyId: policy.data.policyId, version: "1.0", status: "DRAFT", contentReference: "local", createdAt: null }, adapter);
  assert.equal(version.ok, true);
  if (!version.ok) return;
  const acknowledgment = await createAcknowledgment(dispatcher, { policyId: policy.data.policyId, policyVersionId: version.data.versionId, userReference: dispatcher.id }, adapter);
  assert.equal(acknowledgment.ok, true);
});

test("governance input validators accept valid payloads and reject missing or malformed fields", () => {
  assert.equal(isCreatePolicyInput({ title: "Validated policy", category: "OPERATIONS", status: "DRAFT" }), true);
  assert.equal(isCreatePolicyInput({ title: " ", category: "OPERATIONS", status: "DRAFT" }), false);
  assert.equal(isCreatePolicyInput({ title: "Policy", category: "UNKNOWN", status: "DRAFT" }), false);
  assert.equal(isCreatePolicyInput({ title: "Policy", category: "OTHER", status: "DRAFT", unitId: "unknown-unit" }), false);
  assert.equal(isCreatePolicyInput({ title: "Policy", category: "OTHER", status: "DRAFT", role: "super_admin" }), false);
  assert.equal(isCreateProcedureInput({ title: "Procedure", operationalSteps: ["Step"] }), true);
  assert.equal(isCreateProcedureInput({ title: "Procedure", operationalSteps: "not-an-array" }), false);
  assert.equal(isCreateProcedureInput({ title: "Procedure", status: "DRAFT", approvalStatus: "APPROVED" }), false);
  assert.equal(isCreatePolicyVersionInput({ policyId: "policy", version: "1.0", status: "DRAFT", contentReference: "local" }), true);
  assert.equal(isCreatePolicyVersionInput({ policyId: "policy", version: "", status: "DRAFT", contentReference: "local" }), false);
  assert.equal(isCreatePolicyVersionInput({ policyId: "policy", version: "1.0", status: "DRAFT", contentReference: "local", role: "super_admin" }), false);
  assert.equal(isCreateApprovalInput({ policyId: "policy", policyVersionId: "version", reviewerReference: "reviewer", decision: "APPROVED", comments: null, state: "APPROVAL" }), true);
  assert.equal(isCreateApprovalInput({ policyId: "policy", policyVersionId: "version", reviewerReference: "reviewer", decision: "APPROVED", comments: null, state: "APPROVAL", status: "ACTIVE" }), false);
  assert.equal(isCreateAcknowledgmentInput({ policyId: "policy", policyVersionId: "version", userReference: "user" }), true);
  assert.equal(isCreateAcknowledgmentInput({ policyId: "policy", policyVersionId: "version" }), false);
  assert.equal(isCreateAcknowledgmentInput({ policyId: "policy", policyVersionId: "version", userReference: "user", status: "PENDING" }), false);
});

test("service validates input after authorization and before adapter access", async () => {
  let mutationCalled = false;
  const adapter = createLocalGovernanceAdapter();
  adapter.createPolicy = async () => { mutationCalled = true; throw new Error("unexpected mutation"); };
  assert.deepEqual(await createPolicy(null, {} as never, adapter), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await createPolicy(user("super_admin"), { title: "", category: "OTHER", status: "DRAFT" } as never, adapter), { ok: false, error: "InvalidInput" });
  assert.equal(mutationCalled, false);
});

test("draft cannot become active and retired cannot become current", () => {
  assert.equal(canTransitionPolicyStatus("DRAFT", "ACTIVE"), false);
  assert.equal(canTransitionPolicyStatus("RETIRED", "ACTIVE"), false);
  assert.equal(canTransitionPolicyStatus("APPROVED", "ACTIVE"), true);
});

test("missing persistence contains no governance records", async () => {
  assert.deepEqual(await unavailableGovernanceAdapter.listPolicies(), []);
  assert.deepEqual(await unavailableGovernanceAdapter.listProcedures(), []);
  assert.deepEqual(await unavailableGovernanceAdapter.listAcknowledgments(), []);
  assert.deepEqual(await unavailableGovernanceAdapter.listPolicyVersions(), []);
  assert.deepEqual(await unavailableGovernanceAdapter.listApprovals(), []);
  assert.deepEqual(await unavailableGovernanceAdapter.getApprovals("missing"), []);
});

test("local adapter starts empty and stores policies through the service", async () => {
  const adapter = createLocalGovernanceAdapter();
  const owner = user("super_admin");
  assert.deepEqual(await adapter.listPolicies(), []);
  const input = { title: "Local policy", category: "OPERATIONS" as const, status: "DRAFT" as const, unitId: APC_UNITS[0].id, currentVersionId: null, approvalStatus: "DRAFT" as const };
  const created = await createPolicy(owner, input, adapter);
  assert.equal(created.ok, true);
  if (!created.ok) return;
  assert.equal(dataOf(await getPolicy(owner, created.data.policyId, adapter))?.title, "Local policy");
  assert.equal(dataOf(await getGovernance(owner, adapter)).policies.length, 1);
  assert.equal(dataOf(await getPolicy(owner, created.data.policyId, adapter))?.unitId, APC_UNITS[0].id);
});

test("procedures remain separate and policy versions resolve independently", async () => {
  const adapter = createLocalGovernanceAdapter();
  const owner = user("super_admin");
  const policy = await createPolicy(owner, { title: "Versioned policy", category: "OPERATIONS", status: "DRAFT", unitId: null, currentVersionId: null, approvalStatus: "DRAFT" }, adapter);
  assert.equal(policy.ok, true);
  if (!policy.ok) return;
  const procedure = await createProcedure(owner, { title: "Separate procedure", policyId: policy.data.policyId, unitId: null, currentVersionId: null }, adapter);
  assert.equal(procedure.ok, true);
  await createPolicyVersion(owner, { policyId: policy.data.policyId, version: "1.0", status: "DRAFT", contentReference: "local", createdAt: null }, adapter);
  const second = await createPolicyVersion(owner, { policyId: policy.data.policyId, version: "2.0", status: "DRAFT", contentReference: "local", createdAt: null }, adapter);
  assert.equal(second.ok, true);
  if (!second.ok) return;
  await updatePolicy(owner, policy.data.policyId, { currentVersionId: second.data.versionId }, adapter);
  assert.equal((await adapter.getPolicyVersions(policy.data.policyId)).length, 2);
  assert.equal((await adapter.getCurrentPolicyVersion(policy.data.policyId))?.version, "2.0");
  assert.equal((await adapter.listProcedures()).length, 1);
  assert.equal((await adapter.listPolicies()).length, 1);
});

test("service validates lifecycle and authorization before local mutation", async () => {
  const adapter = createLocalGovernanceAdapter();
  const owner = user("super_admin");
  const dispatcher = user("dispatcher");
  const policy = await createPolicy(owner, { title: "Controlled policy", category: "OPERATIONS", status: "DRAFT", unitId: null, currentVersionId: null, approvalStatus: "DRAFT" }, adapter);
  assert.equal(policy.ok, true);
  if (!policy.ok) return;
  assert.deepEqual(await transitionPolicy(dispatcher, policy.data.policyId, "ACTIVE", adapter), { ok: false, error: "Forbidden" });
  assert.deepEqual(await transitionPolicy(owner, policy.data.policyId, "ACTIVE", adapter), { ok: false, error: "InvalidTransition" });
  await transitionPolicy(owner, policy.data.policyId, "UNDER_REVIEW", adapter);
  assert.deepEqual(await transitionPolicy(owner, policy.data.policyId, "APPROVED", adapter), { ok: false, error: "InvalidTransition" });
});

test("acknowledgment records track explicit status without changing authorization", async () => {
  const adapter = createLocalGovernanceAdapter();
  const dispatcher = user("dispatcher");
  const policy = await createPolicy(user("super_admin"), { policyId: "policy-1", title: "Acknowledgment policy", category: "OTHER", status: "DRAFT" }, adapter);
  assert.equal(policy.ok, true);
  const version = await createPolicyVersion(user("super_admin"), { policyId: "policy-1", version: "1.0", status: "DRAFT", contentReference: "local", createdAt: null, versionId: "version-1" }, adapter);
  assert.equal(version.ok, true);
  const result = await createAcknowledgment(dispatcher, { policyId: "policy-1", policyVersionId: "version-1", userReference: dispatcher.id }, adapter);
  assert.equal(result.ok, true);
  assert.equal((await adapter.listAcknowledgments()).length, 1);
  const stored = (await adapter.getAcknowledgments("policy-1"))[0];
  assert.equal(stored.status, "ACKNOWLEDGED");
  assert.equal(stored.acknowledgmentTimestamp, stored.acknowledgedAt);
  assert.equal(stored.identityReference, dispatcher.id);
  assert.equal(canPerformGovernanceOperation(dispatcher, "activate_policy"), false);
});

test("acknowledgments require the signed-in identity and an existing policy version", async () => {
  const adapter = createLocalGovernanceAdapter();
  const dispatcher = user("dispatcher");
  const policy = await createPolicy(user("super_admin"), { title: "Acknowledgment policy", category: "OTHER", status: "DRAFT" }, adapter);
  assert.equal(policy.ok, true);
  if (!policy.ok) return;
  assert.deepEqual(await createAcknowledgment(dispatcher, { policyId: policy.data.policyId, policyVersionId: "missing", userReference: dispatcher.id }, adapter), { ok: false, error: "NotFound" });
  assert.deepEqual(await createAcknowledgment(dispatcher, { policyId: policy.data.policyId, policyVersionId: "version", userReference: "another-user" }, adapter), { ok: false, error: "InvalidInput" });
  assert.equal((await adapter.listAcknowledgments()).length, 0);
});

test("an unauthorized mutation does not touch an adapter", async () => {
  let mutationCalled = false;
  const adapter = createLocalGovernanceAdapter();
  adapter.createPolicy = async (input) => { mutationCalled = true; return { ...input, policyId: "blocked" } as Awaited<ReturnType<typeof adapter.createPolicy>>; };
  assert.deepEqual(await createPolicy(null, { title: "blocked", category: "OTHER", status: "DRAFT", unitId: null, currentVersionId: null, approvalStatus: "DRAFT" }, adapter), { ok: false, error: "Unauthorized" });
  assert.equal(mutationCalled, false);
});

test("approval persists its policy and version relationship, but remains protected", async () => {
  const adapter = createLocalGovernanceAdapter();
  const dispatcher = user("dispatcher");
  const owner = user("super_admin");
  await createPolicy(owner, { policyId: "policy-1", title: "Approval policy", category: "OPERATIONS", status: "DRAFT", unitId: null, currentVersionId: "version-1", approvalStatus: "APPROVAL" }, adapter);
  await createPolicyVersion(owner, { policyId: "policy-1", versionId: "version-1", version: "1.0", status: "DRAFT", contentReference: "local", createdAt: null }, adapter);
  await transitionPolicy(owner, "policy-1", "UNDER_REVIEW", adapter);
  await transitionPolicy(owner, "policy-1", "PENDING_APPROVAL", adapter);
  const input = { policyId: "policy-1", policyVersionId: "version-1", reviewerReference: owner.id, decision: "APPROVED" as const, comments: "Reviewed", state: "APPROVAL" as const };
  assert.deepEqual(await createApproval(dispatcher, input, adapter), { ok: false, error: "Forbidden" });
  assert.deepEqual(await approvePolicyRecord(owner, "policy-1", { ...input, decision: "REJECTED" }, adapter), { ok: false, error: "InvalidTransition" });
  const approval = await createApproval(owner, input, adapter);
  assert.equal(approval.ok, true);
  assert.equal((await adapter.getApprovals("policy-1"))[0].policyVersionId, "version-1");
});
