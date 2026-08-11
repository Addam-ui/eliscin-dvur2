"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { galleryItems, thumbSrc, type GalleryItem } from "@/lib/media";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Icon } from "./Icons";

/* Karty mají pevnou výšku a šířku si dopočítají z poměru stran — tak
   vedle sebe vznikne filmový pás s přirozeně různě širokými snímky. */
const cardAspectClass: Record<GalleryItem["aspect"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
};

/* Barevné varianty zástupných dlaždic, ať pás nevypadá monotónně. */
const tileThemes = [
  { from: "#2c4a38", to: "#16281d", accent: "#c19a3d" },
  { from: "#3d6450", to: "#20372a", accent: "#e3c887" },
  { from: "#b5623f", to: "#7c3f28", accent: "#f7e6dc" },
  { from: "#6d9a7e", to: "#31503d", accent: "#fbf8f2" },
];

/** Dlaždice, která se ukáže, dokud na daném místě chybí skutečná fotka. */
function PlaceholderTile({ index, label }: { index: number; label: string }) {
  const theme = tileThemes[index % tileThemes.length];
  const gradientId = `tile-${index}-${theme.from.slice(1)}`;

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 400 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor={theme.from} />
            <stop offset="100%" stopColor={theme.to} />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill={`url(#${gradientId})`} />
        <path
          d="M0 300 C 70 262 130 318 200 292 C 272 266 330 316 400 288 L400 400 L0 400 Z"
          fill={theme.accent}
          opacity="0.12"
        />
        <path
          d="M0 336 C 80 308 140 356 220 334 C 300 312 344 350 400 332 L400 400 L0 400 Z"
          fill={theme.accent}
          opacity="0.09"
        />
        <circle cx="308" cy="104" r="34" fill={theme.accent} opacity="0.18" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center">
        <Icon name="leaf" size={26} strokeWidth={1.2} className="text-cream/45" />
        <span className="text-sm font-medium leading-snug text-cream/70">{label}</span>
        <span className="text-[0.65rem] uppercase tracking-[0.18em] text-cream/35">
          Fotka se připravuje
        </span>
      </div>
    </div>
  );
}

