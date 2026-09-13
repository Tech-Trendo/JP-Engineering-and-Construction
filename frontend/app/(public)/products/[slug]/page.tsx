"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getPublicProductDetail,
  PublicProductDetail,
  getMediaUrl,
} from "@/lib/public-api";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Container,
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
          <div className="text-xs text-slate-400">
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
          <div className="p-12 rounded-2xl bg-white border border-slate-200 shadow-premium-card max-w-md mx-auto space-y-3">
            <h2 className="text-lg font-bold text-slate-900">
              Machinery Model Not Found
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The requested machinery item does not exist or may have been updated in active catalog records.
            </p>
            <div className="pt-2">
              <Button href="/products" variant="primary" size="sm">
                Back to Machinery Catalog &rarr;
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
    <div className="py-10 sm:py-16 space-y-16">
      <Container size="default">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 pb-6 border-b border-slate-200 mb-8 font-medium">
          <Link href="/" className="hover:text-blue-700 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-700 transition">
            Machinery Catalog
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Top Section: Gallery + Primary Specification Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 1. Multi-Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main High-Res Viewport */}
            <div className="relative h-80 sm:h-96 md:h-[440px] w-full rounded-2xl overflow-hidden bg-[#0a0f1d] border border-slate-800 shadow-premium-card">
              {activeImage ? (
                <img
                  src={getMediaUrl(activeImage.image)}
                  alt={activeImage.alt_text || product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                  No Image Available
                </div>
              )}
              {product.is_featured && (
                <span className="absolute top-4 left-4 bg-blue-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                  Featured Equipment
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
                        ? "border-blue-600 ring-2 ring-blue-500/30"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={getMediaUrl(img.image)}
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
                    className="inline-flex text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-xs text-slate-500 mt-1.5 font-medium">
                Catalog Ref: <span className="font-mono text-slate-700">{product.slug}</span>
              </p>
            </div>

            {/* Short Description */}
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {product.short_description ||
                "Certified industrial machinery calibrated for continuous duty cycles across food, water, cold chain, and manufacturing plants."}
            </p>

            {/* Prominent Action Triggers (Pre-fills Product on Quote Form!) */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 block">
                  Procurement & Commissioning
                </span>
                <span className="text-sm font-bold text-slate-900">
                  Custom Engineering & Duty Proposal
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Plant capacities, skid integration, and commissioning schedules are customized to your site requirements.
                </p>
              </div>

              <Button
                href={`/contact?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                variant="accent"
                size="lg"
                className="w-full justify-center text-xs sm:text-sm font-semibold tracking-wide shadow-sm"
              >
                Request a Quote for this Machine &rarr;
              </Button>

              <div className="text-xs text-slate-500 text-center font-medium">
                ✓ Full factory pre-testing and technical documentation provided
              </div>
            </div>

            {/* Operational Quality Checklist */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-200 pt-4 font-normal">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Pre-shipment hydrostatic, flow-rate & electrical validation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>On-site field engineers for installation & operator training</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Warranty coverage with guaranteed spare parts availability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Dynamic Specifications Table & Full Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-slate-200 items-start">
          {/* Dynamic Specifications Table */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 block mb-1">
                Technical Data Sheet
              </span>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                Machine Specifications
              </h3>
            </div>

            {product.specifications && product.specifications.length > 0 ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white text-xs shadow-premium-card">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-5 py-3 font-semibold w-1/2">Parameter / Metric</th>
                      <th className="px-5 py-3 font-semibold w-1/2">Specification Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {product.specifications.map((spec) => (
                      <tr key={spec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-5 py-3 text-slate-600 font-medium">
                          {spec.label}
                        </td>
                        <td className="px-5 py-3 text-slate-900 font-semibold font-mono">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-slate-200 text-xs text-slate-500 italic bg-white shadow-premium-card">
                Standard industrial parameters apply. Contact engineering desk for custom drawings and technical dossier.
              </div>
            )}
          </div>

          {/* Full Narrative Description */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Engineering Dossier
              </span>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                Operational Overview
              </h3>
            </div>

            <div className="text-sm text-slate-600 leading-relaxed space-y-3 whitespace-pre-wrap">
              {product.full_description ||
                "Engineered with food-grade sanitary construction, certified process engineering components, and calibrated for continuous industrial duty cycles."}
            </div>

            <div className="pt-4">
              <Button
                href={`/contact?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                variant="outline"
                size="sm"
              >
                Inquire About Custom Skid Integration &rarr;
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.related_products && product.related_products.length > 0 && (
          <div className="pt-16 border-t border-slate-200 space-y-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-800 block mb-1">
                Related Machinery
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                Related Equipment in Category
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related_products.map((rel) => (
                <Card key={rel.id} variant="default" className="flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-900 border-b border-slate-200">
                      {rel.primary_image ? (
                        <img
                          src={getMediaUrl(rel.primary_image)}
                          alt={rel.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                          JP Machine Spec
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm group-hover:text-blue-700 transition-colors">
                        {rel.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs mt-1">
                        {rel.short_description || "Certified machinery unit."}
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardFooter className="p-4 pt-2 gap-2">
                    <Button
                      href={`/products/${rel.slug}`}
                      variant="outline"
                      size="sm"
                      className="flex-1 justify-center text-xs font-semibold"
                    >
                      Details
                    </Button>
                    <Button
                      href={`/contact?product=${rel.id}&name=${encodeURIComponent(rel.name)}`}
                      variant="accent"
                      size="sm"
                      className="flex-1 justify-center text-xs font-semibold"
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
