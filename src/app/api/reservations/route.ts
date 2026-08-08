import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { sendOwnerNewRequestEmail } from "@/lib/email";
import {
  BLOCKING_STATUSES,
  parseDay,
  reservationRequestSchema,
} from "@/lib/reservations";

export const dynamic = "force-dynamic";

/** Přijme nezávaznou poptávku z webu a uloží ji jako čekající rezervaci. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const parsed = reservationRequestSchema.safeParse(body);
  if (!parsed.success) {
    // Chyby posíláme po polích, aby je formulář uměl zobrazit u inputů.
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return NextResponse.json(
      { error: "Zkontrolujte prosím vyplněné údaje.", fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const arrival = parseDay(data.arrival);
  const departure = parseDay(data.departure);

  try {
    // Termín musí být volný. Kontrolujeme až tady, ne ve formuláři —
    // mezi načtením kalendáře a odesláním mohl někdo termín zabrat.
    const conflict = await prisma.reservation.findFirst({
      where: {
        status: { in: BLOCKING_STATUSES },
        arrival: { lt: departure },
        departure: { gt: arrival },
      },
      select: { id: true },
    });

    if (conflict) {
      return NextResponse.json(
        {
          error:
            "Tenhle termín už je bohužel obsazený. Zkuste prosím vybrat jiný — kalendář jsme právě obnovili.",
          conflict: true,
        },
        { status: 409 },
      );
    }

    const created = await prisma.reservation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        guests: data.guests,
        message: data.message || null,
        arrival,
        departure,
        status: "pending",
        source: "web",
        consentedAt: new Date(),
      },
      select: { id: true },
    });

    // Poptávka je uložená bez ohledu na to, jestli e-mail dorazí — chybu
    // funkce jen zaloguje, nikdy nepadá.
    await sendOwnerNewRequestEmail(data);

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    console.error("Rezervaci se nepodařilo uložit:", error);
    return NextResponse.json(
      { error: "Rezervaci se nepodařilo uložit. Zkuste to prosím znovu, nebo nám zavolejte." },
      { status: 500 },
    );
  }
}
