/**
 * Konfigurace médií — video v hero sekci a fotogalerie.
 *
 * Dokud sem nevložíš vlastní soubory, web používá zástupné vizuály,
 * takže vypadá kompletně i bez nich. Návod je v README.md.
 */

/* ------------------------------------------------------------------ */
/* Hero video                                                          */
/* ------------------------------------------------------------------ */

export const heroMedia = {
  /**
   * Video na pozadí hero sekce.
   *
   * Jak ho zprovoznit:
   *   1. Nahraj soubor do `public/video/` (např. `hero.mp4`).
   *   2. Nastav `video: "/video/hero.mp4"`.
   *   3. Volitelně přidej i WebM verzi — je menší a Chrome ji upřednostní.
   *
   * Doporučení: 1920×1080, max ~10 MB, 15–25 sekund ve smyčce, BEZ zvuku
   * (video běží automaticky a ztlumeně, zvuk by stejně nehrál).
   */
  video: null as string | null,
  videoWebm: null as string | null,

  /**
   * Statický obrázek — ukáže se, než se video načte, a na mobilech
   * s úsporným režimem dat. Nahraď za skutečnou fotku statku.
   */
  poster: "/placeholders/hero.svg",

  /** Popis pro čtečky obrazovky. */
  posterAlt: "Statek Eliščin dvůr v podvečerním světle pod Krkonošemi",
} as const;

/* ------------------------------------------------------------------ */
/* Fotogalerie                                                         */
/* ------------------------------------------------------------------ */

export interface GalleryItem {
  /**
   * Cesta k fotce, např. "/gallery/kuchyne.jpg".
   * Když necháš `null`, vykreslí se zástupná dlaždice a fotka chybí.
   */
  src: string | null;
  /** Popis fotky — nikde se nezobrazuje, ale zůstává v `alt` atributu
   *  kvůli přístupnosti a vyhledávačům. */
  alt: string;
  /** Ovlivňuje výšku dlaždice v pásu. */
  aspect: "portrait" | "square" | "landscape";
}

/**
 * Cesta k malému předgenerovanému náhledu fotky (pás galerie).
 *
 * V pásu se nepoužívá plná fotka přes Next.js optimalizaci — u desítek
 * fotek najednou by každý unikátní rozměr znamenal vlastní zpracování
 * na serveru při první návštěvě, což je znatelně pomalé. Náhledy jsou
 * proto předem zmenšené a uložené jako statické soubory v `public/gallery/thumbs`.
 * Skript pro jejich vygenerování je popsaný v README.
 */
export function thumbSrc(src: string): string {
  const filename = src.split("/").pop();
  return `/gallery/thumbs/${filename}`;
}

/**
 * Fotky v galerii — jeden společný pás, bez kategorií.
 *
 * Přidání vlastní fotky:
 *   1. Nahraj soubor do `public/gallery/`.
 *   2. Přidej sem řádek a vyplň `src`, `alt` a `aspect`.
 *
 * Pořadí v tomhle poli = pořadí v galerii. Klidně sem naházej fotky
 * interiéru, exteriéru i okolí pomíchaně, jak se ti to bude hodit —
 * žádný limit na počet ani na pořadí tu není.
 */
