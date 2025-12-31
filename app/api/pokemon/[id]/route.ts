import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id.toLowerCase()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Pokémon not found" }, { status: 404 });
  }

  const data = await res.json();
  return NextResponse.json({
    id: data.id,
    name: data.name,
    sprites: {
      front: data.sprites.front_default,
      back: data.sprites.back_default,
      shiny: data.sprites.front_shiny,
    },
  });
}