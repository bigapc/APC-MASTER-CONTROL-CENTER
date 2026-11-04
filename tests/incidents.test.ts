import assert from "node:assert/strict";
import test from "node:test";
import { canPerformIncidentOperation } from "../lib/incidents/authorization.ts";
import { unavailableIncidentAdapter } from "../lib/incidents/adapter.ts";

const user = (role: "super_admin" | "dispatcher") => ({
  id: role,
  name: role,
  email: `${role}@example.test`,
  role,
});

test("unauthenticated incident operations are denied", () => {
  for (const operation of ["view", "create", "assign", "escalate", "resolve", "close"] as const) {
    assert.equal(canPerformIncidentOperation(null, operation), false);
  }
});

test("ordinary roles cannot mutate incidents", () => {
  const dispatcher = user("dispatcher");
  assert.equal(canPerformIncidentOperation(dispatcher, "view"), true);
  for (const operation of ["create", "assign", "escalate", "resolve", "close"] as const) {
    assert.equal(canPerformIncidentOperation(dispatcher, operation), false);
  }
});

test("super_admin retains full incident authority", () => {
  const owner = user("super_admin");
  for (const operation of ["view", "create", "update", "acknowledge", "assign", "escalate", "resolve", "close"] as const) {
    assert.equal(canPerformIncidentOperation(owner, operation), true);
  }
});

test("missing persistence returns no incident records", async () => {
  assert.deepEqual(await unavailableIncidentAdapter.listIncidents(), []);
  assert.equal(await unavailableIncidentAdapter.getIncident("missing"), null);
});
