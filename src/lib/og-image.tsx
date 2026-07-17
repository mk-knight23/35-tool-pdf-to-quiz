import { ImageResponse } from "next/og";
import { SITE } from "./site";

/**
 * Static Open Graph / Twitter card image, rendered locally with next/og — no
 * external image service (STANDARDS §5). Uses the "annotated desk" palette from
 * DESIGN_SYSTEM.md: warm paper surface, high-contrast ink, librarian-green accent.
 * Rendered with next/og's bundled default font, so no external font fetch occurs.
 */
export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";
export const ogAlt = `${SITE.name} — turn PDFs and notes into quizzes and flashcards`;

export function renderOgImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F6F2EA",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "#115E59",
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            Q
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#57534E",
              letterSpacing: 1,
            }}
          >
            {SITE.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.05,
              color: "#1C1917",
              fontWeight: 700,
              maxWidth: 940,
            }}
          >
            PDFs and notes into quizzes and flashcards
          </div>
          <div style={{ display: "flex", width: 120, height: 6, backgroundColor: "#115E59" }} />
          <div style={{ fontSize: 32, color: "#57534E", maxWidth: 900, fontFamily: "Arial, sans-serif" }}>
            Study in your browser. Deterministic Quick mode works with zero AI keys.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#79716B",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <span>quizflow.mkazi.live</span>
          <span>Local-first · Open source · MIT</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
