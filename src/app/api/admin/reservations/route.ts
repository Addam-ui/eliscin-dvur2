import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import {
  addDays,
  blockRequestSchema,
  parseDay,
  today,
  toDayString,
} from "@/lib/reservations";

export const dynamic = "force-dynamic";

/** Kompletní seznam rezervací pro administraci. */
export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  // Výchozí pohled: co je aktuální. Archiv se dotáhne až na vyžádání.
  const includePast = searchParams.get("archiv") === "1";

  try {
    const rows = await prisma.reservation.findMany({
      where: includePast ? {} : { departure: { gte: addDays(today(), -1) } },
      orderBy: [{ arrival: "asc" }],
    });

    return NextResponse.json({
      reservations: rows.map((r) => ({
        ...r,
        arrival: toDayString(r.arrival),
        departure: toDayString(r.departure),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Nepodařilo se načíst rezervace:", error);
    return NextResponse.json({ error: "Rezervace se nepodařilo načíst." }, { status: 503 });
  }
}

/** Ruční blokace termínu — majitelka si zabere dny mimo web. */
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const parsed = blockRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Neplatné údaje." },
      { status: 422 },
    );
  }

  const arrival = parseDay(parsed.data.arrival);
  const departure = parseDay(parsed.data.departure);

  try {
    const created = await prisma.reservation.create({
      data: {
        name: "Blokace",
        email: "",
        phone: "",
        guests: 0,
        arrival,
        departure,
        status: "blocked",
        source: "admin",
        note: parsed.data.note || null,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    console.error("Blokaci se nepodařilo uložit:", error);
    return NextResponse.json({ error: "Blokaci se nepodařilo uložit." }, { status: 500 });
  }
}
