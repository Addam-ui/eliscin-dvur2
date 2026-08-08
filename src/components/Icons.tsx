/**
 * Vlastní sada ikon — ručně kreslené SVG, žádná externí knihovna.
 *
 * Všechny ikony sdílí stejnou mřížku 24×24 a tloušťku tahu, aby vedle sebe
 * působily jako jeden set. Barvu dědí z `currentColor`.
 */

import type { SVGProps } from "react";

export type IconName =
  // vybavení a aktivity
  | "pool"
  | "grill"
  | "trampoline"
  | "fireplace"
  | "parking"
  | "fence"
  | "bike"
  | "scooter"
  | "sports"
  | "giraffe"
  | "mountain"
  | "sled"
  | "fortress"
  | "tower"
  | "mill"
  | "waves"
  | "walk"
  | "trail"
  | "car"
  | "bus"
  // rozhraní
  | "menu"
  | "close"
  | "arrowRight"
  | "arrowUp"
  | "arrowUpRight"
  | "chevronLeft"
  | "chevronRight"
  | "chevronDown"
  | "check"
  | "phone"
  | "mail"
  | "mapPin"
  | "star"
  | "calendar"
  | "users"
  | "google"
  | "spinner"
  | "leaf"
  | "key"
  | "document"
  | "download";

