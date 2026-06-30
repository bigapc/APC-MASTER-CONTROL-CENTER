"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  operationId: string;
  acknowledged: boolean;
};

export default function OperationAcknowledgeButton({ operationId, acknowledged }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  if (acknowledged) {
    return <span className="apc-status apc-status-green">Acknowledged</span>;
  }

  function acknowledge() {
    setMessage("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/operations/acknowledge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ operationId, actor: "operator" }),
        });

        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setMessage(payload?.message ?? (response.ok ? "Acknowledged." : "Acknowledge failed."));

        if (response.ok) {
          router.refresh();
        }
      } catch {
        setMessage("Unable to acknowledge right now.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={acknowledge}
        disabled={pending}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-1 text-xs font-black text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Acknowledge"}
      </button>
      {message ? <span className="text-xs font-bold text-zinc-500">{message}</span> : null}
    </div>
  );
}
