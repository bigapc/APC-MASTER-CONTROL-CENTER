import assert from "node:assert/strict";
import test from "node:test";
import { canPerformWorkOperation } from "../lib/work/authorization.ts";

const user = (role: "super_admin" | "dispatcher") => ({
  id: role,
  name: role,
  email: `${role}@example.test`,
  role,
});

test("unauthenticated users cannot view or write work", () => {
  assert.equal(canPerformWorkOperation(null, "view"), false);
  assert.equal(canPerformWorkOperation(null, "create"), false);
});

test("ordinary roles may view but cannot mutate or approve work", () => {
  const dispatcher = user("dispatcher");
  assert.equal(canPerformWorkOperation(dispatcher, "view"), true);
  assert.equal(canPerformWorkOperation(dispatcher, "create"), false);
  assert.equal(canPerformWorkOperation(dispatcher, "update"), false);
  assert.equal(canPerformWorkOperation(dispatcher, "approve"), false);
  assert.equal(canPerformWorkOperation(dispatcher, "reject"), false);
  assert.equal(canPerformWorkOperation(dispatcher, "request_changes"), false);
});

test("super_admin retains work and approval authority", () => {
  const owner = user("super_admin");
  for (const operation of ["view", "create", "update", "approve", "reject", "request_changes"] as const) {
    assert.equal(canPerformWorkOperation(owner, operation), true);
  }
});
