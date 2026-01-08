import { NextResponse } from "next/server";
import type { PokemonCatalogItem } from "@/types/schema";

type PokeListResult = { name: string; url: string };
type PokeListResponse = { results: PokeListResult[] };

function idFromPokemonUrl(url: string) {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") ?? "151");
  const offset = Number(searchParams.get("offset") ?? "0");

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
    { cache: "force-cache" }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch pokemon list" },
      { status: 500 }
    );
  }

  const data = (await res.json()) as PokeListResponse;

  const items = data.results
    .map((p) => {
      const id = idFromPokemonUrl(p.url);
      
      if (!id) return null;

      const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

      return { id, name: p.name, sprite };
    })
    .filter((x): x is PokemonCatalogItem => x !== null);

  return NextResponse.json(items);
}