"use client";

import { useState } from "react";
import type { APCTask, WorkTaskStatus } from "@/lib/work/types";
import { APC_PRIORITIES, type APCPriority } from "@/lib/priority";

const TASK_STATUSES: readonly WorkTaskStatus[] = ["NOT_STARTED", "IN_PROGRESS", "BLOCKED", "AWAITING_APPROVAL", "COMPLETED", "CANCELLED"];

export default function WorkTaskFilters({ tasks }: { tasks: readonly APCTask[] }) {
  const [status, setStatus] = useState<WorkTaskStatus | "ALL">("ALL");
  const [priority, setPriority] = useState<APCPriority | "ALL">("ALL");
  const filteredTasks = tasks.filter((task) => (status === "ALL" || task.status === status) && (priority === "ALL" || task.priority === priority));

  return (
    <section className="apc-card p-6" aria-labelledby="work-task-filter-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="work-task-filter-heading" className="text-2xl font-black">Task view</h2>
          <p className="mt-2 text-sm text-zinc-600">Filters apply to connected task records only.</p>
        </div>
        <p className="text-sm font-bold text-zinc-500">{filteredTasks.length} of {tasks.length} tasks</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-zinc-700">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as WorkTaskStatus | "ALL")} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
            <option value="ALL">All statuses</option>
            {TASK_STATUSES.map((taskStatus) => <option key={taskStatus} value={taskStatus}>{taskStatus.replaceAll("_", " ")}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-700">
          Priority
          <select value={priority} onChange={(event) => setPriority(event.target.value as APCPriority | "ALL")} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
            <option value="ALL">All priorities</option>
            {APC_PRIORITIES.map((taskPriority) => <option key={taskPriority} value={taskPriority}>{taskPriority}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-5 space-y-3" aria-live="polite">
        {filteredTasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
            {tasks.length === 0 ? "No local tasks are connected. Filters will apply when authorized task records are available." : "No tasks match these filters."}
          </p>
        ) : filteredTasks.map((task) => (
          <article key={task.taskId} className="rounded-lg border border-zinc-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="font-bold">{task.title}</h3><p className="mt-1 text-sm text-zinc-600">{task.description}</p></div>
              <div className="flex gap-2 text-xs font-bold">
                <span className="rounded-full border border-zinc-300 px-2 py-1">{task.status.replaceAll("_", " ")}</span>
                <span className="rounded-full border border-zinc-300 px-2 py-1">{task.priority}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}