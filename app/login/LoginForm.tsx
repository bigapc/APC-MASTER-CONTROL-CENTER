"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LoginState = {
  loading: boolean;
  error: string;
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") || "/dashboard", [searchParams]);

  const [email, setEmail] = useState("owner@apc.local");
  const [password, setPassword] = useState("apc_owner_2026");
  const [state, setState] = useState<LoginState>({
    loading: false,
    error: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ loading: true, error: "" });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setState({
          loading: false,
          error: payload?.message ?? "Login failed. Please try again.",
        });
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setState({
        loading: false,
        error: "Unable to complete login right now.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-bold text-zinc-200">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-bold text-zinc-200">Password</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white"
          required
        />
      </label>

      {state.error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="apc-button-primary w-full" disabled={state.loading}>
        {state.loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
