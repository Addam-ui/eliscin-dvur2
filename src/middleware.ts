import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Hlídá administraci. Nepřihlášené odešle na přihlašovací stránku,
 * přihlášené naopak z přihlašovací stránky rovnou do kalendáře.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin";

  const loggedIn = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (!loggedIn && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.set("dalsi", pathname);
    return NextResponse.redirect(url);
  }

  if (loggedIn && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/kalendar";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Chrání stránky administrace. API endpointy si autorizaci řeší samy,
  // aby mohly vracet 401 místo přesměrování.
  matcher: ["/admin", "/admin/:path*"],
};
