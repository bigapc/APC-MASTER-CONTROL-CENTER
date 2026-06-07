export interface DispatchCase {
  id: string;
  subject: string;
  status: "queued" | "active" | "escalated" | "closed";
  assignedTo: string | null;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
}

export interface DispatchAssignment {
  caseId: string;
  dispatcherId: string;
  assignedAt: string;
}

export interface DispatchEscalation {
  caseId: string;
  reason: string;
  escalatedAt: string;
}

export interface DispatcherConnector {
  getQueue(): Promise<DispatchCase[]>;
  getAssignments(): Promise<DispatchAssignment[]>;
  getEscalations(): Promise<DispatchEscalation[]>;
}

import { getDispatchQueue as supabaseGetQueue } from "@/lib/supabase/dispatch";

const now = new Date().toISOString();

const DEMO_QUEUE: DispatchCase[] = [
  { id: "DC-201", subject: "Welfare Check Request", status: "queued", assignedTo: null, priority: "high", createdAt: now, updatedAt: now },
  { id: "DC-202", subject: "SafeConnect Escalation", status: "active", assignedTo: "u-sc-1", priority: "critical", createdAt: now, updatedAt: now },
];

export const dispatcherConnector: DispatcherConnector = {
  async getQueue(): Promise<DispatchCase[]> {
    const live = await supabaseGetQueue();
    return live.length > 0 ? live : DEMO_QUEUE;
  },

  async getAssignments(): Promise<DispatchAssignment[]> {
    const queue = await this.getQueue();
    return queue
      .filter((c) => c.assignedTo !== null)
      .map((c) => ({ caseId: c.id, dispatcherId: c.assignedTo as string, assignedAt: c.updatedAt }));
  },

  async getEscalations(): Promise<DispatchEscalation[]> {
    return [
      { caseId: "DC-202", reason: "No response after 10 minutes", escalatedAt: now },
    ];
  },
};
