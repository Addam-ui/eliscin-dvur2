import Image from "next/image";
import Link from "next/link";
import { heroMedia } from "@/lib/media";
import { site } from "@/lib/site";
import { Icon } from "./Icons";

const quickFacts = [
  { icon: "users" as const, label: "Až 16 lůžek" },
  { icon: "pool" as const, label: "Vyhřívaný bazén" },
  { icon: "fence" as const, label: "Celý areál jen pro vás" },
  { icon: "mountain" as const, label: "30 min na Sněžku" },
];

export function Hero() {
  const hasVideo = Boolean(heroMedia.video || heroMedia.videoWebm);

  return (
    <section id="uvod" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      {/* ---------- Pozadí: video, nebo statický obrázek ---------- */}
      <div className="absolute inset-0 -z-10">
        {hasVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroMedia.poster}
            aria-label={heroMedia.posterAlt}
            className="h-full w-full object-cover"
          >
            {heroMedia.videoWebm && <source src={heroMedia.videoWebm} type="video/webm" />}
            {heroMedia.video && <source src={heroMedia.video} type="video/mp4" />}
          </video>
        ) : (
          <Image
            src={heroMedia.poster}
            alt={heroMedia.posterAlt}
            fill
            priority
            sizes="100vw"
            className="ken-burns object-cover"
          />
        )}
      </div>

      {/* ---------- Ztmavení, aby byl text čitelný ---------- */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-deep/75 via-forest-deep/25 to-forest-deep/90"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(22,40,29,0.55)_100%)]"
        aria-hidden="true"
      />

      {/* ---------- Obsah ---------- */}
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-32 sm:px-8 sm:pb-20">
        <div className="max-w-3xl">
          <h1 className="flex flex-col gap-5">
            <span className="rise-in block" style={{ "--rise-delay": "120ms" } as React.CSSProperties}>
              <Image
                src="/logo/eliscin-dvur-logo.png"
                alt={site.name}
                width={370}
                height={86}
                priority
                className="h-auto w-[240px] drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)] sm:w-[320px]"
              />
            </span>
            <span
              className="rise-in block font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight text-cream sm:text-6xl lg:text-7xl"
              style={{ "--rise-delay": "280ms" } as React.CSSProperties}
            >
              Rodinný penzion
              <span className="block text-gold-light">pod Krkonošemi</span>
            </span>
          </h1>

          <p
            className="rise-in mt-7 max-w-xl text-lg leading-relaxed text-cream/85 sm:text-xl"
            style={{ "--rise-delay": "440ms" } as React.CSSProperties}
          >
            Historický statek v Hajnici, který si pronajmete celý. Bazén, pergola s grilem,
            hřiště pro děti — a hory za humny.
          </p>

          {/* Tlačítka */}
          <div
            className="rise-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ "--rise-delay": "580ms" } as React.CSSProperties}
          >
            <Link
              href="#rezervace"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-cream px-8 py-4 text-base font-semibold text-forest-deep shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-deep"
            >
              <Icon name="calendar" size={19} />
              Zjistit volné termíny
              <Icon
                name="arrowRight"
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="#galerie"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-cream/35 px-8 py-4 text-base font-medium text-cream backdrop-blur-sm transition-all duration-300 hover:border-cream/70 hover:bg-cream/10"
            >
              Prohlédnout statek
              <Icon
                name="arrowUpRight"
                size={18}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Rychlá fakta */}
        <div
          className="rise-in mt-14 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-cream/15 pt-8 sm:mt-16 lg:grid-cols-4"
          style={{ "--rise-delay": "720ms" } as React.CSSProperties}
        >
          {quickFacts.map((fact) => (
            <div key={fact.label} className="flex items-center gap-3 text-cream/85">
              <Icon name={fact.icon} size={26} className="shrink-0 text-gold-light" strokeWidth={1.3} />
              <span className="text-sm font-medium sm:text-base">{fact.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Naznačení scrollu */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="scroll-hint flex h-10 w-6 items-start justify-center rounded-full border border-cream/40 pt-2">
          <span className="h-1.5 w-1 rounded-full bg-cream/80" />
        </div>
      </div>
    </section>
  );
}
