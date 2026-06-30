import { ReactNode } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE, getUserFromSessionValue } from "@/lib/auth";
import type { UserRole } from "@/lib/roles";
import { isPreviewBypassEnabled } from "@/lib/security/previewMode";

interface Props {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export default async function RoleGuard({
  allowedRoles,
  children,
}: Props) {
  if (isPreviewBypassEnabled()) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionValue(sessionValue);
  const allowed = user ? allowedRoles.includes(user.role) : false;

  if (!allowed) {
    return (
      <div className="apc-card p-6">
        Access Denied
      </div>
    );
  }

  return <>{children}</>;
}
