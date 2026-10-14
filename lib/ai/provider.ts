import type { AIProviderAdapter, AIRequest } from "./types";

export const unavailableAIProvider: AIProviderAdapter = {
  id: "no-live-provider",
  status: "NOT_CONNECTED",
  async submit(request: AIRequest) {
    void request;
    return {
      status: "PROVIDER_PENDING",
      message: "AI Request Simulation Not Connected",
    };
  },
};

export function createAIRequest(
  request: Omit<AIRequest, "requestId" | "status" | "submittedAt">
): AIRequest {
  return {
    ...request,
    requestId: "pending-provider-request",
    status: "PROVIDER_PENDING",
    submittedAt: new Date().toISOString(),
  };
}