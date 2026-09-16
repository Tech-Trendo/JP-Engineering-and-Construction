import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "JP Engineering & Construction Pvt. Ltd.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0a1b33",
          backgroundImage: "radial-gradient(circle at 25px 25px, #1b3a6e 2%, transparent 0%), radial-gradient(circle at 75px 75px, #071324 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "14px",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: 900,
              color: "#1b3a6e",
              border: "3px solid #c8391a",
            }}
          >
            JP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              JP Engineering & Construction
            </span>
            <span style={{ fontSize: "16px", color: "#94a3b8", fontWeight: 600 }}>
              Pvt. Ltd. • ISO 9001:2015 Certified
            </span>
          </div>
        </div>

        {/* Central Core Value Proposition */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "980px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(200, 57, 26, 0.2)",
              border: "1px solid #c8391a",
              padding: "6px 16px",
              borderRadius: "30px",
              fontSize: "14px",
              fontWeight: 700,
              color: "#f87171",
              textTransform: "uppercase",
              letterSpacing: "1px",
              alignSelf: "flex-start",
            }}
          >
            Turnkey Industrial Solutions in Nepal
          </div>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.15,
              margin: 0,
              color: "#ffffff",
            }}
          >
            Industrial Machinery &amp; Turnkey Engineering Plants
          </h1>
          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.4,
              color: "#cbd5e1",
              margin: 0,
            }}
          >
            Dairy Processing • RO Water Plants • Cold Storage • Stainless Steel Fabrication
          </p>
        </div>

        {/* Footer info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #1e293b",
            paddingTop: "24px",
            fontSize: "18px",
            color: "#94a3b8",
          }}
        >
          <span>Kathmandu, Nepal • Phone: 01-5385552</span>
          <span style={{ color: "#ffffff", fontWeight: 700 }}>jpengineering.com.np</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
