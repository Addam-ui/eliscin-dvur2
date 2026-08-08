"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { nightsFromRanges } from "@/lib/calendar";
import { formatDayCs, nightsBetween, parseDay } from "@/lib/reservations";
import { contact, reservation as config } from "@/lib/site";
import { Calendar, type DateRange } from "./Calendar";
import { Icon } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

interface Availability {
  occupied: { arrival: string; departure: string }[];
  pending: { arrival: string; departure: string }[];
}

type Status = "idle" | "loading" | "sent" | "error";

const emptyRange: DateRange = { arrival: null, departure: null };

export function Reservation() {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [availabilityFailed, setAvailabilityFailed] = useState(false);
  const [range, setRange] = useState<DateRange>(emptyRange);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "6",
    message: "",
    consent: false,
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  /* Načtení obsazenosti. */
  useEffect(() => {
    let cancelled = false;

    fetch("/api/availability")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("nedostupné"))))
      .then((data: Availability) => {
        if (!cancelled) setAvailability(data);
      })
      .catch(() => {
        if (!cancelled) setAvailabilityFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const occupiedNights = useMemo(
    () => nightsFromRanges(availability?.occupied ?? []),
    [availability],
  );
  const pendingNights = useMemo(
    () => nightsFromRanges(availability?.pending ?? []),
    [availability],
  );

  const nights =
    range.arrival && range.departure
      ? nightsBetween(parseDay(range.arrival), parseDay(range.departure))
      : 0;

  const rangeComplete = Boolean(range.arrival && range.departure);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    setErrors({});

    if (!rangeComplete) {
      setFormError("Vyberte prosím v kalendáři termín příjezdu a odjezdu.");
      return;
    }

    if (!form.consent) {
      setFormError("Je potřeba souhlasit se zpracováním osobních údajů.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guests: Number(form.guests),
          arrival: range.arrival,
          departure: range.departure,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setErrors(data.fieldErrors ?? {});
        setFormError(data.error ?? "Odeslání se nepodařilo. Zkuste to prosím znovu.");

        // Termín mezitím někdo zabral — načteme kalendář znovu.
        if (data.conflict) {
          fetch("/api/availability")
            .then((res) => res.json())
            .then(setAvailability)
            .catch(() => undefined);
          setRange(emptyRange);
        }
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setFormError(
        "Spojení se serverem selhalo. Zkuste to prosím znovu, nebo nám rovnou zavolejte.",
      );
    }
  }

  /* ---------------- Potvrzení ---------------- */

  if (status === "sent") {
    return (
      <section id="rezervace" className="bg-cream py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-forest-pale text-forest">
            <Icon name="check" size={38} strokeWidth={2.2} />
          </div>

          <h2 className="mt-8 font-display text-4xl text-ink sm:text-5xl">Poptávka odeslána</h2>

          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Děkujeme! Máme vaši poptávku na termín{" "}
            <strong className="text-ink">
              {formatDayCs(range.arrival!)} — {formatDayCs(range.departure!)}
            </strong>
            . Ozveme se vám co nejdřív s potvrzením. Rezervace je závazná až po naší odpovědi.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`tel:+420${contact.phones[0].replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-3.5 font-semibold text-cream transition-colors hover:bg-forest-deep"
            >
              <Icon name="phone" size={18} />
              {contact.phones[0]}
            </a>

            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setRange(emptyRange);
                setForm({ name: "", email: "", phone: "", guests: "6", message: "", consent: false });
              }}
              className="rounded-full border border-linen px-7 py-3.5 font-medium text-ink-soft transition-colors hover:border-forest hover:text-forest"
            >
              Poslat další poptávku
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- Formulář ---------------- */

  return (
    <section id="rezervace" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={config.eyebrow}
          heading={config.heading}
          intro={config.intro}
          align="center"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
          {/* Kalendář */}
          <Reveal>
            <div className="h-full rounded-3xl border border-linen bg-sand/60 p-6 sm:p-8">
              {availabilityFailed ? (
                <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 text-center">
                  <Icon name="calendar" size={38} className="text-ink-faint" />
                  <p className="max-w-sm text-ink-soft">
                    Kalendář obsazenosti se teď nepodařilo načíst. Napište nám prosím termín
                    do zprávy, nebo zavolejte — rádi ho ověříme.
                  </p>
                </div>
              ) : availability === null ? (
                <div className="flex h-full min-h-64 items-center justify-center gap-3 text-ink-faint">
                  <Icon name="spinner" size={22} className="animate-spin" />
                  Načítám obsazenost…
                </div>
              ) : (
                <Calendar
                  occupiedNights={occupiedNights}
                  pendingNights={pendingNights}
                  value={range}
                  onChange={setRange}
                />
              )}
            </div>
          </Reveal>

          {/* Formulář */}
          <Reveal delay={120}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="h-full rounded-3xl border border-linen bg-cream p-6 shadow-soft sm:p-8"
            >
              {/* Shrnutí vybraného termínu */}
              <div className="rounded-2xl bg-forest p-5 text-cream">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                      Příjezd
                    </div>
                    <div className="mt-1 font-display text-lg">
                      {range.arrival ? formatDayCs(range.arrival) : "—"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-cream/50">
                      Odjezd
                    </div>
                    <div className="mt-1 font-display text-lg">
                      {range.departure ? formatDayCs(range.departure) : "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-cream/15 pt-4 text-sm">
                  <span className="text-cream/60">
                    {nights > 0
                      ? `${nights} ${nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí"}`
                      : "Vyberte termín v kalendáři"}
                  </span>
                  {rangeComplete && (
                    <button
                      type="button"
                      onClick={() => setRange(emptyRange)}
                      className="text-gold-light underline-offset-4 hover:underline"
                    >
                      Zrušit výběr
                    </button>
                  )}
                </div>
              </div>

              {/* Pole */}
              <div className="mt-6 space-y-4">
                <Field
                  label="Jméno a příjmení"
                  name="name"
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  error={errors.name}
                  autoComplete="name"
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="E-mail"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    error={errors.email}
                    autoComplete="email"
                    required
                  />
                  <Field
                    label="Telefon"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => update("phone", v)}
                    error={errors.phone}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="guests"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Počet osob <span className="text-clay">*</span>
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={form.guests}
                    onChange={(e) => update("guests", e.target.value)}
                    className="w-full rounded-xl border border-linen bg-cream px-4 py-3 text-ink transition-colors focus:border-forest focus:outline-none"
                  >
                    {Array.from({ length: config.maxGuests }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "osoba" : n < 5 ? "osoby" : "osob"}
                      </option>
                    ))}
                  </select>
                  {errors.guests && <FieldError message={errors.guests} />}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-ink"
                  >
                    Zpráva
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Máte nějaké přání nebo dotaz? Napište nám."
                    className="w-full resize-y rounded-xl border border-linen bg-cream px-4 py-3 text-ink placeholder:text-ink-faint/70 transition-colors focus:border-forest focus:outline-none"
                  />
                </div>
              </div>

              {/* Souhlas se zpracováním osobních údajů */}
              <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, consent: e.target.checked }));
                    setFormError(null);
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-linen text-forest focus:ring-forest"
                />
                <span>
                  Souhlasím se zpracováním osobních údajů uvedených v tomto formuláři za
                  účelem vyřízení rezervace — viz{" "}
                  <Link href="/ochrana-osobnich-udaju" className="link-underline text-ink">
                    zásady ochrany osobních údajů
                  </Link>
                  . <span className="text-clay">*</span>
                </span>
              </label>

              {formError && (
                <p
                  role="alert"
                  className="mt-5 flex items-start gap-2.5 rounded-xl bg-clay-pale px-4 py-3 text-sm text-clay"
                >
                  <Icon name="close" size={17} className="mt-0.5 shrink-0" strokeWidth={2.2} />
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-forest px-8 py-4 font-semibold text-cream shadow-soft transition-all duration-300 hover:bg-forest-deep hover:shadow-lift disabled:cursor-wait disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Icon name="spinner" size={19} className="animate-spin" />
                    Odesílám…
                  </>
                ) : (
                  <>
                    Odeslat nezávaznou poptávku
                    <Icon name="arrowRight" size={18} />
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
                Odesláním nic neplatíte. Rezervace je závazná až po našem potvrzení.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pomocné kousky formuláře                                            */
/* ------------------------------------------------------------------ */

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1.5 text-sm text-clay" role="alert">
      {message}
    </p>
  );
}

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
  required?: boolean;
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  autoComplete,
  required,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-cream px-4 py-3 text-ink placeholder:text-ink-faint/70 transition-colors focus:outline-none ${
          error ? "border-clay focus:border-clay" : "border-linen focus:border-forest"
        }`}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-clay" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
