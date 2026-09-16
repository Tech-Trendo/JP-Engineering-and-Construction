import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology Partners & Machinery Collaborations",
  description:
    "Explore our global manufacturing partners, component suppliers, and technology collaborations providing industrial compressors, automation, and stainless steel systems.",
  alternates: {
    canonical: "/about/our-partners",
  },
  openGraph: {
    title: "Technology Partners & Collaborations | JP Engineering & Construction",
    description:
      "Explore our global manufacturing partners, component suppliers, and technology collaborations in industrial equipment.",
    url: "https://jpengineering.com.np/about/our-partners",
    type: "website",
  },
};

export default function OurPartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
