"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: "#030712", color: "#f1f5f9", fontFamily: "Inter, sans-serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <p style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(6,182,212,0.6)", marginBottom: "16px" }}>
            500 — Server Error
          </p>
          <h1 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, letterSpacing: "-0.03em", background: "linear-gradient(135deg,#06b6d4,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "16px" }}>
            Something broke.
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, marginBottom: "32px" }}>
            An unexpected error occurred. Try reloading the page.
          </p>
          <button
            onClick={reset}
            style={{ padding: "10px 24px", borderRadius: "12px", background: "#06b6d4", color: "#030712", fontWeight: 600, fontSize: "14px", border: "none", cursor: "pointer" }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
