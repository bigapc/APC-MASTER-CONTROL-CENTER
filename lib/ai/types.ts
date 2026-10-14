import type { UserRole } from "@/lib/roles";

export type AIAssistantId = "lhm" | "hermes" | "mission-intelligence";
export type AIStatus = "PLANNED" | "LOCAL_DEVELOPMENT" | "INTEGRATION_PENDING" | "NOT_CONNECTED" | "LIVE";
export type AIRequestStatus = "PERMISSION_PENDING" | "PROVIDER_PENDING" | "HUMAN_REVIEW" | "COMPLETED";

export type AIAssistant = {
  id: AIAssistantId;
  name: string;
  title: string;
  purpose: string;
  capabilities: readonly string[];
  permittedRoles: readonly UserRole[];
  dataDomains: readonly string[];
  humanReviewRequired: boolean;
  status: AIStatus;
};

export type AIRequest = {
  requestId: string;
  assistantId: AIAssistantId;
  authorizedUserId: string;
  requestCategory: string;
  dataClassification: string;
  status: AIRequestStatus;
  submittedAt: string;
};

export type AIAuditRecord = {
  requestId: string;
  authorizedUserReference: string;
  assistantId: AIAssistantId;
  requestCategory: string;
  dataClassification: string;
  humanReviewStatus: "REQUIRED" | "NOT_STARTED" | "COMPLETED";
  timestamp: string;
  outcomeReference: string | null;
};

export type AIProviderAdapter = {
  id: string;
  status: Exclude<AIStatus, "PLANNED" | "LOCAL_DEVELOPMENT">;
  submit: (request: AIRequest) => Promise<{ status: "PROVIDER_PENDING"; message: string }>;
};