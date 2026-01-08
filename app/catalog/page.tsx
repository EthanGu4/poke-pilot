"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PokemonCatalogCard from "@/components/PokemonCatalogCard/PokemonCatalogCard";
import { PokemonCatalogItem } from "@/types/schema";

export default function CatalogPage() {
  const [allPokemon, setAllPokemon] = useState<PokemonCatalogItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 1025;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/pokemon/list?limit=${LIMIT}&offset=0`);
        if (!res.ok) throw new Error("Failed to load catalog");

        const data = (await res.json()) as PokemonCatalogItem[];
        if (!cancelled) setAllPokemon(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPokemon;

    const maybeId = Number(q);
    const byId = Number.isFinite(maybeId)
      ? allPokemon.filter((p) => p.id === maybeId)
      : [];

    const byName = allPokemon.filter((p) => p.name.includes(q));

    const map = new Map<number, PokemonCatalogItem>();
    for (const p of [...byId, ...byName]) map.set(p.id, p);
    return Array.from(map.values());
  }, [allPokemon, query]);

  return (
    <main className="min-h-screen px-4 py-7 text-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#F7F5E8]" />

      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[26px] border-[3px] border-black/25 bg-gradient-to-b from-red-500 to-red-700 shadow-[0_26px_70px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 rounded-full border-[3px] border-black/25 bg-[radial-gradient(circle_at_30%_30%,#a5f3fc,#38bdf8_55%,#1d4ed8_100%)] shadow-[0_14px_28px_rgba(56,189,248,0.35)]">
                <div className="absolute inset-[8px] rounded-full border border-white/50 bg-white/20" />
                <div className="absolute left-3 top-3 h-2 w-2 rounded-full bg-white/80" />
              </div>

              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-white drop-shadow sm:text-xl">
                  Pokédex
                </h1>
                <p className="text-xs text-white/80">
                  Showing <span className="font-semibold">{filtered.length}</span>{" "}
                  of <span className="font-semibold">{allPokemon.length}</span>
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="
                ml-auto
                inline-flex items-center gap-2
                rounded-full border-[2px] border-black/30
                bg-white/15 px-4 py-2
                text-sm font-extrabold text-white drop-shadow
                shadow-[0_6px_0_rgba(0,0,0,0.25)]
                transition-all
                hover:-translate-y-0.5 hover:bg-white/25
                active:translate-y-0 active:shadow-[0_3px_0_rgba(0,0,0,0.25)]
                sm:text-base
              "
            >
              ← Dashboard
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-200/90 shadow-[0_0_0_2px_rgba(0,0,0,0.15)]" />
              <span className="h-3 w-3 rounded-full bg-amber-200/90 shadow-[0_0_0_2px_rgba(0,0,0,0.15)]" />
              <span className="h-3 w-3 rounded-full bg-emerald-200/90 shadow-[0_0_0_2px_rgba(0,0,0,0.15)]" />
            </div>
          </div>

          <div className="bg-black/10 px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="sticky top-4 z-10 rounded-[18px] border-[3px] border-black/25 bg-slate-100/70 p-3 shadow-[0_16px_34px_rgba(0,0,0,0.18)] backdrop-blur">
              <div className="relative overflow-hidden rounded-[14px] border-[2px] border-black/25 bg-[#F7F5E8] px-3 py-3">
                <div className="pointer-events-none absolute inset-0 opacity-[0.24] mix-blend-multiply [background:linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.10)_1px,transparent_1px,transparent_6px)]" />

                <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs font-bold tracking-wide text-black/60">
                    SEARCH
                  </div>

                  <div className="flex gap-2">
                    <div className="flex flex-1 items-center gap-2 rounded-xl border-[2px] border-black/25 bg-white/40 px-3 py-2">
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="name or id"
                        className="w-full bg-transparent text-sm font-semibold text-black/75 outline-none placeholder:text-black/45"
                      />
                    </div>

                    <button
                      onClick={() => setQuery("")}
                      className="rounded-xl border-[2px] border-black/25 bg-white/35 px-4 py-2 text-sm font-extrabold text-black/70 transition hover:bg-white/50 active:scale-[0.99]"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {loading && (
              <div className="mt-4 rounded-2xl border-[2px] border-black/25 bg-white/15 px-4 py-3 text-sm font-semibold text-white/90">
                Loading…
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-2xl border-[2px] border-black/25 bg-rose-100/20 px-4 py-3 text-sm font-semibold text-white">
                Error: {error}
              </div>
            )}

            {!loading && !error && (
              <section className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                {filtered.map((p) => (
                  <PokemonCatalogCard key={p.id} p={p} />
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
