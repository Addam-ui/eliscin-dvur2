"use client";

import { useMemo, useState } from "react";
import {
  buildMonthGrid,
  isRangeFree,
  monthLabel,
  shiftMonth,
  WEEKDAYS_CS,
} from "@/lib/calendar";
import { toDayString, today } from "@/lib/reservations";
import { Icon } from "./Icons";

export interface DateRange {
  arrival: string | null;
  departure: string | null;
}

interface CalendarProps {
  /** Noci, které jsou definitivně obsazené. */
  occupiedNights: Set<string>;
  /** Noci s nevyřízenou poptávkou — jen vizuální upozornění. */
  pendingNights?: Set<string>;
  value: DateRange;
  onChange: (range: DateRange) => void;
  /** Kolik měsíců vedle sebe na širokých obrazovkách. */
  months?: 1 | 2;
}

export function Calendar({
  occupiedNights,
  pendingNights,
  value,
  onChange,
  months = 2,
}: CalendarProps) {
  const start = today();
  const [view, setView] = useState({
    year: start.getUTCFullYear(),
    month: start.getUTCMonth(),
  });
  const [hovered, setHovered] = useState<string | null>(null);

  const todayKey = toDayString(start);

  /* Nelistujeme do minulosti — starší měsíce nemají pro rezervaci smysl. */
  const atStart =
    view.year === start.getUTCFullYear() && view.month === start.getUTCMonth();

  const visibleMonths = useMemo(() => {
    return Array.from({ length: months }, (_, i) => shiftMonth(view.year, view.month, i));
  }, [view, months]);

  /**
   * Klik na den: první výběr nastaví příjezd, druhý odjezd.
   * Klik před příjezd nebo přes obsazený termín začíná výběr znovu.
   */
  function handleSelect(key: string) {
    const { arrival, departure } = value;

    if (!arrival || departure) {
      onChange({ arrival: key, departure: null });
      return;
    }

    if (key <= arrival) {
      onChange({ arrival: key, departure: null });
      return;
    }

    if (!isRangeFree(arrival, key, occupiedNights)) {
      // V cestě je obsazený termín — bereme klik jako nový začátek výběru.
      onChange({ arrival: key, departure: null });
      return;
    }

    onChange({ arrival, departure: key });
  }

  /** Náhled rozsahu, který se vybere, když uživatel klikne na den pod myší. */
  const previewEnd =
    value.arrival && !value.departure && hovered && hovered > value.arrival ? hovered : null;

  function dayState(key: string, outside: boolean) {
    const isPast = key < todayKey;
    const isOccupied = occupiedNights.has(key);
    const isPending = pendingNights?.has(key) ?? false;

    const rangeEnd = value.departure ?? previewEnd;
    const inRange =
      value.arrival && rangeEnd ? key > value.arrival && key < rangeEnd : false;

    return {
      isPast,
      isOccupied,
      isPending,
      isArrival: key === value.arrival,
      isDeparture: key === value.departure,
      inRange,
      // Den odjezdu předchozí rezervace zůstává volný pro nový příjezd.
      disabled: outside || isPast || isOccupied,
    };
  }

  return (
    <div>
      {/* Ovládání měsíců */}
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(shiftMonth(view.year, view.month, -1))}
          disabled={atStart}
          aria-label="Předchozí měsíc"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-linen text-ink transition-colors hover:border-forest hover:text-forest disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-linen disabled:hover:text-ink"
        >
          <Icon name="chevronLeft" size={18} />
        </button>

        <div className="flex flex-1 justify-around px-2">
          {visibleMonths.map((m, i) => (
            <span
              key={`${m.year}-${m.month}`}
              className={`font-display text-lg capitalize text-ink ${i > 0 ? "hidden lg:block" : ""}`}
            >
              {monthLabel(m.year, m.month)}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setView(shiftMonth(view.year, view.month, 1))}
          aria-label="Další měsíc"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-linen text-ink transition-colors hover:border-forest hover:text-forest"
        >
          <Icon name="chevronRight" size={18} />
        </button>
      </div>

      {/* Mřížky měsíců */}
      <div className={months === 2 ? "grid gap-8 lg:grid-cols-2" : ""}>
        {visibleMonths.map((m, index) => (
          <div key={`${m.year}-${m.month}`} className={index > 0 ? "hidden lg:block" : ""}>
            <div className="mb-2 grid grid-cols-7 gap-1">
              {WEEKDAYS_CS.map((day) => (
                <div
                  key={day}
                  className="py-1 text-center text-xs font-semibold uppercase tracking-wider text-ink-faint"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1" onMouseLeave={() => setHovered(null)}>
              {buildMonthGrid(m.year, m.month).map((day) => {
                const state = dayState(day.key, day.outside);

                if (day.outside) {
                  return <div key={day.key} aria-hidden="true" />;
                }

                const classes = [
                  "relative flex h-11 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
                ];

                if (state.disabled) {
                  classes.push("cursor-not-allowed");
                  classes.push(
                    state.isOccupied
                      ? "bg-clay-pale text-clay/50 line-through"
                      : "text-ink-faint/40",
                  );
                } else if (state.isArrival || state.isDeparture) {
                  classes.push("bg-forest text-cream shadow-soft");
                } else if (state.inRange) {
                  classes.push("bg-forest-pale text-forest");
                } else if (state.isPending) {
                  classes.push(
                    "bg-gold-light/25 text-ink hover:bg-forest-pale hover:text-forest",
                  );
                } else {
                  classes.push("text-ink hover:bg-forest-pale hover:text-forest");
                }

                return (
                  <button
                    key={day.key}
                    type="button"
                    disabled={state.disabled}
                    onClick={() => handleSelect(day.key)}
                    onMouseEnter={() => setHovered(day.key)}
                    onFocus={() => setHovered(day.key)}
                    aria-label={`${day.dayOfMonth}. ${monthLabel(m.year, m.month)}${
                      state.isOccupied ? " — obsazeno" : ""
                    }`}
                    aria-pressed={state.isArrival || state.isDeparture}
                    className={classes.join(" ")}
                  >
                    {day.dayOfMonth}

                    {day.key === todayKey && (
                      <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-clay" />
                    )}
                    {state.isPending && !state.isOccupied && (
                      <span
                        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold"
                        title="Čeká na potvrzení"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 border-t border-linen pt-5 text-xs text-ink-soft">
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-forest" /> Váš výběr
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-clay-pale ring-1 ring-inset ring-clay/25" />{" "}
          Obsazeno
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded bg-gold-light/40" /> Čeká na potvrzení
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-clay" /> Dnes
        </span>
      </div>
    </div>
  );
}
