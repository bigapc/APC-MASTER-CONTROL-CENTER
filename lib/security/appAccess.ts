import { mockSession } from "@/lib/session/session";

export function hasAppAccess(
  appId: string
) {
  return mockSession.appAccess.includes(
    appId
  );
}
