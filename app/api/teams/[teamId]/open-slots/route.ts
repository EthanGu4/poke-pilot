import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getOpenSlots } from "@/queries/teams";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
    const user = getAuth();
    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    const { teamId } = await params;

    const slots = await getOpenSlots(teamId);
    
    return NextResponse.json({ slots });
}