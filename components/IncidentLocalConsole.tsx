"use client";

import { useState, type FormEvent } from "react";
import type { APCIncident, IncidentSeverity } from "@/lib/incidents/types";

type SeverityFilter = IncidentSeverity | "ALL";
type LocalIncidentNote = { id: string; severity: IncidentSeverity; message: string; createdAt: string };

const SEVERITIES: readonly IncidentSeverity[] = ["CRITICAL", "HIGH", "MODERATE", "LOW", "INFORMATIONAL"];
const severityStyles: Record<IncidentSeverity, string> = {
  CRITICAL: "border-red-300 bg-red-50 text-red-800",
  HIGH: "border-orange-300 bg-orange-50 text-orange-800",
  MODERATE: "border-amber-300 bg-amber-50 text-amber-800",
  LOW: "border-blue-300 bg-blue-50 text-blue-800",
  INFORMATIONAL: "border-zinc-300 bg-zinc-50 text-zinc-700",
};

export default function IncidentLocalConsole({ incidents }: { incidents: readonly APCIncident[] }) {
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("ALL");
  const [noteSeverity, setNoteSeverity] = useState<IncidentSeverity>("INFORMATIONAL");
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState<LocalIncidentNote[]>([]);
  const visibleIncidents = incidents.filter((incident) => severityFilter === "ALL" || incident.severity === severityFilter);
  const visibleNotes = notes.filter((note) => severityFilter === "ALL" || note.severity === severityFilter);

  function addLocalNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    setNotes((current) => [{ id: crypto.randomUUID(), severity: noteSeverity, message: trimmedMessage, createdAt: new Date().toISOString() }, ...current]);
    setMessage("");
  }

  return (
    <section className="apc-card p-6" aria-labelledby="incident-local-console-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="incident-local-console-heading" className="text-2xl font-black">Incident review console</h2>
          <p className="mt-2 text-sm text-zinc-600">Severity filters cover connected incidents and local notes; notes are not incident records.</p>
        </div>
        <label className="grid gap-2 text-sm font-bold text-zinc-700">
          Severity filter
          <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value as SeverityFilter)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
            <option value="ALL">All severities</option>
            {SEVERITIES.map((severity) => <option key={severity} value={severity}>{severity}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-5 space-y-3" aria-live="polite">
        {visibleIncidents.length === 0 && <p className="text-sm text-zinc-600">No connected incident records match this severity.</p>}
        {visibleIncidents.map((incident) => (
          <article key={incident.incidentId} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 p-4">
            <div><h3 className="font-bold">{incident.title}</h3><p className="mt-1 text-sm text-zinc-600">{incident.status.replaceAll("_", " ")}</p></div>
            <span className={`rounded-full border px-2 py-1 text-xs font-bold ${severityStyles[incident.severity]}`}>{incident.severity}</span>
          </article>
        ))}
        {visibleNotes.map((note) => (
          <article key={note.id} className="rounded-lg border border-zinc-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`rounded-full border px-2 py-1 text-xs font-bold ${severityStyles[note.severity]}`}>{note.severity} · LOCAL NOTE</span>
              <time className="text-xs text-zinc-500" dateTime={note.createdAt}>{new Date(note.createdAt).toLocaleString()}</time>
            </div>
            <p className="mt-3 text-sm text-zinc-700">{note.message}</p>
          </article>
        ))}
      </div>

      <form onSubmit={addLocalNote} className="mt-6 border-t border-zinc-200 pt-5">
        <h3 className="font-bold">Add a session-only note</h3>
        <p className="mt-1 text-sm text-zinc-600">Stored only in this page’s browser state. It does not create or persist an incident.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[12rem_1fr_auto]">
          <label className="grid gap-2 text-sm font-bold text-zinc-700">
            Severity
            <select value={noteSeverity} onChange={(event) => setNoteSeverity(event.target.value as IncidentSeverity)} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">
              {SEVERITIES.map((severity) => <option key={severity} value={severity}>{severity}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-zinc-700">
            Note
            <input value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} required placeholder="Add a temporary review note" className="rounded-lg border border-zinc-300 px-3 py-2" />
          </label>
          <button type="submit" className="self-end rounded-lg bg-[#c1121f] px-4 py-2 text-sm font-bold text-white">Add note</button>
        </div>
      </form>
    </section>
  );
}