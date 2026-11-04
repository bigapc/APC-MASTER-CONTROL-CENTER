import type { CurrentUser } from "@/lib/auth";
import { getCommunicationsDataAdapter, getCommunicationsSnapshot, type CommunicationsDataAdapter } from "./adapter";
import { canPerformCommunicationOperation, type CommunicationOperation } from "./authorization";
import { canTransitionCommunicationStatus, type APCCommunication, type CommunicationStatus, type CommunicationsSnapshot, type CreateCommunicationInput } from "./types";

export type CommunicationsServiceResult<T> = { ok: true; data: T } | { ok: false; error: "Unauthorized" | "Forbidden" | "NotConfigured" | "NotFound" | "InvalidTransition" };

function denied<T>(user: CurrentUser | null, operation: CommunicationOperation): CommunicationsServiceResult<T> | null {
  if (!user) return { ok: false, error: "Unauthorized" };
  if (!canPerformCommunicationOperation(user, operation)) return { ok: false, error: "Forbidden" };
  return null;
}

function adapterOrDefault(adapter?: CommunicationsDataAdapter) {
  return adapter ?? getCommunicationsDataAdapter();
}

export async function getCommunications(user: CurrentUser | null, adapter?: CommunicationsDataAdapter): Promise<CommunicationsServiceResult<CommunicationsSnapshot>> {
  const failure = denied<CommunicationsSnapshot>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await getCommunicationsSnapshot(adapterOrDefault(adapter)) };
}

export async function listCommunications(user: CurrentUser | null, adapter?: CommunicationsDataAdapter): Promise<CommunicationsServiceResult<readonly APCCommunication[]>> {
  const failure = denied<readonly APCCommunication[]>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await adapterOrDefault(adapter).listCommunications() };
}

export async function getCommunication(user: CurrentUser | null, communicationId: string, adapter?: CommunicationsDataAdapter): Promise<CommunicationsServiceResult<APCCommunication | null>> {
  const failure = denied<APCCommunication | null>(user, "view");
  if (failure) return failure;
  return { ok: true, data: await adapterOrDefault(adapter).getCommunication(communicationId) };
}

export async function createCommunication(user: CurrentUser | null, input: CreateCommunicationInput, adapter?: CommunicationsDataAdapter): Promise<CommunicationsServiceResult<APCCommunication>> {
  const failure = denied<APCCommunication>(user, "create");
  if (failure) return failure;
  if (input.status && input.status !== "DRAFT") return { ok: false, error: "InvalidTransition" };
  return { ok: true, data: await adapterOrDefault(adapter).createCommunication({ ...input, status: "DRAFT" }) };
}

export async function updateCommunication(user: CurrentUser | null, communicationId: string, input: Partial<APCCommunication>, adapter?: CommunicationsDataAdapter): Promise<CommunicationsServiceResult<APCCommunication | null>> {
  const failure = denied<APCCommunication | null>(user, "update");
  if (failure) return failure;
  const persistence = adapterOrDefault(adapter);
  if (input.status) return transitionCommunication(user, communicationId, input.status, persistence);
  const communication = await persistence.updateCommunication(communicationId, input);
  if (!communication) return { ok: false, error: "NotFound" };
  return { ok: true, data: communication };
}

export async function transitionCommunication(user: CurrentUser | null, communicationId: string, status: CommunicationStatus, adapter?: CommunicationsDataAdapter): Promise<CommunicationsServiceResult<APCCommunication | null>> {
  const operation = status === "READY" ? "prepare" : status === "SENT" || status === "FAILED" ? "send" : status === "CANCELLED" ? "cancel" : status === "ARCHIVED" ? "archive" : "record_read";
  const failure = denied<APCCommunication | null>(user, operation);
  if (failure) return failure;
  const persistence = adapterOrDefault(adapter);
  const communication = await persistence.getCommunication(communicationId);
  if (!communication) return { ok: false, error: "NotFound" };
  if (!canTransitionCommunicationStatus(communication.status, status)) return { ok: false, error: "InvalidTransition" };
  if (status === "SENT") return { ok: false, error: "NotConfigured" };
  return { ok: true, data: await persistence.transitionCommunication(communicationId, status) };
}
