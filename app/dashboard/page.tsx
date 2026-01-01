"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MeResponse = { user: { userId: string; email: string; username: string } | null };

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse["user"]>(null);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: MeResponse) => setMe(d.user))
      .catch(() => setMe(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <div className="w-full max-w-xl px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {me ? `Welcome, ${me.username}` : "Welcome"}
        </h1>
        <p className="mt-3 text-zinc-300">
          Pick where you want to go.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/catalog")}
            className="rounded-2xl border border-zinc-800 bg-white/5 p-6 text-left hover:bg-white/10 transition"
          >
            <div className="text-lg font-semibold">Catalog</div>
            <div className="mt-1 text-sm text-zinc-300">
              Browse Pokémon and view stats/sprites.
            </div>
          </button>

          <button
            onClick={() => router.push("/teams")}
            className="rounded-2xl border border-zinc-800 bg-white/5 p-6 text-left hover:bg-white/10 transition"
          >
            <div className="text-lg font-semibold">Teams</div>
            <div className="mt-1 text-sm text-zinc-300">
              Build and manage your teams.
            </div>
          </button>
        </div>

        <p className="mt-8 text-xs text-zinc-500">
          {me ? "You’re logged in." : "You’re browsing as a guest."}
        </p>
        
        {me && (
          <button
            onClick={handleLogout}
            className="mt-6 text-sm text-zinc-400 hover:text-white transition"
          >
            Log out
          </button>
        )}
      </div>
    </main>
  );
}