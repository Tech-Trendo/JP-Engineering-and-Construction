import { ImageResponse } from "next/og";
import { getPublicProductDetail } from "@/lib/public-api";

export const runtime = "nodejs";
export const alt = "JP Engineering Machinery Specification";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getPublicProductDetail(slug);
  } catch {
    product = null;
  }

  const productName = product?.name || "Industrial Machinery";
  const categoryName = product?.categories?.[0]?.name || "Turnkey Equipment";
  const description =
    product?.short_description?.slice(0, 140) ||
    "Custom engineering specifications, capacity sizing, and turnkey commissioning in Nepal.";

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
          backgroundColor: "#071324",
          backgroundImage: "linear-gradient(to bottom right, #0a1b33, #071324)",
          padding: "60px 80px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 900,
              color: "#1b3a6e",
              border: "3px solid #c8391a",
            }}
          >
            JP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "24px", fontWeight: 800 }}>
              JP Engineering &amp; Construction Pvt. Ltd.
            </span>
            <span style={{ fontSize: "15px", color: "#94a3b8" }}>
              Machinery Catalog • ISO 9001:2015
            </span>
          </div>
        </div>

        {/* Product Details */}
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
              alignSelf: "flex-start",
            }}
          >
            {categoryName}
          </div>
          <h1
            style={{
              fontSize: "48px",
              fontWeight: 900,
              lineHeight: 1.15,
              margin: 0,
              color: "#ffffff",
            }}
          >
            {productName}
          </h1>
          <p
            style={{
              fontSize: "20px",
              lineHeight: 1.4,
              color: "#cbd5e1",
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>

        {/* Footer */}
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
          <span>SS304/SS316L • Siemens PLC • Turnkey Nepal Support</span>
          <span style={{ color: "#ffffff", fontWeight: 700 }}>jpengineering.com.np</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
