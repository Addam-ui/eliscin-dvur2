import { ImageResponse } from "next/og";

/**
 * Favicon — generovaný přímo v kódu, žádný externí obrázkový nástroj
 * potřeba. Malý monogram "E" v barvách webu, čitelný i v 16–32px záložce
 * prohlížeče, kde by se ozdobné kaligrafické logo ztratilo.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const runtime = "nodejs";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <span
          style={{
            fontSize: 21,
            fontWeight: 700,
            color: "#fbf8f2",
            fontFamily: "Georgia, serif",
            lineHeight: 1,
            marginTop: 1,
          }}
        >
          E
        </span>
      </div>
    ),
    { ...size },
  );
}
