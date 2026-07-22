import { ImageResponse } from "next/og";

export const alt = "Amine Nahli — Portfolio, cybersécurité, intelligence artificielle et ingénierie logicielle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0f1720", color: "#f4f7fa", padding: "72px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px", color: "#69ddd0", fontSize: 28, fontWeight: 700 }}>
        <div style={{ display: "flex", width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center", background: "#69ddd0", color: "#06201e", fontSize: 22 }}>AN</div>
        PORTFOLIO
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: "-3px", fontWeight: 700 }}>Amine Nahli</div>
        <div style={{ maxWidth: 980, color: "#b9c5d1", fontSize: 36, lineHeight: 1.25 }}>Ingénierie logicielle · Cybersécurité · Intelligence artificielle</div>
      </div>
      <div style={{ display: "flex", color: "#8494a5", fontSize: 24 }}>Fès, Maroc · Français / English</div>
    </div>,
    size,
  );
}
