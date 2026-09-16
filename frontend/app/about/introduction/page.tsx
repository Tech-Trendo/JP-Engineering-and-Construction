"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import FaqSection from "@/components/FaqSection";
import {
  getPublicSiteContent,
  getPublicSiteSettings,
  getMediaUrl,
  PublicSiteContent,
  PublicSiteSettings,
} from "@/lib/public-api";

export default function IntroductionPage() {
  const [loading, setLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<PublicSiteContent | null>(null);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadIntroData() {
      setLoading(true);
      setHasError(false);
      try {
        const [contentRes, settingsRes] = await Promise.allSettled([
          getPublicSiteContent(),
          getPublicSiteSettings(),
        ]);

        if (contentRes.status === "fulfilled") {
          setSiteContent(contentRes.value);
        } else {
          setHasError(true);
        }

        if (settingsRes.status === "fulfilled") {
          setSiteSettings(settingsRes.value);
        }
      } catch (err) {
        console.error("[IntroductionPage] fetch error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadIntroData();
  }, []);

  const paragraphs = siteContent?.full_intro
    ? siteContent.full_intro.split("\n\n").filter(Boolean)
    : [];

  return (
    <>
      <PageBanner
        title="Corporate Introduction"
        breadcrumbs={[{ label: "About Us" }, { label: "Introduction" }]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-pulse">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 w-36 bg-gray-200 rounded" />
                <div className="h-10 w-2/3 bg-gray-200 rounded" />
                <div className="h-64 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded" />
                <div className="h-48 bg-gray-200 rounded" />
              </div>
            </div>
          ) : hasError ? (
            <div className="p-12 border border-red-200 bg-red-50 text-center rounded-lg max-w-lg mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                !
              </div>
              <h3 className="text-red-800 font-bold text-lg mb-1">Unable to load introduction</h3>
              <p className="text-red-700 text-sm leading-relaxed mb-4">
                Corporate introduction could not be loaded from the backend API.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main content */}
              <div className="lg:col-span-2">
                <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                  Who We Are
                </span>
                <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-5">
                  About {siteSettings?.company_name}
                </h2>
                {(siteSettings?.hero_image || siteSettings?.hero_image_url) ? (
                  <div className="relative h-[320px] mb-6 bg-gray-100 rounded overflow-hidden shadow-sm">
                    <img
                      src={getMediaUrl(siteSettings.hero_image || siteSettings.hero_image_url)}
                      alt={siteSettings?.company_name || "Factory Overview"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="prose max-w-none text-gray-700 text-[14px] leading-relaxed space-y-4">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {siteSettings && (
                  <div className="bg-[#1b3a6e] text-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold text-base mb-4 pb-2 border-b border-white/20">
                      Company Facts
                    </h4>
                    <ul className="space-y-3 text-xs">
                      {siteSettings.founding_year && (
                        <li className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-300">Established</span>
                          <span className="font-semibold">{siteSettings.founding_year}</span>
                        </li>
                      )}
                      {siteSettings.address && (
                        <li className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-300">Headquarters</span>
                          <span className="font-semibold text-right max-w-[180px]">{siteSettings.address}</span>
                        </li>
                      )}
                      {siteSettings.company_type && (
                        <li className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-300">Company Type</span>
                          <span className="font-semibold">{siteSettings.company_type}</span>
                        </li>
                      )}
                      {siteSettings.employee_count && (
                        <li className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="text-gray-300">Workforce</span>
                          <span className="font-semibold">{siteSettings.employee_count}</span>
                        </li>
                      )}
                      {siteSettings.stat_projects_completed && (
                        <li className="flex items-center justify-between">
                          <span className="text-gray-300">Completed Projects</span>
                          <span className="font-bold text-[#c8391a] text-sm">{siteSettings.stat_projects_completed}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* ISO 9001:2015 Certification Highlight */}
                {siteSettings?.iso_certified !== false && (
                  <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg shadow-2xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-2">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{siteSettings?.iso_standard || "ISO 9001:2015"} Certified</span>
                    </div>
                    <p className="text-[12px] text-gray-600 leading-relaxed mb-2">
                      Accredited Quality Management System registered under certificate number <span className="font-mono font-semibold text-gray-800">{siteSettings?.iso_certificate_number || "129594/A/0001/UK/En"}</span>.
                    </p>
                    <Link
                      href="/#iso-certified"
                      className="text-xs font-bold text-[#c8391a] hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Official Certificate</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                )}

                <div className="bg-[#f8f9fb] border border-gray-200 p-6 rounded-lg">
                  <h4 className="text-[#1b3a6e] font-bold text-sm uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                    Quick Navigation
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link href="/about/our-team" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Our Team</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about/our-clients" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Our Clients</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/about/our-partners" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Our Partners</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/products" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Machinery Catalog</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" className="flex items-center gap-2 text-gray-700 hover:text-[#c8391a] py-1 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a]" />
                        <span>Contact Us</span>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#c8391a] text-white p-6 rounded-lg shadow-md">
                  <h4 className="font-bold text-base mb-2">Need an Industrial Quote?</h4>
                  <p className="text-red-100 text-xs mb-4 leading-relaxed">
                    Send us your plant capacity, dimensions, and specifications for a detailed technical estimate.
                  </p>
                  <Link
                    href="/contact-us#quote"
                    className="block text-center bg-white text-[#c8391a] font-bold text-xs uppercase tracking-wider py-3 rounded hover:bg-gray-100 transition-colors"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <FaqSection
        badge="Company Overview FAQ"
        title="About JP Engineering & Construction FAQs"
        subtitle="Common questions about our history, manufacturing workshop, ISO credentials, and national engineering presence."
        faqs={[
          {
            question: "When was JP Engineering & Construction established in Nepal?",
            answer:
              "JP Engineering & Construction was established in 1998 in Kathmandu and has grown over 25+ years into one of Nepal's leading industrial machinery fabricators and turnkey plant contractors.",
          },
          {
            question: "What is your primary manufacturing workshop infrastructure?",
            answer:
              "Our fabrication facility in Kathmandu features hydraulic shearing machines, CNC sheet bending, automated TIG and arc welding stations, metal lathe machinery, and calibrated hydrostatic pressure testing rigs.",
          },
          {
            question: "What credentials and quality certifications does the company hold?",
            answer:
              "We hold ISO 9001:2015 Quality Management System Certification (Certificate No: 129594/A/0001/UK/En), accredited by URS and UKAS Management Systems (0043) with IAF recognition.",
          },
          {
            question: "Which geographic areas of Nepal do you support?",
            answer:
              "We deliver and commission machinery across all 7 provinces of Nepal, including key industrial belts such as Kathmandu Valley, Birgunj, Chitwan, Pokhara, Butwal, Biratnagar, and Nepalgunj.",
          },
        ]}
      />
    </>
  );
}
