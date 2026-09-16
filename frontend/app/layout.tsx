import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};
import ConditionalShell from "@/components/ConditionalShell";
import {
  getPublicSiteSettings,
  getPublicCategories,
  getPublicIndustries,
  getPublicProducts,
  PublicIndustry,
  PublicProductListItem,
} from "@/lib/public-api";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  let settings: Awaited<ReturnType<typeof getPublicSiteSettings>> | null = null;
  try {
    settings = await getPublicSiteSettings();
  } catch {
    settings = null;
  }

  const companyName = settings?.company_name || "JP Engineering & Construction Pvt. Ltd.";
  const title = `${companyName} | Industrial Machinery & Turnkey Solutions Nepal`;
  const description =
    settings?.company_description ||
    "Leading manufacturer and engineering contractor in Nepal specializing in dairy processing plants, water treatment (RO) systems, cold storage facilities, industrial chillers, and stainless steel fabrication since 1998.";

  return {
    metadataBase: new URL("https://jpengineering.com.np"),
    title: {
      default: title,
      template: `%s | ${companyName}`,
    },
    description,
    keywords: [
      "JP Engineering and Construction",
      "industrial machinery Nepal",
      "dairy processing plant Nepal",
      "reverse osmosis water plant Nepal",
      "cold storage construction Nepal",
      "pasteurizer homogenizer Nepal",
      "chilling vat Nepal",
      "food processing machinery",
      "stainless steel fabrication Kathmandu",
      "turnkey engineering contractor Nepal",
      "ISO 9001 certified engineering company",
    ],
    authors: [{ name: companyName, url: "https://jpengineering.com.np" }],
    creator: companyName,
    publisher: companyName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "https://jpengineering.com.np",
        "ne-NP": "https://jpengineering.com.np",
        "x-default": "https://jpengineering.com.np",
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      alternateLocale: ["ne_NP"],
      url: "https://jpengineering.com.np",
      siteName: companyName,
      title,
      description,
      images: [
        {
          url: "/images/hero-machinery.jpg",
          width: 1200,
          height: 630,
          alt: `${companyName} - Industrial Machinery and Turnkey Engineering Solutions`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-machinery.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/assets/logo.png",
    },
    other: {
      "geo.region": "NP-BA",
      "geo.placename": "Kathmandu, Nepal",
      "geo.position": "27.7172;85.3240",
      ICBM: "27.7172, 85.3240",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let siteSettings: Awaited<ReturnType<typeof getPublicSiteSettings>> | undefined = undefined;
  let categories: Awaited<ReturnType<typeof getPublicCategories>> = [];
  let industries: PublicIndustry[] = [];
  let products: PublicProductListItem[] = [];

  const [settingsRes, catsRes, indsRes, prodsRes] = await Promise.allSettled([
    getPublicSiteSettings(),
    getPublicCategories(),
    getPublicIndustries(),
    getPublicProducts(),
  ]);

  if (settingsRes.status === "fulfilled") {
    siteSettings = settingsRes.value;
  }
  if (catsRes.status === "fulfilled") {
    categories = catsRes.value;
  }
  if (indsRes.status === "fulfilled") {
    industries = indsRes.value;
  }
  if (prodsRes.status === "fulfilled") {
    products = prodsRes.value;
  }

  // Schema.org Organization & LocalBusiness Structured Data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": "https://jpengineering.com.np/#organization",
    name: siteSettings?.company_name || "JP Engineering & Construction Pvt. Ltd.",
    alternateName: [
      "JPEC",
      "JP Engineering",
      "JP Engineering Nepal",
      "JP Engineering and Construction",
    ],
    url: "https://jpengineering.com.np",
    logo: "https://jpengineering.com.np/assets/logo.png",
    image: "https://jpengineering.com.np/images/hero-machinery.jpg",
    description:
      siteSettings?.company_description ||
      "Leading manufacturer and turnkey engineering contractor in Nepal specializing in dairy processing, water treatment, cold storage, and stainless steel fabrication.",
    foundingDate: siteSettings?.founding_year || "1998",
    telephone: siteSettings?.primary_phone || "+977-01-5385552",
    email: siteSettings?.primary_email || "info@jpec.com.np",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSettings?.address || "Kathmandu, Nepal",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.7172,
      longitude: 85.324,
    },
    priceRange: "$$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: [
      siteSettings?.facebook_url,
      siteSettings?.tiktok_url,
      siteSettings?.youtube_url,
    ].filter(Boolean),
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "ISO 9001:2015 Quality Management System Certification",
        credentialCategory: "Quality Standard",
        recognizedBy: {
          "@type": "Organization",
          name: "URS / UKAS Management Systems (0043) / IAF Multilateral Recognition Arrangement",
        },
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://jpengineering.com.np/#website",
    url: "https://jpengineering.com.np",
    name: siteSettings?.company_name || "JP Engineering & Construction Pvt. Ltd.",
    description:
      siteSettings?.company_description ||
      "Industrial machinery manufacturer and turnkey engineering contractor in Nepal.",
    publisher: {
      "@id": "https://jpengineering.com.np/#organization",
    },
    inLanguage: ["en-US", "ne-NP"],
  };

  return (
    <html lang="en" className={`${poppins.variable} ${poppins.className}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${poppins.className} flex flex-col min-h-screen text-gray-800 bg-white antialiased overflow-x-hidden w-full font-sans`}>
        <ConditionalShell siteSettings={siteSettings} categories={categories} industries={industries} products={products}>
          {children}
        </ConditionalShell>
      </body>
    </html>
  );
}
