import { NextResponse } from "next/server";
import { getGovernanceUser, governanceErrorStatus } from "@/lib/governance/api";
import { getGovernance } from "@/lib/governance/service";
import { createPolicy, createProcedure, createPolicyVersion } from "@/lib/governance/service";
import { isCreatePolicyInput, isCreatePolicyVersionInput, isCreateProcedureInput, isRecord } from "@/lib/governance/validation";

export async function GET() {
  const result = await getGovernance(await getGovernanceUser());
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.error === "Unauthorized" ? 401 : 403 });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: Request) {
  const user = await getGovernanceUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body) || !isRecord(body.data)) return NextResponse.json({ error: "Invalid Request" }, { status: 400 });

  const result = body.resource === "policy" && isCreatePolicyInput(body.data)
    ? await createPolicy(user, body.data)
    : body.resource === "procedure" && isCreateProcedureInput(body.data)
      ? await createProcedure(user, body.data)
      : body.resource === "version" && isCreatePolicyVersionInput(body.data)
        ? await createPolicyVersion(user, body.data)
        : null;
  if (!result) return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: governanceErrorStatus(result.error) });
  }
  return NextResponse.json(result.data, { status: 201 });
}
