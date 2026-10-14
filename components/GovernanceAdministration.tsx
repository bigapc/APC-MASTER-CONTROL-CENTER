"use client";

import { useState } from "react";
import type { GovernanceSnapshot } from "@/lib/governance/types";

type Props = { initialSnapshot: GovernanceSnapshot };

export default function GovernanceAdministration({ initialSnapshot }: Props) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [title, setTitle] = useState("");
  const [procedureTitle, setProcedureTitle] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function create(resource: "policy" | "procedure" | "version") {
    setBusy(true);
    setMessage(null);
    const data = resource === "policy"
      ? { title, category: "OTHER", status: "DRAFT", unitId: null, currentVersionId: null, approvalStatus: "DRAFT" }
      : resource === "procedure"
        ? { title: procedureTitle, policyId: null, unitId: null, currentVersionId: null }
        : { policyId: snapshot.policies[0]?.policyId, version: `local-${snapshot.policyVersions.length + 1}`, status: "DRAFT", contentReference: "local-development", createdAt: null };
    if (resource === "version" && !data.policyId) {
      setMessage("Create a policy before creating a version.");
      setBusy(false);
      return;
    }
    const response = await fetch("/api/governance", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ resource, data }) });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setMessage(result.error ?? "Governance operation failed.");
      setBusy(false);
      return;
    }
    const refreshed = await fetch("/api/governance");
    if (refreshed.ok) setSnapshot(await refreshed.json());
    if (resource === "policy") setTitle("");
    if (resource === "procedure") setProcedureTitle("");
    setMessage(`${resource} created in local memory.`);
    setBusy(false);
  }

  async function transition(policyId: string, action: string, body?: object) {
    setBusy(true);
    setMessage(null);
    const response = await fetch(`/api/governance/policies/${policyId}/${action}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) setMessage(result.error ?? "Governance operation failed.");
    else {
      const refreshed = await fetch("/api/governance");
      if (refreshed.ok) setSnapshot(await refreshed.json());
      setMessage(`${action} completed.`);
    }
    setBusy(false);
  }

  return <section className="apc-card p-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl font-black">Local administration</h2><p className="mt-2 text-sm text-zinc-600">Writes use the protected Governance API and remain in-memory only.</p></div>{busy && <span className="text-sm font-bold text-[#c1121f]">Working...</span>}</div>
    {message && <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800" role="status">{message}</p>}
    <div className="mt-6 grid gap-5 lg:grid-cols-3">
      <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void create("policy"); }}><h3 className="font-black">Create policy</h3><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Policy title" className="w-full rounded-xl border border-zinc-300 p-3" /><button disabled={busy} className="rounded-xl bg-[#c1121f] px-4 py-2 font-bold text-white disabled:opacity-50">Create Draft Policy</button></form>
      <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void create("procedure"); }}><h3 className="font-black">Create procedure</h3><input required value={procedureTitle} onChange={(event) => setProcedureTitle(event.target.value)} placeholder="Procedure title" className="w-full rounded-xl border border-zinc-300 p-3" /><button disabled={busy} className="rounded-xl bg-[#c1121f] px-4 py-2 font-bold text-white disabled:opacity-50">Create Procedure</button></form>
      <div className="space-y-3"><h3 className="font-black">Create policy version</h3><p className="text-sm text-zinc-600">Uses the first actual local policy and creates a Draft version.</p><button disabled={busy || snapshot.policies.length === 0} onClick={() => void create("version")} className="rounded-xl border border-[#c1121f] px-4 py-2 font-bold text-[#c1121f] disabled:opacity-50">Create Draft Version</button></div>
    </div>
    <div className="mt-8 space-y-4"><h3 className="font-black">Policy workflow</h3>{snapshot.policies.length === 0 ? <p className="text-sm text-zinc-600">No policies have been created yet.</p> : snapshot.policies.map((policy) => <div key={policy.policyId} className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 p-4"><div className="mr-auto"><p className="font-black">{policy.title}</p><p className="text-sm text-zinc-600">Status: {policy.status}</p></div>{policy.status === "DRAFT" && <button onClick={() => void transition(policy.policyId, "under-review")} className="rounded-lg border px-3 py-2 text-sm font-bold">Submit Review</button>}{policy.status === "UNDER_REVIEW" && <><button onClick={() => void transition(policy.policyId, "changes-requested")} className="rounded-lg border px-3 py-2 text-sm font-bold">Request Changes</button><button onClick={() => void transition(policy.policyId, "pending-approval")} className="rounded-lg border px-3 py-2 text-sm font-bold">Submit Approval</button></>}{policy.status === "PENDING_APPROVAL" && (policy.currentVersionId ? <button onClick={() => void transition(policy.policyId, "approve", { policyVersionId: policy.currentVersionId })} className="rounded-lg border px-3 py-2 text-sm font-bold">Approve</button> : <span className="text-sm text-zinc-500">Create a current version before approval.</span>)}{policy.status === "APPROVED" && <button onClick={() => void transition(policy.policyId, "activate")} className="rounded-lg border px-3 py-2 text-sm font-bold">Activate</button>}</div>)}</div>
  </section>;
}
