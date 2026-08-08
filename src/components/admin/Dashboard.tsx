"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, type DateRange } from "@/components/Calendar";
import { Icon } from "@/components/Icons";
import { nightsFromRanges } from "@/lib/calendar";
import {
  BLOCKING_STATUSES,
  formatDayCs,
  nightsBetween,
  parseDay,
  today,
  toDayString,
  type ReservationStatus,
} from "@/lib/reservations";
import { AdminCalendar } from "./AdminCalendar";
import { ReservationCard } from "./ReservationCard";
import type { AdminReservation } from "./types";

type Tab = "pending" | "upcoming" | "all";

export function Dashboard() {
  const router = useRouter();

  const [reservations, setReservations] = useState<AdminReservation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/reservations", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      if (!response.ok) throw new Error("nedostupné");
      const data = await response.json();
      setReservations(data.reservations);
      setError(null);
    } catch {
      setError("Rezervace se nepodařilo načíst. Zkontrolujte připojení k databázi.");
      setReservations([]);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  /* ---------------- Akce ---------------- */

  async function changeStatus(id: string, status: ReservationStatus) {
    setBusyId(id);
    setError(null);
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Změnu se nepodařilo uložit.");
      } else {
        await load();
      }
    } catch {
      setError("Změnu se nepodařilo uložit.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Opravdu smazat? Záznam zmizí natrvalo.")) return;

    setBusyId(id);
    try {
      const response = await fetch(`/api/admin/reservations/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Smazání se nepodařilo.");
      } else {
        if (selectedId === id) setSelectedId(null);
        await load();
      }
    } catch {
      setError("Smazání se nepodařilo.");
    } finally {
      setBusyId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  }

  /* ---------------- Odvozená data ---------------- */

  const stats = useMemo(() => {
    const list = reservations ?? [];
    const todayKey = toDayString(today());

    const upcoming = list
      .filter((r) => r.status === "confirmed" && r.departure >= todayKey)
      .sort((a, b) => a.arrival.localeCompare(b.arrival));

    return {
      pending: list.filter((r) => r.status === "pending").length,
      confirmed: list.filter((r) => r.status === "confirmed").length,
      nextArrival: upcoming[0] ?? null,
      nightsBooked: upcoming.reduce(
        (sum, r) => sum + nightsBetween(parseDay(r.arrival), parseDay(r.departure)),
        0,
      ),
    };
  }, [reservations]);

  const visible = useMemo(() => {
    const list = reservations ?? [];
    const todayKey = toDayString(today());

    if (tab === "pending") return list.filter((r) => r.status === "pending");
    if (tab === "upcoming")
      return list.filter((r) => r.departure >= todayKey && r.status !== "rejected");
    return list;
  }, [reservations, tab]);

  const selected = reservations?.find((r) => r.id === selectedId) ?? null;

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen">
      {/* Horní lišta */}
      <header className="sticky top-0 z-30 border-b border-linen bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Image
              src="/logo/eliscin-dvur-logo-dark.png"
              alt="Eliščin dvůr"
              width={370}
              height={86}
              className="h-8 w-auto"
            />
            <span className="hidden border-l border-linen pl-4 text-sm font-medium text-ink-soft sm:block">
              Správa rezervací
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-forest sm:block"
            >
              Zobrazit web
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-linen px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-clay hover:text-clay"
            >
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {error && (
          <p
            role="alert"
            className="mb-6 flex items-start gap-2.5 rounded-2xl bg-clay-pale px-5 py-4 text-sm text-clay"
          >
            <Icon name="close" size={18} strokeWidth={2.2} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        {/* Přehled */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="calendar"
            label="Čeká na vyřízení"
            value={stats.pending}
            accent={stats.pending > 0}
          />
          <StatCard icon="check" label="Potvrzených pobytů" value={stats.confirmed} />
          <StatCard icon="users" label="Nocí obsazeno" value={stats.nightsBooked} />
          <div className="rounded-2xl border border-linen bg-cream p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
              <Icon name="key" size={15} />
              Nejbližší příjezd
            </div>
            <div className="mt-2 font-display text-lg leading-tight text-ink">
              {stats.nextArrival ? (
                <>
                  {formatDayCs(stats.nextArrival.arrival)}
                  <span className="mt-0.5 block text-sm font-sans text-ink-soft">
                    {stats.nextArrival.name}
                  </span>
                </>
              ) : (
                <span className="text-ink-faint">Zatím nic</span>
              )}
            </div>
          </div>
        </div>

        {/* Kalendář + blokace */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
          <div>
            {reservations === null ? (
              <div className="flex h-96 items-center justify-center gap-3 rounded-3xl border border-linen bg-cream text-ink-faint">
                <Icon name="spinner" size={22} className="animate-spin" />
                Načítám kalendář…
              </div>
            ) : (
              <AdminCalendar
                reservations={reservations}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          <div className="space-y-6">
            {/* Detail vybraného dne */}
            {selected && (
              <div className="rounded-3xl border-2 border-clay/40 bg-cream p-6 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl text-ink">Vybraná rezervace</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedId(null)}
                    aria-label="Zrušit výběr"
                    className="text-ink-faint transition-colors hover:text-ink"
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>
                <div className="mt-4">
                  <ReservationCard
                    reservation={selected}
                    busy={busyId === selected.id}
                    onChangeStatus={changeStatus}
                    onRemove={remove}
                    compact
                  />
                </div>
              </div>
            )}

            <BlockForm reservations={reservations} onDone={load} onError={setError} />
          </div>
        </div>

        {/* Seznam rezervací */}
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-ink">Rezervace</h2>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtr rezervací">
              {(
                [
                  { id: "pending" as const, label: `Ke schválení (${stats.pending})` },
                  { id: "upcoming" as const, label: "Nadcházející" },
                  { id: "all" as const, label: "Vše" },
                ]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-pressed={tab === item.id}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    tab === item.id
                      ? "border-forest bg-forest text-cream"
                      : "border-linen text-ink-soft hover:border-forest/50 hover:text-forest"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {reservations === null ? (
              <div className="flex items-center gap-3 rounded-2xl border border-linen bg-cream px-6 py-8 text-ink-faint">
                <Icon name="spinner" size={20} className="animate-spin" />
                Načítám…
              </div>
            ) : visible.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-linen bg-cream/60 px-6 py-12 text-center text-ink-faint">
                {tab === "pending"
                  ? "Žádné čekající poptávky. Vše je vyřízené."
                  : "Zatím tu nic není."}
              </div>
            ) : (
              visible.map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  busy={busyId === reservation.id}
                  onChangeStatus={changeStatus}
                  onRemove={remove}
                  onFocusInCalendar={() => setSelectedId(reservation.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dílčí komponenty                                                    */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: "calendar" | "check" | "users";
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-colors ${
        accent ? "border-gold bg-gold/10" : "border-linen bg-cream"
      }`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-faint">
        <Icon name={icon} size={15} />
        {label}
      </div>
      <div className="mt-2 font-display text-3xl text-ink tabular-nums">{value}</div>
    </div>
  );
}

