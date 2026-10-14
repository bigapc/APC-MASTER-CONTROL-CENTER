"use client";

import { useState } from "react";
import { APC_UNITS } from "@/lib/apcUnits";
import { filterCommunicationHistory, type APCCommunication, type CommunicationStatus, type CommunicationType, type CommunicationsSnapshot, type RecipientKind } from "@/lib/communications/types";

type Props = { initialSnapshot: CommunicationsSnapshot };
const types: CommunicationType[] = ["DIRECT", "UNIT_NOTICE", "EXECUTIVE_NOTICE", "ANNOUNCEMENT", "OPERATIONAL", "INCIDENT", "ESCALATION", "GOVERNANCE", "TRAINING", "SYSTEM"];
const recipientKinds: RecipientKind[] = ["IDENTITY", "PERSONNEL", "APC_UNIT", "DEPARTMENT", "EXECUTIVE_GROUP", "OPERATIONAL_GROUP"];
const statuses: CommunicationStatus[] = ["DRAFT", "READY", "SENT", "DELIVERED", "READ", "CANCELLED", "FAILED", "ARCHIVED", "NOT_CONNECTED"];

export default function CommunicationsAdministration({ initialSnapshot }: Props) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<CommunicationType>("ANNOUNCEMENT");
  const [priority, setPriority] = useState("NORMAL");
  const [recipientKind, setRecipientKind] = useState<RecipientKind>("IDENTITY");
  const [recipient, setRecipient] = useState("");
  const [unitId, setUnitId] = useState("");
  const [incident, setIncident] = useState("");
  const [work, setWork] = useState("");
  const [governance, setGovernance] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyType, setHistoryType] = useState<CommunicationType | "ALL">("ALL");
  const [historyPriority, setHistoryPriority] = useState<string>("ALL");
  const [historyStatus, setHistoryStatus] = useState<CommunicationStatus | "ALL">("ALL");
  const [historyUnitId, setHistoryUnitId] = useState("ALL");
  const [selectedCommunicationId, setSelectedCommunicationId] = useState<string | null>(null);

  async function refresh() {
    try {
      const response = await fetch("/api/communications");
      if (response.ok) setSnapshot(await response.json());
      else setMessage("Unable to refresh local communication history.");
    } catch {
      setMessage("Unable to refresh local communication history.");
    }
  }

  async function createDraft(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const response = await fetch("/api/communications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ data: { subject, body, type, priority, senderReference: null, recipients: recipient ? [{ kind: recipientKind, reference: recipient }] : [], unitId: unitId || null, relatedIncidentId: incident || null, relatedWorkReference: work || null, relatedGovernanceReference: governance || null } }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) setMessage(result.error ?? "Communication creation failed.");
    else {
      setSubject(""); setBody(""); setRecipientKind("IDENTITY"); setRecipient(""); setUnitId(""); setIncident(""); setWork(""); setGovernance("");
      await refresh();
      setMessage("Draft saved in local memory.");
    }
    setBusy(false);
  }

  async function action(communicationId: string, actionName: string, data?: object) {
    setBusy(true);
    setMessage(null);
    const response = await fetch(`/api/communications/${communicationId}/${actionName}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data ? { data } : {}) });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok ? `${actionName} completed.` : result.error ?? "Communication operation failed.");
    if (response.ok) await refresh();
    setBusy(false);
  }

  async function saveEdit(event: React.FormEvent) {
    event.preventDefault();
    if (!editingId) return;
    await action(editingId, "update", { subject: editSubject, body: editBody });
    setEditingId(null);
  }

  const history = filterCommunicationHistory(snapshot.communications, {
    query: historyQuery,
    type: historyType === "ALL" ? undefined : historyType,
    priority: historyPriority === "ALL" ? undefined : historyPriority as APCCommunication["priority"],
    status: historyStatus === "ALL" ? undefined : historyStatus,
    unitId: historyUnitId === "ALL" ? undefined : historyUnitId || null,
  });
  const selectedCommunication = selectedCommunicationId ? snapshot.communications.find((communication) => communication.communicationId === selectedCommunicationId) ?? null : null;

  function referenceValue(value: string | null) {
    return value ?? "Not referenced";
  }

  function communicationDetails(communication: APCCommunication) {
    return <article className="rounded-xl border border-zinc-200 bg-zinc-50 p-5" aria-live="polite"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-[#c1121f]">Communication detail</p><h4 className="mt-1 text-xl font-black">{communication.subject}</h4></div><button type="button" onClick={() => setSelectedCommunicationId(null)} className="rounded-lg border px-3 py-2 text-sm font-bold">Close</button></div><p className="mt-4 whitespace-pre-wrap text-sm text-zinc-700">{communication.body}</p><dl className="mt-5 grid gap-3 text-sm md:grid-cols-2"><div><dt className="font-bold text-zinc-500">Lifecycle</dt><dd>{communication.status}</dd></div><div><dt className="font-bold text-zinc-500">Type / priority</dt><dd>{communication.type} / {communication.priority}</dd></div><div><dt className="font-bold text-zinc-500">Sender reference</dt><dd>{referenceValue(communication.senderReference)}</dd></div><div><dt className="font-bold text-zinc-500">Recipient references</dt><dd>{communication.recipients.length ? communication.recipients.map((recipientItem) => `${recipientItem.kind}: ${recipientItem.reference}`).join(", ") : "None"}</dd></div><div><dt className="font-bold text-zinc-500">APC Unit</dt><dd>{referenceValue(communication.unitId)}</dd></div><div><dt className="font-bold text-zinc-500">Incident reference</dt><dd>{referenceValue(communication.relatedIncidentId)}</dd></div><div><dt className="font-bold text-zinc-500">Work reference</dt><dd>{referenceValue(communication.relatedWorkReference)}</dd></div><div><dt className="font-bold text-zinc-500">Governance reference</dt><dd>{referenceValue(communication.relatedGovernanceReference)}</dd></div><div><dt className="font-bold text-zinc-500">Created</dt><dd>{referenceValue(communication.createdAt)}</dd></div><div><dt className="font-bold text-zinc-500">Updated</dt><dd>{referenceValue(communication.updatedAt)}</dd></div></dl><p className="mt-5 text-xs text-zinc-500">Local record only. Lifecycle state is not evidence of external delivery.</p></article>;
  }

  return <section className="apc-card p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">Communication administration</h2><p className="mt-2 text-sm text-zinc-600">Create and manage local drafts through the protected Communications API.</p></div>{busy && <span className="text-sm font-bold text-[#c1121f]">Working...</span>}</div>
    {message && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="status">{message}</p>}
    <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={createDraft}>
      <input required value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" className="rounded-xl border border-zinc-300 p-3" />
      <select value={type} onChange={(event) => setType(event.target.value as CommunicationType)} className="rounded-xl border border-zinc-300 p-3">{types.map((option) => <option key={option}>{option}</option>)}</select>
      <select value={priority} onChange={(event) => setPriority(event.target.value)} className="rounded-xl border border-zinc-300 p-3"><option>LOW</option><option>NORMAL</option><option>HIGH</option><option>CRITICAL</option></select>
      <select value={recipientKind} onChange={(event) => setRecipientKind(event.target.value as RecipientKind)} className="rounded-xl border border-zinc-300 p-3">{recipientKinds.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}</select>
      <input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder={`${recipientKind.replaceAll("_", " ")} reference (optional)`} className="rounded-xl border border-zinc-300 p-3" />
      <textarea required value={body} onChange={(event) => setBody(event.target.value)} placeholder="Message body" className="min-h-28 rounded-xl border border-zinc-300 p-3 md:col-span-2" />
      <select value={unitId} onChange={(event) => setUnitId(event.target.value)} className="rounded-xl border border-zinc-300 p-3"><option value="">APC Unit reference (optional)</option>{APC_UNITS.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}</select>
      <input value={incident} onChange={(event) => setIncident(event.target.value)} placeholder="Incident reference (optional)" className="rounded-xl border border-zinc-300 p-3" />
      <input value={work} onChange={(event) => setWork(event.target.value)} placeholder="Work item reference (optional)" className="rounded-xl border border-zinc-300 p-3" />
      <input value={governance} onChange={(event) => setGovernance(event.target.value)} placeholder="Governance reference (optional)" className="rounded-xl border border-zinc-300 p-3" />
      <button disabled={busy} className="w-fit rounded-xl bg-[#c1121f] px-4 py-2 font-bold text-white disabled:opacity-50">Save Draft</button>
    </form><p className="mt-3 text-xs text-zinc-500">Recipient references are stored exactly as entered. No recipient directory, recipient validation, or live delivery connection is available.</p>
    {editingId && <form className="mt-8 space-y-3 rounded-xl border border-zinc-200 p-4" onSubmit={saveEdit}><h3 className="font-black">Edit draft</h3><input required value={editSubject} onChange={(event) => setEditSubject(event.target.value)} className="w-full rounded-xl border border-zinc-300 p-3" /><textarea required value={editBody} onChange={(event) => setEditBody(event.target.value)} className="min-h-24 w-full rounded-xl border border-zinc-300 p-3" /><div className="flex gap-3"><button disabled={busy} className="rounded-lg bg-[#c1121f] px-3 py-2 text-sm font-bold text-white">Save Changes</button><button type="button" onClick={() => setEditingId(null)} className="rounded-lg border px-3 py-2 text-sm font-bold">Cancel Edit</button></div></form>}
    <div className="mt-8 space-y-4"><div><h3 className="font-black">Communication history / command inbox</h3><p className="mt-1 text-sm text-zinc-600">Search and filter actual local communication records. No live delivery data is connected.</p></div>{snapshot.communications.length === 0 ? <p className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600">No Local Communications</p> : <><div className="grid gap-3 rounded-xl border border-zinc-200 p-4 md:grid-cols-2 xl:grid-cols-5"><input value={historyQuery} onChange={(event) => setHistoryQuery(event.target.value)} placeholder="Search subject, body, recipient" className="rounded-xl border border-zinc-300 p-3 xl:col-span-2" /><select value={historyType} onChange={(event) => setHistoryType(event.target.value as CommunicationType | "ALL")} className="rounded-xl border border-zinc-300 p-3"><option value="ALL">All types</option>{types.map((option) => <option key={option} value={option}>{option}</option>)}</select><select value={historyPriority} onChange={(event) => setHistoryPriority(event.target.value)} className="rounded-xl border border-zinc-300 p-3"><option value="ALL">All priorities</option><option value="LOW">LOW</option><option value="NORMAL">NORMAL</option><option value="HIGH">HIGH</option><option value="CRITICAL">CRITICAL</option></select><select value={historyStatus} onChange={(event) => setHistoryStatus(event.target.value as CommunicationStatus | "ALL")} className="rounded-xl border border-zinc-300 p-3"><option value="ALL">All lifecycle states</option>{statuses.map((option) => <option key={option} value={option}>{option}</option>)}</select><select value={historyUnitId} onChange={(event) => setHistoryUnitId(event.target.value)} className="rounded-xl border border-zinc-300 p-3"><option value="ALL">All APC Units</option><option value="">No APC Unit</option>{APC_UNITS.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)}</select></div>{selectedCommunication && communicationDetails(selectedCommunication)}{history.length === 0 ? <p className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600">No local communications match the current filters.</p> : history.map((communication) => <article key={communication.communicationId} className="rounded-xl border border-zinc-200 p-4"><div className="flex flex-wrap items-start gap-3"><div className="mr-auto"><h4 className="font-black">{communication.subject}</h4><p className="mt-1 line-clamp-2 text-sm text-zinc-600">{communication.body}</p><p className="mt-2 text-xs text-zinc-500">{communication.type} | {communication.priority} | Lifecycle: {communication.status}</p><p className="mt-1 text-xs text-zinc-500">Recipients: {communication.recipients.length ? communication.recipients.map((item) => `${item.kind}:${item.reference}`).join(", ") : "None"} | APC Unit: {communication.unitId ?? "None"}</p></div><button type="button" onClick={() => setSelectedCommunicationId(communication.communicationId)} className="rounded-lg border px-3 py-2 text-sm font-bold">View details</button>{communication.status === "DRAFT" && <><button onClick={() => { setEditingId(communication.communicationId); setEditSubject(communication.subject); setEditBody(communication.body); }} className="rounded-lg border px-3 py-2 text-sm font-bold">Edit</button><button onClick={() => void action(communication.communicationId, "prepare")} className="rounded-lg border px-3 py-2 text-sm font-bold">Ready</button><button onClick={() => void action(communication.communicationId, "cancel")} className="rounded-lg border px-3 py-2 text-sm font-bold">Cancel</button><button onClick={() => void action(communication.communicationId, "archive")} className="rounded-lg border px-3 py-2 text-sm font-bold">Archive</button></>}{communication.status === "READY" && <><button onClick={() => void action(communication.communicationId, "send")} className="rounded-lg border px-3 py-2 text-sm font-bold">Attempt Send</button><button onClick={() => void action(communication.communicationId, "cancel")} className="rounded-lg border px-3 py-2 text-sm font-bold">Cancel</button><button onClick={() => void action(communication.communicationId, "archive")} className="rounded-lg border px-3 py-2 text-sm font-bold">Archive</button></>}{communication.status === "DELIVERED" && <button onClick={() => void action(communication.communicationId, "read")} className="rounded-lg border px-3 py-2 text-sm font-bold">Mark Read</button>}{["SENT", "DELIVERED", "READ", "CANCELLED", "FAILED"].includes(communication.status) && <button onClick={() => void action(communication.communicationId, "archive")} className="rounded-lg border px-3 py-2 text-sm font-bold">Archive</button>}</div></article>)}</>}</div>
  </section>;
}
