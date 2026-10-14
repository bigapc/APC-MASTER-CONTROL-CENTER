import type { CurrentUser } from "@/lib/auth";

export type IncidentOperation = "view" | "create" | "update" | "acknowledge" | "escalate" | "assign" | "resolve" | "close";

const SUPER_ADMIN_ONLY: readonly IncidentOperation[] = ["create", "update", "acknowledge", "escalate", "assign", "resolve", "close"];

export function canPerformIncidentOperation(user: CurrentUser | null, operation: IncidentOperation) {
  if (!user) return false;
  if (SUPER_ADMIN_ONLY.includes(operation)) return user.role === "super_admin";
  return true;
}

export function getIncidentAuthorizationError(user: CurrentUser | null, operation: IncidentOperation) {
  if (!user) return "Unauthorized" as const;
  if (!canPerformIncidentOperation(user, operation)) return "Forbidden" as const;
  return null;
}
