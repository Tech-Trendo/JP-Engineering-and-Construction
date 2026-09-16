import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us & Corporate Introduction",
  description:
    "Learn about JP Engineering & Construction Pvt. Ltd., an ISO 9001:2015 certified engineering firm delivering turnkey machinery and construction solutions in Nepal since 1998.",
  alternates: {
    canonical: "/about/introduction",
  },
  openGraph: {
    title: "About Us & Corporate Introduction | JP Engineering & Construction",
    description:
      "Learn about JP Engineering & Construction Pvt. Ltd., an ISO 9001:2015 certified engineering firm delivering turnkey machinery and construction solutions in Nepal since 1998.",
    url: "https://jpengineering.com.np/about/introduction",
    type: "website",
  },
};

export default function IntroductionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
