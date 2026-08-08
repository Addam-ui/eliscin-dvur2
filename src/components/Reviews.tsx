import { contact, reviews } from "@/lib/site";
import { Icon } from "./Icons";
import { Reveal } from "./Reveal";

export function Reviews() {
  return (
    <section className="bg-sand py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-linen bg-cream p-9 text-center shadow-soft sm:p-14">
            {/* Uvozovky na pozadí */}
            <span
              className="pointer-events-none absolute -top-8 left-8 font-display text-[10rem] leading-none text-forest/[0.06]"
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <div className="relative">
              <span className="eyebrow justify-center">{reviews.eyebrow}</span>

              <h2 className="mt-4 font-display text-[2.1rem] leading-tight text-ink sm:text-5xl">
                {reviews.heading}
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                {reviews.intro}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={contact.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-linen bg-cream px-7 py-3.5 font-semibold text-ink shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <Icon name="google" size={20} strokeWidth={0} />
                  Recenze na Googlu
                  <Icon
                    name="arrowUpRight"
                    size={17}
                    className="text-ink-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>

                <a
                  href={contact.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-forest px-7 py-3.5 font-semibold text-cream transition-colors duration-300 hover:bg-forest-deep"
                >
                  <Icon name="star" size={18} className="text-gold-light" />
                  Napsat hodnocení
                </a>
              </div>

              <p className="mt-7 text-sm text-ink-faint">
                Byli jste u nás? Pár vět na Googlu nám moc pomůže.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
