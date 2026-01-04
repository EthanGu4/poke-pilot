import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { deletePokemonFromTeam } from "@/queries/teams";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ teamId: string, slotNumber: number }> }
) {
    const user = getAuth();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { teamId, slotNumber } = await params;

    const slots = await deletePokemonFromTeam(teamId, slotNumber);
    
    return NextResponse.json({ slots });
}