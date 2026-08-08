import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";
import { getAdminPasswordHash } from "@/lib/admin-password";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Jednoduchá brzda proti hádání hesla.
 *
 * Drží se v paměti instance — na serverless to není neprůstřelné, ale
 * běžný slovníkový útok to zastaví. Na tenhle web to stačí.
 */
const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000;

function throttle(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.until) {
    attempts.set(key, { count: 1, until: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const hash = getAdminPasswordHash();

  if (!hash) {
    return NextResponse.json(
      {
        error:
          "Administrace zatím není nastavená. Chybí nebo je poškozený ADMIN_PASSWORD_HASH — postup je v README.",
      },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "neznama";

  if (throttle(ip)) {
    return NextResponse.json(
      { error: "Příliš mnoho pokusů. Zkuste to prosím za deset minut." },
      { status: 429 },
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const valid = password.length > 0 && (await bcrypt.compare(password, hash));

  if (!valid) {
    return NextResponse.json({ error: "Nesprávné heslo." }, { status: 401 });
  }

  attempts.delete(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions);
  return response;
}
