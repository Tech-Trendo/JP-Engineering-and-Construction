"use client";

import { useState, useEffect, Suspense } from "react";
import PageBanner from "@/components/PageBanner";
import ContactForm from "@/components/ContactForm";
import FaqSection from "@/components/FaqSection";
import { getPublicSiteSettings, PublicSiteSettings } from "@/lib/public-api";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      setHasError(false);
      try {
        const data = await getPublicSiteSettings();
        setSiteSettings(data);
      } catch (err) {
        console.error("[ContactPage] getPublicSiteSettings failed:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const contactItems = siteSettings
    ? [
        {
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
          ),
          label: "Factory & Headquarters",
          value: siteSettings.address,
        },
        {
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          ),
          label: "Direct Sales & Support",
          value: [
            siteSettings.primary_phone,
            ...(siteSettings.secondary_phone
              ? siteSettings.secondary_phone.split(",").map((s) => s.trim())
              : []),
          ]
            .filter(Boolean)
            .join("\n"),
        },
        {
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          ),
          label: "Official Email",
          value: siteSettings.secondary_email
            ? `${siteSettings.primary_email}\n${siteSettings.secondary_email}`
            : siteSettings.primary_email,
        },
      ].filter((item) => Boolean(item.value))
    : [];

  return (
    <>
      <PageBanner
        title="Contact Us &amp; Request a Quote"
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      {/* Contact info cards */}
      <section className="py-10 bg-[#f5f6f8] border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 p-6 flex items-start gap-4 rounded h-28">
                  <div className="w-12 h-12 bg-gray-200 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasError ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded text-center">
              <p className="text-amber-800 text-xs font-medium">
                Live contact details currently offline. You may submit an equipment inquiry below.
              </p>
            </div>
          ) : contactItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-gray-200 p-6 flex items-start gap-4 shadow-sm rounded"
                >
                  <div className="w-12 h-12 bg-[#1b3a6e] rounded flex items-center justify-center text-white shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-bold text-[#1b3a6e] text-[14px] mb-1">
                      {item.label}
                    </div>
                    {item.value.split("\n").map((line, i) => {
                      if (line.includes("@")) {
                        return (
                          <a
                            key={i}
                            href={`mailto:${line}`}
                            className="block text-gray-600 hover:text-[#c8391a] text-[13px] transition-colors"
                          >
                            {line}
                          </a>
                        );
                      }
                      if (/^[\d\s+-]+$/.test(line.trim())) {
                        return (
                          <a
                            key={i}
                            href={`tel:${line.replace(/[^\d+]/g, "")}`}
                            className="block text-gray-600 hover:text-[#c8391a] text-[13px] transition-colors"
                          >
                            {line}
                          </a>
                        );
                      }
                      return (
                        <div key={i} className="text-gray-600 text-[13px]">
                          {line}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Direct Quotation
            </span>
            <h2 className="text-[#1b3a6e] text-2xl font-bold mt-1 mb-6">
              Request Machinery Quote
            </h2>
            <Suspense
              fallback={
                <div className="p-8 text-center text-gray-500">
                  Loading form...
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </div>

          {/* Location & Hours Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1b3a6e] text-white p-7 rounded shadow-md">
              <h3 className="font-bold text-lg mb-2">Technical Consultation</h3>
              <p className="text-gray-300 text-xs leading-relaxed mb-6">
                Our mechanical engineers provide plant sizing, CAD schematics, and turnkey machinery integration estimates.
              </p>
              <div className="space-y-4 text-xs">
                {siteSettings?.business_hours && (
                  <div>
                    <div className="text-gray-400 font-semibold mb-0.5">
                      Business Hours
                    </div>
                    <div>{siteSettings.business_hours}</div>
                  </div>
                )}
                {siteSettings?.map_location_text && (
                  <div>
                    <div className="text-gray-400 font-semibold mb-0.5">
                      Plant Directions
                    </div>
                    <div className="leading-relaxed">
                      {siteSettings.map_location_text}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border border-gray-200 p-6 rounded bg-[#f8f9fb]">
              <h4 className="font-bold text-[#1b3a6e] text-sm mb-2">
                Turnkey Project Delivery
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Beyond machinery supply, JP Engineering & Construction Pvt. Ltd. provides on-site civil and piping integration, stainless steel welding, electrical automation, operator training, and annual maintenance contracts (AMC).
              </p>
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        badge="Inquiry & Support FAQ"
        title="Frequently Asked Consultation Questions"
        subtitle="Common questions regarding project quotation, on-site feasibility visits, fabrication, and after-sales support."
        faqs={[
          {
            question: "How quickly can I receive a turnkey machinery quotation?",
            answer:
              "Our mechanical engineering team reviews your throughput capacity, facility dimensions, and process requirements to prepare a detailed technical specification and budget quotation within 24 to 48 hours.",
          },
          {
            question: "Do you conduct on-site feasibility visits outside Kathmandu Valley?",
            answer:
              "Yes. Our senior field engineers regularly travel across Nepal—including Chitwan, Birgunj, Butwal, Pokhara, Nepalgunj, and Biratnagar—for site surveys, piping layouts, and civil foundation assessments.",
          },
          {
            question: "Can machinery be custom-fabricated to fit our specific facility layout?",
            answer:
              "Absolutely. All stainless steel storage tanks, pasteurization skids, conveyor networks, and CIP units are custom-designed and fabricated in our workshop to match your ceiling heights and floor plan constraints.",
          },
          {
            question: "What after-sales and spare parts support is available in Nepal?",
            answer:
              "We maintain an inventory of genuine spare parts (pumps, valves, seals, PLC cards) at our central warehouse and provide 24/7 technical field support and annual maintenance contracts (AMC) across Nepal.",
          },
        ]}
      />
    </>
  );
}
