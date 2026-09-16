import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machinery & Equipment Catalog",
  description:
    "Explore JP Engineering's catalog of industrial machinery in Nepal: dairy pasteurizers, homogenizers, reverse osmosis water plants, cold rooms, chillers, and stainless steel fabrication.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Machinery & Equipment Catalog | JP Engineering & Construction",
    description:
      "Explore JP Engineering's catalog of industrial machinery in Nepal: dairy pasteurizers, homogenizers, reverse osmosis water plants, cold rooms, chillers, and stainless steel fabrication.",
    url: "https://jpengineering.com.np/products",
    type: "website",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
