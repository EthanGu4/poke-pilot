import { getAllTeams, getSpecificTeamFromId } from "@/queries/teams";
import { getPokemon } from "@/lib/pokemon";
import TeamCard from "@/components/TeamCard/TeamCard";

export default async function TeamsPage() {
  const teams = await getAllTeams();

  const teamsWithPokemon = await Promise.all(
    teams.map(async (team: { id: string; name: string }) => {
      const teamRows = await getSpecificTeamFromId(team.id);

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

      return {
        id: team.id,
        name: team.name,
        pokemon,
      };
    })
  );

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>All Teams</h1>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(720px, 1fr))",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {teamsWithPokemon
          .filter(team => team.pokemon.length === 6)
          .map((team) => (
            <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </main>
  );
}