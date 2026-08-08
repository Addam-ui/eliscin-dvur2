import { SignJWT, jwtVerify } from "jose";

/**
 * Přihlášení do administrace.
 *
 * Záměrně tu není bcrypt — tenhle soubor používá i middleware, který běží
 * v Edge runtime. Ověření hesla proto zůstává v `/api/admin/login`,
 * kde běží plný Node.
 */

export const SESSION_COOKIE = "ed_admin_session";

/** Jak dlouho zůstane majitelka přihlášená. */
const SESSION_DAYS = 7;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "Chybí proměnná AUTH_SECRET (min. 16 znaků). Vygeneruj ji podle .env.example.",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Je administrace vůbec nastavená? */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.AUTH_SECRET && process.env.ADMIN_PASSWORD_HASH);
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DAYS * 24 * 60 * 60,
};
