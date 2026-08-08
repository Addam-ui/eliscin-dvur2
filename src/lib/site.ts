/**
 * Centrální obsah webu.
 *
 * Skoro všechny texty, ceny a kontakty jsou tady — když je chceš změnit,
 * uprav tenhle soubor a nemusíš sahat do komponent.
 */

export const site = {
  name: "Eliščin dvůr",
  tagline: "Rodinný penzion pod Krkonošemi",
  description:
    "Rodinný penzion Eliščin dvůr v Hajnici u Trutnova. Celý statek jen pro vás — bazén, pergola s grilem, hřiště a Krkonoše za humny. Ubytování až pro 16 osob.",
  url: "https://www.eliscindvur.cz",
} as const;

export const contact = {
  person: "Petra Jansová",
  street: "Hajnice 148",
  zip: "544 66",
  city: "Hajnice — Kyje",
  country: "Česká republika",
  ico: "46473092",
  phones: ["774 311 421", "774 311 420"],
  email: "ordinacepetra@seznam.cz",
  /** Přesná poloha statku podle profilu na Google Maps. */
  coords: { lat: 50.4909923, lng: 15.9220008 },
  /** Sdílený odkaz na profil — používá se u mapy a v odkazu na trasu. */
  googleMapsUrl: "https://maps.app.goo.gl/fQj6WK3WW7zMmgWe7",
  /** Profil penzionu na Googlu, kde jsou recenze. */
  googleReviewUrl: "https://www.google.com/maps?cid=4137937902885754059",
  /** Až budeš mít Facebook / Instagram, doplň sem — jinak nech prázdné. */
  facebook: "",
  instagram: "",
} as const;

/* ------------------------------------------------------------------ */
/* Navigace                                                            */
/* ------------------------------------------------------------------ */

export const navigation = [
  { label: "Úvod", href: "#uvod" },
  { label: "Ubytování", href: "#ubytovani" },
  { label: "Aktivity", href: "#aktivity" },
  { label: "Galerie", href: "#galerie" },
  { label: "Ceník", href: "#cenik" },
  { label: "Rezervace", href: "#rezervace" },
  { label: "Kontakt", href: "#kontakt" },
] as const;

/* ------------------------------------------------------------------ */
/* Úvodní sekce                                                        */
/* ------------------------------------------------------------------ */

