import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default async function TeamsPage() {
  const user = await getAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Teams</h1>

      <p>
        You are logged in as <strong>{user.username}</strong>
      </p>

      <p>
        User ID: <code>{user.userId}</code>
      </p>

      <p style={{ marginTop: 16, opacity: 0.7 }}>
        If you can see this page and the user ID, auth is working correctly 🎉
      </p>
    </main>
  );
}