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
