"use client";

import { useEffect, useMemo, useState } from "react";
import PokemonCatalogCard from "@/components/PokemonCatalogCard/PokemonCatalogCard";
import { PokemonCatalogItem } from "@/types/schema";

export default function CatalogPage() {
  const [allPokemon, setAllPokemon] = useState<PokemonCatalogItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Number of pokemon displayed
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
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Catalog</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Showing {filtered.length} of {allPokemon.length}
        </p>
      </header>

      <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or id (e.g. pikachu or 25)"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #ddd",
            outline: "none",
          }}
        />
        <button
          onClick={() => setQuery("")}
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {loading && <p style={{ marginTop: 16 }}>Loading…</p>}

      {error && (
        <p style={{ marginTop: 16, color: "crimson" }}>
          Error: {error}
        </p>
      )}

      {!loading && !error && (
        <section
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: 12,
          }}
        >
          {filtered.map((p) => (
            <PokemonCatalogCard key={p.id} p={p} />
          ))}
        </section>
      )}
    </main>
  );
}