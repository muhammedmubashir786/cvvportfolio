"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin");
    router.refresh(); // re-runs server components so the layout sees the new session
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form
        onSubmit={handleSubmit}
        className="glass w-full max-w-sm rounded-2xl p-8"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
          <Lock className="h-5 w-5 gold-text" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-center font-display text-xl font-semibold text-ink">
          Admin Login
        </h1>

        <div className="mt-6 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-lg border border-gold/20 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-gold/20 bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-gold py-2.5 font-medium text-bg disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
