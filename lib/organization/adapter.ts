import { EMPTY_ORGANIZATION_SNAPSHOT, type OrganizationSnapshot } from "./structure";

export interface OrganizationStructureAdapter {
  readonly status: OrganizationSnapshot["sourceStatus"];
  getSnapshot(): Promise<OrganizationSnapshot>;
}

export const localOrganizationStructureAdapter: OrganizationStructureAdapter = {
  status: "LOCAL_DEVELOPMENT",
  async getSnapshot() { return EMPTY_ORGANIZATION_SNAPSHOT; },
};

export function getOrganizationStructureAdapter(): OrganizationStructureAdapter {
  return localOrganizationStructureAdapter;
}

export async function getOrganizationSnapshot(): Promise<OrganizationSnapshot> {
  const adapter = getOrganizationStructureAdapter();
  const snapshot = await adapter.getSnapshot();
  return { ...snapshot, sourceStatus: adapter.status };
}