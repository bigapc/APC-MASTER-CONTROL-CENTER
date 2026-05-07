import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="max-w-xl rounded-3xl bg-white p-10 text-center shadow">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Armstrong Pack Company
        </p>

        <h1 className="mt-3 text-4xl font-bold text-slate-950">
          APC Master Control Center
        </h1>

        <p className="mt-4 text-slate-600">
          Monitor SafeConnect, CommunitySafeConnect, and CSC 2.0 from one
          private dashboard.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800"
        >
          Enter Dashboard
        </Link>
      </div>
    </div>
  );
}
