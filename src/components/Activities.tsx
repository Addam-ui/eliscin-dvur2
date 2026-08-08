"use client";

import { useMemo, useState } from "react";
import { activities } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Icon, type IconName } from "./Icons";

export function Activities() {
  const [filter, setFilter] = useState<string>("Vše");

  /* Kategorie bereme přímo z dat, ať se seznam nemusí udržovat dvakrát. */
  const categories = useMemo(
    () => ["Vše", ...Array.from(new Set(activities.items.map((a) => a.category)))],
    [],
  );

  const visible = useMemo(
    () =>
      filter === "Vše"
        ? activities.items
        : activities.items.filter((a) => a.category === filter),
    [filter],
  );

  return (
    <section
      id="aktivity"
      className="grain relative overflow-hidden bg-forest-deep py-24 sm:py-32"
    >
      {/* Nasvícení v rohu */}
      <div
        className="pointer-events-none absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-forest-light/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={activities.eyebrow}
          heading={activities.heading}
          intro={activities.intro}
          tone="dark"
        />

        {/* Filtr kategorií */}
        <Reveal delay={220}>
          <div
            className="mt-12 flex flex-wrap gap-2.5"
            role="group"
            aria-label="Filtr kategorií aktivit"
          >
            {categories.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={active}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "border-gold-light bg-gold-light text-forest-deep"
                      : "border-cream/20 text-cream/70 hover:border-cream/45 hover:text-cream"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Karty aktivit */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 100}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-cream/12 bg-cream/[0.045] p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-light/45 hover:bg-cream/[0.09]">
                {/* Ikona */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest/60 text-gold-light ring-1 ring-inset ring-cream/10 transition-all duration-500 group-hover:bg-gold-light group-hover:text-forest-deep">
                    <Icon name={item.icon as IconName} size={28} strokeWidth={1.4} />
                  </div>
                  <span className="rounded-full bg-cream/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cream/60">
                    {item.distance}
                  </span>
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-light/80">
                  {item.category}
                </span>
                <h3 className="mt-2 font-display text-2xl text-cream">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-cream/65">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-12 text-center text-cream/60">V této kategorii zatím nic není.</p>
        )}
      </div>
    </section>
  );
}
