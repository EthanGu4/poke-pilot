import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "auth";

type AuthPayload = { userId: string; email: string, username: string };

export function signAuthToken(payload: AuthPayload) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export async function setAuthCookie(token: string) {

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, 
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

export async function getAuth(): Promise<AuthPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  } catch {
    return null;
  }
}

export function requireAuth() {
  const auth = getAuth();
  if (!auth) throw new Error("UNAUTHORIZED");
  return auth;
}
