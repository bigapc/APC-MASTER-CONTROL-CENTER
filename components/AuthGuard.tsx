import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, getUserFromSessionValue } from "@/lib/auth";
import { isPreviewBypassEnabled } from "@/lib/security/previewMode";

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isPreviewBypassEnabled()) {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionValue(sessionValue);

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
