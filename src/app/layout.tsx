import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { site, contact } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "penzion Krkonoše",
    "ubytování Hajnice",
    "chalupa pro rodiny",
    "ubytování Trutnov",
    "pronájem celého objektu",
    "Eliščin dvůr",
  ],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2c4a38",
  width: "device-width",
  initialScale: 1,
};

/** Strukturovaná data pro Google — pomáhá s vyhledáváním ubytování. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: `+420${contact.phones[0].replace(/\s/g, "")}`,
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.street,
    postalCode: contact.zip,
    addressLocality: contact.city,
    addressCountry: "CZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: contact.coords.lat,
    longitude: contact.coords.lng,
  },
  petsAllowed: false,
  numberOfRooms: 3,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Bazén", value: true },
    { "@type": "LocationFeatureSpecification", name: "Gril", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parkování zdarma", value: true },
    { "@type": "LocationFeatureSpecification", name: "Dětské hřiště", value: true },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {/*
          Pojistka pro vypnutý JavaScript: prvky určené k postupnému odkrývání
          by bez něj zůstaly neviditelné, protože je nemá co odkrýt.
          <noscript> se uplatní jen když skripty neběží, takže se HTML na
          serveru i na klientu shoduje a hydratace nic nehlásí.
        */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
