import { contact, contactSection } from "@/lib/site";
import { Icon, type IconName } from "./Icons";
import { MapEmbed } from "./MapEmbed";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

/** Mapa míří přesně na souřadnice statku, ne jen na obec. */
const mapEmbedSrc = `https://maps.google.com/maps?q=${contact.coords.lat},${contact.coords.lng}&z=15&hl=cs&output=embed`;

export function Contact() {
  return (
    <section
      id="kontakt"
      className="grain relative overflow-hidden bg-forest-deep py-24 sm:py-32"
    >
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-forest-light/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={contactSection.eyebrow}
          heading={contactSection.heading}
          intro={contactSection.intro}
          tone="dark"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-8">
          {/* Kontaktní údaje */}
          <Reveal>
            <div className="flex h-full flex-col gap-8 rounded-3xl border border-cream/12 bg-cream/[0.045] p-8 backdrop-blur-sm sm:p-10">
              <div>
                <h3 className="font-display text-2xl text-cream">{contact.person}</h3>
                <p className="mt-1 text-sm uppercase tracking-wider text-gold-light">
                  Majitelka penzionu
                </p>
              </div>

              <div className="space-y-5">
                <ContactRow icon="mapPin" label="Adresa">
                  <span className="not-italic">
                    {contact.street}
                    <br />
                    {contact.zip} {contact.city}
                  </span>
                </ContactRow>

                <ContactRow icon="phone" label="Telefon">
                  <span className="flex flex-col gap-1">
                    {contact.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:+420${phone.replace(/\s/g, "")}`}
                        className="link-underline w-fit"
                      >
                        {phone}
                      </a>
                    ))}
                  </span>
                </ContactRow>

                <ContactRow icon="mail" label="E-mail">
                  <a href={`mailto:${contact.email}`} className="link-underline break-all">
                    {contact.email}
                  </a>
                </ContactRow>

                <ContactRow icon="key" label="IČO">
                  {contact.ico}
                </ContactRow>
              </div>
            </div>
          </Reveal>

          {/* Mapa */}
          <Reveal delay={120}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-cream/12 bg-cream/[0.045]">
              <MapEmbed src={mapEmbedSrc} title="Mapa — Eliščin dvůr, Hajnice" />

              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2.5 text-sm font-semibold text-forest-deep shadow-lift transition-colors hover:bg-white"
              >
                <Icon name="mapPin" size={16} />
                Navigovat
              </a>
            </div>
          </Reveal>
        </div>

        {/* Jak se k nám dostat */}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {contactSection.directions.map((item, i) => (
            <Reveal key={item.title} delay={i * 110}>
              <div className="h-full rounded-3xl border border-cream/12 bg-cream/[0.045] p-7 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/60 text-gold-light ring-1 ring-inset ring-cream/10">
                  <Icon name={item.icon as IconName} size={24} strokeWidth={1.4} />
                </div>
                <h3 className="mt-5 font-display text-xl text-cream">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-cream/65">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: IconName;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon name={icon} size={20} className="mt-0.5 shrink-0 text-gold-light" strokeWidth={1.5} />
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-cream/45">{label}</div>
        <div className="mt-1 text-cream/85">{children}</div>
      </div>
    </div>
  );
}
