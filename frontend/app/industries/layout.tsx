import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Sectors & Turnkey Engineering Solutions",
  description:
    "Explore our specialized turnkey industrial solutions in Nepal across Dairy Processing, Water Treatment, Cold Storage Warehousing, Food & Beverage, and Pharmaceuticals.",
  alternates: {
    canonical: "/industries",
  },
  openGraph: {
    title: "Industrial Sectors & Turnkey Solutions | JP Engineering & Construction",
    description:
      "Explore our specialized turnkey industrial solutions in Nepal across Dairy Processing, Water Treatment, Cold Storage Warehousing, Food & Beverage, and Pharmaceuticals.",
    url: "https://jpengineering.com.np/industries",
    type: "website",
  },
};

export default function IndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
