import { cookies } from "next/headers";
import { SESSION_COOKIE, getUserFromSessionValue } from "@/lib/auth";
import { createSessionProfile } from "@/lib/session/session";

export async function hasAppAccess(appId: string) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionValue(sessionValue);

  if (!user) {
    return false;
  }

  const session = createSessionProfile(user);
  return session.appAccess.includes(appId);
}
