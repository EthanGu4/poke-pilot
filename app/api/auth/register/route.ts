import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { query } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    const existing = await query<{ id: string }>(
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

    const rows = await query<UserRow>(
      `INSERT INTO public.users (email, username, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, username, passwordHash]
    );

    return NextResponse.json({ user: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("REGISTER error:", err);
    return NextResponse.json({ error: "internal server error" }, { status: 500 });
  }
}