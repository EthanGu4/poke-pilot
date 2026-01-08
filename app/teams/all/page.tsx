import { getAuth } from "@/lib/auth";
import { getPokemon } from "@/lib/pokemon";
import { getAllTeams, getPokemonTeamFromTeamId } from "@/queries/teams";
import TeamCard from "@/components/TeamCard/TeamCard";
import Link from "next/link";

export default async function TeamsPage() {
  const user = await getAuth();
  const teams = await getAllTeams();

  const teamsWithPokemon = await Promise.all(
    teams.map(async (team: { id: string; name: string }) => {
      const teamRows = await getPokemonTeamFromTeamId(team.id);

      const pokemon = await Promise.all(
        teamRows
          .sort((a, b) => a.slot - b.slot)
          .map(async (row) => {
            const p = await getPokemon(String(row.pokemon_id));
            return {
              slot: row.slot,
              name: p.name,
              sprite: p.sprites.front,
            };
          })
      );

      return { id: team.id, name: team.name, pokemon };
    })
  );

  const fullTeams = teamsWithPokemon.filter((t) => t.pokemon.length === 6);

  return (
    <main className="min-h-screen bg-orange-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-medium tracking-wide text-orange-700/70">
            COMMUNITY
          </div>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">All Teams</h1>
              <div className="mt-2 text-sm text-zinc-600">
                Showing <span className="font-semibold text-zinc-900">{fullTeams.length}</span>{" "}
                completed teams
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {user && (
                <div>
                  <Link
                    href="/teams"
                    className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-orange-50 active:translate-y-[1px]"
                  >
                    Your teams
                  </Link>
                  <Link
                    href="/teams/new"
                    className="rounded-xl bg-orange-200 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-orange-300 active:translate-y-[1px]"
                  >
                    + New team
                  </Link>
                </div>
              )}

              {!user && (
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-orange-200 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-orange-300 active:translate-y-[1px]"
                >
                  Back to dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {fullTeams.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-sm">
            <div className="text-2xl">🌿</div>
            <div className="mt-3 text-lg font-semibold">No completed teams yet</div>
            <div className="mt-1 text-sm text-zinc-600">
              Once teams hit 6 Pokémon, they’ll show up here.
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5">
            {fullTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
