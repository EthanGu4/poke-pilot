import type { PokemonResponse } from "@/types/schema";

export async function getPokemon(id: string): Promise<PokemonResponse> {
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