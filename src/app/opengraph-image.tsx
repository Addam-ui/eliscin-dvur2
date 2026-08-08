import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Náhled, který se ukáže při sdílení odkazu na web (Facebook, WhatsApp,
 * Messenger, Twitter/X...). Bez tohohle souboru sdílený odkaz nemá žádný
 * obrázek — vygeneruje se automaticky, žádné ruční nahrávání není potřeba.
 *
 * Používá skutečné logo webu (přečtené přímo ze souboru), takže při změně
 * loga v `public/logo/` se náhled aktualizuje sám.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function OpengraphImage() {
  const logoPath = join(process.cwd(), "public/logo/eliscin-dvur-logo.png");
  const logoBase64 = readFileSync(logoPath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #16281d 0%, #2c4a38 55%, #1c3327 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={520} height={121} alt="" />

        <div
          style={{
            marginTop: 30,
            width: 64,
            height: 2,
            background: "#c19a3d",
          }}
        />

        <div
          style={{
            marginTop: 30,
            fontSize: 34,
            color: "#e3c887",
            fontFamily: "Georgia, serif",
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 22,
            color: "#fbf8f2",
            opacity: 0.7,
            fontFamily: "Georgia, serif",
          }}
        >
          Hajnice · Krkonoše
        </div>
      </div>
    ),
    { ...size },
  );
}
