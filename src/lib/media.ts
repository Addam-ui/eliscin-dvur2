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
  /** Popis fotky — důležitý pro vyhledávače i čtečky obrazovky. */
  alt: string;
  /** Ovlivňuje výšku dlaždice v pásu. */
  aspect: "portrait" | "square" | "landscape";
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
  { src: null, alt: "Kamenná společenská místnost s klenbou", aspect: "landscape" },
  { src: null, alt: "Statek z příjezdové cesty", aspect: "landscape" },
  { src: null, alt: "Vyhřívaný bazén na zahradě", aspect: "square" },
  { src: null, alt: "Obývací pokoj pravého křídla", aspect: "portrait" },
  { src: null, alt: "Výhled na Krkonoše z okolí statku", aspect: "landscape" },
  { src: null, alt: "Pergola s grilem a posezením", aspect: "portrait" },
  { src: null, alt: "Kuchyň s jídelním stolem", aspect: "portrait" },
  { src: null, alt: "Dvůr za soumraku", aspect: "square" },
  { src: null, alt: "Zahrada s trampolínou a hřištěm", aspect: "landscape" },
  { src: null, alt: "Cyklostezka Podkrkonoším", aspect: "square" },
  { src: null, alt: "Ložnice s manželskými postelemi", aspect: "square" },
  { src: null, alt: "Původní kamenné zdivo statku", aspect: "portrait" },
  { src: null, alt: "Bazén za večerního osvětlení", aspect: "landscape" },
  { src: null, alt: "Louky a lesy za statkem", aspect: "landscape" },
  { src: null, alt: "Kuchyňský kout levého křídla", aspect: "landscape" },
  { src: null, alt: "Vjezd do oploceného areálu", aspect: "landscape" },
  { src: null, alt: "Stolní tenis pod přístřeškem", aspect: "square" },
  { src: null, alt: "Ranní mlha nad údolím", aspect: "portrait" },
  { src: null, alt: "Ložnice pro šest osob", aspect: "landscape" },
  { src: null, alt: "Parkování v areálu", aspect: "square" },
  { src: null, alt: "Ohniště na zahradě", aspect: "portrait" },
  { src: null, alt: "Cesta k autobusové zastávce", aspect: "square" },
  { src: null, alt: "Koupelna po rekonstrukci", aspect: "portrait" },
  { src: null, alt: "Statek ze zahrady", aspect: "landscape" },
  { src: null, alt: "Herní prvky pro děti", aspect: "landscape" },
  { src: null, alt: "Dřevěné schodiště do patra", aspect: "portrait" },
  { src: null, alt: "Podvečerní pohled na dvůr", aspect: "portrait" },
  { src: null, alt: "Zima v Podkrkonoší", aspect: "landscape" },
  { src: null, alt: "Posezení u kamen", aspect: "square" },
  { src: null, alt: "Zahradní posezení ve stínu", aspect: "square" },
  { src: null, alt: "Jídelní stůl pro celou rodinu", aspect: "landscape" },
];
