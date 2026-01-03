import type { PokemonResponse } from "@/types/schema";
import Link from "next/link";
import SpriteCard from "@/components/SpriteCard/SpriteCard";
import AbilityCard from "@/components/AbilityCard/AbilityCard";
import MoveCard from "@/components/MoveCard/MoveCard";
import { getPokemon } from "@/lib/pokemon";

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;
  let p: PokemonResponse;

  try {
    p = await getPokemon(id);
  } catch (e) {
    const msg = (e as Error).message;

    if (msg === "NOT_FOUND") {
      return (
        <main style={{ padding: 24, fontFamily: "system-ui" }}>
          <h1>Not found</h1>
          <p>No Pokémon for “{id}”.</p>
            <Link href="/catalog" style={{ textDecoration: "underline" }}>
              ← Back to Catalog
            </Link>
        </main>
      );
    }

    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Something went wrong</h1>
        <Link href="/catalog" style={{ textDecoration: "underline" }}>
          ← Back to Catalog
        </Link>
      </main>
    );
  }

  const name = p.name.charAt(0).toUpperCase() + p.name.slice(1);
  const typeNames = p.types.map((t) => t.type.name);

  const statLabels = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
  const stats = p.stats.slice(0, 6).map((s, i) => ({
    label: statLabels[i] ?? `Stat ${i + 1}`,
    value: s.base_stat,
  }));

  const abilityNames = p.abilities.map((a) => a.ability.name);
  const moveNames = p.moves;

  return (
    <main className="min-h-screen bg-[#F7F5E8] text-[#1F2937]">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#2B2B2B] bg-white px-3 py-2 text-sm font-semibold shadow-[3px_3px_0_#2B2B2B] transition active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_#2B2B2B]"
          >
            <span aria-hidden>←</span> Back
          </Link>

          <div className="rounded-lg border-2 border-[#2B2B2B] bg-white px-3 py-2 text-xs font-semibold shadow-[3px_3px_0_#2B2B2B]">
            Pokédex Entry
          </div>
        </div>

        <div className="rounded-3xl border-4 border-[#2B2B2B] bg-[#FFFDF4] shadow-[6px_6px_0_#2B2B2B] overflow-hidden">
          <div className="flex flex-col gap-3 border-b-4 border-[#2B2B2B] bg-[#E84A4A] px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow">
                  {name}
                </h1>
                <span className="rounded-full border-2 border-white/80 bg-white/15 px-3 py-1 text-sm font-bold text-white">
                  #{p.id}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {typeNames.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border-2 border-white/70 bg-white/15 px-3 py-1 text-sm font-bold capitalize text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-sm font-semibold text-white/90">
                Height: <span className="text-white">{p.height}</span> dm • Weight:{" "}
                <span className="text-white">{p.weight}</span> hg
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border-2 border-white bg-[#7DD3FC]" />
              <div className="h-3 w-3 rounded-full border-2 border-white bg-[#FDE047]" />
              <div className="h-3 w-3 rounded-full border-2 border-white bg-[#86EFAC]" />
            </div>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <section className="rounded-xl border-2 border-[#2B2B2B] bg-white p-4 shadow-[4px_4px_0_#2B2B2B]">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-extrabold tracking-wide">
                    View
                  </h2>
                </div>

                <div className="flex flex-wrap gap-4">
                  <SpriteCard label="Front" src={p.sprites.front} />
                  <SpriteCard label="Back" src={p.sprites.back} />
                  <SpriteCard label="Front (Shiny)" src={p.sprites.frontShiny} />
                  <SpriteCard label="Back (Shiny)" src={p.sprites.backShiny} />
                </div>
              </section>

              <section className="rounded-xl border-2 border-[#2B2B2B] bg-white p-4 shadow-[4px_4px_0_#2B2B2B]">
                <h2 className="text-sm font-extrabold tracking-wide">
                  Abilities
                </h2>
                <div className="mt-3">
                  <AbilityCard items={abilityNames} />
                </div>
              </section>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <section className="rounded-xl border-2 border-[#2B2B2B] bg-white p-4 shadow-[4px_4px_0_#2B2B2B]">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold tracking-wide">
                    Base Stats
                  </h2>
                </div>

                <div className="mt-4 space-y-3">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="grid grid-cols-[96px_1fr_44px] items-center gap-3"
                    >
                      <div className="text-xs font-bold text-[#374151]">
                        {s.label.toUpperCase()}
                      </div>

                      <div className="h-3 overflow-hidden rounded-full border-2 border-[#2B2B2B] bg-[#F3F4F6]">
                        <div
                          className="h-full bg-[#111827]"
                          style={{
                            width: `${Math.min(100, (s.value / 200) * 100)}%`,
                          }}
                        />
                      </div>

                      <div className="text-right text-sm font-extrabold tabular-nums">
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border-2 border-[#2B2B2B] bg-white p-4 shadow-[4px_4px_0_#2B2B2B]">
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-sm font-extrabold tracking-wide">Moves</h2>
                  <p className="text-xs font-semibold text-[#6B7280]">
                    Showing {Math.min(20, moveNames.length)} / {moveNames.length}
                  </p>
                </div>

                <div className="mt-3">
                  <MoveCard items={moveNames.slice(0, 20)} />
                </div>
              </section>
            </div>
          </div>

          <Link
            href="/catalog/secret"
            className="block border-t-4 border-[#2B2B2B] bg-[#FFF3B0] px-6 py-4"
          >
            <p className="text-xs font-semibold text-[#374151]">Don&apos;t click here.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}

