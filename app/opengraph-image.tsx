import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Erasmus+ Portal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(weight: number) {
  const text = "Erasmus+ PortalFikirden yaygınlaştırmaya projenizi tek yerden yönetinAB hibe projeleriniz için tek adres";
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`
  ).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) throw new Error("Font CSS'inde URL bulunamadı");
  return fetch(match[1]).then((res) => res.arrayBuffer());
}

export default async function Image() {
  const [logoData, interRegular, interBold, interExtraBold] = await Promise.all([
    readFile(join(process.cwd(), "public", "logo-icon.png")),
    loadGoogleFont(400),
    loadGoogleFont(700),
    loadGoogleFont(800),
  ]);
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #EAF1FF 0%, #FAFAFB 48%, #FFF1E3 100%)",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={64} height={64} style={{ borderRadius: "16px" }} />
          <span style={{ fontSize: 34, fontWeight: 800, color: "#1F2430" }}>Erasmus+ Portal</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: "920px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              columnGap: "14px",
              rowGap: "0px",
              fontSize: 58,
              fontWeight: 800,
              color: "#1F2430",
              lineHeight: 1.3,
            }}
          >
            <span>Fikirden</span>
            <span style={{ color: "#2F6FEB" }}>yaygınlaştırmaya,</span>
            <span>Erasmus+</span>
            <span>projenizi</span>
            <span>tek</span>
            <span>yerden</span>
            <span style={{ color: "#E08A3C" }}>yönetin</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 26, fontWeight: 400, color: "#5B6473" }}>
            Haberler &middot; Rehberler &middot; Araçlar &middot; Danışmanlık
          </span>
          <span style={{ fontSize: 26, fontWeight: 700, color: "#2F6FEB" }}>erasmusportal.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "Inter", data: interBold, weight: 700, style: "normal" },
        { name: "Inter", data: interExtraBold, weight: 800, style: "normal" },
      ],
    }
  );
}
