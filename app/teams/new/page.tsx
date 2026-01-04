import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import { createNewUntitledTeam } from "@/queries/teams";

export default async function NewTeamPage() {
  const user = await getAuth();
  if (!user) redirect("/teams/all");

  const newTeam = await createNewUntitledTeam(user.userId);
  redirect(`/teams/${newTeam[0].id}`);
}