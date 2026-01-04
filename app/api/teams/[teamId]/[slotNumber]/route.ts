import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { deletePokemonFromTeam } from "@/queries/teams";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ teamId: string, slotNumber: string }> }
) {
    const user = getAuth();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { teamId, slotNumber: slotNumberStr } = await context.params;
    const slotNumber = parseInt(slotNumberStr, 10);

    const slots = await deletePokemonFromTeam(teamId, slotNumber);
    
    return NextResponse.json({ slots });
}