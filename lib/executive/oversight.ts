import { getAccessSnapshot } from "@/lib/access/adapter";
import { getCommunicationsUser } from "@/lib/communications/api";
import { getCommunications } from "@/lib/communications/service";
import { getGovernanceUser } from "@/lib/governance/api";
import { getGovernance } from "@/lib/governance/service";
import { getIncidentSnapshot } from "@/lib/incidents/adapter";
import { getWorkSnapshot } from "@/lib/work/adapter";
import { getGatewayStatus } from "@/lib/events/gatewayService";
import { APC_AI_ASSISTANTS } from "@/lib/ai/registry";
import { APC_INTEGRATIONS } from "@/lib/integrations/registry";
import { APC_UNITS } from "@/lib/apcUnits";

export type OversightStatus = "AVAILABLE" | "LOCAL_DEVELOPMENT" | "ARCHITECTURE_READY" | "NOT_CONNECTED" | "NO_LIVE_DATA";

export interface ExecutiveOversightDomain {
  domain: string;
  architectureStatus: OversightStatus;
  persistenceStatus: string;
  integrationStatus: string;
  attentionStatus: string;
}

export interface ExecutiveOversightSnapshot {
  domains: readonly ExecutiveOversightDomain[];
  sourceStatus: "LOCAL_DEVELOPMENT" | "NOT_CONNECTED";
  liveCountsAvailable: false;
}

function resultStatus(result: { ok: boolean }) {
  return result.ok ? "LOCAL_DEVELOPMENT" : "NOT_CONNECTED";
}

export async function getExecutiveOversight(): Promise<ExecutiveOversightSnapshot> {
  const [communications, governance, incidents, work, access] = await Promise.all([
    getCommunications(await getCommunicationsUser()),
    getGovernance(await getGovernanceUser()),
    getIncidentSnapshot(),
    getWorkSnapshot(),
    getAccessSnapshot(),
  ]);
  const gateway = getGatewayStatus();
  const localUnits = APC_UNITS.filter((unit) => unit.integrationStatus === "LOCAL_DEVELOPMENT").length;
  const configuredIntegrations = APC_INTEGRATIONS.filter((integration) => integration.configurationStatus === "LIVE").length;
  const aiConnected = APC_AI_ASSISTANTS.some((assistant) => assistant.status === "LIVE");

  return {
    sourceStatus: "LOCAL_DEVELOPMENT",
    liveCountsAvailable: false,
    domains: [
      { domain: "Governance", architectureStatus: resultStatus(governance), persistenceStatus: "Local in-memory architecture available", integrationStatus: "Production persistence not connected", attentionStatus: "No live governance records" },
      { domain: "Communications", architectureStatus: resultStatus(communications), persistenceStatus: "Local in-memory architecture available", integrationStatus: "External delivery not connected", attentionStatus: "No live communications" },
      { domain: "Incidents", architectureStatus: incidents.sourceStatus === "NOT_CONNECTED" ? "NOT_CONNECTED" : "LOCAL_DEVELOPMENT", persistenceStatus: incidents.sourceStatus, integrationStatus: "Incident source not connected", attentionStatus: "No live incident data connected" },
      { domain: "Work", architectureStatus: work.sourceStatus === "NOT_CONNECTED" ? "NOT_CONNECTED" : "LOCAL_DEVELOPMENT", persistenceStatus: work.sourceStatus, integrationStatus: "Work source not connected", attentionStatus: "No live work records connected" },
      { domain: "Access", architectureStatus: access.sourceStatus === "NOT_CONNECTED" ? "NOT_CONNECTED" : "LOCAL_DEVELOPMENT", persistenceStatus: access.sourceStatus, integrationStatus: "Identity provider not connected", attentionStatus: "No live identity administration data" },
      { domain: "Personnel", architectureStatus: "ARCHITECTURE_READY", persistenceStatus: "Not connected", integrationStatus: "Personnel source not connected", attentionStatus: "No live personnel data" },
      { domain: "Organization", architectureStatus: "ARCHITECTURE_READY", persistenceStatus: "Local architecture available", integrationStatus: "Occupant data not connected", attentionStatus: "No live organization records" },
      { domain: "APC Units", architectureStatus: localUnits > 0 ? "LOCAL_DEVELOPMENT" : "ARCHITECTURE_READY", persistenceStatus: "Existing registry available", integrationStatus: "External unit integrations not connected", attentionStatus: "No live unit activity" },
      { domain: "Integrations", architectureStatus: configuredIntegrations > 0 ? "AVAILABLE" : "NOT_CONNECTED", persistenceStatus: gateway.persistence, integrationStatus: gateway.externalSources, attentionStatus: "No live integration events" },
      { domain: "Academy", architectureStatus: "ARCHITECTURE_READY", persistenceStatus: "Local architecture available", integrationStatus: "Learning persistence not connected", attentionStatus: "No live academy activity" },
      { domain: "APC AI", architectureStatus: aiConnected ? "AVAILABLE" : "ARCHITECTURE_READY", persistenceStatus: "Local registry available", integrationStatus: aiConnected ? "Provider connected" : "AI provider not connected", attentionStatus: "No live AI activity" },
      { domain: "Operations", architectureStatus: "ARCHITECTURE_READY", persistenceStatus: "Local architecture available", integrationStatus: "Operational source not connected", attentionStatus: "No live operations feed" },
    ],
  };
}
