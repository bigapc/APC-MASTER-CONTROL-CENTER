import type { APCEventEnvelope } from "./gatewayTypes";

export interface EventDataAdapter {
  readonly status: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
  listEvents(): Promise<readonly APCEventEnvelope[]>;
  saveEvent(event: APCEventEnvelope): Promise<boolean>;
}

export const unavailableEventAdapter: EventDataAdapter = {
  status: "NOT_CONNECTED",
  async listEvents() { return []; },
  async saveEvent() { return false; },
};

export function getEventDataAdapter(): EventDataAdapter {
  return unavailableEventAdapter;
}