"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    // tiny client-side guard so you don’t spam the API with blanks
    if (!email.trim() || !username.trim() || password.length < 6) {
      setMessage("Please enter email, username, and a password (6+ chars).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          username: username.trim(),
          password,
        }),
      });

      const data = (await res.json()) as {
        user?: { username: string };
        error?: string;
      };

      if (res.ok && data.user) {
        setMessage(`Signed up as ${data.user.username}`);

        router.push("/dashboard");
        router.refresh();
      } else {
        setMessage(data.error || "Error signing up");
      }
    } catch (err) {
      setMessage((err as Error).message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white">
      <div className="w-full max-w-md px-6">
        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-zinc-300">
          Sign up to save and share Pokémon teams.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-zinc-800 bg-black/30 p-6"
        >
          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Email</label>
            <input
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Username</label>
            <input
              placeholder="JohnDoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-300">Password</label>
            <input
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-zinc-600"
            />
            <p className="text-xs text-zinc-500">Use at least 6 characters.</p>
          </div>

          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                message.toLowerCase().includes("error") ||
                message.toLowerCase().includes("please")
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full rounded-xl border border-zinc-800 bg-transparent px-4 py-3 text-zinc-200 transition hover:bg-zinc-900"
          >
            Already have an account? Log in
          </button>
        </form>
      </div>
    </main>
  );
}


// "use client";

// import { useState } from "react";

// export default function SignupPage() {
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState<string>("");

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setMessage("");

//     const res = await fetch("/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, username, password }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       setMessage(`Signed up as ${data.user.username}`);
//     } else {
//       setMessage(data.error || "Error signing up");
//     }
//   }

//   return (
//     <main style={{ padding: 24, fontFamily: "system-ui" }}>
//       <h1>Sign Up</h1>

//       <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 300 }}>
//         <input
//           placeholder="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           placeholder="username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <input
//           placeholder="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit">Create account</button>
//       </form>

//       {message && <p style={{ marginTop: 12 }}>{message}</p>}
//     </main>
//   );
// }