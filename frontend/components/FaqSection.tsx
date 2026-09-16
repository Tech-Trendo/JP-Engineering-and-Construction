"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getPublicFaqs, getPublicSiteSettings, type PublicSiteSettings } from "@/lib/public-api";

export interface FaqItem {
  id?: number;
  question: string;
  answer: string;
  category?: string;
}

interface FaqSectionProps {
  pageKey?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  faqs?: FaqItem[];
  className?: string;
}

export default function FaqSection({
  pageKey,
  title = "Frequently Asked Questions",
  subtitle = "Direct answers to common engineering questions regarding fabrication specs, capacity sizing, PLC automation, and turnkey commissioning across Nepal.",
  badge = "Technical Knowledge Base",
  faqs: initialFaqs = [],
  className = "",
}: FaqSectionProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Load real site settings for contact numbers
  useEffect(() => {
    let isMounted = true;
    getPublicSiteSettings().then((settings) => {
      if (isMounted && settings) {
        setSiteSettings(settings);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Dynamically hydrate FAQs from live CMS API
  useEffect(() => {
    let isMounted = true;
    if (pageKey) {
      getPublicFaqs(pageKey).then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setFaqs(
            data.map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
              category: item.category || undefined,
            }))
          );
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [pageKey]);


  // Keep state updated if initialFaqs changes and no pageKey was set
  useEffect(() => {
    if (!pageKey && initialFaqs && initialFaqs.length > 0) {
      setFaqs(initialFaqs);
    }
  }, [initialFaqs, pageKey]);

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  // Collect unique categories if present
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      if (f.category && f.category.trim()) {
        set.add(f.category.trim());
      }
    });
    return Array.from(set);
  }, [faqs]);

  // Filter if user clicks a category pill (optional convenience when > 5 FAQs)
  const displayFaqs = React.useMemo(() => {
    if (activeCategory === "All") return faqs;
    return faqs.filter((f) => f.category === activeCategory);
  }, [faqs, activeCategory]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Frequently Asked Questions"
      className={`py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-t border-slate-200/80 relative overflow-hidden ${className}`}
    >
      {/* Dynamic SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Decorative ambient background blur */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 bg-[#1b3a6e]/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-10 w-72 h-72 bg-[#c8391a]/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Sticky Title & Engineering Help Card */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 space-y-6 mb-10 lg:mb-0">
            <div>
              {badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-[#c8391a] border border-red-200/60 mb-3 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8391a] animate-pulse" />
                  {badge}
                </div>
              )}
              <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Engineer Consultation Card (Stripe/Linear style CTA card) */}
            <div className="rounded-2xl p-5 sm:p-6 bg-white border border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1b3a6e]/10 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1b3a6e]/10 text-[#1b3a6e] flex items-center justify-center font-bold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight">
                    Have Custom Specs?
                  </h3>
                  <p className="text-[11px] text-gray-500">Direct Chief Engineer Support</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Need specific throughput calculations, custom workshop drawings, or an on-site feasibility study in Nepal? Speak directly with our mechanical engineering desk.
              </p>

              <div className="pt-3 space-y-2">
                {/* Real Primary Office Landline */}
                <a
                  href={`tel:${(siteSettings?.primary_phone || "01-5385552").replace(/[^\d+]/g, "")}`}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 text-xs font-semibold text-[#1b3a6e] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {siteSettings?.primary_phone || "01-5385552"}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Office</span>
                </a>

                {/* Real Direct Engineering Mobile Line */}
                <a
                  href="tel:+9779851112988"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 text-xs font-semibold text-[#1b3a6e] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    +977-9851112988
                  </span>
                  <span className="text-[10px] text-emerald-600 uppercase tracking-wider font-bold">Direct Mobile</span>
                </a>

                <Link
                  href="/contact-us"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3.5 rounded-xl bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Request Technical Quotation
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Card Accordions */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
            {/* Category Filter Pills if available */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 pb-2 overflow-x-auto scrollbar-thin">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("All");
                    setOpenIndex(0);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    activeCategory === "All"
                      ? "bg-[#1b3a6e] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  All ({faqs.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setOpenIndex(0);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#1b3a6e] text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Accordion Items */}
            {displayFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.id || idx}
                  className={`rounded-2xl transition-all duration-200 bg-white border ${
                    isOpen
                      ? "border-[#1b3a6e]/30 shadow-[0_4px_20px_rgba(27,58,110,0.06)] border-l-4 border-l-[#c8391a]"
                      : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1 pr-2">
                      {faq.category && (
                        <span className="inline-block text-[10px] font-bold text-[#c8391a] uppercase tracking-wider">
                          {faq.category}
                        </span>
                      )}
                      <h3
                        className={`text-sm sm:text-base font-bold transition-colors ${
                          isOpen
                            ? "text-[#1b3a6e]"
                            : "text-slate-800 group-hover:text-[#1b3a6e]"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    <span
                      className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-200 ${
                        isOpen
                          ? "bg-[#c8391a] text-white rotate-45"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      }`}
                      aria-hidden="true"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-0 animate-fadeIn">
                      <div className="pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
