import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { authQuery } from "@/queries/auth";
import { signAuthToken, setAuthCookie } from "@/lib/auth";

type LoginBody = {
  emailOrUsername?: string;
  password?: string;
};

type LoginRow = {
  id: string;
  email: string;
  username: string;
  password_hash: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const emailOrUsername = body.emailOrUsername?.trim().toLowerCase();
    const password = body.password;

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: "emailOrUsername and password are required" },
        { status: 400 }
      );
    }

    const rows = await authQuery<LoginRow>(
      `SELECT id, email, username, password_hash
       FROM public.users
       WHERE email = $1 OR LOWER(username) = $1
       LIMIT 1`,
      [emailOrUsername]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }

    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });
    
    await setAuthCookie(token);

    return NextResponse.json(
      { user: { id: user.id, email: user.email, username: user.username } },
      { status: 200 }
    );
  } catch (err) {
    console.error("LOGIN error:", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}