export function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ atStart: true, atEnd: true });

  /* Poloha pásu — pohání viditelnost šipek. */
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 1) {
      setScrollState({ atStart: true, atEnd: true });
      return;
    }
    setScrollState({
      atStart: track.scrollLeft <= 4,
      atEnd: track.scrollLeft >= max - 4,
    });
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return;

    const ro = new ResizeObserver(updateScrollState);
    ro.observe(track);
    window.addEventListener("resize", updateScrollState);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  function scrollByViewport(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.82, behavior: "smooth" });
  }

  function onTrackKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByViewport(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByViewport(-1);
    }
  }

  /* ---------------- Lightbox ---------------- */

  const active = lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goLightbox = useCallback((step: number) => {
    setLightboxIndex((current) => {
      if (current === null) return null;
      const total = galleryItems.length;
      return (current + step + total) % total;
    });
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goLightbox(1);
      if (e.key === "ArrowLeft") goLightbox(-1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, closeLightbox, goLightbox]);

  /*
   * Kolečkem myši / gestem na trackpadu se dá v lightboxu přepínat mezi
   * fotkami stejně jako šipkami. Jeden „cvak" kolečka pošle spoustu
   * drobných wheel událostí najednou — bez chvilkového zámku by to
   * přeskočilo rovnou o několik fotek.
   */
  const wheelLocked = useRef(false);

  function onLightboxWheel(e: React.WheelEvent) {
    if (wheelLocked.current) return;
    const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 12) return;

    wheelLocked.current = true;
    goLightbox(delta > 0 ? 1 : -1);
    window.setTimeout(() => {
      wheelLocked.current = false;
    }, 350);
  }

  /* Swipe prstem na dotykových zařízeních — doleva další, doprava předchozí. */
  const touchStartX = useRef<number | null>(null);

  function onLightboxTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches.length === 1 ? e.touches[0].clientX : null;
  }

  function onLightboxTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    goLightbox(delta < 0 ? 1 : -1);
  }

  return (
    <section id="galerie" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Fotogalerie"
          heading="Podívejte se k nám"
          intro="Statek zvenku i zevnitř, zahrada, bazén a kus okolí. Nejlepší představu ale stejně dostanete až na místě."
        />

        <Reveal delay={150}>
          <div className="relative mt-12">
            {/* Pás fotek */}
            <div
              ref={trackRef}
              onScroll={updateScrollState}
              onKeyDown={onTrackKeyDown}
              tabIndex={0}
              role="region"
              aria-label="Fotografie penzionu"
              className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 pl-1 pr-8"
            >
              {galleryItems.map((item, i) => (
                <button
                  key={`${item.alt}-${i}`}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={`group relative block h-64 shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-forest-deep shadow-soft transition-shadow duration-500 hover:shadow-lift sm:h-80 lg:h-96 ${cardAspectClass[item.aspect]}`}
                  aria-label={`Zvětšit fotku: ${item.alt}`}
                >
                  {item.src ? (
                    // Obyčejný <img> na malý předgenerovaný náhled — žádné
                    // zpracování za běhu, takže se v pásu s desítkami
                    // fotek načítá hned. Plná kvalita je jen v lightboxu.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbSrc(item.src)}
                      alt={item.alt}
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <PlaceholderTile index={i} label={item.alt} />
                  )}

                  <span className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 scale-75 items-center justify-center rounded-full bg-cream/90 text-forest opacity-0 transition-all duration-[400ms] group-hover:scale-100 group-hover:opacity-100">
                    <Icon name="arrowUpRight" size={16} strokeWidth={2} />
                  </span>
                </button>
              ))}
            </div>

            {/* Šipky — jen když je co posouvat */}
            {!scrollState.atStart && (
              <button
                type="button"
                onClick={() => scrollByViewport(-1)}
                aria-label="Posunout vlevo"
                className="absolute left-1 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/95 text-forest-deep shadow-lift transition-transform hover:scale-105 sm:flex"
              >
                <Icon name="chevronLeft" size={20} />
              </button>
            )}
            {!scrollState.atEnd && (
              <button
                type="button"
                onClick={() => scrollByViewport(1)}
                aria-label="Posunout vpravo"
                className="absolute right-1 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/95 text-forest-deep shadow-lift transition-transform hover:scale-105 sm:flex"
              >
                <Icon name="chevronRight" size={20} />
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-8 text-center text-sm text-ink-faint">
            Fotky průběžně doplňujeme. Chcete vidět něco konkrétního? Napište nám.
          </p>
        </Reveal>
      </div>

      {/* ---------- Lightbox ---------- */}
      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-deep/97 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={closeLightbox}
          onWheel={onLightboxWheel}
          onTouchStart={onLightboxTouchStart}
          onTouchEnd={onLightboxTouchEnd}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Zavřít"
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream sm:right-8 sm:top-8"
          >
            <Icon name="close" size={26} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(-1);
            }}
            aria-label="Předchozí fotka"
            className="absolute left-2 flex h-12 w-12 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream sm:left-6"
          >
            <Icon name="chevronLeft" size={28} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(1);
            }}
            aria-label="Další fotka"
            className="absolute right-2 flex h-12 w-12 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream sm:right-6"
          >
            <Icon name="chevronRight" size={28} />
          </button>

          <figure className="max-h-full w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div
              className={`relative w-full overflow-hidden rounded-2xl ${cardAspectClass[active.aspect]} max-h-[75vh]`}
            >
              {active.src ? (
                // Obyčejný <img> na originální soubor — stejně jako u náhledů
                // v pásu se tu vyhýbáme Next.js optimalizaci za běhu, která
                // by u první návštěvy každé fotky znamenala citelné čekání.
                // Fotky jsou už samy o sobě rozumně velké (kolem 1920 px).
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={active.src}
                  alt={active.alt}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <PlaceholderTile index={lightboxIndex ?? 0} label={active.alt} />
              )}
            </div>

            <figcaption className="mt-4 text-center text-sm tabular-nums text-cream/70">
              {(lightboxIndex ?? 0) + 1} / {galleryItems.length}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
