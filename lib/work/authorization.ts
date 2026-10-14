import type { CurrentUser } from "@/lib/auth";

export type WorkOperation = "view" | "create" | "update" | "approve" | "reject" | "request_changes";

const SUPER_ADMIN_ONLY: readonly WorkOperation[] = ["create", "update", "approve", "reject", "request_changes"];

export function canPerformWorkOperation(user: CurrentUser | null, operation: WorkOperation) {
  if (!user) return false;
  if (SUPER_ADMIN_ONLY.includes(operation)) return user.role === "super_admin";
  return true;
}

export function getWorkAuthorizationError(user: CurrentUser | null, operation: WorkOperation) {
  if (!user) return "Unauthorized";
  if (!canPerformWorkOperation(user, operation)) return "Forbidden";
  return null;
}
