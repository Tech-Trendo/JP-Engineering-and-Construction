"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getPublicProductDetail,
  PublicProductDetail,
} from "@/lib/public-api";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Container,
  Badge,
} from "@/components/ui";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<PublicProductDetail | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getPublicProductDetail(slug)
      .then((data) => {
        if (!isMounted) return;
        setProduct(data);
        // Find primary image index if available
        if (data.images && data.images.length > 0) {
          const primaryIdx = data.images.findIndex((img) => img.is_primary);
          setSelectedImageIndex(primaryIdx !== -1 ? primaryIdx : 0);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to load product detail:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Product not found or unavailable."
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <Container size="default">
          <div className="text-xs font-mono text-stone-400">
            Loading equipment specifications...
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center space-y-4">
        <Container size="default">
          <div className="p-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 max-w-md mx-auto space-y-3">
            <h2 className="text-lg font-bold text-stone-900 dark:text-white">
              Machinery Model Not Found
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              The requested equipment item does not exist or may have been retired from active catalog circulation.
            </p>
            <div className="pt-2">
              <Button href="/products" variant="primary" size="sm">
                Back to Equipment Catalog &rarr;
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const activeImage =
    product.images && product.images[selectedImageIndex]
      ? product.images[selectedImageIndex]
      : product.images?.[0];

  return (
    <div className="py-12 sm:py-16 space-y-20">
      <Container size="default">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-stone-400 pb-6 border-b border-stone-200 dark:border-stone-800 mb-8">
          <Link href="/" className="hover:text-stone-900 dark:hover:text-white transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-stone-900 dark:hover:text-white transition">
            Fleet Catalog
          </Link>
          <span>/</span>
          <span className="text-stone-900 dark:text-white font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Top Section: Gallery + Primary Specification Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 1. Multi-Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main High-Res Viewport */}
            <div className="relative h-80 sm:h-96 md:h-[440px] w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-sm">
              {activeImage ? (
                <img
                  src={activeImage.image}
                  alt={activeImage.alt_text || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-mono text-xs text-stone-500">
                  No Image Available
                </div>
              )}
              {product.is_featured && (
                <span className="absolute top-4 left-4 bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider font-mono">
                  Featured Fleet Asset
                </span>
              )}
            </div>

            {/* Thumbnail Strip (Click to swap) */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-24 rounded-lg overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-amber-500 ring-2 ring-amber-500/20"
                        : "border-stone-200 dark:border-stone-800 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={img.alt_text || `View ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Overview, Category Tags & Prominent Quote CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category Badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {product.categories.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex text-[11px] font-mono px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-950 dark:text-white leading-tight">
                {product.name}
              </h1>

              <p className="font-mono text-xs text-stone-400 mt-1">
                Ref Code: {product.slug.toUpperCase()}
              </p>
            </div>

            {/* Short Description */}
            <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {product.short_description ||
                "Certified heavy industrial machinery calibrated for continuous duty cycles across regional infrastructure projects."}
            </p>

            {/* Prominent Action Triggers (Pre-fills Product on Quote Form!) */}
            <div className="p-6 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                  Procurement & Mobilization
                </span>
                <span className="text-sm font-bold text-stone-900 dark:text-white">
                  Direct Duty Cycle Proposal
                </span>
                <p className="text-xs text-stone-500 mt-1">
                  Pricing and deployment terms are tailored to ground conditions, multi-rig dispatch, and project timelines.
                </p>
              </div>

              <Button
                href={`/contact?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                variant="accent"
                size="lg"
                className="w-full justify-center text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-sm"
              >
                Request a Quote for this Machine &rarr;
              </Button>

              <div className="text-[11px] font-mono text-stone-500 text-center">
                ✓ Full preventative maintenance record provided upon dispatch
              </div>
            </div>

            {/* Operational Metrics Checklist */}
            <div className="space-y-2 text-xs font-mono text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Pre-mobilization pressure & hydraulic load testing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>On-site field mechanics & technical operator support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Zero hidden fees — transparent engineering assessment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Dynamic Specifications Table & Full Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-stone-200 dark:border-stone-800 items-start">
          {/* Dynamic Specifications Table */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                Technical Data Sheet
              </span>
              <h3 className="text-xl font-bold tracking-tight text-stone-950 dark:text-white">
                Machine Specifications
              </h3>
            </div>

            {product.specifications && product.specifications.length > 0 ? (
              <div className="rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-[11px] uppercase tracking-wider text-stone-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold w-1/2">Parameter / Metric</th>
                      <th className="px-5 py-3 font-semibold w-1/2">Specification Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800/80">
                    {product.specifications.map((spec) => (
                      <tr key={spec.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/40">
                        <td className="px-5 py-3 text-stone-600 dark:text-stone-400 font-medium">
                          {spec.label}
                        </td>
                        <td className="px-5 py-3 text-stone-950 dark:text-white font-bold">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-stone-200 dark:border-stone-800 text-xs text-stone-400 italic font-mono">
                Standard duty parameters apply. Request detailed engineering dossier for exact dimensions.
              </div>
            )}
          </div>

          {/* Full Narrative Description */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 block mb-1">
                Engineering Dossier
              </span>
              <h3 className="text-xl font-bold tracking-tight text-stone-950 dark:text-white">
                Operational Overview
              </h3>
            </div>

            <div className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed space-y-3 whitespace-pre-wrap">
              {product.full_description ||
                "This rig combines reinforced high-tensile steel boom construction with advanced variable-displacement hydraulic pumps to provide maximum breakout efficiency in dense soils, rock, and civil foundation trenches."}
            </div>

            <div className="pt-4">
              <Button
                href={`/contact?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                variant="outline"
                size="sm"
              >
                Inquire About Custom Attachments &rarr;
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.related_products && product.related_products.length > 0 && (
          <div className="pt-16 border-t border-stone-200 dark:border-stone-800 space-y-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block mb-1">
                Complementary Fleet
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-stone-950 dark:text-white">
                Related Equipment in Category
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related_products.map((rel) => (
                <Card key={rel.id} variant="default" className="flex flex-col justify-between">
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-stone-900 border-b border-stone-200 dark:border-stone-800">
                      {rel.primary_image ? (
                        <img
                          src={rel.primary_image}
                          alt={rel.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center font-mono text-[10px] text-stone-500">
                          JP Fleet
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm">{rel.name}</CardTitle>
                      <CardDescription className="line-clamp-2 text-[11px] mt-1">
                        {rel.short_description || "Certified heavy machinery."}
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardFooter className="p-4 pt-2 gap-2">
                    <Button
                      href={`/products/${rel.slug}`}
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center text-[11px]"
                    >
                      Details
                    </Button>
                    <Button
                      href={`/contact?product=${rel.id}&name=${encodeURIComponent(rel.name)}`}
                      variant="accent"
                      size="sm"
                      className="flex-1 justify-center text-[11px]"
                    >
                      Quote
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
