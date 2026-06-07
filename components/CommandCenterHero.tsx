import { APC_COMMAND } from "@/lib/apcCommandCenter";

export default function CommandCenterHero() {
  return (
    <section className="apc-card-dark p-10">
      <div className="apc-badge">
        {APC_COMMAND.companyName}
      </div>

      <h1 className="mt-4 text-5xl font-black text-white">
        APC Master Control Center
      </h1>

      <p className="mt-5 max-w-4xl text-zinc-300">
        Unified oversight for {APC_COMMAND.applications[0]},
        {" "}
        {APC_COMMAND.applications[1]} and {APC_COMMAND.applications[2]}.
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-lg text-white">
          {APC_COMMAND.mission}
        </p>
      </div>
    </section>
  );
}
