export type APCUnitStatus =
  | "OPERATIONAL"
  | "DEVELOPMENT"
  | "INTEGRATION_PENDING"
  | "OFFLINE"
  | "ATTENTION_REQUIRED";

export type APCIntegrationStatus =
  | "NOT_CONNECTED"
  | "PENDING_CONFIGURATION"
  | "LOCAL_DEVELOPMENT"
  | "LIVE";

export type APCUnit = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: APCUnitStatus;
  integrationStatus: APCIntegrationStatus;
  primaryRoute: string | null;
  externalUrl: string | null;
  healthStatus: string | null;
  lastActivity: string | null;
  ownerDepartment: string | null;
};

export const APC_UNITS: APCUnit[] = [
  {
    id: "safeconnect",
    name: "SafeConnect",
    description: "Safety exchange and urgent service workflows.",
    category: "Safety Operations",
    status: "INTEGRATION_PENDING",
    integrationStatus: "PENDING_CONFIGURATION",
    primaryRoute: "/apps",
    externalUrl: process.env.NEXT_PUBLIC_SAFECONNECT_PUBLIC_URL || null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "Safety Operations",
  },
  {
    id: "communitysafeconnect",
    name: "CommunitySafeConnect",
    description: "Community reporting, local tasks, and neighborhood connection tools.",
    category: "Community Safety",
    status: "INTEGRATION_PENDING",
    integrationStatus: "PENDING_CONFIGURATION",
    primaryRoute: "/apps",
    externalUrl: process.env.NEXT_PUBLIC_COMMUNITYSAFECONNECT_PUBLIC_URL || null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "Community Operations",
  },
  {
    id: "csc-2-0",
    name: "CommunitySafeConnect-CSC-2.0",
    description: "Dispatcher coordination, monitoring, and agency support.",
    category: "Command Operations",
    status: "INTEGRATION_PENDING",
    integrationStatus: "PENDING_CONFIGURATION",
    primaryRoute: "/apps",
    externalUrl: process.env.NEXT_PUBLIC_CSC_2_PUBLIC_URL || null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "Dispatch Operations",
  },
  {
    id: "safeconnect-dispatcher",
    name: "SafeConnect Dispatcher Platform",
    description: "Future dispatcher workspace for SafeConnect operations.",
    category: "Dispatch",
    status: "DEVELOPMENT",
    integrationStatus: "LOCAL_DEVELOPMENT",
    primaryRoute: "/dispatch",
    externalUrl: null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "Dispatch Operations",
  },
  {
    id: "apc-academy",
    name: "APC Academy",
    description: "Future training and workforce development unit.",
    category: "Education",
    status: "DEVELOPMENT",
    integrationStatus: "NOT_CONNECTED",
    primaryRoute: "/academy",
    externalUrl: null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "APC Academy",
  },
  {
    id: "apc-ai",
    name: "APC AI",
    description: "Authorized decision-support and cross-unit intelligence foundation.",
    category: "Intelligence",
    status: "DEVELOPMENT",
    integrationStatus: "NOT_CONNECTED",
    primaryRoute: "/apc-ai",
    externalUrl: null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "APC Intelligence",
  },
  {
    id: "apn",
    name: "APN - Armstrong Pack Network",
    description: "Future APC network for coordinated partnerships and services.",
    category: "Network",
    status: "DEVELOPMENT",
    integrationStatus: "NOT_CONNECTED",
    primaryRoute: "/franchise-network",
    externalUrl: null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "APC Network",
  },
  {
    id: "apc-daily",
    name: "APC Daily",
    description: "Future APC communications and daily operating information unit.",
    category: "Communications",
    status: "DEVELOPMENT",
    integrationStatus: "NOT_CONNECTED",
    primaryRoute: null,
    externalUrl: null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "APC Communications",
  },
  {
    id: "safeworkconnect",
    name: "SafeWorkConnect",
    description: "Future standalone workforce opportunity and skills platform.",
    category: "Workforce Development",
    status: "DEVELOPMENT",
    integrationStatus: "NOT_CONNECTED",
    primaryRoute: null,
    externalUrl: null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "APC Workforce Initiatives",
  },
  {
    id: "ecochain",
    name: "EcoChain",
    description: "Future sustainability and resource coordination unit.",
    category: "Sustainability",
    status: "DEVELOPMENT",
    integrationStatus: "NOT_CONNECTED",
    primaryRoute: null,
    externalUrl: null,
    healthStatus: null,
    lastActivity: null,
    ownerDepartment: "APC Sustainability",
  },
];