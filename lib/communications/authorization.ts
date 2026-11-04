import type { CurrentUser } from "@/lib/auth";

export type CommunicationOperation = "view" | "create" | "update" | "prepare" | "send" | "cancel" | "archive" | "record_read";

const ADMIN_OPERATIONS: readonly CommunicationOperation[] = ["create", "update", "prepare", "send", "cancel", "archive"];

export function canPerformCommunicationOperation(user: CurrentUser | null, operation: CommunicationOperation) {
  if (!user) return false;
  return !ADMIN_OPERATIONS.includes(operation) || user.role === "super_admin";
}
