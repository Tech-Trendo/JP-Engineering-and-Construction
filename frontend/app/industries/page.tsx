"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getPublicIndustries,
  getPublicSiteSettings,
  getMediaUrl,
  PublicIndustry,
  PublicSiteSettings,
} from "@/lib/public-api";
import PageBanner from "@/components/PageBanner";
import FaqSection from "@/components/FaqSection";

export default function IndustriesPage() {
  const [loading, setLoading] = useState(true);
  const [industries, setIndustries] = useState<PublicIndustry[]>([]);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadIndustries() {
      setLoading(true);
      setHasError(false);
      try {
        const results = await Promise.allSettled([
          getPublicIndustries(),
          getPublicSiteSettings(),
        ]);

        if (results[0].status === "fulfilled") {
          setIndustries(results[0].value);
        } else {
          setHasError(true);
        }

        if (results[1].status === "fulfilled") {
          setSiteSettings(results[1].value);
        }
      } catch (err) {
        console.error("[IndustriesPage] fetch error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadIndustries();
  }, []);

  return (
    <>
      <PageBanner
        title="Industrial Sectors We Serve"
        subtitle="Specialized turnkey engineering, automated machinery, and food-grade fabrication tailored for Nepal's critical production industries."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries", href: "/industries" },
        ]}
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-10 w-1/3 bg-gray-200 rounded mx-auto" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          ) : hasError ? (
            <div className="p-8 border border-red-200 bg-red-50 text-center rounded-lg max-w-md mx-auto">
              <p className="text-red-700 font-semibold text-sm mb-4">
                Unable to load industry sectors from the backend API.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                Retry
              </button>
            </div>
          ) : industries.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 p-8">
              <p className="text-gray-500 font-medium text-sm">
                Industry sectors are currently being configured in the CMS.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center max-w-2xl mx-auto mb-14">
                <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                  Tailored Industrial Machinery
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1b3a6e] mt-2 mb-3">
                  Comprehensive Turnkey Plant Solutions
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Select an industry below to discover complete plant setups, machinery specifications,
                  fabrication standards, and turnkey project execution.
                </p>
              </div>

              {/* Industries Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {industries.map((ind) => {
                  const imgSrc =
                    getMediaUrl(ind.icon_or_image_url || ind.icon_or_image) ||
                    "/images/hero-machinery.webp";

                  return (
                    <div
                      key={ind.id}
                      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Image Header */}
                      <div className="relative h-56 bg-gray-100 overflow-hidden">
                        <img
                          src={imgSrc}
                          alt={ind.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-white text-lg font-bold leading-snug drop-shadow-sm">
                            {ind.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {ind.description}
                          </p>

                          {/* Key Parameters */}
                          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
                            <div>
                              <span className="font-semibold text-gray-700 block">Divisions:</span>
                              <span>{ind.categories_count} Categories</span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700 block">Machinery:</span>
                              <span>{ind.products_count} Models</span>
                            </div>
                          </div>
                        </div>

                        {/* Action CTA */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <Link
                            href={`/industries/${ind.slug}`}
                            className="w-full inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all group/btn"
                          >
                            <span>Explore {ind.name}</span>
                            <svg
                              className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Turnkey Capabilities Callout */}
          <div className="mt-16 bg-[#0f2347] text-white rounded-2xl p-8 sm:p-12 overflow-hidden relative">
            <div className="relative z-10 max-w-2xl">
              <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                Turnkey Project Contracting
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-4 leading-tight">
                Need a Custom Industrial Plant Layout?
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8">
                From milk processing and fruit cold preservation to industrial reverse osmosis and meat packing,
                our engineering team delivers end-to-end design, fabrication, SCADA automation, and commissioning.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact-us#quote"
                  className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded shadow-sm hover:shadow transition-all"
                >
                  Request Technical Consultation
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#1b3a6e] hover:bg-[#0f2347] text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded shadow-sm hover:shadow transition-all"
                >
                  Browse Full Machinery Catalog
                </Link>
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
          </div>
        </div>
      </section>

      <FaqSection
        badge="Industrial Sectors FAQ"
        title="Turnkey Industrial Sectors FAQ"
        subtitle="Technical insights into plant engineering, multidisciplinary contracting, and commissioning across Nepal."
        faqs={[
          {
            question: "Which key industrial sectors does JP Engineering specialize in?",
            answer:
              "We engineer complete turnkey plants and machinery for 6 major sectors in Nepal: Dairy & Milk Processing, Beverages & Mineral Water Bottling, Cold Chain Storage & Blast Freezing, Food & Snack Processing, Pharmaceuticals, and Meat & Poultry Processing.",
          },
          {
            question: "What does 'Turnkey Industrial Execution' include?",
            answer:
              "Our turnkey service encompasses initial site surveys, architectural and P&ID layout drafting, stainless steel tank and skid fabrication, utility piping (steam, glycol, compressed air), electrical panel wiring, on-site commissioning, and operator certification.",
          },
          {
            question: "Can you retrofit or expand an existing processing facility in Nepal?",
            answer:
              "Yes. We frequently upgrade existing facilities by expanding pasteurization capacity, converting manual washing to automated CIP, installing energy-saving heat pumps, or automating manual processing lines with Siemens PLCs.",
          },
          {
            question: "How does JP Engineering ensure compliance with quality regulations?",
            answer:
              "As an ISO 9001:2015 certified manufacturer (accredited by URS and UKAS 0043), our welding, pressure vessel fabrication, and sanitation standards comply with international sanitary engineering guidelines and Department of Food Technology and Quality Control (DFTQC) standards.",
          },
        ]}
      />
    </>
  );
}
