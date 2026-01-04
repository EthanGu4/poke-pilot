import { NextResponse } from "next/server";
import { deleteTeam, updateTeamName } from "@/queries/teams";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    await deleteTeam(teamId);
    return NextResponse.json({ ok: true });

  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete";
    const status =
      msg === "Unauthorized" ? 401 :
      msg.includes("not found") ? 404 : 500;

    return new NextResponse(msg, { status });
  }
}

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const body = await _req.json();
    const name = body.name;

    await updateTeamName(name, teamId);
    return NextResponse.json({ ok: true });

  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to delete";
    const status =
      msg === "Unauthorized" ? 401 :
      msg.includes("not found") ? 404 : 500;

    return new NextResponse(msg, { status });
  }
}