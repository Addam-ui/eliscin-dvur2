"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icons";

/**
 * Tlačítko „nahoru" v pravém dolním rohu.
 *
 * Objeví se, až když je návštěvník kus pod hero sekcí — nahoře na stránce
 * by nedávalo smysl.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    // Respektujeme nastavení „omezit pohyb" — jinak by to trhlo přes celou stránku.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Zpět na začátek stránky"
      title="Zpět nahoru"
      className={`group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-forest text-cream shadow-lift transition-all duration-[400ms] hover:bg-forest-deep hover:shadow-deep sm:bottom-8 sm:right-8 sm:h-14 sm:w-14 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Icon
        name="arrowUp"
        size={22}
        strokeWidth={2}
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
