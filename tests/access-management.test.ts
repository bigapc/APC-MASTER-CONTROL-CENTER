import assert from "node:assert/strict";
import test from "node:test";
import { getAccessAuditSnapshotForUser, getAccessSnapshotForUser, listAccessAudit } from "../lib/access/service.ts";

const user = (role: "super_admin" | "dispatcher") => ({
  id: role,
  name: role,
  email: `${role}@example.test`,
  role,
});

test("access snapshots reject unauthenticated users before returning adapter data", async () => {
  assert.deepEqual(await getAccessSnapshotForUser(null), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await getAccessAuditSnapshotForUser(null), { ok: false, error: "Unauthorized" });
});

test("authenticated users can view access architecture but not audit data", async () => {
  const dispatcher = user("dispatcher");
  const access = await getAccessSnapshotForUser(dispatcher);
  assert.equal(access.ok, true);
  if (access.ok) {
    assert.equal(access.data.sourceStatus, "NOT_CONNECTED");
    assert.deepEqual(access.data.identities, []);
    assert.deepEqual(access.data.audit, []);
  }
  assert.deepEqual(await getAccessAuditSnapshotForUser(dispatcher), { ok: false, error: "Forbidden" });
  assert.deepEqual(await listAccessAudit(dispatcher), { ok: false, error: "Forbidden" });
});

test("super_admin may view the disconnected access audit snapshot", async () => {
  const result = await getAccessAuditSnapshotForUser(user("super_admin"));
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.sourceStatus, "NOT_CONNECTED");
    assert.deepEqual(result.data.audit, []);
  }
});