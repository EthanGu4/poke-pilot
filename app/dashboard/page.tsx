"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MeResponse = { user: { userId: string; email: string; username: string } | null };

const backgrounds = [
  "/backgrounds/pixel-bg.avif",
  "/backgrounds/pixel-bg1.webp", 
  "/backgrounds/pixel-bg2.gif",
  "/backgrounds/pixel-bg3.gif",
  "/backgrounds/pixel-bg4.gif",
  "/backgrounds/pixel-bg5.jpg",
  "/backgrounds/pixel-bg6.jpg",
  "/backgrounds/pixel-bg7.jpg",
  "/backgrounds/pixel-bg8.jpg",
  "/backgrounds/pixel-bg9.jpg",
  "/backgrounds/pixel-bg10.jpg",
  "/backgrounds/pixel-bg11.jpg",
  "/backgrounds/pixel-bg12.png",
  "/backgrounds/pixel-bg13.avif",
  "/backgrounds/pixel-bg14.webp",
  "/backgrounds/pixel-bg15.jpg",
  "/backgrounds/pixel-bg16.jpg",
  "/backgrounds/pixel-bg17.jpg",
  "/backgrounds/pixel-bg18.jpg",
]

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse["user"]>(null);
  const [bgImage] = useState(() => {
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  });

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
    <main className="min-h-screen flex items-center justify-center text-white">
      <div
        suppressHydrationWarning
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `url('${bgImage}')`
        }}
      />

      <div className="fixed inset-0 -z-10 bg-black/50 backdrop-blur-xxs" />
      
      <div className="w-full max-w-xl px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {me ? `Welcome, ${me.username}` : "Welcome"}
        </h1>

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
            onClick={() => {
              if (me) {
                router.push("/teams");
              } else {
                router.push("/teams/all");
              }
            }}
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