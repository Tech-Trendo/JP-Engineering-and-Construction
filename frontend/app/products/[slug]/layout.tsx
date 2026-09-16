import type { Metadata } from "next";
import { getPublicProductDetail, getMediaUrl } from "@/lib/public-api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getPublicProductDetail(slug);
    if (!product) {
      return {
        title: "Machinery Not Found",
        description: "The requested machinery specification could not be located in our catalog.",
      };
    }

    const primaryImageUrl =
      product.images?.find((i) => i.is_primary)?.image ||
      product.images?.[0]?.image;

    const fullImageUrl = primaryImageUrl
      ? primaryImageUrl.startsWith("http")
        ? primaryImageUrl
        : `https://jpengineering.com.np${getMediaUrl(primaryImageUrl)}`
      : "https://jpengineering.com.np/images/hero-machinery.jpg";

    const title = `${product.name} | Industrial Machinery Specifications`;
    const description =
      product.short_description ||
      `Technical specifications, capacity, and quotation for ${product.name} manufactured by JP Engineering & Construction Pvt. Ltd.`;

    const categoryNames = product.categories?.map((c) => c.name) || [];

    return {
      title,
      description,
      keywords: [
        product.name,
        ...categoryNames,
        "industrial machinery Nepal",
        "turnkey plant machinery",
        "JP Engineering",
      ],
      alternates: {
        canonical: `/products/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://jpengineering.com.np/products/${slug}`,
        type: "website",
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
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
      title: "Machinery Specifications | JP Engineering & Construction",
      description:
        "Industrial machinery and processing equipment engineered by JP Engineering & Construction Pvt. Ltd.",
      alternates: {
        canonical: `/products/${slug}`,
      },
    };
  }
}

export default async function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product = null;
  try {
    product = await getPublicProductDetail(slug);
  } catch {
    product = null;
  }

  const primaryImageUrl =
    product?.images?.find((i) => i.is_primary)?.image ||
    product?.images?.[0]?.image;

  const fullImageUrl = primaryImageUrl
    ? primaryImageUrl.startsWith("http")
      ? primaryImageUrl
      : `https://jpengineering.com.np${getMediaUrl(primaryImageUrl)}`
    : "https://jpengineering.com.np/images/hero-machinery.jpg";

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: {
          "@type": "ImageObject",
          url: fullImageUrl,
          contentUrl: fullImageUrl,
          caption: product.name,
        },
        description: product.short_description || product.name,
        sku: `JPEC-${product.id}`,
        mpn: `JPEC-${product.slug}`,
        brand: {
          "@type": "Brand",
          name: "JP Engineering & Construction",
          logo: "https://jpengineering.com.np/assets/logo.png",
        },
        additionalProperty: (product.specifications || []).map((spec) => ({
          "@type": "PropertyValue",
          name: spec.label,
          value: spec.value,
        })),
      }
    : null;

  const breadcrumbsSchema = product
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
            name: "Machinery Catalog",
            item: "https://jpengineering.com.np/products",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: `https://jpengineering.com.np/products/${slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
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
