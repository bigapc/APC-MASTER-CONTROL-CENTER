import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { APP_CONFIG } from "@/lib/appConfig";
import { isPreviewBypassEnabled } from "@/lib/security/previewMode";

export default function HomePage() {
  const previewBypass = isPreviewBypassEnabled();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-8 text-white md:px-8 md:py-12">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur md:p-12">
          <div className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-red-200">
            Armstrong Pack Company
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
            APC Master Control Center
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300 md:text-xl">
            A private executive command environment built to monitor SafeConnect,
            CommunitySafeConnect, CommunitySafeConnect-CSC-2.0, and CSC NextGen from one secure place.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["Secure access", "Signed APC sessions and protected routes"],
              ["Live oversight", "Operations, alerts, dispatch, and health"],
              ["Unified control", "One cockpit for all connected platforms"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-red-200">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/25 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
              Mission Statement
            </p>
            <p className="mt-3 text-xl font-bold leading-8 text-white">
              “{APP_CONFIG.mission}”
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href={previewBypass ? "/dashboard" : "/login"} className="apc-button-primary">
              {previewBypass ? "Open Dashboard" : "Enter Control Center"} <ArrowRight size={18} />
            </Link>

            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-zinc-200">
              <ShieldCheck size={18} className="text-red-300" />
              Approved for executive oversight
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-black/25 p-6 text-sm leading-7 text-zinc-300">
            <p className="font-semibold uppercase tracking-[0.2em] text-red-200">
              Powered by Armstrong Pack Company
            </p>
            <p className="mt-3">
              Copyright {currentYear} Armstrong Pack Company. All rights reserved.
            </p>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/30 backdrop-blur">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#c1121f] text-white shadow-lg shadow-red-950/40">
              <ShieldCheck size={30} />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-white">
              Built for secure company oversight.
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-zinc-300">
              Monitor apps, operations, alerts, dispatch, staff performance, analytics,
              backend status, and daily readiness from one APC command center.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Unified app monitoring",
              "Control Hub links for all three apps",
              "Dispatcher and operations view",
              "Backend identity verification for Darrell Armstrong",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm font-semibold text-zinc-100">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
