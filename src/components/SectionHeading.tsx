import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string;
  intro?: string;
  /** Na tmavém pozadí se prohodí barvy textu. */
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  intro,
  tone = "light",
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <Reveal>
        <span className={`eyebrow ${dark ? "!text-gold-light" : ""}`}>{eyebrow}</span>
      </Reveal>

      <Reveal delay={90}>
        <h2
          className={`mt-4 font-display text-[2.1rem] leading-[1.12] sm:text-5xl ${
            dark ? "text-cream" : "text-ink"
          }`}
        >
          {heading}
        </h2>
      </Reveal>

      {intro && (
        <Reveal delay={180}>
          <p
            className={`mt-5 text-lg leading-relaxed ${dark ? "text-cream/70" : "text-ink-soft"}`}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
