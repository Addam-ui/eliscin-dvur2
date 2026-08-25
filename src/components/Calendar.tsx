"use client";

import { useMemo, useState } from "react";
import {
  buildMonthGrid,
  isRangeFree,
  monthLabel,
  shiftMonth,
  WEEKDAYS_CS,
} from "@/lib/calendar";
import { addDays, parseDay, toDayString, today } from "@/lib/reservations";
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

/* Barvy půlek dne. Musí sedět s tokeny v globals.css. */
const OCCUPIED = "#f7e6dc"; // clay-pale
const PENDING = "rgba(227, 200, 135, 0.4)"; // gold-light
const FREE = "transparent";

/**
 * Pozadí dne rozdělené úhlopříčkou na dopoledne a odpoledne.
 *
 * Rezervace končí ráno a začíná odpoledne, takže v den střídání je půl
 * dne obsazená a půl volná — právě to úhlopříčka ukazuje. Levý horní
 * trojúhelník je dopoledne, pravý dolní odpoledne.
 */
function dayBackground(morning: string, afternoon: string): string | undefined {
  if (morning === FREE && afternoon === FREE) return undefined;
  if (morning === afternoon) return morning;

  // Tenká linka uprostřed, ať je předěl znát i mezi světlými odstíny.
  return `linear-gradient(135deg, ${morning} 0 calc(50% - 1px), var(--color-linen) calc(50% - 1px) calc(50% + 1px), ${afternoon} calc(50% + 1px) 100%)`;
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
    const prevKey = toDayString(addDays(parseDay(key), -1));

    /* Noc začínající tímhle dnem = odpoledne obsazené.
       Noc předchozí = obsazené dopoledne, host odjíždí až ráno. */
    const nightBooked = occupiedNights.has(key);
    const morningBooked = occupiedNights.has(prevKey);
    const nightPending = pendingNights?.has(key) ?? false;
    const morningPending = pendingNights?.has(prevKey) ?? false;

    const rangeEnd = value.departure ?? previewEnd;
    const inRange =
      value.arrival && rangeEnd ? key > value.arrival && key < rangeEnd : false;

    /* Na obsazený den se dá odjet — noc před ním je totiž volná.
       Jen na něj nejde přijet, protože ta noc už patří někomu jinému. */
    const choosingDeparture = Boolean(value.arrival && !value.departure);
    const canBeDeparture =
      choosingDeparture &&
      key > value.arrival! &&
      isRangeFree(value.arrival!, key, occupiedNights);

    return {
      isPast,
      nightBooked,
      morningBooked,
      nightPending,
      morningPending,
      isArrival: key === value.arrival,
      isDeparture: key === value.departure,
      inRange,
      disabled: outside || isPast || (nightBooked && !canBeDeparture),
    };
  }

  /** Popisek, který se ukáže po najetí na den. */
  function dayHint(s: ReturnType<typeof dayState>): string {
    if (s.isArrival) return "Váš příjezd";
    if (s.isDeparture) return "Váš odjezd";
    if (s.isPast) return "Termín už proběhl";
    if (s.inRange) return "Součást pobytu";

    if (s.nightBooked && s.morningBooked) return "Obsazeno";
    if (s.morningBooked) return "Odjezd hosta";
    if (s.nightBooked) return "Příjezd hosta";

    if (s.nightPending || s.morningPending) return "Čeká na potvrzení";
    return "Volno";
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
                if (day.outside) {
                  return <div key={day.key} aria-hidden="true" />;
                }

                const state = dayState(day.key, day.outside);
                const hint = dayHint(state);
                const selected = state.isArrival || state.isDeparture;

                const classes = [
                  "group relative flex h-11 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200",
                ];

                /* Vlastní pozadí jen tam, kde se kreslí půlky dne — výběr
                   a zvýraznění rozsahu mají přednost a řeší se třídami. */
                let background: string | undefined;

                if (selected) {
                  classes.push("bg-forest text-cream shadow-soft");
                } else if (state.inRange) {
                  classes.push("bg-forest-pale text-forest");
                } else {
                  const morning = state.morningBooked
                    ? OCCUPIED
                    : state.morningPending
                      ? PENDING
                      : FREE;
                  const afternoon = state.nightBooked
                    ? OCCUPIED
                    : state.nightPending
                      ? PENDING
                      : FREE;
                  background = dayBackground(morning, afternoon);

                  classes.push(
                    state.disabled
                      ? state.isPast
                        ? "text-ink-faint/40"
                        : "text-clay/60"
                      : "text-ink hover:ring-2 hover:ring-inset hover:ring-forest-light",
                  );
                }

                if (state.disabled) classes.push("cursor-not-allowed");

                return (
                  <button
                    key={day.key}
                    type="button"
                    disabled={state.disabled}
                    onClick={() => handleSelect(day.key)}
                    onMouseEnter={() => setHovered(day.key)}
                    onFocus={() => setHovered(day.key)}
                    style={background ? { background } : undefined}
                    aria-label={`${day.dayOfMonth}. ${monthLabel(m.year, m.month)} — ${hint}`}
                    aria-pressed={selected}
                    className={classes.join(" ")}
                  >
                    <span className="relative z-10">{day.dayOfMonth}</span>

                    {day.key === todayKey && (
                      <span className="absolute bottom-1.5 z-10 h-1 w-1 rounded-full bg-clay" />
                    )}

                    {/* Popisek po najetí. `pointer-events-none`, aby nebránil
                        kliknutí na den pod ním. */}
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-forest-deep px-2.5 py-1.5 text-xs font-medium text-cream opacity-0 shadow-lift transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
                    >
                      {hint}
                    </span>
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
