import { NextResponse } from "next/server";
import { getCommunicationsUser } from "@/lib/communications/api";
import { transitionCommunication, updateCommunication } from "@/lib/communications/service";
import type { APCCommunication, CommunicationStatus } from "@/lib/communications/types";

const actions: Record<string, CommunicationStatus> = {
  prepare: "READY",
  send: "SENT",
  cancel: "CANCELLED",
  archive: "ARCHIVED",
  read: "READ",
};

export async function POST(request: Request, { params }: { params: Promise<{ communicationId: string; action: string }> }) {
  try {
    const user = await getCommunicationsUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { communicationId, action } = await params;
    if (action === "update") {
      const body = await request.json().catch(() => null) as { data?: Partial<APCCommunication> } | null;
      if (!body?.data) return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
      const result = await updateCommunication(user, communicationId, body.data);
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error === "Forbidden" ? 403 : result.error === "NotFound" ? 404 : 409 });
      return NextResponse.json(result.data);
    }
    const status = actions[action];
    if (!status) return NextResponse.json({ error: "Not Found" }, { status: 404 });
    const result = await transitionCommunication(user, communicationId, status);
    if (!result.ok) {
      const error = result.error === "InvalidTransition" ? "Invalid communication lifecycle transition." : result.error === "NotConfigured" ? "External delivery is not connected." : result.error;
      return NextResponse.json({ error }, { status: result.error === "Forbidden" ? 403 : result.error === "NotFound" ? 404 : result.error === "NotConfigured" ? 503 : 409 });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Unexpected Error" }, { status: 500 });
  }
}