export const galleryItems: GalleryItem[] = [
  { src: "/gallery/letecky-pohled-bazen-zahrada.jpg", alt: "Letecký pohled na bazén a zahradu Eliščina dvora", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-cely-statek.jpg", alt: "Letecký pohled na celý statek Eliščin dvůr", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-dvur-bazen.jpg", alt: "Letecký pohled na dvůr s bazénem", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-okoli.jpg", alt: "Letecký pohled na statek a okolní krajinu", aspect: "landscape" },
  { src: "/gallery/zahrada-posezeni-kamenne.jpg", alt: "Kamenné posezení na zahradě", aspect: "landscape" },
  { src: "/gallery/zahrada-strom-kamenna-zed.jpg", alt: "Zahrada s kamennou zídkou a vzrostlým stromem", aspect: "landscape" },
  { src: "/gallery/zahrada-hriste-altan.jpg", alt: "Zahrada s altánem a hřištěm pro děti", aspect: "landscape" },
  { src: "/gallery/zahrada-bazen-travnik.jpg", alt: "Rozlehlý trávník s bazénem", aspect: "landscape" },
  { src: "/gallery/pergola-gril-posezeni.jpg", alt: "Krytá pergola s grilem a posezením", aspect: "landscape" },
  { src: "/gallery/zahrada-bazen-stromy.jpg", alt: "Zahrada s bazénem obklopená stromy", aspect: "landscape" },
  { src: "/gallery/terasa-zahony-fasada.jpg", alt: "Terasa se záhony před statkem", aspect: "landscape" },
  { src: "/gallery/terasa-statek-fasada.jpg", alt: "Terasa a fasáda statku", aspect: "landscape" },
  { src: "/gallery/zahrada-strom-posezeni.jpg", alt: "Vzrostlý strom a posezení na zahradě", aspect: "landscape" },
  { src: "/gallery/spolecenska-mistnost-krb.jpg", alt: "Kamenná společenská místnost s krbem", aspect: "landscape" },
  { src: "/gallery/spolecenska-mistnost-klenba.jpg", alt: "Klenutá společenská místnost s kamny", aspect: "landscape" },
  { src: "/gallery/obyvaci-pokoj-sedaci-souprava.jpg", alt: "Obývací pokoj se sedací soupravou", aspect: "landscape" },
  { src: "/gallery/loznice-cihlova-zed.jpg", alt: "Ložnice s cihlovou zdí", aspect: "landscape" },
  { src: "/gallery/jidelna-schodiste-tramy.jpg", alt: "Jídelna s dřevěnými trámy a schodištěm", aspect: "landscape" },
  { src: "/gallery/kuchyne-jidelni-stul.jpg", alt: "Kuchyň s jídelním stolem", aspect: "landscape" },
  { src: "/gallery/loznice-vyhled-oken.jpg", alt: "Ložnice s výhledem z okna", aspect: "landscape" },
  { src: "/gallery/jidelna-velka-okna.jpg", alt: "Jídelní kout s velkými okny", aspect: "landscape" },
  { src: "/gallery/kuchyne-devena-linka.jpg", alt: "Kuchyň s dřevěnou linkou", aspect: "landscape" },
  { src: "/gallery/kuchyne-cihlova-zed.jpg", alt: "Kuchyň s cihlovou zdí", aspect: "landscape" },
  { src: "/gallery/kuchyne-tramovy-strop.jpg", alt: "Kuchyň s trámovým stropem", aspect: "landscape" },
  { src: "/gallery/kuchyne-spotrebice.jpg", alt: "Plně vybavená kuchyň", aspect: "landscape" },
  { src: "/gallery/jidelna-mezanin.jpg", alt: "Jídelní stůl pod mezaninem", aspect: "landscape" },
  { src: "/gallery/podkrovni-loznice-zebrik.jpg", alt: "Podkrovní ložnice s žebříkem", aspect: "landscape" },
  { src: "/gallery/jidelna-terasa-dvere.jpg", alt: "Jídelní stůl u dveří na terasu", aspect: "landscape" },
  { src: "/gallery/cesta-zahrada-plot.jpg", alt: "Cesta zahradou k dřevěnému plotu", aspect: "landscape" },
  { src: "/gallery/fasada-terasa-popinava.jpg", alt: "Fasáda statku s popínavou rostlinou", aspect: "landscape" },
  { src: "/gallery/nadvori-terasa.jpg", alt: "Nádvoří statku", aspect: "landscape" },
  { src: "/gallery/jidelna-posuvne-dvere.jpg", alt: "Jídelna s posuvnými dveřmi na terasu", aspect: "landscape" },
  { src: "/gallery/koupelna-obklady.jpg", alt: "Koupelna s obklady", aspect: "landscape" },
  { src: "/gallery/jidelna-schodiste.jpg", alt: "Jídelní kout se schodištěm", aspect: "landscape" },
  { src: "/gallery/pradelna-pracka.jpg", alt: "Prádelna s pračkou", aspect: "landscape" },
  { src: "/gallery/koupelna-umyvadlo-pracka.jpg", alt: "Koupelna s umyvadlem a pračkou", aspect: "landscape" },
  { src: "/gallery/chodba-vstup-terasa.jpg", alt: "Chodba se vstupem na terasu", aspect: "landscape" },
  { src: "/gallery/koupelna-detail.jpg", alt: "Koupelna po rekonstrukci", aspect: "landscape" },
  { src: "/gallery/koupelna-sprchovy-kout.jpg", alt: "Koupelna se sprchovým koutem", aspect: "landscape" },
  { src: "/gallery/jidelna-schody-tramy.jpg", alt: "Jídelna s dřevěnými trámy", aspect: "landscape" },
  { src: "/gallery/jidelna-vyhled-zahradu.jpg", alt: "Jídelní stůl s výhledem do zahrady", aspect: "landscape" },
  { src: "/gallery/schodiste-terasa.jpg", alt: "Schodiště s výhledem na terasu", aspect: "landscape" },
  { src: "/gallery/terasa-plot-zahrada.jpg", alt: "Terasa s dřevěným plotem", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-dvur-2.jpg", alt: "Letecký pohled na dvůr a přilehlé zahrady", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-statek-blizsi.jpg", alt: "Letecký pohled na statek zblízka", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-strecha-terasa.jpg", alt: "Letecký pohled na střechu a terasu statku", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-zahrada-stromy.jpg", alt: "Letecký pohled na zahradu se vzrostlými stromy", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-vesnice.jpg", alt: "Letecký pohled na statek v obci Hajnice", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-krajina.jpg", alt: "Letecký pohled na statek a krajinu Podkrkonoší", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-siroky.jpg", alt: "Široký letecký pohled na okolí statku", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-krajina-2.jpg", alt: "Letecký pohled na krajinu kolem statku", aspect: "landscape" },
  { src: "/gallery/letecky-pohled-zaver.jpg", alt: "Letecký pohled na Eliščin dvůr a okolí", aspect: "landscape" },
];
