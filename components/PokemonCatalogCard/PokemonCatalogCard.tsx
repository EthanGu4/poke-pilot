"use client";

import Link from "next/link";
import type { PokemonCatalogItem } from "@/types/schema";

export default function PokemonCatalogCard({ p }: { p: PokemonCatalogItem }) {
  const displayName = p.name.charAt(0).toUpperCase() + p.name.slice(1);

  return (
    <Link href={`/catalog/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 12, background: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>#{p.id}</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{displayName}</div>
          </div>
          {p.sprite ? <img src={p.sprite} alt={p.name} width={72} height={72} /> : <div style={{ width: 64, height: 64 }} />}
        </div>
      </div>
    </Link>
  );
}