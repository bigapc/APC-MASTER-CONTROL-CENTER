import type { CurrentUser } from "@/lib/auth";

export type GovernanceOperation = "view" | "create_policy" | "update_policy" | "request_review" | "request_changes" | "approve_policy" | "activate_policy" | "acknowledge_policy";

const ADMIN_OPERATIONS: readonly GovernanceOperation[] = ["create_policy", "update_policy", "request_review", "request_changes", "approve_policy", "activate_policy"];

export function canPerformGovernanceOperation(user: CurrentUser | null, operation: GovernanceOperation): boolean {
  if (!user) return false;
  if (ADMIN_OPERATIONS.includes(operation)) return user.role === "super_admin";
  return true;
}