export const INCIDENT_STATUSES = [
  "Reported", "Under Review", "Acknowledged", "Escalated", "In Progress", "Awaiting Approval", "Resolved", "Closed", "Cancelled",
] as const;

export const INCIDENT_SEVERITIES = [
  "Critical", "High", "Moderate", "Low", "Informational",
] as const;

export const INCIDENT_CATEGORIES = [
  "Operational", "Technical", "Security", "Safety", "Communications", "Personnel", "Customer / Client", "Service Disruption", "System Integration", "Compliance", "Other",
] as const;
