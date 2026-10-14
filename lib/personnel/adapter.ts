import type { PersonnelSnapshot } from "./types";

export interface PersonnelDataAdapter {
  readonly status: PersonnelSnapshot["sourceStatus"];
  listPersonnel(): Promise<PersonnelSnapshot["personnel"]>;
}

export const unavailablePersonnelAdapter: PersonnelDataAdapter = {
  status: "NOT_CONNECTED",
  async listPersonnel() { return []; },
};

export function getPersonnelDataAdapter(): PersonnelDataAdapter {
  return unavailablePersonnelAdapter;
}

export async function getPersonnelSnapshot(): Promise<PersonnelSnapshot> {
  const adapter = getPersonnelDataAdapter();
  return { personnel: await adapter.listPersonnel(), sourceStatus: adapter.status };
}