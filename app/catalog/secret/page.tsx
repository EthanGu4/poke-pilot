"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import GlitchedPokemonCatalogCard from "@/components/GlitchedPokemonCatalogCard/GlitchedPokemonCatalogCard";
import { PokemonCatalogItem } from "@/types/schema";

type RainCol = {
  left: string;
  delay: string;
  duration: string;
  opacity: number;
  size: number;
  hue: number;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export default function GlitchDexPage() {
  const [allPokemon, setAllPokemon] = useState<PokemonCatalogItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIMIT = 1025;

  // chaos visuals
  const [cols, setCols] = useState<RainCol[]>([]);
  const [seed, setSeed] = useState(0);

  // boot + takeover overlays
  const [booting, setBooting] = useState(true);
  const [takeover, setTakeover] = useState(false);
  const takeoverTimeout = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/pokemon/list?limit=${LIMIT}&offset=0`);
        if (!res.ok) throw new Error("DEX DATA CORRUPTED");

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

  // boot splash
  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 950);
    return () => window.clearTimeout(t);
  }, []);

  // code rain + reseed loop
  useEffect(() => {
    const makeCols = () => {
      const count = 34;
      const next: RainCol[] = Array.from({ length: count }).map(() => ({
        left: `${rand(0, 100).toFixed(2)}%`,
        delay: `${rand(0, 4).toFixed(2)}s`,
        duration: `${rand(2.4, 6.8).toFixed(2)}s`,
        opacity: Number(rand(0.1, 0.4).toFixed(2)),
        size: Math.round(rand(10, 16)),
        hue: Math.round(rand(80, 170)),
      }));
      setCols(next);
    };

    makeCols();
    const interval = window.setInterval(() => {
      setSeed((s) => s + 1);
      if (Math.random() < 0.55) makeCols();
    }, 1600);

    return () => window.clearInterval(interval);
  }, []);

  const triggerTakeover = () => {
    setTakeover(true);
    if (takeoverTimeout.current) window.clearTimeout(takeoverTimeout.current);
    takeoverTimeout.current = window.setTimeout(() => {
      setTakeover(false);
    }, 700) as unknown as number;
  };

  useEffect(() => {
    return () => {
      if (takeoverTimeout.current) window.clearTimeout(takeoverTimeout.current);
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

  // prebuild “code” lines for rain
  const columnText = useMemo(() => {
    const glyphs = "01ABCDEF!?@#$%&*+-=<>[]{}\\/|~^";
    const make = () =>
      Array.from({ length: 38 })
        .map(() => glyphs[Math.floor(Math.random() * glyphs.length)])
        .join("\n");
    return Array.from({ length: 48 }).map(make);
  }, [seed]);

  // decide which cards are corrupted (only when not searching)
  const isCorrupted = (idx: number) => {
    if (query.trim()) return false;
    const r = (idx * 31 + seed * 17) % 100;
    return r < 45; // ~45%
  };

  // optional: occasionally make a card jitter
  const isGlitchy = (idx: number) => idx % 9 === 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070A0F] text-[#E7FFEE]">
      {/* BACKGROUND CHAOS */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,197,94,0.18),transparent_55%),radial-gradient(circle_at_80%_25%,rgba(16,185,129,0.12),transparent_52%),radial-gradient(circle_at_45%_85%,rgba(168,85,247,0.12),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.14] mix-blend-overlay [background:linear-gradient(rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:100%_4px]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.10] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.30)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="pointer-events-none fixed inset-0 glitch-warp" />

      {/* CODE RAIN */}
      <div className="pointer-events-none fixed inset-0 z-10">
        {cols.map((c, i) => (
          <pre
            key={`${i}-${seed}`}
            className="absolute top-[-45%] select-none whitespace-pre leading-[1.05] tracking-[0.05em]"
            style={{
              left: c.left,
              fontSize: c.size,
              opacity: c.opacity,
              filter: `hue-rotate(${c.hue}deg)`,
              animation: `rainFall ${c.duration} linear ${c.delay} infinite`,
              textShadow:
                "0 0 10px rgba(34,197,94,0.35), 0 0 24px rgba(16,185,129,0.25)",
            }}
          >
            {columnText[i % columnText.length]}
          </pre>
        ))}
      </div>

      {/* GLITCH SHARDS */}
      <div className="pointer-events-none fixed inset-0 z-10 opacity-70">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            suppressHydrationWarning
            key={`${i}-${seed}`}
            className="absolute glitch-shard"
            style={{
              left: `${rand(0, 100).toFixed(2)}%`,
              top: `${rand(0, 100).toFixed(2)}%`,
              width: `${rand(80, 260).toFixed(0)}px`,
              height: `${rand(10, 28).toFixed(0)}px`,
              animationDelay: `${rand(0, 2).toFixed(2)}s`,
              opacity: rand(0.08, 0.22),
            }}
          />
        ))}
      </div>

      {/* SYSTEM TAKEOVER OVERLAY */}
      <div
        className={[
          "pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity",
          takeover ? "opacity-100" : "",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-emerald-500/10" />
        <div className="absolute inset-0 takeover-flash" />
        <div className="absolute inset-0 opacity-[0.16] [background:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:100%_3px]" />
        <div className="absolute left-0 top-1/3 h-[2px] w-full bg-emerald-200/30" />
        <div className="absolute left-0 top-[60%] h-[1px] w-full bg-fuchsia-200/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-emerald-200/25 bg-black/65 px-5 py-4 text-center shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_16px_60px_rgba(0,0,0,0.55)]">
            <p className="text-[10px] font-black tracking-[0.35em] text-emerald-100/70">
              SYSTEM TAKEOVER
            </p>
            <p className="mt-2 text-sm font-black text-emerald-50">
              QUARANTINE PROTOCOL ACTIVE
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-100/70">
              injecting corruption…
            </p>
          </div>
        </div>
      </div>

      {/* BIOS BOOT OVERLAY */}
      {booting && (
        <div className="fixed inset-0 z-50 bg-black">
          <div className="mx-auto flex h-full max-w-4xl flex-col justify-center px-6">
            <div className="rounded-2xl border border-emerald-200/25 bg-black/60 p-5 shadow-[0_0_0_1px_rgba(16,185,129,0.18)]">
              <p className="text-xs font-black tracking-[0.35em] text-emerald-100/70">
                BIOS / ROM CHECK
              </p>
              <div className="mt-4 space-y-2 font-mono text-[12px] leading-relaxed text-emerald-50/90">
                <p>GLITCHDEX BIOS v0.0.{(seed % 9) + 1}</p>
                <p>Memory Bank: OK</p>
                <p>Dex Cache: WARN</p>
                <p>Rendering Pipeline: UNSTABLE</p>
                <p>
                  Booting…{" "}
                  <span className="inline-block w-8 text-emerald-200/80">
                    {["|", "/", "-", "\\"][seed % 4]}
                  </span>
                </p>
              </div>

              <div className="mt-5 h-2 w-full overflow-hidden rounded-full border border-emerald-200/20 bg-emerald-500/10">
                <div className="h-full w-full origin-left animate-bootbar bg-emerald-400/60" />
              </div>
            </div>

            <p className="mt-6 text-center text-xs font-black text-emerald-100/60">
              DO NOT POWER OFF
            </p>
          </div>
        </div>
      )}

      {/* UI CONTENT */}
      <div className="relative z-20 mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-3xl border border-emerald-200/20 bg-black/55 shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_30px_120px_rgba(0,0,0,0.8)] backdrop-blur">
          {/* HEADER */}
          <div className="relative border-b border-emerald-200/15 bg-gradient-to-r from-emerald-500/20 via-emerald-400/10 to-fuchsia-500/10 px-5 py-4">
            <div className="absolute inset-0 opacity-35 [background:linear-gradient(90deg,transparent,rgba(16,185,129,0.12),transparent)] animate-pulse" />
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-black tracking-[0.35em] text-emerald-100/70">
                  !! QUARANTINE BREACH !!
                </p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-emerald-50">
                  GLITCHDEX{" "}
                  <span className="inline-block align-middle rounded border border-emerald-200/25 bg-black/40 px-2 py-0.5 text-[10px] font-black text-emerald-100/80">
                    VIRUS BUILD
                  </span>
                </h1>
                <p className="mt-1 text-xs font-semibold text-emerald-100/70">
                  Showing ??? / ??? entries (unstable)
                </p>
              </div>

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() => {
                    setSeed((s) => s + 1);
                    triggerTakeover();
                  }}
                  className="rounded-xl border border-emerald-200/25 bg-emerald-500/15 px-3 py-2 text-xs font-black text-emerald-50/90
                             shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_10px_30px_rgba(0,0,0,0.35)]
                             transition hover:bg-emerald-500/22 active:translate-y-[1px]"
                  title="Inject more corruption (cosmetic)"
                >
                  INJECT
                </button>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="border-b border-emerald-200/10 bg-black/55 px-4 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-black tracking-wide text-emerald-100/70">
                MEMORY SEARCH
              </span>

              <div className="flex gap-2">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 rounded-xl opacity-70 [background:linear-gradient(90deg,rgba(16,185,129,0.22),rgba(168,85,247,0.18))] blur-[10px]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="NAME OR ID"
                    className="relative w-[220px] rounded-xl border border-emerald-200/25 bg-black/60 px-3 py-2 text-sm font-black uppercase text-emerald-50/90 outline-none
                               placeholder:text-emerald-100/40 focus:border-emerald-200/40"
                  />
                </div>

                <button
                  onClick={() => setQuery("")}
                  className="rounded-xl border border-emerald-200/25 bg-black/50 px-3 py-2 text-sm font-black text-emerald-50/80
                             transition hover:bg-black/65 active:translate-y-[1px]"
                >
                  CLR
                </button>

                <button
                  type="button"
                  onClick={triggerTakeover}
                  className="rounded-xl border border-fuchsia-200/20 bg-fuchsia-500/10 px-3 py-2 text-sm font-black text-fuchsia-50/80
                             transition hover:bg-fuchsia-500/15 active:translate-y-[1px]"
                  title="System takeover (cosmetic)"
                >
                  !!!
                </button>
              </div>
            </div>
          </div>

          {/* GRID */}
          <div className="px-4 py-4">
            {loading && (
              <div className="rounded-2xl border border-emerald-200/15 bg-emerald-500/10 px-4 py-3 text-sm font-black text-emerald-50/90">
                LOADING… DO NOT UNPLUG
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-200/20 bg-rose-500/10 px-4 py-3 text-sm font-black text-rose-50/90">
                ERROR: {error}
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-black text-emerald-100/70">
                  <span className="rounded-lg border border-emerald-200/15 bg-black/35 px-2 py-1">
                    WARNING: VISUAL ARTIFACTS DETECTED
                  </span>
                  <span className="rounded-lg border border-emerald-200/15 bg-black/35 px-2 py-1">
                    PACKET LOSS: {clamp(Math.floor((seed * 7) % 53), 7, 52)}%
                  </span>
                  <span className="rounded-lg border border-emerald-200/15 bg-black/35 px-2 py-1">
                    SEED: {seed}
                  </span>
                </div>

                <section className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
                  {filtered.map((p, idx) => (
                    <GlitchedPokemonCatalogCard
                      key={p.id}
                      p={p}
                      overrideName={isCorrupted(idx) ? "???" : undefined}
                      glitchy={isGlitchy(idx)}
                    />
                  ))}
                </section>
              </>
            )}
          </div>

          <div className="border-t border-emerald-200/10 bg-black/60 px-5 py-4">
            <p className="text-xs font-black tracking-wide text-emerald-100/70">
              if you can read this, the virus can read you.
            </p>
          </div>
        </div>
      </div>

      {/* PAGE-LOCAL CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes rainFall { 0%{transform:translateY(0)} 100%{transform:translateY(190vh)} }

            .glitch-warp{
              background:
                radial-gradient(circle at 20% 30%, rgba(16,185,129,0.12), transparent 55%),
                radial-gradient(circle at 75% 40%, rgba(168,85,247,0.10), transparent 50%);
              mix-blend-mode: overlay;
              animation: warp 1.35s steps(2,end) infinite;
              opacity: 0.60;
            }
            @keyframes warp{
              0%{filter:blur(0px);transform:translate(0,0)}
              20%{filter:blur(1px) saturate(1.2);transform:translate(1px,0)}
              40%{filter:blur(0px) saturate(1.1);transform:translate(-1px,1px)}
              60%{filter:blur(1px) saturate(1.25);transform:translate(0,-1px)}
              80%{filter:blur(0px) saturate(1.1);transform:translate(1px,1px)}
              100%{filter:blur(0px);transform:translate(0,0)}
            }

            .glitch-shard{
              background: linear-gradient(90deg, transparent, rgba(16,185,129,0.35), rgba(168,85,247,0.25), transparent);
              border-radius: 999px;
              animation: shard 1.05s steps(2,end) infinite;
            }
            @keyframes shard{
              0%{transform:translateX(0) scaleX(0.9)}
              25%{transform:translateX(12px) scaleX(1.15)}
              50%{transform:translateX(-10px) scaleX(0.95)}
              75%{transform:translateX(16px) scaleX(1.1)}
              100%{transform:translateX(0) scaleX(0.9)}
            }

            .takeover-flash{
              background:
                radial-gradient(circle at 50% 50%, rgba(16,185,129,0.18), transparent 55%),
                linear-gradient(90deg, transparent, rgba(16,185,129,0.12), transparent);
              animation: takeover 0.7s steps(2,end) 1;
            }
            @keyframes takeover{
              0%{opacity:0;filter:blur(0px);transform:translate(0,0)}
              15%{opacity:1;filter:blur(0.6px);transform:translate(1px,0)}
              35%{opacity:0.7;filter:blur(0px);transform:translate(-1px,1px)}
              55%{opacity:0.95;filter:blur(0.9px);transform:translate(0,-1px)}
              100%{opacity:0;filter:blur(0px);transform:translate(0,0)}
            }

            @keyframes bootbar{ 0%{transform:scaleX(0.05)} 55%{transform:scaleX(0.75)} 100%{transform:scaleX(1)} }
            .animate-bootbar{ animation: bootbar 0.95s ease-out forwards; }

            .image-pixelated{ image-rendering: pixelated; }

            @media (prefers-reduced-motion: reduce){
              .glitch-warp,.glitch-shard,pre[style*="rainFall"],.takeover-flash,.animate-bootbar{
                animation:none !important;
              }
            }
          `,
        }}
      />
    </main>
  );
}
