"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProductCarousel from "@/components/ProductCarousel";
import HeroSlider from "@/components/HeroSlider";
import AnimatedStatCounter from "@/components/AnimatedStatCounter";
import MapSection from "@/components/MapSection";
import IsoCertificationSection from "@/components/IsoCertificationSection";
import {
  getPublicSiteSettings,
  getPublicSiteContent,
  getPublicCategories,
  getPublicProducts,
  getPublicClients,
  getPublicPartners,
  getPublicHeroSlides,
  getPublicIndustries,
  getMediaUrl,
  PublicSiteSettings,
  PublicSiteContent,
  PublicCategory,
  PublicProductListItem,
  PublicClient,
  PublicPartner,
  PublicHeroSlide,
  PublicIndustry,
} from "@/lib/public-api";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [siteContent, setSiteContent] = useState<PublicSiteContent | null>(null);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [products, setProducts] = useState<PublicProductListItem[]>([]);
  const [clients, setClients] = useState<PublicClient[]>([]);
  const [partners, setPartners] = useState<PublicPartner[]>([]);
  const [heroSlides, setHeroSlides] = useState<PublicHeroSlide[]>([]);
  const [industries, setIndustries] = useState<PublicIndustry[]>([]);

  const [hasError, setHasError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setHasError(false);

    try {
      const results = await Promise.allSettled([
        getPublicSiteSettings(),
        getPublicSiteContent(),
        getPublicCategories(),
        getPublicProducts({ is_featured: true }),
        getPublicClients(),
        getPublicPartners(),
        getPublicHeroSlides(),
        getPublicIndustries(),
      ]);

      if (results[0].status === "fulfilled") setSiteSettings(results[0].value);
      if (results[1].status === "fulfilled") setSiteContent(results[1].value);
      if (results[2].status === "fulfilled") setCategories(results[2].value);

      if (results[3].status === "fulfilled") {
        const feat = results[3].value;
        if (feat.length > 0) {
          setProducts(feat);
        } else {
          // If no featured, load all machinery
          try {
            const all = await getPublicProducts();
            setProducts(all);
          } catch {
            // ignore
          }
        }
      }

      if (results[4].status === "fulfilled") setClients(results[4].value);
      if (results[5].status === "fulfilled") setPartners(results[5].value);
      if (results[6].status === "fulfilled") setHeroSlides(results[6].value);
      if (results[7].status === "fulfilled") setIndustries(results[7].value);

      const allFailed = results.every((r) => r.status === "rejected");
      if (allFailed) {
        setHasError(true);
      }
    } catch (err) {
      console.error("[HomePage] Live API fetch error:", err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = siteSettings
    ? [
        { value: siteSettings.stat_years_experience, label: "Years of Experience" },
        { value: siteSettings.stat_projects_completed, label: "Projects Completed" },
        { value: siteSettings.stat_happy_clients, label: "Happy Clients" },
        { value: siteSettings.stat_business_sectors, label: "Industrial Sectors" },
      ].filter((s) => Boolean(s.value))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        {/* Shimmering Hero Skeleton */}
        <div className="w-full h-[450px] lg:h-[540px] bg-slate-800 animate-pulse flex flex-col justify-center px-8 lg:px-24">
          <div className="max-w-xl space-y-4">
            <div className="h-4 w-48 bg-slate-700 rounded" />
            <div className="h-10 w-full bg-slate-700 rounded" />
            <div className="h-16 w-3/4 bg-slate-700 rounded" />
            <div className="flex gap-4 pt-2">
              <div className="h-10 w-36 bg-[#c8391a]/60 rounded" />
              <div className="h-10 w-36 bg-slate-700 rounded" />
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="bg-[#1b3a6e] py-6 px-4">
          <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-[1280px] mx-auto px-4 py-16 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-72 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-gray-50">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl font-bold mb-4">
          !
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Connect to Backend API</h2>
        <p className="text-gray-600 max-w-md text-sm mb-6">
          The application could not reach the live API server. Please check your network connection or verify that the backend services are running.
        </p>
        <button
          onClick={loadData}
          className="bg-[#c8391a] hover:bg-[#a62d14] text-white font-semibold text-sm px-6 py-2.5 rounded shadow transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Auto-Sliding Section with Live Backend Data */}
      <HeroSlider siteSettings={siteSettings} slides={heroSlides} />

      {/* Animated Stats Bar */}
      {stats.length > 0 && <AnimatedStatCounter stats={stats} />}

      {/* About Corporate Intro Section */}
      {siteContent && (
        <section className="py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[360px] lg:h-[420px] bg-gray-100 rounded overflow-hidden shadow-md flex items-center justify-center">
              {categories[0]?.icon_or_image ? (
                <img
                  src={getMediaUrl(categories[0].icon_or_image)}
                  alt={siteSettings?.company_name || "Industrial Facility"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1b3a6e] to-[#0f2347] flex flex-col items-center justify-center text-white p-8 text-center">
                  {siteSettings?.logo_url && (
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 p-2 shadow-inner border border-white/20">
                      <img
                        src={getMediaUrl(siteSettings.logo_url)}
                        alt={siteSettings.company_name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {siteSettings?.company_name && (
                    <div className="font-bold text-lg">{siteSettings.company_name}</div>
                  )}
                  {siteSettings?.tagline && (
                    <div className="text-xs text-gray-300 mt-1">{siteSettings.tagline}</div>
                  )}
                </div>
              )}
              {siteSettings?.tagline && (
                <div className="absolute bottom-4 left-4 right-4 bg-[#1b3a6e]/95 text-white p-4 backdrop-blur-sm rounded">
                  <div className="text-xs uppercase tracking-widest text-[#c8391a] font-bold">
                    Engineering &amp; Manufacturing
                  </div>
                  <div className="font-semibold text-sm mt-0.5">{siteSettings.tagline}</div>
                </div>
              )}
            </div>

            <div>
              <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                Who We Are
              </span>
              <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-4 leading-snug">
                {siteContent.title}
              </h2>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 whitespace-pre-line">
                {siteContent.short_intro}
              </p>
              {categories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {categories.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-[#c8391a] shrink-0" />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/about/introduction"
                  className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
                >
                  <span>Learn More About Us</span>
                </Link>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#1b3a6e] hover:bg-[#0f2347] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
                >
                  <span>Get In Touch</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ISO 9001:2015 Certification Section */}
      <IsoCertificationSection siteSettings={siteSettings} />

      {/* Machinery Categories Grid */}
      {categories.length > 0 && (
        <section className="py-16 bg-[#f5f6f8]">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                Industrial Machinery Sectors
              </span>
              <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
                Machinery &amp; Equipment Solutions
              </h2>
              <p className="text-gray-500 text-[14px] max-w-[620px] mx-auto">
                We engineer, manufacture, and commission reliable industrial equipment across diverse sectors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-[200px] overflow-hidden bg-gray-100 flex items-center justify-center">
                    {cat.icon_or_image ? (
                      <img
                        src={getMediaUrl(cat.icon_or_image)}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1b3a6e]/10 flex flex-col items-center justify-center text-[#1b3a6e] p-4 text-center">
                        <span className="font-bold text-sm">{cat.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-4 text-white font-bold text-sm">
                      {cat.name}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-gray-600 text-[13px] leading-relaxed mb-4 line-clamp-3">
                      {cat.description}
                    </p>
                    <Link
                      href={`/products#${cat.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded shadow-sm hover:shadow transition-all mt-auto"
                    >
                      <span>Explore Equipment</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse Machinery by Industry Section */}
      {industries.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                Sectors We Serve
              </span>
              <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
                Browse Machinery by Industry
              </h2>
              <p className="text-gray-500 text-[14px] max-w-[560px] mx-auto">
                Select an industrial sector to explore specialized processing machinery, turnkey plant capabilities, and engineering solutions.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {industries.map((industry) => {
                const imgSrc = industry.icon_or_image_url
                  ? getMediaUrl(industry.icon_or_image_url)
                  : industry.icon_or_image
                  ? getMediaUrl(industry.icon_or_image)
                  : null;
                return (
                  <Link
                    key={industry.id}
                    href={`/industries/${industry.slug}`}
                    className="group relative overflow-hidden rounded-xl bg-slate-900 aspect-video flex items-end shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={industry.name}
                        className="absolute inset-0 w-full !h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
                    <div className="relative z-10 p-3.5 sm:p-4 w-full flex items-end justify-between">
                      <div>
                        <div className="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-md">
                          {industry.name}
                        </div>
                        {industry.products_count > 0 && (
                          <div className="text-gray-200 text-[11px] sm:text-xs mt-0.5 font-medium drop-shadow-xs">
                            {industry.products_count} machine{industry.products_count !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#c8391a] flex items-center justify-center shrink-0 ml-2 group-hover:bg-white group-hover:text-[#c8391a] transition-colors shadow-md">
                        <svg className="w-4 h-4 text-white group-hover:text-[#c8391a] transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}

              <Link
                href="/industries"
                className="group relative overflow-hidden rounded-xl aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-[#c8391a] to-[#a62d14] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-4 text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 group-hover:bg-white/30 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <div className="text-white font-bold text-sm sm:text-base leading-snug">View All Sectors</div>
                <div className="text-white/80 text-[11px] sm:text-xs mt-0.5">Explore Every Industry</div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Machinery Products */}
      {products.length > 0 && (
        <section className="py-16 bg-[#f5f6f8]">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                  Our Catalog
                </span>
                <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-1">
                  Featured Industrial Machines
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                <span>View All Machinery</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <ProductCarousel products={products} />
          </div>
        </section>
      )}

      {/* 1. Valued Clients Section */}
      {clients.length > 0 && (
        <section className="py-14 bg-white border-t border-gray-200">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                  Trusted By Industry Leaders
                </span>
                <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-1">
                  Our Valued Clients
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Industrial processors, dairy factories, and engineering institutions that rely on JP Engineering.
                </p>
              </div>
              <Link
                href="/about/our-clients"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b3a6e] hover:text-[#c8391a] transition-colors shrink-0 group"
              >
                <span>View All Clients</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5 items-center">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 h-28 sm:h-32 md:h-36 flex flex-col items-center justify-center text-center shadow-xs hover:border-[#1b3a6e] hover:shadow-md transition-all group"
                >
                  {client.logo ? (
                    <img
                      src={getMediaUrl(client.logo)}
                      alt={client.name}
                      className="max-h-20 sm:max-h-24 max-w-[90%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-[#1b3a6e] line-clamp-2 px-1">{client.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Technology & Equipment Partners Section */}
      {partners.length > 0 && (
        <section className="py-14 bg-[#f8f9fb] border-t border-b border-gray-200">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                  Global Engineering Collaboration
                </span>
                <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-1">
                  Our Technology Partners
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">
                  Premier international component suppliers and technology partners powering our turnkey systems.
                </p>
              </div>
              <Link
                href="/about/our-partners"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b3a6e] hover:text-[#c8391a] transition-colors shrink-0 group"
              >
                <span>View All Partners</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5 items-center">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 h-28 sm:h-32 md:h-36 flex flex-col items-center justify-center text-center shadow-xs hover:border-[#1b3a6e] hover:shadow-md transition-all group"
                >
                  {partner.logo ? (
                    <img
                      src={getMediaUrl(partner.logo)}
                      alt={partner.name}
                      className="max-h-20 sm:max-h-24 max-w-[90%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-[#1b3a6e] line-clamp-2 px-1">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Google Map Section */}
      <MapSection />

      {/* Persistent Quote CTA Banner from Backend SiteSettings */}
      {siteSettings && siteSettings.cta_heading && (
        <section className="py-14 bg-[#1b3a6e] text-white">
          <div className="max-w-[1280px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-[700px]">
              {siteSettings.company_name && (
                <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                  {siteSettings.company_name}
                </span>
              )}
              <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-2">
                {siteSettings.cta_heading}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {siteSettings.cta_subtext}
              </p>
            </div>
            <Link
              href={siteSettings.cta_button_link || "/contact-us"}
              className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded shadow-sm hover:shadow transition-all whitespace-nowrap"
            >
              {siteSettings.cta_button_label || "Get In Touch"}
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
