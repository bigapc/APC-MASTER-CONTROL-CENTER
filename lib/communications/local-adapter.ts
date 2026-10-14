import type { CommunicationsDataAdapter } from "./adapter";
import type { APCCommunication, CommunicationStatus, CommunicationsSnapshot, CreateCommunicationInput } from "./types";

function createId() {
  return `communication-${crypto.randomUUID()}`;
}

export class LocalCommunicationsAdapter implements CommunicationsDataAdapter {
  readonly status = "LOCAL_DEVELOPMENT" as const;
  private readonly communications: APCCommunication[] = [];

  async listCommunications() { return [...this.communications]; }
  async getCommunication(communicationId: string) {
    return this.communications.find((communication) => communication.communicationId === communicationId) ?? null;
  }
  async createCommunication(input: CreateCommunicationInput) {
    const now = new Date().toISOString();
    const communication: APCCommunication = { ...input, communicationId: input.communicationId ?? createId(), status: input.status ?? "DRAFT", createdAt: now, updatedAt: now };
    this.communications.push(communication);
    return communication;
  }
  async updateCommunication(communicationId: string, input: Partial<APCCommunication>) {
    const index = this.communications.findIndex((communication) => communication.communicationId === communicationId);
    if (index < 0) return null;
    this.communications[index] = { ...this.communications[index], ...input, communicationId, updatedAt: new Date().toISOString() };
    return this.communications[index];
  }
  async transitionCommunication(communicationId: string, status: CommunicationStatus) {
    return this.updateCommunication(communicationId, { status });
  }
  async getSnapshot(): Promise<CommunicationsSnapshot> {
    return { communications: await this.listCommunications(), sourceStatus: this.status };
  }
}

export function createLocalCommunicationsAdapter() {
  return new LocalCommunicationsAdapter();
}
