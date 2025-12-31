export type PokemonResponse = {
    id: number,
    name: string,
    height: number,
    weight: number,
    abilities: Array<{ ability: { name: string } }>,
    moves: string[]
    stats: Array<{ base_stat: number }>,
    sprites: { 
        front: string | null;
        back: string | null;
        frontShiny: string | null;
        backShiny: string | null;
    },
    types: Array<{ type: { name: string } }>
}

export type PokemonAbility = {
    ability: { name: string };
}

export type PokemonStat = {
  base_stat: number;
};

export type PokemonType = {
  type: { name: string };
};

export type PokemonSprites = {
  front_default: string | null;
  back_default: string | null;
  front_shiny: string | null;
  back_shiny: string | null;
};