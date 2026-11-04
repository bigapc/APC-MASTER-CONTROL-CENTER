import type { AIAssistant } from "./types";

export const APC_AI_ASSISTANTS: readonly AIAssistant[] = [
  {
    id: "lhm",
    name: "LHM™",
    title: "Logical Human Mentor",
    purpose: "Structured decision support and operational guidance.",
    capabilities: ["Scenario analysis", "Policy guidance", "Operational recommendations", "Training assistance", "Human-centered decision support"],
    permittedRoles: ["super_admin", "app_admin", "dispatcher", "agency_manager", "organization_manager"],
    dataDomains: ["Approved operational context", "Training content"],
    humanReviewRequired: true,
    status: "NOT_CONNECTED",
  },
  {
    id: "hermes",
    name: "HERMES™",
    title: "Enterprise Resource Management and Execution Support",
    purpose: "Support resource coordination and operational planning.",
    capabilities: ["Resource recommendations", "Workflow coordination", "Operational prioritization", "Capacity awareness", "Cross-unit planning"],
    permittedRoles: ["super_admin", "app_admin", "dispatcher", "agency_manager", "organization_manager"],
    dataDomains: ["Approved resource data", "Unit planning context"],
    humanReviewRequired: true,
    status: "NOT_CONNECTED",
  },
  {
    id: "mission-intelligence",
    name: "Mission Intelligence™",
    title: "Strategic Insight Layer",
    purpose: "Future APC-wide strategic insight.",
    capabilities: ["Cross-unit pattern analysis", "Strategic trend identification", "Integration awareness", "Executive decision support"],
    permittedRoles: ["super_admin"],
    dataDomains: ["Approved cross-unit summaries", "Strategic planning context"],
    humanReviewRequired: true,
    status: "NOT_CONNECTED",
  },
];

export function getAPCAIAssistant(id: AIAssistant["id"]) {
  return APC_AI_ASSISTANTS.find((assistant) => assistant.id === id);
}