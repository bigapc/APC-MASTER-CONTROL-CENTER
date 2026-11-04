import type { AccessSnapshot, APCIdentity, APCAccessRequest, APCUnitAccessGrant, APCAccessAuditRecord } from "./types";

export interface IdentityDataAdapter {
  readonly status: AccessSnapshot["sourceStatus"];
  listIdentities(): Promise<readonly APCIdentity[]>;
  listAccessRequests(): Promise<readonly APCAccessRequest[]>;
  listUnitAccess(): Promise<readonly APCUnitAccessGrant[]>;
  listAudit(): Promise<readonly APCAccessAuditRecord[]>;
}

export const unavailableIdentityAdapter: IdentityDataAdapter = {
  status: "NOT_CONNECTED",
  async listIdentities() { return []; },
  async listAccessRequests() { return []; },
  async listUnitAccess() { return []; },
  async listAudit() { return []; },
};

export function getIdentityDataAdapter() {
  return unavailableIdentityAdapter;
}

export async function getAccessSnapshot(): Promise<AccessSnapshot> {
  const adapter = getIdentityDataAdapter();
  const [identities, requests, unitAccess, audit] = await Promise.all([
    adapter.listIdentities(), adapter.listAccessRequests(), adapter.listUnitAccess(), adapter.listAudit(),
  ]);
  return { identities, requests, unitAccess, audit, sourceStatus: adapter.status };
}
