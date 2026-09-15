"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { getPublicPartners, getMediaUrl, PublicPartner } from "@/lib/public-api";

export default function OurPartnersPage() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<PublicPartner[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadPartners() {
      setLoading(true);
      setHasError(false);
      try {
        const data = await getPublicPartners();
        setPartners(data);
      } catch (err) {
        console.error("[OurPartnersPage] fetch error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPartners();
  }, []);

  return (
    <>
      <PageBanner
        title="Technology &amp; Equipment Partners"
        breadcrumbs={[{ label: "About Us" }, { label: "Our Partners" }]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Global Partnerships
            </span>
            <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
              Our Technology Partners
            </h2>
            <p className="text-gray-500 text-[14px] max-w-[620px] mx-auto">
              We collaborate with premier international technology providers and component manufacturers to ensure equipment conforms to the highest industrial benchmarks.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#f8f9fb] border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center h-48">
                  <div className="w-full h-20 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : hasError ? (
            <div className="p-12 border border-red-200 bg-red-50 text-center rounded-lg max-w-lg mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                !
              </div>
              <h3 className="text-red-800 font-bold text-lg mb-1">Unable to load partners</h3>
              <p className="text-red-700 text-sm leading-relaxed mb-4">
                Technology partners could not be loaded from the backend API.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                Retry
              </button>
            </div>
          ) : partners.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-[#f8f9fb] border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-[#1b3a6e] hover:shadow-md transition-all group"
                >
                  <div className="w-full h-20 mb-4 flex items-center justify-center bg-white rounded p-3 border border-gray-100">
                    {partner.logo ? (
                      <img
                        src={getMediaUrl(partner.logo)}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#1b3a6e]">
                        {partner.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-[#1b3a6e] font-bold text-sm group-hover:text-[#c8391a] transition-colors">
                    {partner.name}
                  </h3>
                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-[#c8391a] mt-2 underline"
                    >
                      Visit Website &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded border border-gray-200 p-8">
              <p className="text-gray-500 text-sm">
                Partner listings are currently being updated in the CMS.
              </p>
            </div>
          )}

          {/* Partnership CTA */}
          <div className="mt-16 bg-[#1b3a6e] text-white p-8 md:p-10 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h3 className="font-bold text-xl mb-1.5">
                Interested in Becoming a Technology Partner?
              </h3>
              <p className="text-gray-300 text-sm max-w-[650px]">
                We welcome inquiries from machinery manufacturers, automation engineers, and industrial component suppliers worldwide.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="shrink-0 bg-[#c8391a] hover:bg-[#a62d14] text-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded transition-all whitespace-nowrap"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
