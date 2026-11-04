import assert from "node:assert/strict";
import test from "node:test";
import type { APCEventEnvelope } from "../lib/events/gatewayTypes.ts";
import { canPerformGatewayOperation } from "../lib/events/gatewayAuthorization.ts";
import { unavailableEventAdapter } from "../lib/events/gatewayAdapter.ts";
import { validateEventEnvelope } from "../lib/events/gateway.ts";

const user = (role: "super_admin" | "dispatcher") => ({
  id: role,
  name: role,
  email: `${role}@example.test`,
  role,
});

const validEvent: APCEventEnvelope = {
  eventId: "evt-test",
  eventType: "operation.created" as const,
  eventVersion: "1.0",
  source: "safeconnect",
  sourceKind: "APC_UNIT",
  timestamp: new Date().toISOString(),
  correlationId: null,
  priority: "NORMAL",
  severity: "INFORMATIONAL",
  status: "RECEIVED",
  relatedIncidentId: null,
  relatedProjectId: null,
  relatedTaskId: null,
  classification: "INTERNAL",
  payload: { reference: "test" },
  metadata: {},
};

test("unknown and malformed event sources are rejected", () => {
  assert.deepEqual(validateEventEnvelope({ ...validEvent, source: "unknown-unit" }), { ok: false, error: "UnknownSource" });
  assert.deepEqual(validateEventEnvelope({ ...validEvent, eventType: "not.allowed" }), { ok: false, error: "InvalidEvent" });
  assert.deepEqual(validateEventEnvelope({ ...validEvent, payload: "sensitive raw payload" }), { ok: false, error: "InvalidEvent" });
});

test("gateway authorization blocks unauthenticated and ordinary submissions", () => {
  assert.equal(canPerformGatewayOperation(null, "view"), false);
  assert.equal(canPerformGatewayOperation(user("dispatcher"), "submit"), false);
  assert.equal(canPerformGatewayOperation(user("dispatcher"), "view"), true);
});

test("super_admin retains administrative gateway authority", () => {
  assert.equal(canPerformGatewayOperation(user("super_admin"), "submit"), true);
  assert.equal(canPerformGatewayOperation(user("super_admin"), "configure"), true);
});

test("missing persistence remains empty", async () => {
  assert.deepEqual(await unavailableEventAdapter.listEvents(), []);
  assert.equal(await unavailableEventAdapter.saveEvent(validEvent), false);
});
