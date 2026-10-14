import assert from "node:assert/strict";
import test from "node:test";
import { APC_UNITS } from "../lib/apcUnits.ts";
import { getAcademySnapshotForUser } from "../lib/academy/service.ts";
import { getCommunications } from "../lib/communications/service.ts";
import { getIncidentSnapshotForUser } from "../lib/incidents/service.ts";
import { getOrganizationSnapshotForUser } from "../lib/organization/service.ts";
import { getPersonnelSnapshotForUser } from "../lib/personnel/service.ts";
import { getUnitDirectoryForUser } from "../lib/units/service.ts";
import { getWorkSnapshotForUser } from "../lib/work/service.ts";

const dispatcher = { id: "dispatcher", name: "Dispatcher", email: "dispatcher@example.test", role: "dispatcher" as const };

test("all module snapshot services reject unauthenticated callers", async () => {
  assert.deepEqual(await getAcademySnapshotForUser(null), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await getPersonnelSnapshotForUser(null), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await getUnitDirectoryForUser(null), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await getWorkSnapshotForUser(null), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await getIncidentSnapshotForUser(null), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await getCommunications(null), { ok: false, error: "Unauthorized" });
  assert.deepEqual(await getOrganizationSnapshotForUser(null), { ok: false, error: "Unauthorized" });
});

test("module foundations expose local catalogs without inventing personnel or course records", async () => {
  const academy = await getAcademySnapshotForUser(dispatcher);
  const personnel = await getPersonnelSnapshotForUser(dispatcher);
  const units = await getUnitDirectoryForUser(dispatcher);
  const organization = await getOrganizationSnapshotForUser(dispatcher);

  assert.equal(academy.ok, true);
  if (academy.ok) {
    assert.equal(academy.data.sourceStatus, "NOT_CONNECTED");
    assert.deepEqual(academy.data.courses, []);
  }
  assert.equal(personnel.ok, true);
  if (personnel.ok) {
    assert.equal(personnel.data.sourceStatus, "NOT_CONNECTED");
    assert.deepEqual(personnel.data.personnel, []);
  }
  assert.equal(units.ok, true);
  if (units.ok) {
    assert.equal(units.data.sourceStatus, "LOCAL_DEVELOPMENT");
    assert.deepEqual(units.data.units, APC_UNITS);
  }
  assert.equal(organization.ok, true);
  if (organization.ok) {
    assert.equal(organization.data.sourceStatus, "LOCAL_DEVELOPMENT");
    assert.ok(organization.data.positions.every((position) => position.occupantUserId === null));
    assert.ok(organization.data.departments.every((department) => department.assignedStaffUserIds.length === 0));
  }
});

test("work, incident, and communication snapshots retain their local-only statuses", async () => {
  const work = await getWorkSnapshotForUser(dispatcher);
  const incidents = await getIncidentSnapshotForUser(dispatcher);
  const communications = await getCommunications(dispatcher);

  assert.equal(work.ok, true);
  if (work.ok) {
    assert.equal(work.data.sourceStatus, "NOT_CONNECTED");
    assert.deepEqual(work.data.projects, []);
    assert.deepEqual(work.data.tasks, []);
  }
  assert.equal(incidents.ok, true);
  if (incidents.ok) {
    assert.equal(incidents.data.sourceStatus, "NOT_CONNECTED");
    assert.deepEqual(incidents.data.incidents, []);
  }
  assert.equal(communications.ok, true);
  if (communications.ok) {
    assert.equal(communications.data.sourceStatus, "LOCAL_DEVELOPMENT");
    assert.ok(Array.isArray(communications.data.communications));
  }
});