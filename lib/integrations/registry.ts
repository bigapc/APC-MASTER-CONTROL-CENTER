import { APC_UNITS } from "@/lib/apcUnits";

export type IntegrationConnectionType = "API" | "WEBHOOK" | "DATABASE" | "SERVICE";
export type IntegrationDirection = "INBOUND" | "OUTBOUND" | "BIDIRECTIONAL";
export type IntegrationStatus = "NOT_CONNECTED" | "PENDING_CONFIGURATION" | "LIVE";

export interface APCIntegrationDefinition {
  integrationId: string;
  unitId: (typeof APC_UNITS)[number]["id"];
  connectionType: IntegrationConnectionType;
  direction: IntegrationDirection;
  authenticationStatus: "NOT_CONFIGURED" | "CONFIGURED" | "VERIFIED";
  eventCapability: "NOT_CONNECTED" | "READY_FOR_CONFIGURATION" | "LIVE";
  lastConnectionStatus: "UNKNOWN" | "NOT_CONNECTED" | "CONNECTED" | "ERROR";
  configurationStatus: IntegrationStatus;
}

export const APC_INTEGRATIONS: readonly APCIntegrationDefinition[] = APC_UNITS.map((unit) => ({
  integrationId: `gateway-${unit.id}`,
  unitId: unit.id,
  connectionType: "WEBHOOK",
  direction: "INBOUND",
  authenticationStatus: "NOT_CONFIGURED",
  eventCapability: "NOT_CONNECTED",
  lastConnectionStatus: "NOT_CONNECTED",
  configurationStatus: "NOT_CONNECTED",
}));
