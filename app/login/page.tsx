"use client";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-2xl bg-white p-8">
        <h1 className="text-3xl font-black">
          APC Master Control Center
        </h1>

        <p className="mt-3 text-zinc-600">
          Saving Lives and Building Stronger Communities through Safety and Connections.
        </p>

        <form className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-red-700 p-3 text-white"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
