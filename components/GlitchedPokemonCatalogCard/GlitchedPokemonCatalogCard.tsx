"use client";

import Link from "next/link";
import type { PokemonCatalogItem } from "@/types/schema";

export default function GlitchedPokemonCatalogCard({
  p,
  overrideName,
  glitchy = false,
}: {
  p: PokemonCatalogItem;
  overrideName?: string; 
  glitchy?: boolean; 
}) {
  const baseName = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  const displayName = overrideName ?? baseName;

  return (
    <Link href={`/catalog/${p.id}`} className="group block no-underline">
      <div
        className={[
          "relative overflow-hidden rounded-2xl border border-emerald-200/20 bg-black/55 p-3",
          "shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur",
          "transition-transform duration-150 hover:-translate-y-0.5",
          glitchy ? "card-glitch" : "",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay [background:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:100%_4px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.30)_1px,transparent_1px)] [background-size:18px_18px]" />

        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <div className="absolute left-0 top-[18%] h-[2px] w-full bg-emerald-200/15" />
          <div className="absolute left-0 top-[52%] h-[1px] w-full bg-fuchsia-200/10" />
          <div className="absolute left-0 top-[78%] h-[2px] w-full bg-emerald-200/10" />
        </div>

        <div className="relative flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-lg border border-emerald-200/20 bg-black/50 px-2 py-0.5 text-[11px] font-black tracking-wide text-emerald-50/75">
              #{p.id}
            </div>

            <div className="mt-2 truncate text-[15px] font-black tracking-tight text-emerald-50/90">
              {displayName === "???" ? (
                <span className="tracking-[0.28em]">???</span>
              ) : (
                displayName
              )}
            </div>

            <div className="mt-1 text-[10px] font-black tracking-[0.22em] text-emerald-100/50">
              {displayName === "???" ? "UNKNOWN ENTRY" : "ENTRY OK"}
            </div>
          </div>

          <div className="relative flex h-[72px] w-[72px] items-center justify-center">
            <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-emerald-400/10 blur-xl opacity-80 group-hover:bg-fuchsia-400/10" />

            <div className="absolute inset-0 rounded-2xl border border-emerald-200/20 bg-black/45 shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_2px_0_rgba(255,255,255,0.08)_inset]" />

            {p.sprite ? (
              <img
                src={p.sprite}
                alt={p.name}
                width={72}
                height={72}
                loading="lazy"
                className={[
                  "relative z-10 h-[72px] w-[72px] image-pixelated",
                  "opacity-95 drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]",
                  "transition-transform duration-150 group-hover:scale-[1.06]",
                  glitchy ? "sprite-glitch" : "",
                ].join(" ")}
              />
            ) : (
              <div className="relative z-10 h-[72px] w-[72px] rounded-xl bg-emerald-200/10" />
            )}

            <div className="pointer-events-none absolute right-2 top-2 flex gap-1 opacity-70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-300/25" />
            </div>
          </div>
        </div>
      </div>

      {/* page-local helpers (safe even if duplicated) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .image-pixelated{ image-rendering: pixelated; }
            .sprite-glitch{ animation: spriteJit 1.1s steps(2,end) infinite; }
            @keyframes spriteJit{
              0%{ transform: translate(0,0) }
              25%{ transform: translate(1px,0) }
              50%{ transform: translate(-1px,1px) }
              75%{ transform: translate(0,-1px) }
              100%{ transform: translate(0,0) }
            }
          `,
        }}
      />
    </Link>
  );
}
