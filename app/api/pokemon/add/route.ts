import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { addPokemonToTeam } from "@/queries/teams";

export async function POST(req: Request) {
    const user = getAuth();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { pokemonId, teamId, slotNumber } = await req.json();
        await addPokemonToTeam(pokemonId, teamId, slotNumber);
        return NextResponse.json({ ok: true });

    } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to delete";
        const status =
            msg === "Unauthorized" ? 401 :
            msg.includes("not found") ? 404 : 500;

        return new NextResponse(msg, { status });
    }
}