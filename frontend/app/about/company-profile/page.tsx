"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import {
  getPublicSiteSettings,
  getPublicCategories,
  PublicSiteSettings,
  PublicCategory,
} from "@/lib/public-api";

const WHY_JP_ENGINEERING = [
  {
    title: "10+ Years Proven Experience",
    description: "Over a decade of successful engineering installations, manufacturing plants, and turnkey machinery setups across Nepal.",
    icon: (
      <svg className="w-5 h-5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Uncompromising Quality Products",
    description: "Precision-engineered using certified SS304 & SS316 food-grade stainless steel with high durability and international compliance.",
    icon: (
      <svg className="w-5 h-5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Qualified Technical Manpower",
    description: "Staffed with certified mechanical, thermal, electrical, and SCADA automation engineers delivering bespoke industrial installations.",
    icon: (
      <svg className="w-5 h-5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: "Necessary Advice to Customers",
    description: "Expert engineering consultation, CAD plant layouts, technical feasibility studies, and regulatory guidance for your enterprise.",
    icon: (
      <svg className="w-5 h-5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Advanced Fabrication Equipment",
    description: "Equipped with state-of-the-art CNC cutting, automated orbital welding, and hydraulic press bending technology.",
    icon: (
      <svg className="w-5 h-5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: "Dedicated After-Sales Service",
    description: "Rapid on-site maintenance, original component spare parts warehouse, and 24/7 emergency breakdown support.",
    icon: (
      <svg className="w-5 h-5 text-[#c8391a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setHasError(false);
      try {
        const [settingsRes, catsRes] = await Promise.allSettled([
          getPublicSiteSettings(),
          getPublicCategories(),
        ]);

        if (settingsRes.status === "fulfilled") {
          setSiteSettings(settingsRes.value);
        } else {
          setHasError(true);
        }

        if (catsRes.status === "fulfilled") {
          setCategories(catsRes.value);
        }
      } catch (err) {
        console.error("[CompanyProfilePage] fetch error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const overviewStats = siteSettings
    ? [
        { label: "Company Type", value: siteSettings.company_type },
        { label: "Established", value: siteSettings.founding_year },
        { label: "Headquarters", value: siteSettings.address },
        { label: "Employees", value: siteSettings.employee_count },
      ].filter((item) => Boolean(item.value))
    : [];

  const keyStats = siteSettings
    ? [
        { value: siteSettings.stat_years_experience, label: "Years Experience" },
        { value: siteSettings.stat_projects_completed, label: "Projects Completed" },
        { value: siteSettings.stat_happy_clients, label: "Happy Clients" },
        { value: siteSettings.stat_business_sectors, label: "Industrial Sectors" },
      ].filter((s) => Boolean(s.value))
    : [];

  return (
    <>
      <PageBanner
        title="Company Profile"
        breadcrumbs={[{ label: "About Us" }, { label: "Company Profile" }]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-pulse">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-6 w-36 bg-gray-200 rounded" />
                <div className="h-8 w-2/3 bg-gray-200 rounded" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded" />
                <div className="h-36 bg-gray-200 rounded" />
              </div>
            </div>
          ) : hasError ? (
            <div className="p-12 border border-red-200 bg-red-50 text-center rounded-lg max-w-lg mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                !
              </div>
              <h3 className="text-red-800 font-bold text-lg mb-1">Unable to load company profile</h3>
              <p className="text-red-700 text-sm leading-relaxed mb-4">
                Company profile could not be loaded from the backend API.
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
              <div className="lg:col-span-2 space-y-10">
                {/* Overview */}
                <div>
                  <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
                    Company Overview
                  </span>
                  <h2 className="text-[#1b3a6e] text-2xl font-bold mt-2 mb-4">
                    {siteSettings?.company_name}
                  </h2>
                  {overviewStats.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {overviewStats.map((item) => (
                        <div key={item.label} className="bg-[#f8f9fb] border border-gray-200 p-3 rounded">
                          <div className="text-[11px] text-gray-500 uppercase tracking-wide mb-0.5">
                            {item.label}
                          </div>
                          <div className="text-[#1b3a6e] font-bold text-[13px]">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-600 text-[14px] leading-relaxed whitespace-pre-line">
                    {siteSettings?.company_description}
                  </p>
                </div>

                {/* Why JP Engineering? (Authentic 6 Pillars from jpec.com.np) */}
                <div>
                  <h3 className="text-[#1b3a6e] font-bold text-[18px] mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#c8391a]" />
                    Why JP Engineering?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {WHY_JP_ENGINEERING.map((pillar, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 p-4 bg-white hover:border-[#1b3a6e] rounded-lg shadow-2xs hover:shadow-xs transition-all flex items-start gap-3"
                      >
                        <div className="p-2 rounded-md bg-red-50 shrink-0 mt-0.5">
                          {pillar.icon}
                        </div>
                        <div>
                          <h4 className="text-[#1b3a6e] font-bold text-[13px] mb-1">
                            {pillar.title}
                          </h4>
                          <p className="text-gray-600 text-[12px] leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Core Capabilities */}
                <div>
                  <h3 className="text-[#1b3a6e] font-bold text-[17px] mb-4 flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-[#c8391a]" />
                    Core Machinery &amp; Engineering Disciplines
                  </h3>
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {categories.map((cat) => (
                        <div key={cat.id} className="border border-gray-200 p-4 bg-[#f8f9fb] rounded">
                          <h4 className="text-[#1b3a6e] font-bold text-[14px] mb-1">
                            {cat.name}
                          </h4>
                          <p className="text-gray-600 text-[12px] leading-relaxed line-clamp-3">
                            {cat.description || "Comprehensive manufacturing, assembly, and turnkey plant commissioning."}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs">Disciplines are currently being updated.</p>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {keyStats.length > 0 && (
                  <div className="bg-[#1b3a6e] text-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 pb-2 border-b border-white/20">
                      Key Industrial Numbers
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {keyStats.map((s) => (
                        <div key={s.label} className="bg-white/10 p-3 rounded">
                          <div className="text-2xl font-black text-[#c8391a]">{s.value}</div>
                          <div className="text-[11px] text-gray-300 mt-0.5">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#f8f9fb] border border-gray-200 p-6 rounded-lg">
                  <h4 className="text-[#1b3a6e] font-bold text-sm uppercase tracking-wider mb-3">
                    Need Machinery Specs?
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed mb-4">
                    Our engineers supply CAD drawings, technical datasheets, and comprehensive quotes tailored to your project requirements.
                  </p>
                  <Link
                    href="/contact-us#quote"
                    className="block text-center bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider py-3 rounded transition-colors"
                  >
                    Request Proposal
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
