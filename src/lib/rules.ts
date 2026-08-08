import type { IconName } from "@/components/Icons";

/**
 * Provozní řády ke stažení/přečtení — bazén, sauna a další, jak přibudou.
 *
 * Přidání dalšího řádu:
 *   1. Nahraj dokument do `public/dokumenty/`.
 *   2. Přidej sem novou položku se `slug` (použije se v URL adrese
 *      `/provozni-rady/slug`), ikonou a seznamem pravidel.
 *
 * Detailní stránka i karta na hlavní stránce se vytvoří automaticky —
 * nikde jinde nic upravovat nemusíš.
 */

export interface HouseRuleLine {
  text: string;
  /** Zvýrazní řádek (zákazy, důležitá upozornění). */
  emphasis?: boolean;
}

export interface HouseRuleDoc {
  slug: string;
  title: string;
  icon: IconName;
  summary: string;
  rules: HouseRuleLine[];
  /** Poznámka na konci — např. co hrozí za porušení. */
  closingNote?: string;
  /** Cesta k původnímu dokumentu v `public/`, pokud existuje. */
  downloadFile?: string;
  downloadLabel?: string;
}

export const houseRules: HouseRuleDoc[] = [
  {
    slug: "bazen",
    title: "Provozní řád bazénu",
    icon: "pool",
    summary:
      "Pravidla pro bezpečné a příjemné koupání — přečtěte si je prosím před první návštěvou bazénu.",
    rules: [
      { text: "Vstup do bazénu bez obuvi — obuv si odložte na připravené podložky." },
      { text: "Osoby do 18 let pouze v doprovodu dospělé osoby." },
      { text: "O otevření lamelového krytu bazénu vás poučí majitel." },
      { text: "Před vstupem do vody je nutné se řádně osprchovat." },
      { text: "Na vycákanou vodu používejte připravené stěrky." },
      { text: "Na odvlhčovač nepokládejte žádné předměty (např. ručníky)." },
      {
        text: "Pokud na odvlhčovači svítí chyba P1, bazén řádně vyvětrejte okny, případně zavolejte majiteli.",
      },
      { text: "Dvě hodiny bazénu jsou v ceně ubytování, další hodiny po domluvě s majitelem." },
      { text: "Používání sauny pouze po domluvě s majitelem, 300 Kč za hodinu." },
      {
        text: "Po ukončení koupání je nutné zarolovat krytí bazénu, vložit nádobu s dezinfekcí a vystěrkovat podlahu do kanálků — pokud nedojde k úklidu, bude účtováno zvlášť 200 Kč.",
      },
      // Obě zvýrazněná pravidla schválně pohromadě na konci, těsně před
      // závěrečnou poznámkou o postihu — ať to nepůsobí rozházeně.
      { text: "Přísný zákaz skákání do bazénu!", emphasis: true },
      { text: "U bazénu není možné konzumovat jídlo ani pití.", emphasis: true },
    ],
    closingNote:
      "Za jakékoliv porušení provozního řádu bazénu může majitel zakázat vstup do bazénu nebo si účtovat další poplatky.",
    downloadFile: "/dokumenty/provozni-rad-bazenu.docx",
    downloadLabel: "Stáhnout jako Word dokument",
  },
];

/**
 * Kolik dalších řádů se ještě chystá — na hlavní stránce se za skutečné
 * řády doplní tolik prázdných karet „připravujeme". Až přibude další
 * řád do `houseRules`, sniž tohle číslo o jedna.
 */
export const upcomingRulesCount = 2;
