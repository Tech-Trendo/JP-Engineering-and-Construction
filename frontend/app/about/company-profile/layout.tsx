import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Profile & Engineering Credentials",
  description:
    "Explore the official company profile, ISO 9001:2015 certifications, workshop capabilities, and 25+ years track record of JP Engineering & Construction Pvt. Ltd.",
  alternates: {
    canonical: "/about/company-profile",
  },
  openGraph: {
    title: "Company Profile & Credentials | JP Engineering & Construction",
    description:
      "Explore the official company profile, ISO 9001:2015 certifications, and engineering track record of JP Engineering & Construction Pvt. Ltd.",
    url: "https://jpengineering.com.np/about/company-profile",
    type: "website",
  },
};

export default function CompanyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
