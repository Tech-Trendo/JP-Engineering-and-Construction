"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PublicIndustry,
  PublicIndustryDetail,
  getPublicIndustryDetail,
  getMediaUrl,
} from "@/lib/public-api";

interface IndustryMachinerySectionProps {
  industries: PublicIndustry[];
  initialDetail?: PublicIndustryDetail | null;
}

export default function IndustryMachinerySection({
  industries = [],
  initialDetail = null,
}: IndustryMachinerySectionProps) {
  if (!industries || industries.length === 0) {
    return null;
  }

  const [activeSlug, setActiveSlug] = useState<string>(
    initialDetail?.slug || industries[0]?.slug || ""
  );
  const [currentDetail, setCurrentDetail] = useState<PublicIndustryDetail | null>(
    initialDetail || null
  );
  const [loading, setLoading] = useState<boolean>(!initialDetail);
  const [cache, setCache] = useState<Record<string, PublicIndustryDetail>>(() => {
    if (initialDetail && initialDetail.slug) {
      return { [initialDetail.slug]: initialDetail };
    }
    return {};
  });

  // Fetch or retrieve from cache whenever activeSlug changes
  useEffect(() => {
    if (!activeSlug) return;
    if (cache[activeSlug]) {
      setCurrentDetail(cache[activeSlug]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getPublicIndustryDetail(activeSlug)
      .then((detail) => {
        if (!isMounted) return;
        if (detail) {
          setCurrentDetail(detail);
          setCache((prev) => ({ ...prev, [activeSlug]: detail }));
        }
      })
      .catch((err) => {
        console.error(`[IndustryMachinerySection] Failed to load industry ${activeSlug}:`, err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSlug, cache]);

  const activeIndustry = industries.find((ind) => ind.slug === activeSlug) || industries[0];
  const previewProducts = (currentDetail?.products || []).slice(0, 3);
  const totalMachineCount = currentDetail?.products?.length ?? activeIndustry?.products_count ?? 0;

  return (
    <section className="py-16 md:py-20 bg-slate-50 border-t border-b border-gray-200" id="industries">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#1b3a6e]/10 text-[#1b3a6e] text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
            <span className="w-2 h-2 rounded-full bg-[#c8391a]" />
            Sectors We Serve
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1b3a6e] tracking-tight">
            Turnkey Machinery by Industry
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Select an industrial sector below to preview specialized processing machinery, turnkey plant
            capabilities, and engineering solutions.
          </p>
        </div>

        {/* Industry Selection Tabs - Clean Industrial Styling (No Emojis) */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {industries.map((ind) => {
            const isActive = ind.slug === activeSlug;
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActiveSlug(ind.slug)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-xs ${
                  isActive
                    ? "bg-[#1b3a6e] text-white shadow-md ring-2 ring-[#c8391a] ring-offset-2"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isActive ? "bg-[#c8391a]" : "bg-gray-400"}`} />
                <span>{ind.name}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-[#c8391a] text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {ind.products_count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Curated Spotlight Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c8391a] mb-1">
                <span>Sector Spotlight</span>
                <span>•</span>
                <span>{currentDetail?.name || activeIndustry?.name}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1b3a6e]">
                {currentDetail?.name || activeIndustry?.name} Engineering Solutions
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {currentDetail?.description || activeIndustry?.description}
              </p>

              {/* Sector Engineering Capabilities */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Turnkey Plant Execution
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Sanitary SS304/SS316 Fabrication
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
                  <svg className="w-3.5 h-3.5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  PLC Automation &amp; Telemetry
                </span>
              </div>
            </div>

            {/* Direct Link to Dedicated Page */}
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <Link
                href={`/industries/${activeIndustry.slug}`}
                className="inline-flex items-center justify-center gap-2 bg-[#1b3a6e] hover:bg-[#12274a] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-md shadow-sm transition-colors text-center"
              >
                <span>View Dedicated Sector Page</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href={`/contact-us?industry=${encodeURIComponent(
                  currentDetail?.name || activeIndustry?.name
                )}#quote`}
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-md shadow-sm transition-colors text-center"
              >
                <span>Request Sector Quote</span>
              </Link>
            </div>
          </div>

          {/* Linked Categories Involved */}
          {currentDetail?.categories && currentDetail.categories.length > 0 && (
            <div className="mt-5 pt-1">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                Machinery Categories in this Sector:
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {currentDetail.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products#${cat.slug}`}
                    className="text-xs px-3 py-1 bg-slate-100 hover:bg-[#1b3a6e] hover:text-white text-gray-700 rounded-md font-medium transition-colors cursor-pointer border border-gray-200"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Curated Machinery Preview (Top 3 Machines Only) */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400">
            <div className="w-8 h-8 border-3 border-[#1b3a6e] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-medium">Loading sector machinery...</p>
          </div>
        ) : previewProducts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Featured Equipment Preview ({previewProducts.length} of {totalMachineCount})
              </span>
              <Link
                href={`/industries/${activeIndustry.slug}`}
                className="text-xs font-bold text-[#1b3a6e] hover:text-[#c8391a] transition-colors inline-flex items-center gap-1"
              >
                <span>See all {totalMachineCount} machines</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previewProducts.map((product) => {
                const primaryCat = product.categories?.[0]?.name || "Machinery";
                const imgSrc = getMediaUrl(product.primary_image) || "/images/hero-machinery.jpg";

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col group"
                  >
                    {/* Machine Thumbnail */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="block relative aspect-square bg-white overflow-hidden flex items-center justify-center p-3 cursor-pointer"
                    >
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#0f2347]/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        {primaryCat}
                      </div>
                    </Link>

                    {/* Machine Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 leading-snug group-hover:text-[#c8391a] transition-colors line-clamp-2">
                          {product.name}
                        </h4>
                        <p className="mt-1.5 text-xs text-gray-600 leading-relaxed line-clamp-2">
                          {product.short_description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <Link
                          href={`/products/${product.slug}`}
                          className="text-xs font-bold text-[#1b3a6e] hover:text-[#c8391a] transition-colors inline-flex items-center gap-1"
                        >
                          <span>Specs</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <Link
                          href={`/contact-us?product=${product.id}#quote`}
                          className="text-[11px] font-bold uppercase tracking-wider bg-gray-100 hover:bg-[#c8391a] text-gray-700 hover:text-white px-2.5 py-1 rounded-xs transition-colors"
                        >
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Callout Banner */}
            <div className="mt-8 text-center bg-white rounded-xl p-6 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h4 className="font-bold text-base text-[#1b3a6e]">
                  Looking for full {activeIndustry.name} plant layouts?
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Visit the dedicated sector page to view all machinery specifications, project capabilities, and custom quotes.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/industries"
                  className="text-xs font-semibold text-gray-600 hover:text-[#1b3a6e] px-4 py-2.5 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                >
                  All Industries
                </Link>
                <Link
                  href={`/industries/${activeIndustry.slug}`}
                  className="bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Explore {activeIndustry.name}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
