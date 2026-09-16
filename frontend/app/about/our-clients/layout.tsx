import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Valued Clients & Industrial Projects",
  description:
    "Discover the major dairy processors, mineral water bottling plants, cold storage operators, and commercial factories that trust JP Engineering & Construction across Nepal.",
  alternates: {
    canonical: "/about/our-clients",
  },
  openGraph: {
    title: "Our Valued Clients | JP Engineering & Construction",
    description:
      "Discover the major dairy processors, mineral water bottling plants, and factories that trust JP Engineering & Construction across Nepal.",
    url: "https://jpengineering.com.np/about/our-clients",
    type: "website",
  },
};

export default function OurClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
