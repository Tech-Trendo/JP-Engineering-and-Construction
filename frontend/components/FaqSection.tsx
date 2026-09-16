"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  faqs: FaqItem[];
  className?: string;
}

export default function FaqSection({
  title = "Frequently Asked Questions",
  subtitle = "Technical answers to common inquiries regarding fabrication, capacity sizing, automation, and commissioning.",
  badge = "Technical FAQ",
  faqs,
  className = "",
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

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

  return (
    <section className={`py-12 bg-slate-50 border-t border-gray-200 ${className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="max-w-2xl mb-8">
          {badge && (
            <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest block mb-1">
              {badge}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1b3a6e]">{title}</h2>
          {subtitle && <p className="text-gray-600 text-xs sm:text-sm mt-1">{subtitle}</p>}
        </div>

        <div className="max-w-3xl space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left py-4 px-5 sm:px-6 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#1b3a6e] hover:text-[#c8391a] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-gray-500">
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#c8391a]" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
