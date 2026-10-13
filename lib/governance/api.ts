import { cookies } from "next/headers";
import { getUserFromSessionValue, SESSION_COOKIE, type CurrentUser } from "@/lib/auth";

export function governanceErrorStatus(error: string): number {
  if (error === "Unauthorized") return 401;
  if (error === "Forbidden") return 403;
  if (error === "NotFound") return 404;
  if (error === "InvalidInput") return 400;
  if (error === "InvalidTransition") return 409;
  if (error === "NotConfigured") return 503;
  return 500;
}


export async function getGovernanceUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  return getUserFromSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}