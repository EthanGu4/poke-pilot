import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { authQuery } from "@/queries/auth";
import { signAuthToken, setAuthCookie } from "@/lib/auth";

type RegisterBody = {
  email?: string;
  username?: string;
  password?: string;
};

type UserRow = { id: string; email: string; username: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;
    const email = body.email?.trim().toLowerCase();
    const username = body.username?.trim();
    const password = body.password;

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "email, username, password are required" },
        { status: 400 }
      );
    }

    const existing = await authQuery<{ id: string }>(
      `SELECT id FROM public.users WHERE email = $1 OR username = $2 LIMIT 1`,
      [email, username]
    );
    if (existing.length) {
      return NextResponse.json(
        { error: "email or username already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const rows = await authQuery<UserRow>(
      `INSERT INTO public.users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, passwordHash]
    );

    const user = rows[0];

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    await setAuthCookie(token);

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    console.error("REGISTER error:", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}