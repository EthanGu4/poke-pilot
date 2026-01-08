"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!emailOrUsername.trim() || !password) {
      setMessage("Please enter your email/username and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername.trim(),
          password,
        }),
      });

      const data = (await res.json()) as {
        user?: { username: string };
        error?: string;
      };

      if (res.ok && data.user) {
        setMessage(`Logged in as ${data.user.username}`);

        router.push("/dashboard");
        router.refresh();
      } else {
        setMessage(data.error || "Error logging in");
      }
    } catch (err) {
      setMessage((err as Error).message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-zinc-300">Log in to access your account.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-zinc-800 bg-black/30 p-6"
        >
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Email or username</label>
            <input
              placeholder="placeholder"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Password</label>
            <input
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-600"
            />
          </div>

          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                message.toLowerCase().includes("error") ||
                message.toLowerCase().includes("please")
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="w-full rounded-xl border border-zinc-800 bg-transparent px-4 py-3 text-zinc-200 transition hover:bg-zinc-900"
          >
            Need an account? Sign up
          </button>
        </form>
      </div>
    </main>
  );
}
