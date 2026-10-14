import type { CurrentUser } from "@/lib/auth";

export type AccessOperation = "view" | "review_request" | "assign_role" | "remove_role" | "manage_unit_access" | "deactivate_identity" | "reactivate_identity" | "view_audit";

const ADMIN_OPERATIONS: readonly AccessOperation[] = ["review_request", "assign_role", "remove_role", "manage_unit_access", "deactivate_identity", "reactivate_identity", "view_audit"];

export function canPerformAccessOperation(user: CurrentUser | null, operation: AccessOperation) {
  if (!user) return false;
  if (ADMIN_OPERATIONS.includes(operation)) return user.role === "super_admin";
  return true;
}

export function getAccessAuthorizationError(user: CurrentUser | null, operation: AccessOperation) {
  if (!user) return "Unauthorized" as const;
  if (!canPerformAccessOperation(user, operation)) return "Forbidden" as const;
  return null;
}
