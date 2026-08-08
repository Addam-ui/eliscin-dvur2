import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icons";
import { contact, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description: `Zásady ochrany osobních údajů webu ${site.name}.`,
  robots: { index: true, follow: true },
};

/**
 * POSLEDNÍ AKTUALIZACE — přepiš při každé obsahové změně této stránky.
 * Uvedené lhůty uchovávání jsou rozumný výchozí návrh, ne právní rada —
 * než web spustíš ostro, dej je prosím zkontrolovat účetní/právníkovi,
 * hlavně ve vztahu k daňovým a účetním povinnostem.
 */
const AKTUALIZOVANO = "8. srpna 2026";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <main id="hlavni-obsah" className="bg-cream pb-24 pt-32 sm:pb-32 sm:pt-36">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <span className="eyebrow">Právní informace</span>
          <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">
            Ochrana osobních údajů
          </h1>
          <p className="mt-4 text-sm text-ink-faint">Poslední aktualizace: {AKTUALIZOVANO}</p>

          <div className="prose-legal mt-10 space-y-10 text-[0.98rem] leading-relaxed text-ink-soft">
            <section>
              <p>
                Tyto zásady popisují, jaké osobní údaje web {site.name} zpracovává, k čemu
                a jak dlouho, a jaká máte jako návštěvník nebo host práva. Řídíme se
                nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a souvisejícími
                českými předpisy.
              </p>
            </section>

            <Section title="Kdo je správcem údajů">
              <p>
                Správcem osobních údajů je {contact.person}, IČO {contact.ico}, se sídlem{" "}
                {contact.street}, {contact.zip} {contact.city} (dále jen „my" nebo
                „provozovatel"). Ve věcech ochrany osobních údajů nás můžete kontaktovat na{" "}
                <a href={`mailto:${contact.email}`} className="link-underline text-ink">
                  {contact.email}
                </a>{" "}
                nebo na telefonu{" "}
                <a
                  href={`tel:+420${contact.phones[0].replace(/\s/g, "")}`}
                  className="link-underline text-ink"
                >
                  {contact.phones[0]}
                </a>
                .
              </p>
            </Section>

            <Section title="Jaké údaje zpracováváme a proč">
              <h3 className="font-display text-xl text-ink">Rezervační formulář</h3>
              <p>
                Když přes web odešlete poptávku na ubytování, zpracováváme jméno a
                příjmení, e-mail, telefon, počet osob, zvolený termín a případnou zprávu,
                kterou nám napíšete. Tyto údaje potřebujeme, abychom s vámi mohli
                rezervaci dojednat a zajistit — jde tedy o zpracování nezbytné pro jednání
                o uzavření smlouvy a její následné plnění (čl. 6 odst. 1 písm. b) GDPR).
                Odesláním formuláře nás k tomu navíc výslovně žádáte a potvrzujete souhlas
                se zpracováním.
              </p>

              <h3 className="mt-6 font-display text-xl text-ink">E-mailová komunikace</h3>
              <p>
                O nové poptávce se informujeme e-mailem a totéž děláme obráceně — když
                rezervaci potvrdíme nebo zamítneme, pošleme vám o tom e-mail. K odeslání
                těchto e-mailů používáme službu{" "}
                <a
                  href="https://resend.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink"
                >
                  Resend
                </a>{" "}
                (Resend, Inc., USA), která pro nás vystupuje jako zpracovatel. Případný
                přenos údajů mimo Evropskou unii je zajištěn standardními smluvními
                doložkami podle čl. 46 GDPR.
              </p>

              <h3 className="mt-6 font-display text-xl text-ink">Mapa a kontaktní údaje</h3>
              <p>
                Na webu je odkaz na Google Maps a — až po vašem kliknutí — vložená mapa od
                Googlu. Kliknutím na „Zobrazit mapu" se od Googlu načte obsah, který může
                zpracovat vaši IP adresu a další technické údaje podle{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink"
                >
                  zásad ochrany soukromí Google
                </a>
                . Bez kliknutí se k Googlu nic neposílá.
              </p>
            </Section>

            <Section title="Soubory cookie">
              <p>
                Web sám o sobě nepoužívá žádné analytické ani marketingové cookies. Jediná
                cookie, kterou nastavujeme, slouží k přihlášení do administrace rezervací
                (chráněné heslem) — je určená pouze pro provozovatele webu, ne pro
                návštěvníky, a po sedmi dnech automaticky vyprší. Pokud v budoucnu přibudou
                další cookies (např. návštěvnost), tuto stránku doplníme a přidáme
                odpovídající souhlas.
              </p>
            </Section>

            <Section title="Jak dlouho údaje uchováváme">
              <p>
                Údaje o rezervaci — ať už vyřízené, zamítnuté, nebo na kterých jsme se
                nakonec nedohodli — uchováváme po dobu nezbytnou k vyřízení pobytu a dále
                přiměřenou dobu poté pro případ reklamací či právních nároků, nejdéle však
                3 roky od konce pobytu (nebo od odeslání poptávky, pokud k pobytu nedojde).
                Pokud pro některé údaje platí delší lhůta podle zvláštního zákona (typicky
                účetní nebo daňové doklady), uchováváme je po tuto zákonnou dobu.
              </p>
            </Section>

            <Section title="Komu údaje předáváme">
              <p>
                Osobní údaje nepředáváme žádným třetím stranám za účelem jejich vlastního
                marketingu. Ke zpracování využíváme tyto zpracovatele a poskytovatele
                technické infrastruktury:
              </p>
              <ul className="mt-3 space-y-1.5">
                <li>
                  <strong className="text-ink">Resend</strong> — odesílání e-mailových
                  upozornění.
                </li>
                <li>
                  <strong className="text-ink">Poskytovatel hostingu a databáze</strong> —
                  technické uložení webu a rezervačních dat.
                </li>
              </ul>
              <p className="mt-3">
                Se všemi zpracovateli máme, nebo uzavřeme, smlouvu o zpracování osobních
                údajů podle čl. 28 GDPR.
              </p>
            </Section>

            <Section title="Vaše práva">
              <p>Ve vztahu ke svým osobním údajům máte právo:</p>
              <ul className="mt-3 space-y-1.5">
                <li>na přístup k údajům, které o vás zpracováváme,</li>
                <li>na opravu nepřesných nebo neúplných údajů,</li>
                <li>na výmaz údajů („právo být zapomenut"),</li>
                <li>na omezení zpracování,</li>
                <li>na přenositelnost údajů,</li>
                <li>vznést proti zpracování námitku.</li>
              </ul>
              <p className="mt-3">
                Kterékoli z těchto práv můžete uplatnit e-mailem nebo telefonicky na
                kontaktech uvedených výše — ozveme se co nejdřív, nejpozději do měsíce.
                Pokud se domníváte, že s vašimi údaji nezacházíme správně, máte právo podat
                stížnost u Úřadu pro ochranu osobních údajů (Pplk. Sochora 27, 170 00 Praha
                7,{" "}
                <a
                  href="https://www.uoou.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink"
                >
                  www.uoou.cz
                </a>
                ).
              </p>
            </Section>

            <Section title="Zabezpečení">
              <p>
                Přenos dat mezi vaším prohlížečem a webem je šifrovaný (HTTPS). Přístup do
                administrace rezervací je chráněný heslem, které se v databázi neukládá
                v čitelné podobě. K rezervačním údajům má přístup pouze provozovatel.
              </p>
            </Section>
          </div>

          <div className="mt-14 flex items-center gap-3 border-t border-linen pt-8">
            <Icon name="arrowRight" size={16} className="rotate-180 text-ink-faint" />
            <Link href="/" className="link-underline font-medium text-ink">
              Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink sm:text-[1.7rem]">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
