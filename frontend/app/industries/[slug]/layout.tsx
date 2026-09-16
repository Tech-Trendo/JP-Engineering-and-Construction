import type { Metadata } from "next";
import { getPublicIndustryDetail, getMediaUrl } from "@/lib/public-api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const industry = await getPublicIndustryDetail(slug);
    if (!industry) {
      return {
        title: "Industry Sector Not Found",
        description: "The requested industrial machinery sector could not be located.",
      };
    }

    const bannerImg = industry.icon_or_image_url || industry.icon_or_image;
    const fullImageUrl = bannerImg
      ? bannerImg.startsWith("http")
        ? bannerImg
        : `https://jpengineering.com.np${getMediaUrl(bannerImg)}`
      : "https://jpengineering.com.np/images/hero-machinery.jpg";

    const title = `${industry.name} Turnkey Plants & Equipment`;
    const description =
      industry.description ||
      `Specialized industrial processing machinery, turnkey installations, and stainless steel fabrication engineered for ${industry.name} in Nepal.`;

    return {
      title,
      description,
      keywords: [
        industry.name,
        `${industry.name} Nepal`,
        "turnkey industrial plant",
        "food processing plant Nepal",
        "industrial machinery Kathmandu",
        "JP Engineering",
      ],
      alternates: {
        canonical: `/industries/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://jpengineering.com.np/industries/${slug}`,
        type: "website",
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: `${industry.name} - JP Engineering & Construction`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [fullImageUrl],
      },
    };
  } catch {
    return {
      title: "Industrial Engineering Sector | JP Engineering & Construction",
      description:
        "Specialized industrial processing machinery and turnkey engineering solutions in Nepal.",
      alternates: {
        canonical: `/industries/${slug}`,
      },
    };
  }
}

export default async function IndustryDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let industry = null;
  try {
    industry = await getPublicIndustryDetail(slug);
  } catch {
    industry = null;
  }

  const bannerImg = industry?.icon_or_image_url || industry?.icon_or_image;
  const fullImageUrl = bannerImg
    ? bannerImg.startsWith("http")
      ? bannerImg
      : `https://jpengineering.com.np${getMediaUrl(bannerImg)}`
    : "https://jpengineering.com.np/images/hero-machinery.jpg";

  const serviceSchema = industry
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `${industry.name} Turnkey Engineering & Machinery Solutions`,
        serviceType: "Industrial Machinery Manufacturing & Plant Engineering",
        description: industry.description || `${industry.name} processing equipment in Nepal.`,
        provider: {
          "@type": "Organization",
          name: "JP Engineering & Construction Pvt. Ltd.",
          url: "https://jpengineering.com.np",
        },
        areaServed: {
          "@type": "Country",
          name: "Nepal",
        },
        image: fullImageUrl,
        url: `https://jpengineering.com.np/industries/${slug}`,
      }
    : null;

  const breadcrumbsSchema = industry
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://jpengineering.com.np",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Industries",
            item: "https://jpengineering.com.np/industries",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: industry.name,
            item: `https://jpengineering.com.np/industries/${slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {serviceSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
      )}
      {breadcrumbsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      )}
      {children}
    </>
  );
}
