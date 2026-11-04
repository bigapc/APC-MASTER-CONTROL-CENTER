import { NextResponse } from "next/server";
import { getGovernanceUser, governanceErrorStatus } from "@/lib/governance/api";
import { activatePolicyRecord, approvePolicyRecord, createAcknowledgment, transitionPolicy } from "@/lib/governance/service";
import { isNonEmptyString, isRecord, isStringRecord } from "@/lib/governance/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ policyId: string; action: string }> },
) {
  const { action } = await params;
  const user = await getGovernanceUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isNonEmptyString((await params).policyId)) return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  let result;

  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body)) return NextResponse.json({ error: "Invalid Request" }, { status: 400 });

  if (action === "acknowledge") {
    if (!isNonEmptyString(body.policyVersionId)
      || ("metadata" in body && !isStringRecord(body.metadata))) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
    }
    result = await createAcknowledgment(user, { policyId: (await params).policyId, policyVersionId: body.policyVersionId, userReference: user.id, metadata: isStringRecord(body.metadata) ? body.metadata : undefined });
  } else {
    if (["under-review", "changes-requested", "pending-approval", "supersede", "archive", "retire"].includes(action)) {
      const statuses = { "under-review": "UNDER_REVIEW", "changes-requested": "CHANGES_REQUESTED", "pending-approval": "PENDING_APPROVAL", supersede: "SUPERSEDED", archive: "ARCHIVED", retire: "RETIRED" } as const;
      result = await transitionPolicy(user, (await params).policyId, statuses[action as keyof typeof statuses]);
    } else if (action === "approve") {
      if (!isNonEmptyString(body.policyVersionId)
        || ("comments" in body && body.comments !== null && typeof body.comments !== "string")) {
        return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
      }
      const comments = typeof body.comments === "string" ? body.comments : null;
      result = await approvePolicyRecord(user, (await params).policyId, { policyId: (await params).policyId, policyVersionId: body.policyVersionId, reviewerReference: user.id, decision: "APPROVED", comments, state: "APPROVAL" });
    }
    else if (action === "activate") result = await activatePolicyRecord(user, (await params).policyId);
    else return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: governanceErrorStatus(result.error) });
  }
  return NextResponse.json(result.data);
}
