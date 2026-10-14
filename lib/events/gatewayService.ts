import type { CurrentUser } from "@/lib/auth";
import { canPerformGatewayOperation } from "./gatewayAuthorization";
import { getEventDataAdapter } from "./gatewayAdapter";
import { routeEvent, validateEventEnvelope } from "./gateway";
import type { APCEventEnvelope, EventGatewayError, EventGatewayResult } from "./gatewayTypes";

export async function listGatewayEvents(user: CurrentUser | null): Promise<EventGatewayResult<readonly APCEventEnvelope[]> | EventGatewayError> {
  if (!canPerformGatewayOperation(user, "view")) return { ok: false, error: user ? "Forbidden" : "Unauthorized" };
  return { ok: true, data: await getEventDataAdapter().listEvents() };
}

export async function receiveGatewayEvent(user: CurrentUser | null, input: unknown): Promise<EventGatewayResult<{ status: "PENDING_REVIEW" }> | EventGatewayError> {
  if (!canPerformGatewayOperation(user, "submit")) return { ok: false, error: user ? "Forbidden" : "Unauthorized" };
  const validated = validateEventEnvelope(input);
  if (!validated.ok) return validated;
  const adapter = getEventDataAdapter();
  if (!(await adapter.saveEvent(validated.data))) return { ok: false, error: "NotConfigured" };
  return { ok: true, data: { status: routeEvent(validated.data) } };
}

export function getGatewayStatus() {
  return {
    status: "ready" as const,
    gateway: "ACTIVE",
    externalSources: "NOT_CONNECTED",
    sourceAuthorization: "NOT_CONFIGURED",
    persistence: getEventDataAdapter().status,
    analytics: "NOT_CONNECTED",
  };
}