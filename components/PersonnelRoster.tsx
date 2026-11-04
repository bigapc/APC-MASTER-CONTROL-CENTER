"use client";

import { useState } from "react";
import type { PersonnelRecord, PersonnelRecordStatus } from "@/lib/personnel/types";

export default function PersonnelRoster({ personnel }: { personnel: readonly PersonnelRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PersonnelRecordStatus | "ALL">("ALL");
  const [department, setDepartment] = useState("ALL");
  const departments = [...new Set(personnel.map((record) => record.departmentId).filter((value): value is string => Boolean(value)))].sort();
  const normalizedQuery = query.trim().toLowerCase();
  const visiblePersonnel = personnel.filter((record) => {
    const matchesQuery = !normalizedQuery || record.displayName.toLowerCase().includes(normalizedQuery) || record.positionId?.toLowerCase().includes(normalizedQuery);
    return matchesQuery && (status === "ALL" || record.status === status) && (department === "ALL" || record.departmentId === department);
  });

  return (
    <section className="apc-card p-6" aria-labelledby="personnel-roster-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="personnel-roster-heading" className="text-2xl font-black">Personnel roster</h2>
          <p className="mt-2 text-sm text-zinc-600">Filters apply only to connected, authorized personnel records. No sample profiles are shown.</p>
        </div>
        <p className="text-sm font-bold text-zinc-500">{visiblePersonnel.length} of {personnel.length} records</p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm font-bold text-zinc-700">
          Search
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or position" className="rounded-lg border border-zinc-300 px-3 py-2" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-700">
          Employment status
          <select value={status} onChange={(event) => setStatus(event.target.value as PersonnelRecordStatus | "ALL")} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On leave</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-zinc-700">
          Department
          <select value={department} onChange={(event) => setDepartment(event.target.value)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
            <option value="ALL">All departments</option>
            {departments.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-5 space-y-3" aria-live="polite">
        {visiblePersonnel.length === 0 ? <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">{personnel.length === 0 ? "No personnel records are connected." : "No records match these filters."}</p> : visiblePersonnel.map((record) => (
          <article key={record.personnelId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-4">
            <div><h3 className="font-bold">{record.displayName}</h3><p className="mt-1 text-sm text-zinc-600">{record.positionId ?? "Position unassigned"} · {record.departmentId ?? "Department unassigned"}</p></div>
            <span className="rounded-full border border-zinc-300 px-2 py-1 text-xs font-bold">{record.status.replaceAll("_", " ")}</span>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-zinc-500">Personnel provider remains disconnected; filters do not create or modify records.</p>
    </section>
  );
}