const emptyRange: DateRange = { arrival: null, departure: null };

/** Ruční zabrání termínu — údržba, rodina, cokoli mimo web. */
function BlockForm({
  reservations,
  onDone,
  onError,
}: {
  reservations: AdminReservation[] | null;
  onDone: () => Promise<void>;
  onError: (message: string | null) => void;
}) {
  const [range, setRange] = useState<DateRange>(emptyRange);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  // Do kalendáře se nedá kliknout na den, který už je obsazený nebo
  // zablokovaný jindy — zabrání to zbytečné kolizi ještě před odesláním.
  const occupiedNights = useMemo(() => {
    const list = reservations ?? [];
    const ranges = list
      .filter((r) => BLOCKING_STATUSES.includes(r.status as "confirmed" | "blocked"))
      .map((r) => ({ arrival: r.arrival, departure: r.departure }));
    return nightsFromRanges(ranges);
  }, [reservations]);

  const pendingNights = useMemo(() => {
    const list = reservations ?? [];
    const ranges = list
      .filter((r) => r.status === "pending")
      .map((r) => ({ arrival: r.arrival, departure: r.departure }));
    return nightsFromRanges(ranges);
  }, [reservations]);

  const rangeComplete = Boolean(range.arrival && range.departure);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!range.arrival || !range.departure) return;

    onError(null);
    setSaving(true);
    setDone(false);

    try {
      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrival: range.arrival, departure: range.departure, note }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        onError(data.error ?? "Blokaci se nepodařilo uložit.");
      } else {
        setRange(emptyRange);
        setNote("");
        setDone(true);
        await onDone();
      }
    } catch {
      onError("Blokaci se nepodařilo uložit.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-linen bg-cream p-6 shadow-soft">
      <h3 className="flex items-center gap-2.5 font-display text-xl text-ink">
        <Icon name="fence" size={20} className="text-forest-light" />
        Zablokovat termín
      </h3>
      <p className="mt-1.5 text-sm text-ink-soft">
        Klikněte v kalendáři na den příjezdu a pak na den odjezdu. Tyhle dny se na
        webu ukážou jako obsazené.
      </p>

      <div className="mt-5 rounded-2xl border border-linen bg-sand/40 p-4">
        <Calendar
          occupiedNights={occupiedNights}
          pendingNights={pendingNights}
          value={range}
          onChange={setRange}
          months={1}
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-forest px-4 py-3 text-sm text-cream">
        <span>
          {range.arrival ? formatDayCs(range.arrival) : "Od…"}
          {" — "}
          {range.departure ? formatDayCs(range.departure) : "Do…"}
        </span>
        {rangeComplete && (
          <button
            type="button"
            onClick={() => setRange(emptyRange)}
            className="shrink-0 text-gold-light underline-offset-4 hover:underline"
          >
            Zrušit výběr
          </button>
        )}
      </div>

      <div className="mt-3">
        <label htmlFor="block-note" className="mb-1.5 block text-sm font-medium text-ink">
          Poznámka
        </label>
        <input
          id="block-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Např. malování, rodina…"
          className="w-full rounded-xl border border-linen bg-sand/40 px-3.5 py-2.5 text-ink placeholder:text-ink-faint/70 focus:border-forest focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving || !rangeComplete}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? (
          <>
            <Icon name="spinner" size={17} className="animate-spin" />
            Ukládám…
          </>
        ) : (
          "Zablokovat"
        )}
      </button>

      {done && (
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-forest">
          <Icon name="check" size={16} strokeWidth={2.2} />
          Termín zablokován.
        </p>
      )}
    </form>
  );
}
