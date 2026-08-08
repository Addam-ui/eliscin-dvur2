import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { sendGuestStatusEmail } from "@/lib/email";
import { BLOCKING_STATUSES, statusUpdateSchema, toDayString } from "@/lib/reservations";

export const dynamic = "force-dynamic";

/** Změna stavu rezervace — potvrzení, zamítnutí, vrácení do čekajících. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const parsed = statusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Neplatný stav." }, { status: 422 });
  }

  const nextStatus = parsed.data.status;

  try {
    const current = await prisma.reservation.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Rezervace nenalezena." }, { status: 404 });
    }

    // Potvrzovat se dá jen do volného termínu, jinak by vznikly dvě
    // rezervace na stejné dny.
    if (BLOCKING_STATUSES.includes(nextStatus)) {
      const conflict = await prisma.reservation.findFirst({
        where: {
          id: { not: id },
          status: { in: BLOCKING_STATUSES },
          arrival: { lt: current.departure },
          departure: { gt: current.arrival },
        },
        select: { id: true, name: true },
      });

      if (conflict) {
        return NextResponse.json(
          {
            error: `Termín se překrývá s jinou potvrzenou rezervací (${conflict.name}). Nejdřív vyřešte tu.`,
          },
          { status: 409 },
        );
      }
    }

    await prisma.reservation.update({
      where: { id },
      data: { status: nextStatus },
    });

    // Hosta e-mailem informujeme jen o rozhodnutí (potvrzeno/zamítnuto), a
    // jen u skutečných rezervací — blokace nemá kontakt na hosta.
    if ((nextStatus === "confirmed" || nextStatus === "rejected") && current.email) {
      await sendGuestStatusEmail(
        {
          name: current.name,
          email: current.email,
          phone: current.phone,
          guests: current.guests,
          message: current.message,
          arrival: toDayString(current.arrival),
          departure: toDayString(current.departure),
        },
        nextStatus,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Stav rezervace se nepodařilo změnit:", error);
    return NextResponse.json({ error: "Změnu se nepodařilo uložit." }, { status: 500 });
  }
}

/** Trvalé smazání záznamu — hlavně pro úklid blokací. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;

  try {
    await prisma.reservation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Rezervaci se nepodařilo smazat:", error);
    return NextResponse.json({ error: "Smazání se nepodařilo." }, { status: 500 });
  }
}
