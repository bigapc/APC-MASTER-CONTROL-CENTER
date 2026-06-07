import { mockSession } from "@/lib/session/session";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!mockSession) {
    return (
      <div className="p-10">
        Authentication Required
      </div>
    );
  }

  return <>{children}</>;
}
