import { APC_COMMAND } from "@/lib/apcCommandCenter";

export default function CommandFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 text-center text-sm text-zinc-500">
      {APC_COMMAND.companyName} © {currentYear}

      <div className="mt-2">
        APC Master Control Center
      </div>
    </footer>
  );
}
