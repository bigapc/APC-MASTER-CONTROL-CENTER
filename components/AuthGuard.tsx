import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, getUserFromSessionValue } from "@/lib/auth";

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  const user = await getUserFromSessionValue(sessionValue);

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
