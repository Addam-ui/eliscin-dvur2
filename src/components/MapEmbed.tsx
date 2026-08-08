"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "./Icons";

interface MapEmbedProps {
  src: string;
  title: string;
}

/**
 * Mapa se načte až po kliknutí.
 *
 * Vložená Google mapa je odkaz na cizí server — jakmile by se načetla
 * automaticky s příchodem na stránku, Google by mohl začít zpracovávat
 * návštěvníkovu IP adresu a další údaje ještě předtím, než k tomu dá
 * souhlas. Tohle je běžné a jednoduché řešení: dokud návštěvník
 * nekliknem, k Googlu se nic neposílá.
 */
export function MapEmbed({ src, title }: MapEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[24rem] w-full border-0"
      />
    );
  }

  return (
    <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-4 p-8 text-center">
      <Icon name="mapPin" size={30} className="text-gold-light" />
      <p className="max-w-xs text-sm leading-relaxed text-cream/65">
        Mapu poskytuje Google. Po kliknutí se z jejich serveru načte obsah, který
        může zpracovat vaši IP adresu — viz{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-cream/85"
        >
          zásady ochrany soukromí Google
        </a>
        {" "}a naše{" "}
        <Link href="/ochrana-osobnich-udaju" className="link-underline text-cream/85">
          zásady ochrany osobních údajů
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-forest-deep transition-colors hover:bg-white"
      >
        <Icon name="mapPin" size={16} />
        Zobrazit mapu
      </button>
    </div>
  );
}
