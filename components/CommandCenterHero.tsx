import { APC_COMMAND } from "@/lib/apcCommandCenter";

export default function CommandCenterHero() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
      <div className="apc-badge">
        {APC_COMMAND.companyName}
      </div>

      <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
        APC Master Control Center
      </h2>

      <p className="mt-5 max-w-4xl text-base leading-7 text-zinc-300 md:text-lg">
        Unified oversight for {APC_COMMAND.applications[0]},
        {" "}
        {APC_COMMAND.applications[1]} and {APC_COMMAND.applications[2]}.
      </p>

      <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-6">
        <p className="text-lg leading-8 text-white md:text-xl">
          {APC_COMMAND.mission}
        </p>
      </div>
    </section>
  );
}
