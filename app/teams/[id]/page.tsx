import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { getPokemon } from "@/lib/pokemon";
import { getPokemonTeamFromTeamId, getTeamFromTeamId } from "@/queries/teams";
import TeamEditor from "@/components/TeamEditor/TeamEditor";

export default async function TeamEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: teamId } = await params;

  const user = await getAuth();
  if (!user) redirect("/all");

  const selectedTeam = await getTeamFromTeamId(teamId, user.userId);
  if (!selectedTeam) redirect("/catalog");

  const teamRows = await getPokemonTeamFromTeamId(selectedTeam.id);

  const pokemon = await Promise.all(
    teamRows
      .sort((a, b) => a.slot - b.slot)
      .map(async (row) => {
        const p = await getPokemon(String(row.pokemon_id));

        return {
          slot: row.slot,
          pokemon_id: row.pokemon_id,
          name: p.name,
          sprite: p.sprites.front ?? null,
        };
      })
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-800">
          Edit Team
        </h1>

        <TeamEditor
          team={{
            id: selectedTeam.id,
            name: selectedTeam.name,
            is_public: selectedTeam.is_public,
          }}
          pokemon={pokemon}
        />
      </div>
    </main>
  );
}