import assert from "node:assert/strict";
import test from "node:test";
import { APC_UNITS } from "../lib/apcUnits.ts";
import { createLocalCommunicationsAdapter } from "../lib/communications/local-adapter.ts";
import { canPerformCommunicationOperation } from "../lib/communications/authorization.ts";
import { createCommunication, getCommunication, getCommunications, listCommunications, transitionCommunication, updateCommunication } from "../lib/communications/service.ts";
import { canTransitionCommunicationStatus, filterCommunicationHistory } from "../lib/communications/types.ts";

const owner = { id: "owner", name: "Owner", email: "owner@example.test", role: "super_admin" as const };
const dispatcher = { id: "dispatcher", name: "Dispatcher", email: "dispatcher@example.test", role: "dispatcher" as const };
const input = { subject: "Local notice", body: "Internal draft", type: "UNIT_NOTICE" as const, priority: "NORMAL" as const, senderReference: owner.id, recipients: [{ kind: "PERSONNEL" as const, reference: "personnel-reference" }], unitId: APC_UNITS[0].id, relatedIncidentId: "incident-reference", relatedWorkReference: "work-reference", relatedGovernanceReference: "governance-reference" };

test("fresh local communication adapters start empty and remain isolated", async () => {
  const first = createLocalCommunicationsAdapter();
  const second = createLocalCommunicationsAdapter();
  assert.deepEqual(await first.listCommunications(), []);
  await createCommunication(owner, input, first);
  assert.equal((await first.listCommunications()).length, 1);
  assert.deepEqual(await second.listCommunications(), []);
});

test("communication creation is authorized before adapter mutation", async () => {
  let called = false;
  const adapter = createLocalCommunicationsAdapter();
  adapter.createCommunication = async (value) => { called = true; return { ...value, communicationId: "blocked", status: "DRAFT", createdAt: null, updatedAt: null }; };
  assert.deepEqual(await createCommunication(null, input, adapter), { ok: false, error: "Unauthorized" });
  assert.equal(called, false);
  assert.equal(canPerformCommunicationOperation(dispatcher, "create"), false);
});

test("local communication creation preserves references without fabricating recipients", async () => {
  const adapter = createLocalCommunicationsAdapter();
  const result = await createCommunication(owner, input, adapter);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.data.recipients[0].reference, "personnel-reference");
  assert.equal(result.data.unitId, APC_UNITS[0].id);
  assert.equal(result.data.status, "DRAFT");
  const snapshot = await getCommunications(owner, adapter);
  assert.equal(snapshot.ok, true);
  if (!snapshot.ok) return;
  assert.equal(snapshot.data.communications.length, 1);
});

test("service-backed communication history starts empty and retrieves actual records intact", async () => {
  const adapter = createLocalCommunicationsAdapter();
  assert.deepEqual(await listCommunications(owner, adapter), { ok: true, data: [] });
  assert.deepEqual(await getCommunication(owner, "missing-communication", adapter), { ok: true, data: null });
  const created = await createCommunication(owner, input, adapter);
  if (!created.ok) return;
  const retrieved = await getCommunication(owner, created.data.communicationId, adapter);
  assert.equal(retrieved.ok, true);
  if (!retrieved.ok) return;
  assert.equal(retrieved.data?.subject, input.subject);
  assert.equal(retrieved.data?.relatedIncidentId, input.relatedIncidentId);
  assert.equal(retrieved.data?.relatedWorkReference, input.relatedWorkReference);
  assert.equal(retrieved.data?.relatedGovernanceReference, input.relatedGovernanceReference);
});

test("missing communication updates return not found without adapter-side status mutation", async () => {
  const adapter = createLocalCommunicationsAdapter();
  assert.deepEqual(await updateCommunication(owner, "missing-communication", { subject: "No record" }, adapter), { ok: false, error: "NotFound" });
  assert.deepEqual(await adapter.listCommunications(), []);
});

test("communication history filters only actual local records", async () => {
  const adapter = createLocalCommunicationsAdapter();
  const first = await createCommunication(owner, input, adapter);
  const second = await createCommunication(owner, { ...input, subject: "Executive escalation", body: "Review required", type: "ESCALATION", priority: "HIGH", recipients: [{ kind: "EXECUTIVE_GROUP", reference: "executive-reference" }], unitId: null }, adapter);
  if (!first.ok || !second.ok) return;
  const records = await adapter.listCommunications();
  assert.deepEqual(filterCommunicationHistory(records, { query: "executive" }).map((record) => record.communicationId), [second.data.communicationId]);
  assert.deepEqual(filterCommunicationHistory(records, { type: "UNIT_NOTICE", unitId: APC_UNITS[0].id }).map((record) => record.communicationId), [first.data.communicationId]);
  assert.equal(filterCommunicationHistory(records, { status: "READY" }).length, 0);
});

test("communication lifecycle rejects false delivery and invalid transitions", async () => {
  assert.equal(canTransitionCommunicationStatus("DRAFT", "SENT"), false);
  assert.equal(canTransitionCommunicationStatus("READY", "DELIVERED"), false);
  const adapter = createLocalCommunicationsAdapter();
  const created = await createCommunication(owner, input, adapter);
  if (!created.ok) return;
  assert.deepEqual(await transitionCommunication(owner, created.data.communicationId, "SENT", adapter), { ok: false, error: "InvalidTransition" });
  const prepared = await transitionCommunication(owner, created.data.communicationId, "READY", adapter);
  assert.equal(prepared.ok, true);
  if (!prepared.ok) return;
  assert.equal(prepared.data?.status, "READY");
  assert.equal(typeof prepared.data?.updatedAt, "string");
});

