import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icons";
import { houseRules } from "@/lib/rules";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return houseRules.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = houseRules.find((d) => d.slug === slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.summary,
    robots: { index: true, follow: true },
  };
}

/**
 * Samostatná stránka bez hlavičky a patičky webu — jen řád samotný
 * a odkaz na stažení. Schválně minimální, ať se dá pohodlně otevřít
 * třeba přes QR kód vyvěšený přímo u bazénu, bez zbytečné navigace.
 */
export default async function HouseRulePage({ params }: PageProps) {
  const { slug } = await params;
  const doc = houseRules.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <main className="min-h-screen bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest text-cream">
            <Icon name={doc.icon} size={27} strokeWidth={1.4} />
          </div>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{doc.title}</h1>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-ink-soft">{doc.summary}</p>

        {doc.downloadFile && (
          <a
            href={doc.downloadFile}
            download
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest-deep"
          >
            <Icon name="download" size={17} />
            {doc.downloadLabel ?? "Stáhnout dokument"}
          </a>
        )}

        <ul className="mt-10 space-y-3.5 border-t border-linen pt-10">
          {doc.rules.map((rule, i) => (
            <li
              key={i}
              className={`flex items-start gap-3.5 rounded-2xl px-4 py-3.5 ${
                rule.emphasis ? "bg-clay-pale text-clay" : "bg-sand/60 text-ink"
              }`}
            >
              <Icon
                name={rule.emphasis ? "close" : "check"}
                size={18}
                strokeWidth={2.2}
                className={`mt-0.5 shrink-0 ${rule.emphasis ? "text-clay" : "text-forest-light"}`}
              />
              <span className={`leading-relaxed ${rule.emphasis ? "font-medium" : ""}`}>
                {rule.text}
              </span>
            </li>
          ))}
        </ul>

        {doc.closingNote && (
          <p className="mt-8 rounded-2xl bg-forest-deep px-6 py-5 text-sm leading-relaxed text-cream/85">
            {doc.closingNote}
          </p>
        )}
      </div>
    </main>
  );
}
