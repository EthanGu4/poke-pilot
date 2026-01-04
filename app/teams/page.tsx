import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import Link from "next/link";
import { getTeamsFromUserId, getPokemonTeamFromTeamId } from "@/queries/teams";
import { getPokemon } from "@/lib/pokemon";
import TeamCard from "@/components/TeamCard/TeamCard";

export default async function TeamsPage() {
  const user = await getAuth();
  if (!user) redirect("/teams/all");

  const teams = await getTeamsFromUserId(user.userId);

  const teamsWithPokemon = await Promise.all(
    teams.map(async (team: { id: string; name: string }) => {
      const teamRows = await getPokemonTeamFromTeamId(team.id);

      const pokemon = await Promise.all(
        teamRows
          .sort((a, b) => a.slot - b.slot)
          .map(async (row) => {
            const p = await getPokemon(String(row.pokemon_id));
            return { slot: row.slot, name: p.name, sprite: p.sprites.front };
          })
      );

      return { id: team.id, name: team.name, pokemon };
    })
  );

  return (
    <main className="min-h-screen bg-orange-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="text-xs font-medium tracking-wide text-orange-700/70">
            TEAMS
          </div>

          <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Your Teams</h1>

              <div className="mt-2 text-sm text-zinc-600">
                signed in as{" "}
                <span className="font-semibold text-zinc-900">{user.username}</span>{" "}
                <span className="mx-2 text-zinc-300">·</span>
                <code className="rounded-md border border-orange-200 bg-orange-50 px-2 py-1 font-mono text-[12px]">
                  {user.userId}
                </code>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/teams/new"
                className="rounded-xl bg-orange-200 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-orange-300 active:translate-y-[1px]"
              >
                + New team
              </Link>

              <Link
                href="/teams/all"
                className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-orange-50 active:translate-y-[1px]"
              >
                All teams
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm hover:bg-orange-50 active:translate-y-[1px]"
              >
                Back
              </Link>
            </div>
          </div>
        </div>

        {teamsWithPokemon.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-orange-200 bg-white p-8 text-center shadow-sm">
            <div className="text-2xl">🧺</div>
            <div className="mt-3 text-lg font-semibold">No teams yet</div>
            <div className="mt-1 text-sm text-zinc-600">
              Make one and start building a lineup.
            </div>

            <div className="mt-5">
              <Link
                href="/teams/new"
                className="inline-flex rounded-xl bg-orange-200 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-orange-300 active:translate-y-[1px]"
              >
                Create your first team
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5">
            {teamsWithPokemon.map((team) => (
              <TeamCard key={team.id} team={team} showModify />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
