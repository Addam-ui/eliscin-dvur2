import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BLOCKING_STATUSES, addDays, today, toDayString } from "@/lib/reservations";

export const dynamic = "force-dynamic";

/** Jak daleko dopředu kalendář ukazuje. */
const HORIZON_DAYS = 550;

/**
 * Veřejný přehled obsazenosti.
 *
 * Ven jdou jen termíny, žádná jména ani kontakty — kalendář na webu
 * nesmí prozradit nic o hostech.
 */
export async function GET() {
  const from = today();
  const to = addDays(from, HORIZON_DAYS);

  try {
    const rows = await prisma.reservation.findMany({
      where: {
        status: { in: [...BLOCKING_STATUSES, "pending"] },
        departure: { gt: from },
        arrival: { lt: to },
      },
      select: { arrival: true, departure: true, status: true },
      orderBy: { arrival: "asc" },
    });

    const occupied = rows
      .filter((r) => BLOCKING_STATUSES.includes(r.status as "confirmed" | "blocked"))
      .map((r) => ({ arrival: toDayString(r.arrival), departure: toDayString(r.departure) }));

    const pending = rows
      .filter((r) => r.status === "pending")
      .map((r) => ({ arrival: toDayString(r.arrival), departure: toDayString(r.departure) }));

    return NextResponse.json(
      { occupied, pending, from: toDayString(from), to: toDayString(to) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Nepodařilo se načíst obsazenost:", error);
    return NextResponse.json(
      { error: "Kalendář se nepodařilo načíst.", occupied: [], pending: [] },
      { status: 503 },
    );
  }
}
