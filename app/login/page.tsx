"use client";

import { useState } from "react";

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOrUsername, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`Logged in as ${data.user.username}`);
    } else {
      setMessage(data.error || "Error logging in");
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Log In</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 300 }}>
        <input
          placeholder="email or username"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Log in</button>
      </form>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </main>
  );
}