import { APC_COMMAND } from "@/lib/apcCommandCenter";

export default function CommandFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/20 px-6 py-8 text-center text-sm text-zinc-400">
      <div className="mx-auto max-w-3xl">
        <div className="text-lg font-black tracking-tight text-white">APC</div>
        <div className="mt-1 font-bold text-white">{APC_COMMAND.companyName}</div>
        <p className="mt-2 text-sm text-zinc-300">{APC_COMMAND.mission}</p>
        <div className="mt-4 text-xs uppercase tracking-[0.16em] text-zinc-500">
          APC Master Control Center
        </div>
        <div className="mt-2 text-xs text-zinc-500">
          © {currentYear} {APC_COMMAND.companyName}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
