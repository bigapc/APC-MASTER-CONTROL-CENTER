import CommandSidebar from "@/components/CommandSidebar";

export default function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white">
      <CommandSidebar />

      <main className="flex-1 px-4 py-6 md:px-8 md:py-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
