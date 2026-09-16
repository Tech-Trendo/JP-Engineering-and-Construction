import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Leadership & Engineering Team",
  description:
    "Meet the experienced mechanical engineers, project managers, and technical specialists leading JP Engineering & Construction in Nepal.",
  alternates: {
    canonical: "/about/our-team",
  },
  openGraph: {
    title: "Our Leadership & Engineering Team | JP Engineering & Construction",
    description:
      "Meet the experienced mechanical engineers, project managers, and technical specialists leading JP Engineering & Construction in Nepal.",
    url: "https://jpengineering.com.np/about/our-team",
    type: "website",
  },
};

export default function OurTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
