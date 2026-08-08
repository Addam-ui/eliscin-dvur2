import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icons";
import { houseRules } from "@/lib/rules";
import { site } from "@/lib/site";

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

export default async function HouseRulePage({ params }: PageProps) {
  const { slug } = await params;
  const doc = houseRules.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <>
      <SiteHeader />

      <main id="hlavni-obsah" className="bg-cream pb-24 pt-32 sm:pb-32 sm:pt-36">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href="/#provozni-rady"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-faint transition-colors hover:text-forest"
          >
            <Icon name="arrowRight" size={15} className="rotate-180" />
            Zpět na provozní řády
          </Link>

          <div className="mt-6 flex items-center gap-4">
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

          <p className="mt-10 text-sm text-ink-faint">
            Otázky k provozu {site.name.toLowerCase()}? Napište nebo zavolejte — kontakty
            najdete{" "}
            <Link href="/#kontakt" className="link-underline text-ink">
              tady
            </Link>
            .
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
