import Link from "next/link";
import { pricing } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Icon } from "./Icons";

const czk = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 0,
});

export function Pricing() {
  return (
    <section id="cenik" className="bg-sand py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={pricing.eyebrow}
          heading={pricing.heading}
          intro={pricing.intro}
          align="center"
        />

        {/* Varianty pobytu */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pricing.plans.map((plan, i) => (
            <Reveal key={plan.name} delay={(i % 3) * 110}>
              <article
                className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 ${
                  plan.highlight
                    ? "bg-forest text-cream shadow-deep ring-2 ring-gold"
                    : "border border-linen bg-cream shadow-soft hover:shadow-lift"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute right-6 top-6 rounded-full bg-gold px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider text-forest-deep">
                    Nejčastější
                  </span>
                )}

                <h3
                  className={`font-display text-2xl ${plan.highlight ? "text-cream" : "text-ink"}`}
                >
                  {plan.name}
                </h3>

                <p
                  className={`mt-1.5 text-sm font-medium uppercase tracking-wider ${
                    plan.highlight ? "text-gold-light" : "text-clay"
                  }`}
                >
                  {plan.note}
                </p>

                <div className="mt-7 flex items-baseline gap-2">
                  <span
                    className={`font-display text-4xl tabular-nums ${
                      plan.highlight ? "text-cream" : "text-forest"
                    }`}
                  >
                    {czk.format(plan.price)}
                  </span>
                  <span
                    className={`text-sm ${plan.highlight ? "text-cream/60" : "text-ink-faint"}`}
                  >
                    {plan.unit}
                  </span>
                </div>

                <p
                  className={`mt-4 flex-1 text-[0.95rem] leading-relaxed ${
                    plan.highlight ? "text-cream/70" : "text-ink-soft"
                  }`}
                >
                  {plan.description}
                </p>

                <Link
                  href="#rezervace"
                  className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                    plan.highlight
                      ? "bg-gold text-forest-deep hover:bg-gold-light"
                      : "bg-forest text-cream hover:bg-forest-deep"
                  }`}
                >
                  Poptat termín
                  <Icon
                    name="arrowRight"
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Co je v ceně + podmínky */}
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="h-full rounded-3xl border border-linen bg-cream p-8 sm:p-10">
              <h3 className="flex items-center gap-3 font-display text-2xl text-ink">
                <Icon name="check" size={22} strokeWidth={2.2} className="text-forest-light" />
                V ceně máte
              </h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {pricing.included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.95rem] text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="h-full rounded-3xl bg-forest-deep p-8 text-cream sm:p-10">
              <h3 className="flex items-center gap-3 font-display text-2xl">
                <Icon name="key" size={22} className="text-gold-light" />
                Dobré vědět
              </h3>
              <ul className="mt-6 space-y-4">
                {pricing.terms.map((term) => (
                  <li key={term} className="text-[0.95rem] leading-relaxed text-cream/75">
                    {term}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-ink-soft">{pricing.footnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
