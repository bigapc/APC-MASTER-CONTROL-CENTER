import type { APCUnit } from "@/lib/apcUnits";
import type { APCPriority } from "@/lib/priority";

export type WorkProjectStatus = "PLANNED" | "ACTIVE" | "ON_HOLD" | "NEEDS_ATTENTION" | "COMPLETED" | "CANCELLED";
export type WorkTaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "AWAITING_APPROVAL" | "COMPLETED" | "CANCELLED";
export type ApprovalStatus = "NOT_REQUIRED" | "PENDING" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";

export interface APCProject {
  projectId: string;
  title: string;
  description: string;
  unitId: APCUnit["id"] | null;
  departmentId: string | null;
  priority: APCPriority;
  status: WorkProjectStatus;
  ownerReference: string | null;
  assignedPersonnelReferences: readonly string[];
  createdDate: string | null;
  targetDate: string | null;
  completionDate: string | null;
  approvalStatus: ApprovalStatus;
}

export interface APCTask {
  taskId: string;
  title: string;
  description: string;
  projectId: string | null;
  unitId: APCUnit["id"] | null;
  departmentId: string | null;
  priority: APCPriority;
  status: WorkTaskStatus;
  assignedPersonnelReference: string | null;
  createdByReference: string | null;
  dueDate: string | null;
  completionReference: string | null;
  approvalRequired: boolean;
  approvalStatus: ApprovalStatus;
}

export interface APCApproval {
  approvalId: string;
  workItemId: string;
  requestedByReference: string | null;
  reviewerReference: string | null;
  status: ApprovalStatus;
  requestedAt: string | null;
  resolvedAt: string | null;
}

export interface APCWorkSnapshot {
  projects: readonly APCProject[];
  tasks: readonly APCTask[];
  approvals: readonly APCApproval[];
  sourceStatus: "NOT_CONNECTED" | "LOCAL_DEVELOPMENT" | "LIVE";
}

export const EMPTY_APC_WORK: APCWorkSnapshot = {
  projects: [],
  tasks: [],
  approvals: [],
  sourceStatus: "NOT_CONNECTED",
};
