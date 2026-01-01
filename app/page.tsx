"use client";
import { useRouter } from "next/navigation";
import PokeBallEasterEgg from "@/components/PokeBallEasterEgg/PokeBallEasterEgg";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white">

      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:52px_52px]" />

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="text-center max-w-md w-full">

          <div className="mx-auto mb-5">
            <PokeBallEasterEgg />
          </div>

          <h1 className="text-4xl font-bold tracking-tight mb-4">
            <span className="text-red-500">Poké</span> Pilot
          </h1>

          <p className="text-zinc-300 mb-8">
            Build, customize, and share competitive Pokémon teams.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/signup")}
              className="w-full rounded-xl bg-red-500 hover:bg-red-600 transition px-6 py-3 font-semibold shadow-lg shadow-red-500/20"
            >
              Create an account
            </button>

            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-xl border border-zinc-700 bg-white/5 hover:bg-zinc-800/60 transition px-6 py-3"
            >
              Log in
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-xl text-zinc-400 hover:text-white transition px-6 py-3"
            >
              Continue as guest →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}