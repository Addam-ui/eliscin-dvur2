import { z } from "zod";
import { reservation as reservationConfig } from "./site";

/* ------------------------------------------------------------------ */
/* Stavy                                                               */
/* ------------------------------------------------------------------ */

export const STATUSES = ["pending", "confirmed", "rejected", "blocked"] as const;
export type ReservationStatus = (typeof STATUSES)[number];

/** Stavy, které skutečně obsazují termín — na ty se nedá nic naplánovat. */
export const BLOCKING_STATUSES: ReservationStatus[] = ["confirmed", "blocked"];

export const statusLabels: Record<ReservationStatus, string> = {
  pending: "Čeká na vyřízení",
  confirmed: "Potvrzeno",
  rejected: "Zamítnuto",
  blocked: "Blokace",
};

/* ------------------------------------------------------------------ */
/* Práce s daty                                                        */
/* ------------------------------------------------------------------ */

/**
 * Datum ukládáme vždy jako půlnoc UTC, aby se termín neposouval podle
 * časové zóny serveru. Pracujeme s celými dny, ne s časem.
 */
export function parseDay(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Neplatné datum: ${value}`);
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (Number.isNaN(date.getTime())) throw new Error(`Neplatné datum: ${value}`);
  return date;
}

/** Opak `parseDay` — vrátí "YYYY-MM-DD". */
export function toDayString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Dnešek jako půlnoc UTC. */
export function today(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

/** Počet nocí mezi příjezdem a odjezdem. */
export function nightsBetween(arrival: Date, departure: Date): number {
  return Math.round((departure.getTime() - arrival.getTime()) / 86_400_000);
}

/**
 * Překrývají se dva termíny?
 *
 * Den odjezdu se nepočítá — kdo odjíždí v sobotu, neblokuje sobotu
 * dalšímu hostovi. Proto ostré nerovnosti.
 */
export function rangesOverlap(
  aArrival: Date,
  aDeparture: Date,
  bArrival: Date,
  bDeparture: Date,
): boolean {
  return aArrival < bDeparture && aDeparture > bArrival;
}

/** Všechny obsazené dny v rozsahu, včetně příjezdu, bez dne odjezdu. */
export function expandNights(arrival: Date, departure: Date): string[] {
  const days: string[] = [];
  for (let d = arrival; d < departure; d = addDays(d, 1)) {
    days.push(toDayString(d));
  }
  return days;
}

export function formatDayCs(value: string | Date): string {
  const date = typeof value === "string" ? parseDay(value) : value;
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/* ------------------------------------------------------------------ */
/* Validace                                                            */
/* ------------------------------------------------------------------ */

const dayString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum musí být ve tvaru RRRR-MM-DD");

/** Poptávka odeslaná návštěvníkem webu. */
export const reservationRequestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Vyplňte prosím jméno")
      .max(120, "Jméno je příliš dlouhé"),
    email: z
      .string()
      .trim()
      .email("Zkontrolujte prosím e-mail")
      .max(160),
    phone: z
      .string()
      .trim()
      .min(9, "Zkontrolujte prosím telefon")
      .max(40),
    guests: z
      .number()
      .int()
      .min(1, "Alespoň jedna osoba")
      .max(reservationConfig.maxGuests, `Maximálně ${reservationConfig.maxGuests} osob`),
    arrival: dayString,
    departure: dayString,
    message: z.string().trim().max(2000).optional().or(z.literal("")),
    consent: z.literal(true, {
      message: "Je potřeba souhlasit se zpracováním osobních údajů",
    }),
  })
  .refine((data) => parseDay(data.departure) > parseDay(data.arrival), {
    message: "Odjezd musí být až po příjezdu",
    path: ["departure"],
  })
  .refine((data) => parseDay(data.arrival) >= today(), {
    message: "Termín už je v minulosti",
    path: ["arrival"],
  });

export type ReservationRequest = z.infer<typeof reservationRequestSchema>;

/** Ruční blokace termínu z administrace. */
export const blockRequestSchema = z
  .object({
    arrival: dayString,
    departure: dayString,
    note: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((data) => parseDay(data.departure) > parseDay(data.arrival), {
    message: "Konec blokace musí být až po začátku",
    path: ["departure"],
  });

export const statusUpdateSchema = z.object({
  status: z.enum(STATUSES),
});
