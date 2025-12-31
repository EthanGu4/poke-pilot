"use client";

import { useEffect, useState } from "react";

type SpriteResponse = {
  id: number;
  name: string;
  sprites: {
    front: string | null;
    back: string | null;
    shiny: string | null;
  };
};

export default function SpritesPage() {
  const [pokemon, setPokemon] = useState<SpriteResponse | null>(null);

  useEffect(() => {
    fetch("/api/pokemon/bulbasaur")
      .then((res) => res.json())
      .then(setPokemon);
  }, []);

  if (!pokemon) return <p>Loading...</p>;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ textTransform: "capitalize" }}>{pokemon.name}</h1>

      <div style={{ display: "flex", gap: 24 }}>
        {pokemon.sprites.front && (
          <img src={pokemon.sprites.front} alt="front sprite" />
        )}
        {pokemon.sprites.back && (
          <img src={pokemon.sprites.back} alt="back sprite" />
        )}
        {pokemon.sprites.shiny && (
          <img src={pokemon.sprites.shiny} alt="shiny sprite" />
        )}
      </div>
    </main>
  );
}