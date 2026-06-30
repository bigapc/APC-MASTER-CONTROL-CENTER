"use client";

import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4 py-12 text-white">
      <div className="grid w-full max-w-5xl gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6 p-8 md:p-12">
          <div className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-red-200">
            APC Master Control Center
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Operational access for dispatch, oversight, and field coordination.
            </h1>

            <p className="max-w-xl text-base leading-7 text-zinc-300 md:text-lg">
              Use the APC demo credentials to enter the command center, monitor live systems, and move into the dashboard.
            </p>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-200 sm:grid-cols-2">
            <div>
              <div className="text-zinc-400">Demo admin</div>
              <div className="mt-1 font-semibold">owner@apc.local</div>
              <div className="text-zinc-400">apc_owner_2026</div>
            </div>

            <div>
              <div className="text-zinc-400">Dispatcher</div>
              <div className="mt-1 font-semibold">dispatcher@apc.local</div>
              <div className="text-zinc-400">dispatch_2026</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/30 p-8 md:border-l md:border-t-0 md:p-12">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-6 shadow-lg shadow-black/20">
            <h2 className="text-2xl font-bold text-white">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Authenticate with a demo APC account to continue.
            </p>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
