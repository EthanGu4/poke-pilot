"use client";

import Link from "next/link";
import type { PokemonCatalogItem } from "@/types/schema";

export default function PokemonCatalogCard({ p }: { p: PokemonCatalogItem }) {
  const displayName = p.name.charAt(0).toUpperCase() + p.name.slice(1);

  return (
    <Link href={`/catalog/${p.id}`} className="group block no-underline">
      <div className="relative overflow-hidden rounded-2xl border-[2px] border-black/25 bg-[#F7F5E8] p-3 shadow-[0_14px_28px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22)]">
        <div className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply [background:linear-gradient(to_bottom,rgba(0,0,0,0.10),rgba(0,0,0,0.10)_1px,transparent_1px,transparent_6px)]" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full border border-black/25 bg-white/40 px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-black/60">
              #{p.id}
            </div>

            <div className="mt-2 truncate text-[15px] font-black tracking-tight text-black/80">
              {displayName}
            </div>
          </div>

          <div className="relative flex h-[72px] w-[72px] items-center justify-center">
            <div className="absolute inset-0 rounded-2xl border-[2px] border-black/25 bg-white/35 shadow-[0_2px_0_rgba(255,255,255,0.7)_inset]" />
            {p.sprite ? (
              <img
                src={p.sprite}
                alt={p.name}
                width={72}
                height={72}
                loading="lazy"
                className="relative z-10 h-[72px] w-[72px] drop-shadow-sm transition-transform group-hover:scale-[1.05]"
              />
            ) : (
              <div className="relative z-10 h-[72px] w-[72px] rounded-xl bg-white/25" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
