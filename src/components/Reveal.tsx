"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Zpoždění animace v ms — pro postupné odkrývání karet za sebou. */
  delay?: number;
  /** HTML tag, do kterého se obsah zabalí. */
  as?: ElementType;
  className?: string;
}

/**
 * Odkryje obsah, jakmile se dostane do viewportu.
 *
 * Používá IntersectionObserver místo scroll listeneru, takže neblokuje
 * hlavní vlákno. Animaci vypíná `prefers-reduced-motion` (viz globals.css).
 */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pojistka pro prohlížeče bez IntersectionObserveru — obsah radši
    // zobrazíme bez animace, než abychom ho nechali schovaný.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
