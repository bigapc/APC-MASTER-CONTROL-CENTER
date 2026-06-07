import CommandSidebar from "@/components/CommandSidebar";

export default function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <CommandSidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
