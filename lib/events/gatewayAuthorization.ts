import type { CurrentUser } from "@/lib/auth";

export type GatewayOperation = "view" | "submit" | "configure";

export function canPerformGatewayOperation(user: CurrentUser | null, operation: GatewayOperation) {
  if (!user) return false;
  if (operation === "configure") return user.role === "super_admin";
  return operation === "view" || user.role === "super_admin";
}

export function getGatewayAuthorizationError(user: CurrentUser | null, operation: GatewayOperation) {
  if (!user) return "Unauthorized" as const;
  if (!canPerformGatewayOperation(user, operation)) return "Forbidden" as const;
  return null;
}