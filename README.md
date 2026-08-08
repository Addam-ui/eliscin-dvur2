# Eliščin dvůr — web penzionu

Nový web rodinného penzionu Eliščin dvůr v Hajnici, včetně rezervačního
systému a administrace pro majitelku.

**Technologie:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 ·
Prisma + SQLite (lokálně) / PostgreSQL (produkce)

---

## Rychlý start

```bash
npm install
```

```bash
cp .env.example .env
```

Vygeneruj tajný klíč pro přihlašovací cookie a vlož ho do `.env` jako `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Nastav heslo do administrace — vypsaný řádek zkopíruj do `.env`:

```bash
npm run admin:hash -- tvojeTajneHeslo
```

Vytvoř databázi a spusť web:

```bash
npm run db:push
```

```bash
npm run dev
```

Web běží na `http://localhost:3000`, administrace na `http://localhost:3000/admin`.

---

## Kde se co mění

| Co chceš změnit | Soubor |
| --- | --- |
| Texty, ceny, kontakty, seznam aktivit | `src/lib/site.ts` |
| Hero video a seznam fotek v galerii | `src/lib/media.ts` |
| Barvy, fonty, stíny, animace | `src/app/globals.css` |
| Ikony | `src/components/Icons.tsx` |
| Obsah e-mailů (poptávka, potvrzení, zamítnutí) | `src/lib/email.ts` |
| Favicon, ikona pro iPhone, náhled při sdílení odkazu | `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/opengraph-image.tsx` |
| Zásady ochrany osobních údajů | `src/app/ochrana-osobnich-udaju/page.tsx` |

Skoro všechen obsah je v `src/lib/site.ts` — ceny, popisy pokojů, aktivity
i kontakty. Do komponent kvůli běžné úpravě textu sahat nemusíš.

---

## Přidání videa do hero sekce

1. Nahraj video do `public/video/`, například `hero.mp4`.
2. V `src/lib/media.ts` nastav:

   ```ts
   video: "/video/hero.mp4",
   ```

3. Volitelně přidej i WebM verzi (`videoWebm`) — je menší a Chrome ji upřednostní.

**Doporučené parametry:** 1920×1080, 15–25 sekund ve smyčce, do ~10 MB,
**bez zvukové stopy** (video hraje automaticky a ztlumeně).

Dokud video nenastavíš, ukazuje se statický obrázek s pomalým zoomem —
web tedy vypadá kompletně i bez něj.

Poster (obrázek, než se video načte) změníš taky v `src/lib/media.ts`
v poli `poster`.

---

## Přidání fotek do galerie

1. Nahraj fotky do `public/gallery/`.
2. V `src/lib/media.ts` doplň do pole `galleryItems` řádek:

   ```ts
   { src: "/gallery/kuchyne.jpg", alt: "Kuchyň s jídelním stolem", aspect: "landscape" },
   ```

   - `aspect` — `portrait`, `square` nebo `landscape` (ovlivňuje výšku dlaždice)
   - `alt` — krátký popis. Nikde se nezobrazuje, ale zůstává v HTML kvůli
     Googlu a čtečkám obrazovky pro nevidomé — nepřeskakuj ho.

3. Vygeneruj náhled pro pás galerie:

   ```bash
   npm run gallery:thumbs
   ```

   Bez tohohle kroku se fotka v pásu nezobrazí — pás totiž nepoužívá
   originální soubor, ale malý předgenerovaný náhled (viz níž proč).
   Skript je bezpečné spouštět opakovaně, přeskočí fotky, které náhled
   už mají.

Položky, které mají `src: null`, zobrazují zástupnou dlaždici. Až budeš mít
skutečné fotky, stačí `null` nahradit cestou k souboru a udělat krok 3.

### Proč se v pásu nepoužívají originální fotky

U desítek fotek najednou by prohlížeč při první návštěvě čekal na to, až se
na serveru zpracuje a zmenší úplně každá z nich zvlášť — to je znát jako
znatelné zpomalení. Řešení: `npm run gallery:thumbs` předem zmenší všechny
fotky z `public/gallery/` na malé náhledy (800 px, ~70 kB) uložené
v `public/gallery/thumbs/` a ty se v pásu použijí místo originálu. Plná
kvalita fotky se pořád použije, až si ji návštěvník rozklikne.

