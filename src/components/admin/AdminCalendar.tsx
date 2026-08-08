"use client";

import { useMemo, useState } from "react";
import { buildMonthGrid, monthLabel, shiftMonth, WEEKDAYS_CS } from "@/lib/calendar";
import { addDays, toDayString, today } from "@/lib/reservations";
import { Icon } from "@/components/Icons";
import type { AdminReservation } from "./types";

interface AdminCalendarProps {
  reservations: AdminReservation[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

/** Barvy jednotlivých stavů v mřížce. */
const dayStyles: Record<string, string> = {
  confirmed: "bg-forest text-cream hover:bg-forest-deep",
  pending: "bg-gold/30 text-ink hover:bg-gold/45",
  blocked: "bg-ink/15 text-ink-soft hover:bg-ink/25",
};

export function AdminCalendar({ reservations, selectedId, onSelect }: AdminCalendarProps) {
  const start = today();
  const [view, setView] = useState({
    year: start.getUTCFullYear(),
    month: start.getUTCMonth(),
  });

  const todayKey = toDayString(start);

  /**
   * Mapa den → rezervace, která ten den obsazuje.
   *
   * Zamítnuté ignorujeme a den odjezdu nezapočítáváme, takže se v mřížce
   * nepřekrývá konec jednoho pobytu se začátkem dalšího.
   */
  const dayMap = useMemo(() => {
    const map = new Map<string, AdminReservation>();

    for (const r of reservations) {
      if (r.status === "rejected") continue;

      const end = new Date(`${r.departure}T00:00:00.000Z`);
      for (
        let d = new Date(`${r.arrival}T00:00:00.000Z`);
        d < end;
        d = addDays(d, 1)
      ) {
        map.set(toDayString(d), r);
      }
    }

    return map;
  }, [reservations]);

  const grid = buildMonthGrid(view.year, view.month);

  return (
    <div className="rounded-3xl border border-linen bg-cream p-5 shadow-soft sm:p-7">
      {/* Hlavička s měsícem */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl capitalize text-ink">
          {monthLabel(view.year, view.month)}
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setView({ year: start.getUTCFullYear(), month: start.getUTCMonth() })
            }
            className="rounded-full border border-linen px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-forest hover:text-forest"
          >
            Dnes
          </button>
          <button
            type="button"
            onClick={() => setView(shiftMonth(view.year, view.month, -1))}
            aria-label="Předchozí měsíc"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-linen text-ink transition-colors hover:border-forest hover:text-forest"
          >
            <Icon name="chevronLeft" size={18} />
          </button>
          <button
            type="button"
            onClick={() => setView(shiftMonth(view.year, view.month, 1))}
            aria-label="Další měsíc"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-linen text-ink transition-colors hover:border-forest hover:text-forest"
          >
            <Icon name="chevronRight" size={18} />
          </button>
        </div>
      </div>

      {/* Dny v týdnu */}
      <div className="mb-1.5 grid grid-cols-7 gap-1.5">
        {WEEKDAYS_CS.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-semibold uppercase tracking-wider text-ink-faint"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Mřížka */}
      <div className="grid grid-cols-7 gap-1.5">
        {grid.map((day) => {
          if (day.outside) return <div key={day.key} aria-hidden="true" />;

          const booking = dayMap.get(day.key);
          const isArrivalDay = booking?.arrival === day.key;
          const isSelected = booking !== undefined && booking.id === selectedId;

          const base =
            "relative flex min-h-[4.5rem] flex-col items-start rounded-xl p-2 text-left transition-all duration-200 sm:min-h-[5.5rem]";

          const tone = booking
            ? (dayStyles[booking.status] ?? "bg-sand text-ink")
            : "bg-sand/70 text-ink hover:bg-sand";

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onSelect(booking && !isSelected ? booking.id : null)}
              disabled={!booking}
              aria-label={
                booking
                  ? `${day.dayOfMonth}. ${monthLabel(view.year, view.month)} — ${
                      booking.status === "blocked" ? "blokace" : booking.name
                    }`
                  : `${day.dayOfMonth}. ${monthLabel(view.year, view.month)} — volno`
              }
              aria-pressed={isSelected}
              className={`${base} ${tone} ${
                isSelected ? "ring-2 ring-clay ring-offset-2 ring-offset-cream" : ""
              } ${booking ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                  day.key === todayKey
                    ? booking?.status === "confirmed"
                      ? "bg-cream text-forest"
                      : "bg-clay text-cream"
                    : ""
                }`}
              >
                {day.dayOfMonth}
              </span>

              {isArrivalDay && booking && (
                <span className="mt-1 line-clamp-2 w-full break-words text-[0.68rem] font-medium leading-tight">
                  {booking.status === "blocked" ? "Blokace" : booking.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-linen pt-5 text-xs text-ink-soft">
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-forest" /> Potvrzeno
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-gold/40" /> Čeká na vyřízení
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-ink/15" /> Blokace
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-sand/70 ring-1 ring-inset ring-linen" /> Volno
        </span>
      </div>
    </div>
  );
}
