"use client";

import { Icon } from "@/components/Icons";
import {
  formatDayCs,
  nightsBetween,
  parseDay,
  statusLabels,
  type ReservationStatus,
} from "@/lib/reservations";
import type { AdminReservation } from "./types";

const statusStyles: Record<ReservationStatus, string> = {
  pending: "bg-gold/20 text-[#7a5f16] ring-gold/40",
  confirmed: "bg-forest-pale text-forest ring-forest/25",
  rejected: "bg-clay-pale text-clay ring-clay/25",
  blocked: "bg-ink/10 text-ink-soft ring-ink/15",
};

interface ReservationCardProps {
  reservation: AdminReservation;
  busy: boolean;
  onChangeStatus: (id: string, status: ReservationStatus) => void | Promise<void>;
  onRemove: (id: string) => void | Promise<void>;
  /** Zúžená varianta do postranního panelu. */
  compact?: boolean;
  onFocusInCalendar?: () => void;
}

export function ReservationCard({
  reservation: r,
  busy,
  onChangeStatus,
  onRemove,
  compact = false,
  onFocusInCalendar,
}: ReservationCardProps) {
  const nights = nightsBetween(parseDay(r.arrival), parseDay(r.departure));
  const isBlock = r.status === "blocked";

  return (
    <article
      className={`transition-shadow ${
        // V postranním panelu má kartu už na sobě rámeček ten panel sám —
        // vlastní ohraničení karty by tam dělalo zbytečný dvojitý box.
        compact
          ? ""
          : "rounded-2xl border border-linen bg-cream p-5 shadow-soft hover:shadow-lift sm:p-6"
      } ${busy ? "opacity-60" : ""}`}
    >
      {/* Hlavička */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="font-display text-xl text-ink">
              {isBlock ? "Blokace termínu" : r.name}
            </h3>
            {!isBlock && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusStyles[r.status]}`}
              >
                {statusLabels[r.status]}
              </span>
            )}
            {r.source === "admin" && !isBlock && (
              <span className="rounded-full bg-sand px-2.5 py-0.5 text-xs text-ink-faint">
                ručně
              </span>
            )}
          </div>

          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
            <Icon name="calendar" size={15} className="text-ink-faint" />
            <span className="font-medium text-ink">
              {formatDayCs(r.arrival)} — {formatDayCs(r.departure)}
            </span>
            <span className="text-ink-faint">
              · {nights} {nights === 1 ? "noc" : nights < 5 ? "noci" : "nocí"}
            </span>
            {!isBlock && (
              <span className="text-ink-faint">
                · {r.guests} {r.guests === 1 ? "osoba" : r.guests < 5 ? "osoby" : "osob"}
              </span>
            )}
          </p>
        </div>

        {onFocusInCalendar && (
          <button
            type="button"
            onClick={onFocusInCalendar}
            className="shrink-0 rounded-full border border-linen px-3.5 py-1.5 text-xs font-medium text-ink-soft transition-colors hover:border-forest hover:text-forest"
          >
            Ukázat v kalendáři
          </button>
        )}
      </div>

      {/* Kontakt */}
      {!isBlock && (
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-linen pt-4 text-sm">
          <a
            href={`tel:${r.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-ink transition-colors hover:text-forest"
          >
            <Icon name="phone" size={15} className="text-ink-faint" />
            {r.phone}
          </a>
          <a
            href={`mailto:${r.email}`}
            className="flex items-center gap-2 break-all text-ink transition-colors hover:text-forest"
          >
            <Icon name="mail" size={15} className="shrink-0 text-ink-faint" />
            {r.email}
          </a>
        </div>
      )}

      {/* Zpráva a poznámka */}
      {r.message && (
        <p className="mt-4 rounded-xl bg-sand/70 px-4 py-3 text-sm leading-relaxed text-ink-soft">
          „{r.message}"
        </p>
      )}
      {r.note && (
        <p className="mt-3 text-sm italic text-ink-faint">Poznámka: {r.note}</p>
      )}

      {/* Akce */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-linen pt-4">
        {r.status !== "confirmed" && !isBlock && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChangeStatus(r.id, "confirmed")}
            className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep disabled:opacity-50"
          >
            <Icon name="check" size={16} strokeWidth={2.2} />
            Potvrdit
          </button>
        )}

        {r.status !== "rejected" && !isBlock && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChangeStatus(r.id, "rejected")}
            className="inline-flex items-center gap-2 rounded-full border border-linen px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-clay hover:text-clay disabled:opacity-50"
          >
            <Icon name="close" size={16} strokeWidth={2.2} />
            Zamítnout
          </button>
        )}

        {r.status !== "pending" && !isBlock && (
          <button
            type="button"
            disabled={busy}
            onClick={() => onChangeStatus(r.id, "pending")}
            className="inline-flex items-center gap-2 rounded-full border border-linen px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-forest hover:text-forest disabled:opacity-50"
          >
            Vrátit mezi čekající
          </button>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={() => onRemove(r.id)}
          className="ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-ink-faint transition-colors hover:bg-clay-pale hover:text-clay disabled:opacity-50"
        >
          {busy ? <Icon name="spinner" size={15} className="animate-spin" /> : null}
          Smazat
        </button>
      </div>
    </article>
  );
}
