import { cookies } from "next/headers";
import { getUserFromSessionValue, SESSION_COOKIE, type CurrentUser } from "@/lib/auth";

export async function getCommunicationsUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  return getUserFromSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}
