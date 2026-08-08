import { intro } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Icon, Sprig } from "./Icons";

export function Intro() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-32">
      {/* Jemná dekorace na pozadí */}
      <Icon
        name="leaf"
        size={420}
        strokeWidth={0.4}
        className="pointer-events-none absolute -right-24 -top-24 text-forest/[0.05]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-20">
          <SectionHeading eyebrow={intro.eyebrow} heading={intro.heading} />

          <div className="space-y-5 lg:pt-16">
            {intro.body.map((paragraph, i) => (
              <Reveal key={i} delay={i * 110}>
                <p className="text-lg leading-relaxed text-ink-soft">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Čísla */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-linen bg-linen lg:grid-cols-4">
          {intro.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100}>
              <div className="h-full bg-sand px-6 py-9 text-center transition-colors duration-500 hover:bg-cream">
                <div className="font-display text-4xl text-forest sm:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm font-medium uppercase tracking-wider text-ink-faint">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <Sprig className="mx-auto mt-20 h-6 w-32 text-linen" />
        </Reveal>
      </div>
    </section>
  );
}
