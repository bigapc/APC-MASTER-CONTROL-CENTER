import type { APCCommunication, CommunicationsSnapshot, CreateCommunicationInput, CommunicationStatus } from "./types";

export interface CommunicationsDataAdapter {
  readonly status: CommunicationsSnapshot["sourceStatus"];
  listCommunications(): Promise<readonly APCCommunication[]>;
  getCommunication(communicationId: string): Promise<APCCommunication | null>;
  createCommunication(input: CreateCommunicationInput): Promise<APCCommunication>;
  updateCommunication(communicationId: string, input: Partial<APCCommunication>): Promise<APCCommunication | null>;
  transitionCommunication(communicationId: string, status: CommunicationStatus): Promise<APCCommunication | null>;
}

export const unavailableCommunicationsAdapter: CommunicationsDataAdapter = {
  status: "NOT_CONNECTED",
  async listCommunications() { return []; },
  async getCommunication() { return null; },
  async createCommunication() { throw new Error("Communications persistence is not connected"); },
  async updateCommunication() { return null; },
  async transitionCommunication() { return null; },
};

export function getCommunicationsDataAdapter(): CommunicationsDataAdapter {
  return localCommunicationsAdapter;
}

import { createLocalCommunicationsAdapter } from "./local-adapter";
const localCommunicationsAdapter = createLocalCommunicationsAdapter();

export async function getCommunicationsSnapshot(adapter = getCommunicationsDataAdapter()): Promise<CommunicationsSnapshot> {
  return { communications: await adapter.listCommunications(), sourceStatus: adapter.status };
}