### Jak je galerie poskládaná

Galerie je jeden vodorovný pás — žádné kategorie ani záložky, prostě všechny
fotky za sebou v pořadí, v jakém jsou v `galleryItems`. Klidně tam naházej
fotky interiéru, exteriéru i okolí pomíchaně, jak se ti to bude hodit.
Popisky (`alt`) se u fotek v pásu ani v rozkliknutém zobrazení nezobrazují —
záměrně, aby fotky nic nerušilo.

Prohlíží se:
- **přirozeným scrollem/swipem** myší, trackpadem nebo prstem,
- **šipkami** po stranách (na desktopu, jen když je co posouvat),
- **klávesnicí** — klikni do pásu a použij šipky doleva/doprava.

Klik na fotku ji zvětší přes celou obrazovku. V rozkliknutém zobrazení se
mezi fotkami dá přepínat i kolečkem myši nebo swipem, ne jen šipkami.

### Počet fotek

Počet fotek není ničím omezený. Pás se prostě prodlouží — třicet i padesát
fotek funguje stejně, jen se přes ně o kus víc proscrolluje. Žádné prázdné
místo ani rozbitý layout nehrozí.

---

## Administrace

Přihlášení na `/admin`, po přihlášení se otevře kalendář na `/admin/kalendar`.
Odkaz vede i z patičky webu („Správa rezervací").

Co administrace umí:

- **Kalendář obsazenosti** — měsíční přehled, barevně odlišené potvrzené
  pobyty, čekající poptávky a ruční blokace. Kliknutím na obsazený den se
  otevře detail rezervace.
- **Přehled** — kolik poptávek čeká, kolik nocí je obsazeno, nejbližší příjezd.
- **Seznam rezervací** — s kontaktem na hosta, jeho zprávou a tlačítky
  Potvrdit / Zamítnout / Smazat.
- **Blokace termínu** — zabrání dnů, kdy nechceš nikoho ubytovat (malování,
  návštěva rodiny). Termín se vybírá kliknutím do kalendáře, stejně jako
  na webu — první klik je den příjezdu, druhý den odjezdu. Na obsazené nebo
  už zablokované dny se kliknout nedá. Na webu se pak ukážou jako obsazené.

### Jak fungují termíny

Den odjezdu se nepočítá jako obsazená noc — kdo odjíždí v sobotu, neblokuje
sobotu dalšímu hostovi. Rezervace 8. → 15. srpna tedy obsazuje sedm nocí
a 15. srpna může přijet někdo další.

Poptávka z webu je vždy **nezávazná** a uloží se jako „čeká na vyřízení".
Termín zablokuje až ve chvíli, kdy ji v administraci potvrdíš. Systém přitom
hlídá, aby nešlo potvrdit dvě rezervace na stejné dny.

---

## E-mailová upozornění

Web umí posílat tři typy e-mailů přes [Resend](https://resend.com):

- **Tobě** — jakmile přijde nová poptávka z webu (na adresu z `contact.email`
  v `src/lib/site.ts`).
- **Hostovi** — když v administraci poptávku potvrdíš.
- **Hostovi** — když ji zamítneš.

Bez nastavení web funguje úplně stejně, jen se e-maily neposílají — poptávky
se dál ukládají a vidíš je v administraci, jen o nich nedostaneš upozornění
mimo web.

### Jak to zprovoznit

1. **Založ si účet na [resend.com](https://resend.com).** Free tarif zvládne
   3 000 e-mailů měsíčně, na penzion bohatě stačí. Registrace je jen e-mail
   a heslo, platební kartu nechce.

2. **Vytvoř API klíč.** V administraci Resendu: *API Keys → Create API Key*.
   Stačí oprávnění „Sending access". Klíč se ukáže jen jednou, hned si ho zkopíruj.

3. **Vlož klíč do `.env`:**

   ```
   RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

4. **Restartuj `npm run dev`** (proměnné prostředí se čtou jen při startu).
   Tím je to hotové — e-maily teď fungují, jen se posílají z adresy
   `onboarding@resend.dev` (Resend testovací adresa, funguje bez ověřování
   a chodí odkudkoli komukoli).

### Vlastní odesílací adresa (volitelné, ale doporučené)

Aby e-maily chodily z `rezervace@eliscindvur.cz` místo z Resendovy testovací
adresy, je potřeba ověřit vlastní doménu:

1. V Resendu: *Domains → Add Domain*, zadej `eliscindvur.cz`.
2. Resend vypíše pár DNS záznamů (SPF, DKIM) — vlož je tam, kde spravuješ
   DNS domény (u toho, přes koho je doména koupená). Ověření trvá od pár
   minut do pár hodin.
3. Až Resend doménu potvrdí jako ověřenou, změň v `.env`:

   ```
   EMAIL_FROM="Eliščin dvůr <rezervace@eliscindvur.cz>"
   ```

Do té doby e-maily fungují i bez tohohle kroku — jen z testovací adresy.

### Jak to poznat, že to funguje

Pošli si přes web zkušební poptávku (klidně na vlastní e-mail) a podívej se
do administrace Resendu do sekce *Logs* — tam uvidíš, jestli se e-mail
odeslal, a pokud ne, přesně proč (špatný klíč, neověřená doména apod.).
Stejnou informaci najdeš i v terminálu, kde běží `npm run dev` — chyba se
tam vypíše, ale poptávka se uloží bez ohledu na to, jestli e-mail projde.

---

## GDPR / ochrana osobních údajů

Web má stránku [`/ochrana-osobnich-udaju`](src/app/ochrana-osobnich-udaju/page.tsx)
se zásadami ochrany osobních údajů, odkaz na ni je v patičce. Kromě toho:

- **Rezervační formulář** má povinné zaškrtávací pole se souhlasem se
  zpracováním údajů. Bez zaškrtnutí se formulář neodešle — kontroluje se
  na webu i na serveru. Čas souhlasu se ukládá k rezervaci (`consentedAt`
  v databázi), takže máš doklad, že host souhlasil.
- **Google mapa** v sekci Kontakt se nenačte automaticky, ale až po
  kliknutí na „Zobrazit mapu" — do té doby se k Google nic neposílá.
- Web sám nepoužívá žádné analytické ani marketingové cookies, takže
  (zatím) nepotřebuje cookie lištu. Jediná cookie je přihlašovací pro
  administraci, ta se týká jen tebe, ne návštěvníků webu.

### Co bys měla ještě zkontrolovat

Text zásad jsem napsal přesně podle toho, jak systém skutečně funguje —
jaká data se sbírají, kam se posílají (Resend, hosting) a jaká máte práva.
Není to ale právní rada. Než web spustíš ostro, doporučuju:

- **Nechat text projít účetní/právníkem** — hlavně lhůtu uchovávání dat
  (teď nastavenou na 3 roky, viz `AKTUALIZOVANO` a text v
  `src/app/ochrana-osobnich-udaju/page.tsx`) a to, jestli se něco mění
  v souvislosti s účetnictvím/fakturací, až ji budeš řešit.
- **Pohlídat, že údaje v textu sedí** — adresa, IČO a kontakt se berou
  automaticky z `contact` v `src/lib/site.ts`, takže se samy neliší, ale
  pasáž o Resendu/hostingu uprav, pokud změníš poskytovatele.
- Pokud v budoucnu přidáš Google Analytics nebo jinou službu, která
  sleduje návštěvnost, bude potřeba doplnit cookie lištu se souhlasem —
  bez ní by to nebylo v pořádku.

---

## Nasazení na Vercel

SQLite na Vercelu nefunguje — soubor se po každém nasazení zahodí. Pro produkci
je potřeba PostgreSQL. Zdarma ho dostaneš třeba u [Neonu](https://neon.tech)
nebo přímo ve Vercelu (Storage → Postgres).

1. **Přepni Prisma na Postgres** — v `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

   Schéma je psané tak, aby fungovalo na obou databázích, takže víc měnit nemusíš.

2. **Nahraj projekt na GitHub** a naimportuj ho ve Vercelu.

3. **Nastav proměnné prostředí** ve Vercelu (Settings → Environment Variables):

   | Proměnná | Hodnota |
   | --- | --- |
   | `DATABASE_URL` | připojovací řetězec z Neonu / Vercel Postgresu |
   | `ADMIN_PASSWORD_HASH` | výstup `npm run admin:hash` |
   | `AUTH_SECRET` | náhodný řetězec (viz Rychlý start) |
   | `RESEND_API_KEY` | klíč z Resendu (viz sekce *E-mailová upozornění* výš) |
   | `EMAIL_FROM` | `Eliščin dvůr <onboarding@resend.dev>`, nebo vlastní ověřená adresa |

4. **Vytvoř tabulky v produkční databázi** — lokálně s produkčním
   `DATABASE_URL` spusť:

   ```bash
   npx prisma db push
   ```

5. **Přesměruj doménu** `eliscindvur.cz` na Vercel (Settings → Domains).

> **Poznámka k `ADMIN_PASSWORD_HASH`:** bcrypt hash obsahuje znak `$`
> a Next.js by ho v souboru `.env` expandoval jako proměnnou — heslo by tiše
> přestalo fungovat. Proto `npm run admin:hash` vypisuje hash zakódovaný
> do base64. Ta hodnota funguje beze změny lokálně i na Vercelu.

---

## Nasazení na Netlify

Stejná podmínka jako u Vercelu — SQLite na serverless hostingu nefunguje,
je potřeba PostgreSQL. Kroky s Prisma a tabulkami jsou stejné jako výš, jen
se navíc řeší na jiném místě:

1. **Založ si Postgres databázi.** Buď zvlášť na [Neonu](https://neon.tech)
   (zdarma), nebo přímo v Netlify přes *Extensions → Neon* — Netlify pak
   `DATABASE_URL` nastaví za tebe automaticky.

2. **Přepni Prisma na Postgres** — v `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Nahraj projekt na GitHub** a v Netlify: *Add new site → Import an
   existing project* → vyber repozitář. Netlify Next.js rozpozná
   automaticky (`netlify.toml` v projektu už je připravený).

4. **Nastav proměnné prostředí** v Netlify (Site configuration →
   Environment variables) — stejná pětice jako u Vercelu výš
   (`DATABASE_URL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`, `RESEND_API_KEY`,
   `EMAIL_FROM`). Pokud jsi databázi založil přes Netlify Neon extension,
   `DATABASE_URL` už tam bude mít.

5. **Vytvoř tabulky v produkční databázi** — lokálně s produkčním
   `DATABASE_URL` spusť:

   ```bash
   npx prisma db push
   ```

6. **Přesměruj doménu** (Domain management), pokud chceš vlastní doménu
   místo té, co Netlify přidělí automaticky (`nazev.netlify.app`).

> Chceš nasadit rychle bez GitHubu, jen pro ukázku? Jde to i přes
> `netlify-cli` přímo z tohohle počítače (`npx netlify-cli deploy --prod`)
> — přihlásíš se v otevřeném prohlížeči a nasadí se aktuální stav složky.
> Pro cokoli dlouhodobějšího je ale lepší cesta přes GitHub výš, protože
> se pak nasadí samo při každé změně.

---

## Užitečné příkazy

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run db:studio
```

`db:studio` otevře grafického klienta databáze — hodí se, když je potřeba
sáhnout na data ručně.

---

## Co ještě zbývá doladit

- **Fotky a video** — zatím jsou všude zástupné vizuály.
- **Přímý odkaz na napsání recenze** — obě tlačítka v sekci recenzí teď vedou
  na profil penzionu na Googlu, kde se recenze píšou přes tlačítko na stránce.
  Rovnou otevřít formulář by šlo přes odkaz
  `https://search.google.com/local/writereview?placeid=<Place ID>`, k tomu je
  ale potřeba Place ID ve tvaru `ChIJ…` — vytáhneš ho z
  [Place ID Finderu](https://developers.google.com/maps/documentation/places/web-service/place-id)
  a vložíš do `contact.googleReviewUrl`.
- **Ceník** — struktura je připravená v `pricing.plans`, ceny odpovídají
  starému webu.
- **Vlastní odesílací adresa e-mailů** — dokud si v Resendu neověříš doménu
  `eliscindvur.cz`, chodí e-maily z testovací adresy Resendu. Funkčně to
  nevadí, jen v poli „Od" nebude vaše doména. Postup je v sekci
  *E-mailová upozornění*.
