import type { MetadataRoute } from "next";
import {
  getPublicProducts,
  getPublicIndustries,
} from "@/lib/public-api";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jpengineering.com.np";
  const now = new Date();

  // Core static marketing and institutional pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/industries`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about/introduction`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/company-profile`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about/our-clients`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about/our-partners`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about/our-team`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  let industryRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const [industriesRes, productsRes] = await Promise.allSettled([
      getPublicIndustries(),
      getPublicProducts(),
    ]);

    if (industriesRes.status === "fulfilled" && Array.isArray(industriesRes.value)) {
      industryRoutes = industriesRes.value.map((industry) => ({
        url: `${baseUrl}/industries/${industry.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));
    }

    if (productsRes.status === "fulfilled" && Array.isArray(productsRes.value)) {
      productRoutes = productsRes.value.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("[Sitemap generation error, returning static routes]:", error);
  }

  return [...staticRoutes, ...industryRoutes, ...productRoutes];
}
