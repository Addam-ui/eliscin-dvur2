import { addDays, toDayString } from "./reservations";

export const WEEKDAYS_CS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"] as const;

export const MONTHS_CS = [
  "leden",
  "únor",
  "březen",
  "duben",
  "květen",
  "červen",
  "červenec",
  "srpen",
  "září",
  "říjen",
  "listopad",
  "prosinec",
] as const;

export interface CalendarDay {
  /** "YYYY-MM-DD" */
  key: string;
  date: Date;
  dayOfMonth: number;
  /** Den z předchozího nebo dalšího měsíce, vyplňuje mřížku. */
  outside: boolean;
  isWeekend: boolean;
}

/**
 * Vygeneruje mřížku měsíce začínající pondělím.
 *
 * Vrací vždy celé týdny, takže mřížka nikdy „nepřeteče" — díky tomu
 * nemusí komponenta řešit prázdné buňky.
 */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const first = new Date(Date.UTC(year, month, 1));

  // getUTCDay(): 0 = neděle. Posuneme na pondělí = 0.
  const offset = (first.getUTCDay() + 6) % 7;
  const start = addDays(first, -offset);

  const last = new Date(Date.UTC(year, month + 1, 0));
  const totalDays = offset + last.getUTCDate();
  const weeks = Math.ceil(totalDays / 7);

  const days: CalendarDay[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const date = addDays(start, i);
    const weekday = (date.getUTCDay() + 6) % 7;
    days.push({
      key: toDayString(date),
      date,
      dayOfMonth: date.getUTCDate(),
      outside: date.getUTCMonth() !== month,
      isWeekend: weekday >= 5,
    });
  }

  return days;
}

export function monthLabel(year: number, month: number): string {
  return `${MONTHS_CS[month]} ${year}`;
}

/** Posun o N měsíců, bez přetečení roku. */
export function shiftMonth(year: number, month: number, delta: number) {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

/**
 * Rozloží obsazené termíny na jednotlivé noci.
 *
 * Den odjezdu se do noci nepočítá — proto je volný pro příjezd dalšího
 * hosta a v kalendáři zůstane klikatelný.
 */
export function nightsFromRanges(
  ranges: { arrival: string; departure: string }[],
): Set<string> {
  const nights = new Set<string>();
  for (const range of ranges) {
    const end = new Date(`${range.departure}T00:00:00.000Z`);
    for (
      let d = new Date(`${range.arrival}T00:00:00.000Z`);
      d < end;
      d = addDays(d, 1)
    ) {
      nights.add(toDayString(d));
    }
  }
  return nights;
}

/** Je celý úsek [od, do) volný? */
export function isRangeFree(from: string, to: string, occupied: Set<string>): boolean {
  const end = new Date(`${to}T00:00:00.000Z`);
  for (let d = new Date(`${from}T00:00:00.000Z`); d < end; d = addDays(d, 1)) {
    if (occupied.has(toDayString(d))) return false;
  }
  return true;
}
