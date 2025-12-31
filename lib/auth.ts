import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in .env.local");
}

export type SessionPayload = {
  sub: string; 
  email: string;
  username: string;
};

export async function signSession(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as SessionPayload & { exp: number; iat: number };
}