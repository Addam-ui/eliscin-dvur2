import Link from "next/link";
import { houseRules, upcomingRulesCount } from "@/lib/rules";
import { Icon } from "./Icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Rules() {
  return (
    <section id="provozni-rady" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Provozní řády"
          heading="Pravidla pro pohodlný pobyt"
          intro="Pár praktických řádů k vybavení statku — ať je pobyt příjemný a bezpečný pro všechny."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {houseRules.map((doc, i) => (
            <Reveal key={doc.slug} delay={i * 110}>
              <Link
                href={`/provozni-rady/${doc.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-linen bg-sand/50 p-8 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-cream transition-colors duration-500 group-hover:bg-forest-deep">
                  <Icon name={doc.icon} size={27} strokeWidth={1.4} />
                </div>

                <h3 className="mt-6 font-display text-2xl text-ink">{doc.title}</h3>
                <p className="mt-2.5 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                  {doc.summary}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest">
                  Zobrazit řád
                  <Icon
                    name="arrowRight"
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}

          {Array.from({ length: upcomingRulesCount }, (_, i) => (
            <Reveal key={`pripravujeme-${i}`} delay={(houseRules.length + i) * 110}>
              <div className="flex h-full flex-col items-start rounded-3xl border border-dashed border-linen p-8 text-ink-faint">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand text-ink-faint">
                  <Icon name="document" size={27} strokeWidth={1.4} />
                </div>
                <h3 className="mt-6 font-display text-2xl text-ink-faint">Připravujeme</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed">
                  Další provozní řád tady brzy přibude.
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
