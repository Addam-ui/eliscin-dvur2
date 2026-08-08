"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation, contact } from "@/lib/site";
import { Icon } from "./Icons";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#uvod");

  /* Přepnutí hlavičky do „plné" podoby po odscrollování z hero sekce. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Zvýraznění položky menu podle toho, kde na stránce zrovna jsme. */
  useEffect(() => {
    const sections = navigation
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Otevřené mobilní menu nesmí nechat scrollovat stránku pod sebou. */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* Zavření menu klávesou Escape. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <a
        href="#hlavni-obsah"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-cream"
      >
        Přeskočit na obsah
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-linen/70 bg-cream/85 py-3 shadow-soft backdrop-blur-xl"
            : "border-b border-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          {/* Logo */}
          <Link
            href="/#uvod"
            onClick={() => setMenuOpen(false)}
            className="relative block shrink-0 transition-transform duration-300 hover:scale-[1.03]"
            aria-label={`${"Eliščin dvůr"} — úvodní stránka`}
          >
            <Image
              src={solid ? "/logo/eliscin-dvur-logo-dark.png" : "/logo/eliscin-dvur-logo.png"}
              alt="Eliščin dvůr"
              width={370}
              height={86}
              priority
              className={`w-auto transition-all duration-500 ${solid ? "h-9" : "h-11"}`}
            />
          </Link>

          {/* Navigace — desktop */}
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Hlavní navigace">
            {navigation.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <Link
                  key={item.href}
                  href={`/${item.href}`}
                  className={`relative rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors duration-300 ${
                    solid
                      ? isActive
                        ? "text-forest"
                        : "text-ink-soft hover:text-forest"
                      : isActive
                        ? "text-white"
                        : "text-white/75 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-4 bottom-1 h-px origin-left transition-transform duration-300 ${
                      solid ? "bg-forest" : "bg-white"
                    } ${isActive ? "scale-x-100" : "scale-x-0"}`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Akce vpravo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:+420${contact.phones[0].replace(/\s/g, "")}`}
              className={`hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 md:inline-flex ${
                solid ? "text-ink-soft hover:text-forest" : "text-white/80 hover:text-white"
              }`}
            >
              <Icon name="phone" size={17} />
              <span className="hidden xl:inline">{contact.phones[0]}</span>
            </a>

            <Link
              href="/#rezervace"
              onClick={() => setMenuOpen(false)}
              className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-soft transition-all duration-300 hover:shadow-lift ${
                solid
                  ? "bg-forest text-cream hover:bg-forest-deep"
                  : "bg-cream/95 text-forest-deep hover:bg-white"
              }`}
            >
              Rezervovat
              <Icon
                name="arrowRight"
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>

            {/* Přepínač mobilního menu */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobilni-menu"
              aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 xl:hidden ${
                solid ? "text-ink hover:bg-sand" : "text-white hover:bg-white/15"
              }`}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobilní menu */}
      <div
        id="mobilni-menu"
        className={`fixed inset-0 z-40 bg-forest-deep transition-[opacity,visibility] duration-[400ms] xl:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="grain relative flex h-full flex-col justify-center px-8 pb-16 pt-24">
          <nav className="flex flex-col gap-1" aria-label="Mobilní navigace">
            {navigation.map((item, i) => (
              <Link
                key={item.href}
                href={`/${item.href}`}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-white/10 py-4 transition-all duration-500"
                style={{
                  transitionDelay: menuOpen ? `${100 + i * 55}ms` : "0ms",
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "none" : "translateY(14px)",
                }}
              >
                <span className="font-display text-3xl text-cream">{item.label}</span>
                <Icon
                  name="arrowRight"
                  size={20}
                  className="text-forest-light transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            ))}
          </nav>

          <div
            className="mt-10 space-y-3 transition-all duration-500"
            style={{
              transitionDelay: menuOpen ? `${100 + navigation.length * 55}ms` : "0ms",
              opacity: menuOpen ? 1 : 0,
            }}
          >
            {contact.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:+420${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-cream/80 transition-colors hover:text-cream"
              >
                <Icon name="phone" size={18} className="text-forest-light" />
                {phone}
              </a>
            ))}
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-3 break-all text-cream/80 transition-colors hover:text-cream"
            >
              <Icon name="mail" size={18} className="text-forest-light" />
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
