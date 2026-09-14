import type { Metadata } from "next";
import { Work_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import ConditionalShell from "@/components/ConditionalShell";
import {
  getPublicSiteSettings,
  getPublicCategories,
  getPublicIndustries,
  getPublicProducts,
  PublicIndustry,
  PublicProductListItem,
} from "@/lib/public-api";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getPublicSiteSettings();
    return {
      title: settings.company_name || "JP Engineering & Construction Pvt. Ltd.",
      description: settings.company_description,
      icons: {
        icon: "/favicon.ico",
      },
    };
  } catch {
    return {
      title: "JP Engineering & Construction Pvt. Ltd.",
      description: "Industrial machinery manufacturer and turnkey engineering contractor.",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
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

  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable}`}>
      <body className="flex flex-col min-h-screen text-gray-800 bg-white antialiased">
        <ConditionalShell siteSettings={siteSettings} categories={categories} industries={industries} products={products}>
          {children}
        </ConditionalShell>
      </body>
    </html>
  );
}
