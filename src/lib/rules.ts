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
  {
    slug: "ubytovani",
    title: "Ubytovací řád",
    icon: "key",
    summary:
      "Podmínky pobytu v penzionu — nástup a odjezd, práva a povinnosti hostů i ubytovatele. Přečtěte si je prosím před příjezdem.",
    rules: [
      {
        text: "Host při nástupu k ubytování předloží doklad totožnosti k zápisu do knihy ubytovaných a uhradí dohodnutou cenu pobytu, pokud nebyla zaplacena jiným způsobem.",
      },
      { text: "Host má právo užívat prostory vyhrazené k ubytování, společné prostory penzionu i související služby." },
      { text: "Ubytovatel předá hostovi prostory ve stavu způsobilém k řádnému užívání a zajistí mu nerušený výkon jeho práv." },
      { text: "Bez souhlasu ubytovatele nelze v pokoji provádět žádné změny, například přesouvat vybavení." },
      {
        text: "Nástup k ubytování je možný od 15.00 do 18.00 hodin daného dne, není-li dohodnuto jinak — do té doby ubytovatel pokoj hostovi rezervuje.",
      },
      {
        text: "Není-li ubytovací doba předem sjednána jinak, host uvolní pokoj nejpozději do 10.00 hodin, jinak může být účtován pobyt i za následující den.",
      },
      { text: "Poslední den pobytu host opustí pokoj nejpozději do 10.00 hodin, aby bylo možné pokoj včas připravit pro další hosty." },
      { text: "Ubytování před 6.00 ráno se účtuje jako celá předchozí noc." },
      { text: "Noční klid platí od 22.00 do 7.00 hodin." },
      { text: "Při žádosti o prodloužení pobytu může ubytovatel hostovi nabídnout i jiný pokoj, než ve kterém byl původně ubytován." },
      { text: "Návštěvy na delší dobu jsou možné pouze se souhlasem ubytovatele, a to v době od 8.00 do 22.00 hodin." },
      { text: "Zvíře může mít host v penzionu pouze se souhlasem majitele." },
      { text: "V penzionu mohou být ubytovány pouze osoby bez infekčního onemocnění." },
      { text: "V případě nemoci nebo úrazu hosta zajistí ubytovatel přivolání lékařské pomoci, případně převoz do nemocnice." },
      {
        text: "V pokoji nelze používat vlastní elektrické spotřebiče kromě těch k osobní hygieně (holicí strojek, fén apod.) a spotřebičů s malým příkonem, jako notebook, tiskárna nebo nabíječky.",
      },
      { text: "Při odchodu z pokoje host uzavře okna a vodovodní kohoutky, vypne elektrické přístroje a pokoj uzamkne." },
      {
        text: "Z bezpečnostních důvodů nesmí být děti do 10 let ponechány bez dozoru dospělých v pokoji ani ve společných prostorách penzionu.",
      },
      { text: "Škodu způsobenou na majetku ubytovatele hradí host podle platných předpisů v hotovosti na místě." },
      { text: "Ubytovatel odpovídá za škody, které hostům způsobí na jejich věcech." },
      {
        text: "Host může od smlouvy odstoupit před uplynutím dohodnuté doby — újmu ubytovateli hradí pouze v případě, že jí nemohl zabránit.",
      },
      {
        text: "Za ubytování a související služby host platí dle platného ceníku ubytovatele; požadovanou zálohu ubytovatel nemusí vrátit, pokud host zruší rezervaci a způsobí tím škodu.",
      },
      {
        text: "V zimním období dbejte zvýšené opatrnosti kvůli padajícímu sněhu a rampouchům z budovy — vozidla parkujte mimo dosah střechy a respektujte pokyny správce k přeparkování při úklidu sněhu.",
      },
      { text: "Případné stížnosti a náměty na zlepšení služeb přijímá majitel nebo správce penzionu." },
      // Obě zvýrazněná pravidla schválně pohromadě na konci, stejně jako
      // u bazénu — ať to nepůsobí rozházeně.
      { text: "Při ztrátě klíčů host hradí škodu ve výši 1 500 Kč.", emphasis: true },
      { text: "Kouření není v budově penzionu ani na pokojích dovoleno.", emphasis: true },
    ],
    closingNote:
      "Ubytovatel může před uplynutím dohodnuté doby od smlouvy odstoupit, pokud host i přes upozornění hrubě porušuje dobré mravy nebo ustanovení tohoto ubytovacího řádu.",
  },
  {
    slug: "sauna",
    title: "Provozní řád sauny",
    icon: "fireplace",
    summary: "Pravidla pro bezpečné saunování — přečtěte si je prosím před první návštěvou sauny.",
    rules: [
      { text: "Vstup do sauny je možný pouze po předchozí domluvě s majitelem." },
      { text: "Sauna se platí 300 Kč za hodinu, mimo hodiny zahrnuté v ceně ubytování po domluvě s majitelem." },
      { text: "Před vstupem do sauny se řádně osprchujte." },
      { text: "Do sauny vstupujte bez obuvi a vždy si podložte vlastním ručníkem nebo prostěradlem." },
      { text: "Osoby do 18 let pouze v doprovodu dospělé osoby." },
      { text: "Doporučená doba jednoho pobytu v sauně je 8–12 minut, poté ochlazení a odpočinek — cyklus lze opakovat 2–3×." },
      { text: "Konzumace jídla v sauně není povolena, pitný režim doplňujte před a po saunování." },
      { text: "Po ukončení saunování nechte kamna vychladnout a dveře sauny zavřené." },
      { text: "Jakoukoli závadu nebo poškození nahlaste ihned majiteli." },
      { text: "Za škody způsobené v prostorách sauny odpovídá host podle platných předpisů." },
      // Obě zvýrazněná pravidla schválně pohromadě na konci, stejně jako
      // u ostatních řádů — ať to nepůsobí rozházeně.
      {
        text: "Sauna není vhodná pro osoby s kardiovaskulárním onemocněním, těhotné ženy a osoby pod vlivem alkoholu nebo návykových látek — v případě zdravotních potíží se poraďte předem s lékařem.",
        emphasis: true,
      },
      { text: "Na saunovací kamna a do jejich blízkosti nepatří žádné hořlavé předměty, oblečení ani ručníky.", emphasis: true },
    ],
    closingNote:
      "Za jakékoliv porušení provozního řádu sauny může majitel zakázat vstup do sauny nebo její další používání zpoplatnit či omezit.",
  },
];

/**
 * Kolik dalších řádů se ještě chystá — na hlavní stránce se za skutečné
 * řády doplní tolik prázdných karet „připravujeme". Až přibude další
 * řád do `houseRules`, sniž tohle číslo o jedna.
 */
export const upcomingRulesCount = 0;
