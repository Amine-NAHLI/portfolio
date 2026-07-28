import { ImageResponse } from "next/og";

export const alt = "Amine Nahli — Portfolio, cybersécurité, intelligence artificielle et ingénierie logicielle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#121416", color: "#e2e2e5", padding: "72px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px", color: "#00e5ff", fontSize: 28, fontWeight: 700 }}>
        <div style={{ display: "flex", width: 56, height: 56, borderRadius: 4, alignItems: "center", justifyContent: "center", background: "#00e5ff", color: "#00363d", fontSize: 22 }}>AN</div>
        PORTFOLIO
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: "-3px", fontWeight: 700 }}>Amine Nahli</div>
        <div style={{ maxWidth: 980, color: "#bac9cc", fontSize: 36, lineHeight: 1.25 }}>Ingénierie logicielle · Cybersécurité · Intelligence artificielle</div>
      </div>
      <div style={{ display: "flex", color: "#849396", fontSize: 24 }}>Fès, Maroc · Français / English</div>
    </div>,
    size,
  );
}