export const intro = {
  eyebrow: "Vítejte na dvoře",
  heading: "Celý statek jen pro vaši rodinu",
  body: [
    "Eliščin dvůr je rodinný penzion v Hajnici kousek od Trutnova, na dohled od Krkonoš. Historický statek je památkově chráněný — v letech 2006 až 2010 prošel citlivou rekonstrukcí, která nechala vyniknout původnímu kameni a dřevu a zároveň mu dala pohodlí, jaké dnes od dovolené čekáte.",
    "Nepronajímáme pokoje po jednom. Pronajímáme celý dvůr — se zahradou, bazénem, pergolou i hřištěm. Celý areál je oplocený a uzavřený, takže děti si můžou běhat, kde chtějí, a vy si můžete v klidu sednout k ohni.",
  ],
  stats: [
    { value: "16", label: "lůžek celkem" },
    { value: "2", label: "samostatná křídla" },
    { value: "3×6 m", label: "vyhřívaný bazén" },
    { value: "100 %", label: "soukromí areálu" },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Ubytování                                                           */
/* ------------------------------------------------------------------ */

export const accommodation = {
  eyebrow: "Ubytování",
  heading: "Dvě křídla, jeden statek",
  intro:
    "Dům je uvnitř rozdělený na dvě samostatná křídla s vlastním zázemím. Můžete být dvě rodiny, které mají každá svůj klid — a přesto se potkáváte u jednoho stolu ve společné kamenné místnosti.",

  wings: [
    {
      name: "Pravé křídlo",
      capacity: "až 4 osoby",
      description:
        "Samostatný vchod a vlastní obývací část s kuchyní, jídelním stolem, koženou sedací soupravou a televizí. V patře ložnice se dvěma manželskými postelemi a vlastní koupelnou s WC.",
      features: [
        "Samostatný vchod",
        "Plně vybavená kuchyň",
        "Obývací pokoj s TV",
        "Ložnice — 2× manželská postel",
        "Vlastní koupelna a WC",
      ],
    },
    {
      name: "Levé křídlo",
      capacity: "až 10 osob",
      description:
        "V patře vlastní obývací pokoj s kuchyňským koutem, posezením a televizí. K němu dvě ložnice — jedna se dvěma manželskými postelemi a koupelnou, druhá až pro šest osob, rovněž s vlastní koupelnou a WC.",
      features: [
        "Obývací pokoj s kuchyňským koutem",
        "Ložnice — 2× manželská postel",
        "Ložnice až pro 6 osob",
        "Dvě koupelny s WC",
        "Posezení a TV",
      ],
    },
  ],

  /** Vybavení areálu — `icon` odkazuje na klíč v components/Icons.tsx */
  amenities: [
    {
      icon: "pool",
      title: "Vyhřívaný bazén",
      text: "Osvětlený bazén 3 × 6 × 1,5 m přímo na zahradě. Ideální hloubka i pro menší děti.",
    },
    {
      icon: "grill",
      title: "Pergola s grilem",
      text: "Krytá pergola s posezením a grilem — funguje za slunce i za deště.",
    },
    {
      icon: "trampoline",
      title: "Hřiště a trampolína",
      text: "Herní prvky, trampolína a stolní tenis. Děti si vystačí celý den samy.",
    },
    {
      icon: "fireplace",
      title: "Kamenná společenská místnost",
      text: "Stylová klenutá místnost v přízemí s vlastním zázemím — místo, kde se sejde celá rodina.",
    },
    {
      icon: "parking",
      title: "Parkování v areálu",
      text: "Vlastní parkování uvnitř oploceného pozemku, v ceně pobytu.",
    },
    {
      icon: "fence",
      title: "Oplocený areál",
      text: "Celý dvůr je uzavřený a oplocený. Klid pro vás, bezpečí pro děti.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Aktivity                                                            */
/* ------------------------------------------------------------------ */

export const activities = {
  eyebrow: "Aktivity a výlety",
  heading: "Co se dá podniknout",
  intro:
    "Nemusíte nikam jezdit — a přesto je odkud vybírat. Na zahradě se dá strávit celý týden, a když vyrazíte, máte Krkonoše i Podkrkonoší na dosah.",

  /** `distance` je orientační vzdálenost autem z Eliščina dvora. */
  items: [
    {
      icon: "pool",
      category: "Na dvoře",
      title: "Bazén a zahrada",
      text: "Vyhřívaný osvětlený bazén, trampolína, stolní tenis a hřiště. Grilování pod pergolou až do večera.",
      distance: "0 km",
    },
    {
      icon: "bike",
      category: "Sport",
      title: "Cyklistika Podkrkonoším",
      text: "Značené trasy vedou přímo od dvora — od nenáročných rodinných okruhů po výjezdy do hor.",
      distance: "od dveří",
    },
    {
      icon: "scooter",
      category: "Sport",
      title: "Půjčovna koloběžek",
      text: "Sjezd na koloběžkách je klasika, kterou zvládnou i menší děti. Půjčovny jsou po celém okolí.",
      distance: "v okolí",
    },
    {
      icon: "sports",
      category: "Sport",
      title: "Sportovní areál Havlovice",
      text: "Tenis, minigolf, koupaliště a lanové centrum na jednom místě u řeky Úpy.",
      distance: "~12 km",
    },
    {
      icon: "giraffe",
      category: "S dětmi",
      title: "ZOO Dvůr Králové",
      text: "Safari park se africkou faunou a projížďkou mezi zvířaty — jistota na celý den.",
      distance: "~15 km",
    },
    {
      icon: "mountain",
      category: "Krkonoše",
      title: "Sněžka",
      text: "Nejvyšší hora Česka. Lanovkou z Pece pod Sněžkou nebo pěšky pro ty, co si chtějí sáhnout na dno.",
      distance: "~30 km",
    },
    {
      icon: "sled",
      category: "Krkonoše",
      title: "Černá hora — bobová dráha",
      text: "Lanovka na Černou horu a sjezd na letní bobové dráze. Nahoře vyhlídka po celém hřebeni.",
      distance: "~25 km",
    },
    {
      icon: "fortress",
      category: "Historie",
      title: "Pevnost Stachelberg",
      text: "Největší dělostřelecká tvrz československého opevnění. Podzemí, chodby a výhled do Polska.",
      distance: "~15 km",
    },
    {
      icon: "tower",
      category: "Turistika",
      title: "Jestřebí hory",
      text: "Rozhledny a vyhlídky nad Trutnovem. Krátké výšlapy s velkou odměnou na konci.",
      distance: "~10 km",
    },
    {
      icon: "mill",
      category: "Turistika",
      title: "Babiččino údolí",
      text: "Ratibořice, Staré bělidlo a mlýn — procházka údolím Úpy, kterou znají všichni ze školy.",
      distance: "~30 km",
    },
    {
      icon: "waves",
      category: "S dětmi",
      title: "Koupání v okolí",
      text: "Krytý i venkovní bazén v Trutnově a řada přírodních koupališť v dosahu.",
      distance: "~10 km",
    },
    {
      icon: "walk",
      category: "Turistika",
      title: "Procházky okolím",
      text: "Louky, lesy a polní cesty hned za vraty. Ráno mlha nad údolím, večer srnky na kraji lesa.",
      distance: "od dveří",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Ceník                                                               */
/* ------------------------------------------------------------------ */

export const pricing = {
  eyebrow: "Ceník",
  heading: "Ceny za celý objekt",
  intro:
    "Pronajímáme vždy celý statek — cena je za objekt, ne za osobu. Kolik vás přijede, je na vás, jen ať se vejdete do šestnácti.",

  /** `highlight: true` zvýrazní kartu jako doporučenou. */
  plans: [
    {
      name: "Týden do 10 osob",
      price: 35000,
      unit: "za týden",
      note: "Sobota — sobota",
      description: "Celý objekt na sedm nocí pro menší skupinu.",
      highlight: false,
    },
    {
      name: "Týden do 16 osob",
      price: 42000,
      unit: "za týden",
      note: "Sobota — sobota",
      description: "Plná kapacita statku na sedm nocí. Nejčastější varianta.",
      highlight: true,
    },
    {
      name: "Prodloužený víkend",
      price: 18000,
      unit: "za pobyt",
      note: "Tři noci",
      description: "Kratší pobyt, celý objekt k dispozici.",
      highlight: false,
    },
    {
      name: "Víkend",
      price: 16000,
      unit: "za pobyt",
      note: "Pátek — neděle, dvě noci",
      description: "Rychlý únik z města na dvě noci.",
      highlight: false,
    },
    {
      name: "Silvestr",
      price: 45000,
      unit: "za týden",
      note: "Silvestrovský termín",
      description: "Konec roku na statku, celý týden.",
      highlight: false,
    },
  ],

  included: [
    "Energie (voda, elektřina, topení)",
    "Ložní prádlo",
    "Ručníky",
    "Závěrečný úklid",
    "Parkování v areálu",
    "Bazén, pergola s grilem a hřiště",
  ],

  terms: [
    "Cena je vždy za celý objekt, nikoli za osobu.",
    "Úhrada celého pobytu nejpozději v den příjezdu.",
    "Týdenní pobyty probíhají zásadně od soboty do soboty.",
  ],

  footnote:
    "Máte jiný termín nebo speciální přání? Napište nám — u delších pobytů a mimo sezónu se vždycky domluvíme.",
} as const;

/* ------------------------------------------------------------------ */
/* Rezervace                                                           */
/* ------------------------------------------------------------------ */

export const reservation = {
  eyebrow: "Rezervace",
  heading: "Podívejte se, kdy je volno",
  intro:
    "V kalendáři vidíte obsazené termíny. Vyberte si příjezd a odjezd, pošlete nezávaznou poptávku a my se vám co nejdřív ozveme s potvrzením.",
  maxGuests: 16,
} as const;

/* ------------------------------------------------------------------ */
/* Recenze                                                             */
/* ------------------------------------------------------------------ */

export const reviews = {
  eyebrow: "Reference",
  heading: "Co říkají hosté",
  intro:
    "Nejvíc nám o dvoře řeknou rodiny, které tu už byly. Přečtěte si hodnocení na Googlu — a když jste u nás byli, budeme rádi za pár řádek.",
} as const;

/* ------------------------------------------------------------------ */
/* Kontakt                                                             */
/* ------------------------------------------------------------------ */

export const contactSection = {
  eyebrow: "Kontakt",
  heading: "Jak se k nám dostanete",
  intro:
    "Ležíme v části obce Hajnice zvané Kyje, asi 200 metrů od autobusové zastávky Hajnice, Kyje. Autobusy jezdí na trase Trutnov — Dvůr Králové nad Labem. Přijet se dá autem, autobusem i na kole.",
  directions: [
    {
      icon: "car",
      title: "Autem",
      text: "Z Trutnova i ze Dvora Králové nad Labem jste u nás za čtvrt hodiny. Parkování je přímo v oploceném areálu.",
    },
    {
      icon: "bus",
      title: "Autobusem",
      text: "Zastávka Hajnice, Kyje je 200 metrů od dvora, na lince Trutnov — Dvůr Králové nad Labem.",
    },
    {
      icon: "bike",
      title: "Na kole",
      text: "Značené cyklotrasy Podkrkonoším vedou přímo kolem. Kola necháte v uzamčeném areálu.",
    },
  ],
} as const;
