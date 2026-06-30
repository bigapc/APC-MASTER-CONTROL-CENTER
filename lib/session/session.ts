import { APP_REGISTRY } from "@/lib/appRegistry";
import type { CurrentUser } from "@/lib/auth";

export interface APCSession {
  userId: string;
  email: string;
  role: string;
  appAccess: string[];
}

export function createSessionProfile(user: CurrentUser): APCSession {
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    appAccess:
      user.role === "super_admin"
        ? APP_REGISTRY.map((app) => app.id)
        : [],
  };
}
