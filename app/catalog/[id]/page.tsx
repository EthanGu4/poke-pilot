import type { PokemonResponse } from "@/types/schema";

async function getPokemon(id: string): Promise<PokemonResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/pokemon/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!res.ok) {
    throw new Error("FAILED");
  }

  return res.json();
}


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
          <a href="/catalog" style={{ textDecoration: "underline" }}>
            ← Back to Catalog
          </a>
        </main>
      );
    }

    return (
      <main style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Something went wrong</h1>
        <a href="/catalog" style={{ textDecoration: "underline" }}>
          ← Back to Catalog
        </a>
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
    <main style={{ padding: 48, fontFamily: "system-ui", backgroundColor: "#fca5a5"}}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>{name}</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
            #{p.id} • Types: {typeNames.join(", ")}
          </p>
          <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
            Height: {p.height} • Weight: {p.weight}
          </p>
        </div>

        <a href="/catalog" style={{ alignSelf: "start", textDecoration: "underline" }}>
          ← Back
        </a>
      </header>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>Sprites</h2>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <Sprite label="Front" src={p.sprites.front} />
          <Sprite label="Back" src={p.sprites.back} />
          <Sprite label="Front (Shiny)" src={p.sprites.frontShiny} />
          <Sprite label="Back (Shiny)" src={p.sprites.backShiny} />
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>Abilities</h2>
        <TagRow items={abilityNames} />
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>Base Stats</h2>

        <div style={{ display: "grid", gap: 8, maxWidth: 420 }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1fr 48px",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ fontSize: 14, opacity: 0.8 }}>{s.label}</div>
              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  border: "1px solid #ddd",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (s.value / 200) * 100)}%`,
                    background: "#111",
                  }}
                />
              </div>
              <div style={{ fontVariantNumeric: "tabular-nums", textAlign: "right" }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
        
      </section>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>Moves</h2>

        <p style={{ marginBottom: 24, opacity: 0.75 }}>
          Showing {Math.min(20, moveNames.length)} of {moveNames.length}
        </p>

        <TagRow items={moveNames.slice(0, 20)} />
      </section>
    </main>
  );
}

function Sprite({ label, src }: { label: string; src: string | null }) {
  return (
    <div
      style={{
        width: 160,
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 12,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 8 }}>{label}</div>
      {src ? (
        <img src={src} alt={label} width={120} height={120} />
      ) : (
        <div
          style={{
            width: 120,
            height: 120,
            margin: "0 auto",
            display: "grid",
            placeItems: "center",
            border: "1px dashed #ccc",
            borderRadius: 12,
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          No sprite
        </div>
      )}
    </div>
  );
}

function TagRow({ items }: { items: readonly string[] }) {
  if (items.length === 0) {
    return <p style={{ opacity: 0.6 }}>None</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((name) => (
        <span
          key={name}
          style={{
            border: "1px solid #ddd",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 13,
            background: "#fafafa",
            textTransform: "capitalize",
          }}
        >
          {name}
        </span>
      ))}
    </div>
  );
}