const paths: Record<IconName, React.ReactNode> = {
  /* ---------------- Vybavení areálu ---------------- */

  // Bazén — žebřík a hladina
  pool: (
    <>
      <path d="M6 14V5.5A1.5 1.5 0 0 1 7.5 4h0A1.5 1.5 0 0 1 9 5.5V14" />
      <path d="M13 14V5.5A1.5 1.5 0 0 1 14.5 4h0A1.5 1.5 0 0 1 16 5.5V14" />
      <path d="M9 8h4M9 11h4" />
      <path d="M2 17.2c1.4-1.3 3-1.3 4.4 0s3 1.3 4.4 0 3-1.3 4.4 0 3 1.3 4.4 0" />
      <path d="M2 20.6c1.4-1.3 3-1.3 4.4 0s3 1.3 4.4 0 3-1.3 4.4 0 3 1.3 4.4 0" />
    </>
  ),

  // Gril pod pergolou — poklop, rošt, nohy, stoupající teplo
  grill: (
    <>
      <path d="M3.5 10.5h17a8.5 8.5 0 0 1-8.5 7.5 8.5 8.5 0 0 1-8.5-7.5Z" />
      <path d="M7.5 17.2 6 22M16.5 17.2 18 22M12 18v4" />
      <path d="M9 3.5c0 1-1.2 1.3-1.2 2.4S9 7.6 9 8.6M15 3.5c0 1-1.2 1.3-1.2 2.4S15 7.6 15 8.6" />
      <circle cx="8.5" cy="13.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),

  // Trampolína — rám, plachta, pružiny a poskakující míč
  trampoline: (
    <>
      <ellipse cx="12" cy="10.6" rx="9.2" ry="3.6" />
      <ellipse cx="12" cy="10.6" rx="6.4" ry="2.2" />
      {/* pružiny mezi rámem a plachtou */}
      <path d="M2.8 10.6h2.8M18.4 10.6h2.8M12 7v1.4M12 12.8v1.4" />
      {/* nohy */}
      <path d="M4.6 12.8 2.6 19.4M19.4 12.8l2 6.6M12 14.2v5.2" />
      <path d="M1.2 19.4h2.8M19.8 19.4h2.8M10.6 19.4h2.8" />
      {/* míč — bez něj vypadá ikona jen jako stůl */}
      <circle cx="12" cy="3.4" r="1.6" />
      <path d="M8.6 2.6 7.6 1.4M15.4 2.6l1-1.2" />
    </>
  ),

  // Kamenná společenská místnost — krb s římsou a ohněm
  fireplace: (
    <>
      <path d="M2.6 7.4h18.8" />
      <path d="M4.6 7.4V21M19.4 7.4V21" />
      <path d="M7.8 21v-4.8a4.2 4.2 0 0 1 8.4 0V21" />
      <path d="M2 21h20" />
      <path d="M12 19.6c-1.2 0-2.1-.8-2.1-1.9 0-1.5 1.6-2 1.6-3.6 1.5.6 1.8 1.8 1.5 2.7.5-.2.8-.6.9-1.2.7.7 1 1.5 1 2.1 0 1.1-1.1 1.9-2.9 1.9Z" />
    </>
  ),

  // Parkování v areálu
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4.5" />
      <path d="M9.5 17V7.5h3.2a2.9 2.9 0 0 1 0 5.8H9.5" />
    </>
  ),

  // Oplocený areál
  fence: (
    <>
      <path d="M4 20V8.5L6.5 6 9 8.5V20" />
      <path d="M15 20V8.5L17.5 6 20 8.5V20" />
      <path d="M9 20V8.5L11.5 6 14 8.5V20" />
      <path d="M2 11h20M2 15h20" />
      <path d="M2 20h20" />
    </>
  ),

  /* ---------------- Aktivity ---------------- */

  /*
   * Jízdní kolo. Horní rámová trubka tu schválně není — v mřížce 24 px
   * by splynula se sedlem i řídítky do jedné šmouhy. Takhle zůstane
   * sedlo i řídítka čitelné a rám pořád vypadá jako kolo.
   */
  bike: (
    <>
      <circle cx="5.5" cy="16.9" r="4" />
      <circle cx="18.5" cy="16.9" r="4" />
      <path d="M5.5 16.9 9.8 9.2" />
      <path d="M9.8 9.2 11.8 16.9H5.5" />
      <path d="M11.8 16.9 15.2 9.6 18.5 16.9" />
      <path d="M8.6 9.2h2.4" />
      <path d="M13.9 8.4h2.7" />
      <circle cx="11.8" cy="16.9" r="1" fill="currentColor" stroke="none" />
    </>
  ),

  // Koloběžka — nízká plošina mezi koly, sloupek nad předním kolem
  scooter: (
    <>
      <circle cx="5.2" cy="18.4" r="2.4" />
      <circle cx="18.4" cy="18.4" r="2.4" />
      <path d="M7.6 18.4h6" />
      <path d="M13.6 18.4 18.4 13.6" />
      <path d="M18.4 18.4V4.8" />
      <path d="M15.6 4.8h5.4" />
    </>
  ),

  sports: (
    <>
      <ellipse cx="9.5" cy="9" rx="5.5" ry="6.5" transform="rotate(-30 9.5 9)" />
      <path d="m12.5 14.5 5.5 6.2" />
      <path d="M6 5.5 12.5 12M5.5 9.5 10 14M9 3.5l4.5 4.5" />
      <circle cx="18.5" cy="6" r="2.5" />
    </>
  ),

  // ZOO Dvůr Králové — žirafa
  giraffe: (
    <>
      {/* tělo */}
      <path d="M3.2 17.8v-2.4a3 3 0 0 1 3-3h5.4" />
      <path d="M13.4 13.2c1.4.7 2.2 2 2.2 3.5v1.1" />
      <path d="M3.2 17.8h12.4" />
      {/* nohy */}
      <path d="M5.4 17.8v3.4M13.2 17.8v3.4" />
      {/* ocas */}
      <path d="M3.2 14.8 1.6 12.8" />
      {/* krk */}
      <path d="M11 12.4 14.6 5.8M13.6 13.4 17.2 6.8" />
      {/* hlava */}
      <ellipse cx="16.9" cy="5.2" rx="2.7" ry="1.7" transform="rotate(-30 16.9 5.2)" />
      {/* růžky */}
      <path d="M15.4 3.1 14.9 1.4M17.9 3.9 18.6 2.3" />
      {/* skvrny */}
      <circle cx="6.4" cy="15" r=".9" fill="currentColor" stroke="none" />
      <circle cx="9.8" cy="15.9" r=".9" fill="currentColor" stroke="none" />
    </>
  ),

  mountain: (
    <>
      <path d="m2 19 6.5-11 4 6.2L15 10l7 9H2Z" />
      <path d="m6.2 12.2 2.3 1.5 2.3-1.5" />
      <path d="m13.3 13.5 1.7 1.2 1.7-1.2" />
    </>
  ),

  /*
   * Bobová dráha — sáňky z boku.
   * Laťkovaný sedák tu schválně není: dvě vodorovné lišty se svlaky mezi
   * nimi se v 24 px slily do plného obdélníku.
   */
  sled: (
    <>
      {/* sedák */}
      <path d="M4.8 10.4h14.4" />
      {/* opěrka vzadu */}
      <path d="M18 10.4V6.6M16.2 6.6h3.6" />
      {/* stojky */}
      <path d="M8.2 10.4v6.6M14.8 10.4v6.6" />
      {/* skluznice s ohnutou špičkou */}
      <path d="M6 17.4h13.8" />
      <path d="M6 17.4a3.6 3.6 0 0 1-3.6-3.6" />
      {/* tažné lano */}
      <path d="M2.4 13.8 1 12" />
    </>
  ),

  fortress: (
    <>
      <path d="M3 21V9h2V6h2v3h3V6h2v3h3V6h2v3h2v12" />
      <path d="M2 21h20" />
      <path d="M9.5 21v-5a2.5 2.5 0 0 1 5 0v5" />
      <path d="M6 13h2M16 13h2" />
    </>
  ),

  // Jestřebí hory — rozhledna
  tower: (
    <>
      <path d="M4.5 20.5 9.4 6M19.5 20.5 14.6 6" />
      <path d="M8.4 6h7.2" />
      <path d="M9.2 3.2 12 1.2l2.8 2V6" />
      <path d="M9.2 6V3.2" />
      <path d="M7.4 14h9.2M6.1 17.6h11.8" />
      <path d="M3 20.5h18" />
    </>
  ),

  // Babiččino údolí — vodní mlýn
  mill: (
    <>
      {/* mlýnice */}
      <path d="M2.4 19.4V9.2L6.5 6l4.1 3.2v10.2" />
      <path d="M4.6 19.4v-3.2h3.8v3.2" />
      <path d="M5.2 11.4h3v2.4h-3z" />
      {/* vodní kolo */}
      <circle cx="17.2" cy="15" r="4.4" />
      <path d="M17.2 10.6v8.8M12.8 15h8.8" />
      <circle cx="17.2" cy="15" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),

  // Koupání v okolí — hladina
  waves: (
    <>
      <path d="M1.8 7c1.5-1.6 3.3-1.6 4.8 0s3.3 1.6 4.8 0 3.3-1.6 4.8 0 3.3 1.6 4.8 0" />
      <path d="M1.8 12c1.5-1.6 3.3-1.6 4.8 0s3.3 1.6 4.8 0 3.3-1.6 4.8 0 3.3 1.6 4.8 0" />
      <path d="M1.8 17c1.5-1.6 3.3-1.6 4.8 0s3.3 1.6 4.8 0 3.3-1.6 4.8 0 3.3 1.6 4.8 0" />
    </>
  ),

  // Procházky okolím — turista s batohem a holí
  walk: (
    <>
      <circle cx="13.6" cy="3.9" r="1.9" />
      <path d="M12.9 6.2 11.7 11.6" />
      <path d="M11.4 6.7c-1.7.3-2.9 1.7-2.9 3.4v1.5c0 .8.6 1.4 1.4 1.4h1.5" />
      <path d="m11.7 11.6 1.9 3.9.4 4.8" />
      <path d="m11.7 11.6-2.4 3.3-1.2 4.8" />
      <path d="m12.6 7.6 2.6 2.9" />
      <path d="M16 8.5 16.7 20.4" />
    </>
  ),

  // Značená cesta krajinou
  trail: (
    <>
      <path d="M8.8 21.4c0-4.3 6.3-4.7 6.3-8.9 0-4.1-5.5-4.3-5.5-7.7 0-1.4.7-2.6 1.9-3.2" />
      <path d="M4.1 18.6c0-2 1.3-3.4 1.3-3.4s1.3 1.4 1.3 3.4-1.3 2.8-1.3 2.8-1.3-.8-1.3-2.8Z" />
      <path d="M18.3 9.8c0-2 1.4-3.4 1.4-3.4s1.4 1.4 1.4 3.4-1.4 2.8-1.4 2.8-1.4-.8-1.4-2.8Z" />
      <path d="M19.7 12.6v2.4M5.4 21.4v1.2" />
    </>
  ),

  // Osobní auto z boku
  car: (
    <>
      <path d="M3 16.9h-.6a.9.9 0 0 1-.9-.9v-2.1c0-.7.5-1.3 1.1-1.5l2-.5 2.3-3.3a2.4 2.4 0 0 1 2-1h6a2.4 2.4 0 0 1 1.9.9l2.6 3.4 2 .5c.7.2 1.2.8 1.2 1.5v2c0 .5-.4.9-.9.9h-.7" />
      <path d="M9.1 16.9h5.8" />
      <path d="M6.4 11.9h11.5" />
      <path d="M11.9 7.6v4.3" />
      <circle cx="7" cy="16.9" r="2.1" />
      <circle cx="17" cy="16.9" r="2.1" />
    </>
  ),

  bus: (
    <>
      <rect x="3" y="3" width="18" height="14" rx="2.5" />
      <path d="M3 11h18" />
      <path d="M7 17v2.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5V17M17 17v2.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V17" />
      <path d="M12 3v8" />
      <circle cx="7" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="14" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),

  /* ---------------- Rozhraní ---------------- */

  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  arrowRight: <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  arrowUp: <path d="M12 20V4m0 0-6.2 6.2M12 4l6.2 6.2" />,
  arrowUpRight: <path d="M7 17 17 7m0 0H8.5M17 7v8.5" />,
  chevronLeft: <path d="m14.5 5-7 7 7 7" />,
  chevronRight: <path d="m9.5 5 7 7-7 7" />,
  chevronDown: <path d="m5 9.5 7 7 7-7" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,

  phone: (
    <>
      <path d="M8.4 3.5H5.6A2.1 2.1 0 0 0 3.5 5.7c0 8.2 6.6 14.8 14.8 14.8a2.1 2.1 0 0 0 2.2-2.1v-2.8l-4.4-1.7-2.1 2.1a13.3 13.3 0 0 1-5.6-5.6l2.1-2.1L8.4 3.5Z" />
    </>
  ),

  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 7.3 5.4a2 2 0 0 0 2.4 0L20.5 7" />
    </>
  ),

  mapPin: (
    <>
      <path d="M12 21.5s7.5-6.4 7.5-12A7.5 7.5 0 0 0 4.5 9.5c0 5.6 7.5 12 7.5 12Z" />
      <circle cx="12" cy="9.5" r="2.8" />
    </>
  ),

  star: (
    <path
      d="m12 3.2 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.7l6.1-.9L12 3.2Z"
      fill="currentColor"
      stroke="none"
    />
  ),

  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <circle cx="8.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),

  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5a3.5 3.5 0 0 1 0 6.6" />
      <path d="M17.5 14.2a6.5 6.5 0 0 1 4 5.8" />
    </>
  ),

  // Google „G" v původních barvách — vykresluje se plnou výplní
  google: (
    <>
      <path
        d="M21.6 12.23c0-.68-.06-1.34-.18-1.97H12v3.72h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.27Z"
        fill="#4285F4"
        stroke="none"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.58A10 10 0 0 0 12 22Z"
        fill="#34A853"
        stroke="none"
      />
      <path
        d="M6.42 13.9a6 6 0 0 1 0-3.82V7.5H3.07a10 10 0 0 0 0 9l3.35-2.6Z"
        fill="#FBBC05"
        stroke="none"
      />
      <path
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.99 14.7 2 12 2a10 10 0 0 0-8.93 5.5l3.35 2.58C7.2 7.72 9.4 5.98 12 5.98Z"
        fill="#EA4335"
        stroke="none"
      />
    </>
  ),

  spinner: (
    <>
      <path d="M12 3a9 9 0 1 0 9 9" />
    </>
  ),

  leaf: (
    <>
      <path d="M4 20c0-9 5-15 16-16 0 11-5.5 15-11 15-2 0-3.5-.6-5-1Z" />
      <path d="M4 20c2-6 6-10 11-12" />
    </>
  ),

  key: (
    <>
      <circle cx="7.5" cy="16.5" r="4" />
      <path d="m10.3 13.7 8-8" />
      <path d="m15.5 8.5 2 2M18 6l2.2 2.2" />
    </>
  ),

  document: (
    <>
      <path d="M6.5 3.5h7.5l4 4v13a1 1 0 0 1-1 1h-10.5a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5v4h4" />
      <path d="M8.5 12h7M8.5 15.5h7M8.5 18.5h4" />
    </>
  ),

  download: (
    <>
      <path d="M12 3.5v11.5" />
      <path d="m7.5 11 4.5 4.5L16.5 11" />
      <path d="M4.5 17.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
    </>
  ),
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  /** Velikost v px (šířka i výška). Výchozí 24. */
  size?: number;
}

export function Icon({ name, size = 24, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

/** Dekorativní oddělovač sekcí — větvička. */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 12h34M84 12h34" />
      <path d="M60 5c-4 2.5-6 4.5-6 7s2 4.5 6 7c4-2.5 6-4.5 6-7s-2-4.5-6-7Z" />
      <path d="M60 5v14" />
      <circle cx="44" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="76" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
