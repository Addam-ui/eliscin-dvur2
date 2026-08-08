import { accommodation } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Icon, type IconName } from "./Icons";

export function Accommodation() {
  return (
    <section id="ubytovani" className="bg-sand py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={accommodation.eyebrow}
          heading={accommodation.heading}
          intro={accommodation.intro}
        />

        {/* Dvě křídla */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {accommodation.wings.map((wing, i) => (
            <Reveal key={wing.name} delay={i * 140}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-linen bg-cream p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-10">
                {/* Zelený pruh, který se při hoveru rozjede */}
                <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-forest to-forest-light transition-transform duration-500 group-hover:scale-x-100" />

                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-3xl text-ink">{wing.name}</h3>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-forest-pale px-3.5 py-1.5 text-sm font-semibold text-forest">
                    <Icon name="users" size={15} />
                    {wing.capacity}
                  </span>
                </div>

                <p className="mt-4 leading-relaxed text-ink-soft">{wing.description}</p>

                <ul className="mt-7 space-y-3 border-t border-linen pt-7">
                  {wing.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[0.95rem] text-ink">
                      <Icon
                        name="check"
                        size={17}
                        strokeWidth={2.2}
                        className="mt-1 shrink-0 text-forest-light"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Vybavení areálu */}
        <Reveal className="mt-24">
          <h3 className="font-display text-3xl text-ink sm:text-4xl">K tomu celý areál</h3>
        </Reveal>

        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {accommodation.amenities.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 110}>
              <div className="group flex gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cream text-forest shadow-soft transition-all duration-500 group-hover:-translate-y-1 group-hover:bg-forest group-hover:text-cream">
                  <Icon name={item.icon as IconName} size={27} strokeWidth={1.4} />
                </div>
                <div>
                  <h4 className="font-display text-xl text-ink">{item.title}</h4>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
