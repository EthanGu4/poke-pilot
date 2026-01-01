"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <div className="text-center max-w-md px-6">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="text-red-600">Poké</span> Pilot
        </h1>

        <p className="text-zinc-300 mb-8">
          Build, customize, and share competitive Pokémon teams.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/signup")}
            className="w-full rounded-xl bg-red-500 hover:bg-red-600 transition px-6 py-3 font-semibold"
          >
            Create an account
          </button>

          <button
            onClick={() => router.push("/login")}
            className="w-full rounded-xl border border-zinc-700 hover:bg-zinc-800 transition px-6 py-3"
          >
            Log in
          </button>

          <button
            onClick={() => router.push("/catalog")}
            className="w-full rounded-xl text-zinc-400 hover:text-white transition px-6 py-3"
          >
            Continue as guest →
          </button>
        </div>
      </div>
    </div>
  );
}