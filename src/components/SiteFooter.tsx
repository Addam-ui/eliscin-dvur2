import Image from "next/image";
import Link from "next/link";
import { contact, navigation, site } from "@/lib/site";
import { Icon, Sprig } from "./Icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden bg-[#0f1d15] pt-20">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 pb-16 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Značka */}
          <div>
            <Image
              src="/logo/eliscin-dvur-logo.png"
              alt={site.name}
              width={370}
              height={86}
              className="h-11 w-auto"
            />
            <p className="mt-6 max-w-sm leading-relaxed text-cream/55">
              Rodinný penzion v památkově chráněném statku pod Krkonošemi. Pronajímáme celý
              objekt — se zahradou, bazénem i klidem, který k tomu patří.
            </p>

            <Sprig className="mt-8 h-5 w-28 text-cream/15" />
          </div>

          {/* Navigace */}
          <nav aria-label="Patička — navigace">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
              Na webu
            </h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={`/${item.href}`}
                    className="link-underline text-cream/65 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#rezervace"
                  className="link-underline text-cream/65 transition-colors hover:text-cream"
                >
                  Rezervace
                </Link>
              </li>
              <li>
                <Link
                  href="/ochrana-osobnich-udaju"
                  className="link-underline text-cream/65 transition-colors hover:text-cream"
                >
                  Ochrana osobních údajů
                </Link>
              </li>
            </ul>
          </nav>

          {/* Kontakt */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
              Kontakt
            </h2>
            <address className="mt-5 space-y-3 not-italic text-cream/65">
              <p>
                {contact.person}
                <br />
                {contact.street}
                <br />
                {contact.zip} {contact.city}
              </p>

              {contact.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:+420${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-cream"
                >
                  <Icon name="phone" size={16} className="text-gold-light/70" />
                  {phone}
                </a>
              ))}

              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2.5 break-all transition-colors hover:text-cream"
              >
                <Icon name="mail" size={16} className="shrink-0 text-gold-light/70" />
                {contact.email}
              </a>
            </address>
          </div>
        </div>

        {/* Spodní lišta */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-cream/10 py-7 text-sm text-cream/45 sm:flex-row">
          <p>
            © {year} {site.name} · IČO {contact.ico}
          </p>

          <div className="flex items-center gap-6">
            <Link href="/#uvod" className="transition-colors hover:text-cream">
              Nahoru ↑
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 transition-colors hover:text-cream"
            >
              <Icon name="key" size={14} />
              Správa rezervací
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