test("read permission does not create application authorization", () => {
  assert.equal(canPerformCommunicationOperation(dispatcher, "view"), true);
  assert.equal(canPerformCommunicationOperation(dispatcher, "record_read"), true);
  assert.equal(canPerformCommunicationOperation(dispatcher, "send"), false);
});

test("drafts can be updated, prepared, cancelled, and archived through service rules", async () => {
  const adapter = createLocalCommunicationsAdapter();
  const created = await createCommunication(owner, input, adapter);
  if (!created.ok) return;
  const updated = await updateCommunication(owner, created.data.communicationId, { subject: "Updated notice" }, adapter);
  assert.equal(updated.ok, true);
  const ready = await transitionCommunication(owner, created.data.communicationId, "READY", adapter);
  assert.equal(ready.ok, true);
  const cancelled = await transitionCommunication(owner, created.data.communicationId, "CANCELLED", adapter);
  assert.equal(cancelled.ok, true);
  assert.equal((await adapter.getCommunication(created.data.communicationId))?.subject, "Updated notice");
});

test("explicit lifecycle rules allow archive paths and reject invalid status jumps", async () => {
  assert.equal(canTransitionCommunicationStatus("DRAFT", "ARCHIVED"), true);
  assert.equal(canTransitionCommunicationStatus("READY", "ARCHIVED"), true);
  assert.equal(canTransitionCommunicationStatus("CANCELLED", "ARCHIVED"), true);
  assert.equal(canTransitionCommunicationStatus("FAILED", "ARCHIVED"), true);
  assert.equal(canTransitionCommunicationStatus("DRAFT", "FAILED"), false);
  assert.equal(canTransitionCommunicationStatus("READY", "DELIVERED"), false);
  assert.equal(canTransitionCommunicationStatus("DELIVERED", "FAILED"), false);
  assert.equal(canTransitionCommunicationStatus("ARCHIVED", "READY"), false);

  const adapter = createLocalCommunicationsAdapter();
  const created = await createCommunication(owner, input, adapter);
  if (!created.ok) return;
  const archived = await transitionCommunication(owner, created.data.communicationId, "ARCHIVED", adapter);
  assert.equal(archived.ok, true);
  if (!archived.ok) return;
  assert.equal(archived.data?.status, "ARCHIVED");
  assert.deepEqual(await updateCommunication(owner, created.data.communicationId, { status: "READY" }, adapter), { ok: false, error: "InvalidTransition" });
});

test("provider-gated send never creates sent, delivered, or read state", async () => {
  const adapter = createLocalCommunicationsAdapter();
  const created = await createCommunication(owner, input, adapter);
  if (!created.ok) return;
  const ready = await transitionCommunication(owner, created.data.communicationId, "READY", adapter);
  assert.equal(ready.ok, true);
  assert.deepEqual(await transitionCommunication(owner, created.data.communicationId, "SENT", adapter), { ok: false, error: "NotConfigured" });
  const persisted = await adapter.getCommunication(created.data.communicationId);
  assert.equal(persisted?.status, "READY");
  const persistedStatus: string = persisted?.status ?? "";
  assert.equal(["SENT", "DELIVERED", "READ"].includes(persistedStatus), false);
});

test("cancelled communications cannot resume or send", async () => {
  const adapter = createLocalCommunicationsAdapter();
  const created = await createCommunication(owner, input, adapter);
  if (!created.ok) return;
  await transitionCommunication(owner, created.data.communicationId, "CANCELLED", adapter);
  for (const status of ["READY", "SENT", "DELIVERED", "READ"] as const) {
    assert.deepEqual(await transitionCommunication(owner, created.data.communicationId, status, adapter), { ok: false, error: "InvalidTransition" });
  }
});

test("archive is non-destructive and provider failure remains administrative", async () => {
  const adapter = createLocalCommunicationsAdapter();
  const created = await createCommunication(owner, input, adapter);
  if (!created.ok) return;
  const archived = await transitionCommunication(owner, created.data.communicationId, "ARCHIVED", adapter);
  assert.equal(archived.ok, true);
  assert.equal((await adapter.getCommunication(created.data.communicationId))?.status, "ARCHIVED");
  assert.deepEqual(await transitionCommunication(dispatcher, created.data.communicationId, "FAILED", adapter), { ok: false, error: "Forbidden" });
});

test("delivered communications can be read and then only archived", async () => {
  const adapter = createLocalCommunicationsAdapter();
  const created = await createCommunication(owner, input, adapter);
  if (!created.ok) return;
  await adapter.updateCommunication(created.data.communicationId, { status: "DELIVERED" });
  const read = await transitionCommunication(dispatcher, created.data.communicationId, "READ", adapter);
  assert.equal(read.ok, true);
  assert.deepEqual(await transitionCommunication(dispatcher, created.data.communicationId, "SENT", adapter), { ok: false, error: "Forbidden" });
  assert.deepEqual(await transitionCommunication(dispatcher, created.data.communicationId, "FAILED", adapter), { ok: false, error: "Forbidden" });
});
