import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "./ExecutiveLayout";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ExecutiveLayout>
        {children}
      </ExecutiveLayout>
    </AuthGuard>
  );
}
