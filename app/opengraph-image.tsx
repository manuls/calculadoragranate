import { ImageResponse } from "next/og"

export const alt = "Calculadora Granate · Primera Federación 2026/27"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F8F6F3",
          color: "#211A1D",
          padding: "72px 80px",
          borderTop: "18px solid #811B3A",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ width: 104, height: 104, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "#811B3A", color: "white", fontSize: 52, fontWeight: 800, letterSpacing: -5, paddingRight: 5 }}>
            CG
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#766A6F" }}>Primera Federación · 2026/27</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: -3 }}>Calculadora Granate</div>
          <div style={{ display: "flex", maxWidth: 900, fontSize: 32, lineHeight: 1.35, color: "#62575C" }}>
            Simula los resultados del Pontevedra CF y descubre cómo cambia la clasificación.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#811B3A", fontWeight: 600 }}>
          calculadora.pontevedracf.net
        </div>
      </div>
    ),
    size,
  )
}
