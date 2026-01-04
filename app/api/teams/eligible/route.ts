import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getEligibleTeamsFromUserId } from "@/queries/teams";

export async function GET() {
  const user = await getAuth();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const teams = await getEligibleTeamsFromUserId(user.userId);

  return NextResponse.json({ teams });
}