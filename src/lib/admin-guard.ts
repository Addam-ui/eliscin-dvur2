import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

/** Je požadavek od přihlášené majitelky? */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Zkratka pro API endpointy: vrátí odpověď 401, pokud přihlášení chybí,
 * jinak `null` a volající pokračuje.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: "Nejste přihlášeni." }, { status: 401 });
}
