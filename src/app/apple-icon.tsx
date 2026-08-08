import { ImageResponse } from "next/og";

/**
 * Ikona pro plochu iPhonu/iPadu při přidání webu jako aplikace.
 * iOS si sám ořízne rohy do zaoblení, takže tady žádné dávat nemusíme —
 * naopak by to s jeho maskou vytvořilo divný dvojitý okraj.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2c4a38",
        }}
      >
        <span
          style={{
            fontSize: 112,
            fontWeight: 700,
            color: "#fbf8f2",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            marginTop: 6,
          }}
        >
          E
        </span>
      </div>
    ),
    { ...size },
  );
}
