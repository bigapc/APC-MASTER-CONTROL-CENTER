import type { APCIncident, APCIncidentSnapshot } from "./types";

export interface IncidentDataAdapter {
  readonly status: APCIncidentSnapshot["sourceStatus"];
  listIncidents(): Promise<readonly APCIncident[]>;
  getIncident(incidentId: string): Promise<APCIncident | null>;
}

export const unavailableIncidentAdapter: IncidentDataAdapter = {
  status: "NOT_CONNECTED",
  async listIncidents() { return []; },
  async getIncident() { return null; },
};

export function getIncidentDataAdapter(): IncidentDataAdapter {
  return unavailableIncidentAdapter;
}

export async function getIncidentSnapshot(): Promise<APCIncidentSnapshot> {
  const adapter = getIncidentDataAdapter();
  return { incidents: await adapter.listIncidents(), sourceStatus: adapter.status };
}
