import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { APP_CONFIG } from "@/lib/appConfig";

export default function HomePage() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="apc-card-dark p-10">
          <div className="apc-badge">Armstrong Pack Company</div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white">
            APC Master Control Center
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            A private executive command environment built to monitor SafeConnect,
            CommunitySafeConnect, and CommunitySafeConnect-CSC-2.0 from one
            secure place.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
              Mission Statement
            </p>
            <p className="mt-3 text-xl font-bold leading-8 text-white">
              “{APP_CONFIG.mission}”
            </p>
          </div>

          <Link href="/dashboard" className="apc-button-primary mt-8">
            Enter Control Center <ArrowRight size={18} />
          </Link>
        </section>

        <section className="apc-card p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#c1121f] text-white">
            <ShieldCheck size={30} />
          </div>

          <h2 className="mt-6 text-3xl font-black text-zinc-950">
            Built for secure company oversight.
          </h2>

          <p className="mt-4 leading-7 text-zinc-600">
            Monitor apps, operations, alerts, dispatch, staff performance,
            analytics, backend status, and daily readiness from one APC command
            center.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Unified app monitoring",
              "Control Hub links for all three apps",
              "Dispatcher and operations view",
              "Backend identity verification for Darrell Armstrong",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-zinc-50 p-4 font-bold">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
