import { NextResponse } from "next/server";
import { getCommunicationsUser } from "@/lib/communications/api";
import { createCommunication, getCommunications } from "@/lib/communications/service";
import type { CreateCommunicationInput } from "@/lib/communications/types";

export async function GET() {
  try {
    const result = await getCommunications(await getCommunicationsUser());
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error === "Unauthorized" ? 401 : 403 });
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Unexpected Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCommunicationsUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json().catch(() => null) as { data?: CreateCommunicationInput } | null;
    if (!body?.data) return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    const result = await createCommunication(user, body.data);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.error === "Forbidden" ? 403 : result.error === "Unauthorized" ? 401 : 409 });
    return NextResponse.json(result.data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unexpected Error" }, { status: 500 });
  }
}
