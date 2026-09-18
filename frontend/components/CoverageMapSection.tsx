"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { NepalMap } from "nepal-district-map";
import type { Province } from "nepal-district-map";
import {
  getPublicCoverage,
  PublicCoverageData,
  PublicDistrictCoverage,
} from "@/lib/public-api";

// Vibrant, distinct colors for all 7 provinces of Nepal
export const PROVINCE_THEME_COLORS: Record<Province, { fill: string; stroke: string; labelBg: string }> = {
  Koshi: {
    fill: "#93c5fd", // Soft Sky Blue
    stroke: "#2563eb",
    labelBg: "#dbeafe",
  },
  Madhesh: {
    fill: "#fde68a", // Warm Sun Yellow
    stroke: "#d97706",
    labelBg: "#fef9c3",
  },
  Bagmati: {
    fill: "#a7f3d0", // Fresh Emerald Green
    stroke: "#059669",
    labelBg: "#dcfce7",
  },
  Gandaki: {
    fill: "#ddd6fe", // Royal Lavender Purple
    stroke: "#7c3aed",
    labelBg: "#ede9fe",
  },
  Lumbini: {
    fill: "#fbcfe8", // Soft Rose Pink
    stroke: "#db2777",
    labelBg: "#fce7f3",
  },
  Karnali: {
    fill: "#fed7aa", // Warm Amber Orange
    stroke: "#ea580c",
    labelBg: "#ffedd5",
  },
  Sudurpashchim: {
    fill: "#99f6e4", // Clean Mint Teal
    stroke: "#0d9488",
    labelBg: "#ccfbf1",
  },
};

const PROVINCES_LIST: { id: Province | "all"; label: string }[] = [
  { id: "all", label: "All Nepal (77)" },
  { id: "Bagmati", label: "Bagmati" },
  { id: "Gandaki", label: "Gandaki" },
  { id: "Lumbini", label: "Lumbini" },
  { id: "Koshi", label: "Koshi" },
  { id: "Madhesh", label: "Madhesh" },
  { id: "Karnali", label: "Karnali" },
  { id: "Sudurpashchim", label: "Sudurpashchim" },
];

export default function CoverageMapSection() {
  const [coverageData, setCoverageData] = useState<PublicCoverageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>("Kathmandu");
  const [hoveredDistrictName, setHoveredDistrictName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getPublicCoverage()
      .then((data) => {
        if (isMounted) {
          setCoverageData(data);
          // Default to first highlighted district if available
          if (data.highlighted_districts && data.highlighted_districts.length > 0) {
            setSelectedDistrictName(data.highlighted_districts[0]);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load coverage data:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Map district data for nepal-district-map
  const { districtMap, highlightedList } = useMemo(() => {
    const map: Record<string, PublicDistrictCoverage> = {};
    const highlights: string[] = [];

    if (coverageData?.districts) {
      coverageData.districts.forEach((d) => {
        map[d.district_name] = d;
        if (d.is_highlighted) {
          highlights.push(d.district_name);
        }
      });
    }

    // If backend returned explicit highlighted_districts array
    const finalHighlights =
      highlights.length > 0
        ? highlights
        : coverageData?.highlighted_districts || [];

    return { districtMap: map, highlightedList: finalHighlights };
  }, [coverageData]);

  // Formatted data dictionary for NepalMap
  // Highlighting: Highlighted districts get solid vibrant crimson brand color (#dc2626)
  // Non-highlighted districts omit color so they take their respective PROVINCE color!
  const nepalMapData = useMemo(() => {
    const dataObj: Record<
      string,
      { color?: string; tooltip?: string; [key: string]: unknown }
    > = {};

    // 1. Populate from districtMap if available
    Object.values(districtMap).forEach((d) => {
      if (d.is_highlighted) {
        dataObj[d.district_name] = {
          color: d.highlight_color || "#dc2626",
          tooltip: `${d.district_name}: ${d.projects_count || 1}+ Turnkey Projects`,
        };
      } else {
        // Do NOT set color; colorMode="province" will color it by its province!
        dataObj[d.district_name] = {
          tooltip: `${d.district_name} (${d.province} Province)`,
        };
      }
    });

    // 2. Guarantee that EVERY single district in highlightedList gets a bold, vibrant crimson highlight color
    highlightedList.forEach((districtName) => {
      if (!dataObj[districtName] || !dataObj[districtName].color) {
        dataObj[districtName] = {
          ...dataObj[districtName],
          color: districtMap[districtName]?.highlight_color || "#dc2626",
          tooltip: `${districtName}: Active Project Hub`,
        };
      }
    });

    return dataObj;
  }, [districtMap, highlightedList]);

  // The district currently displayed in the detail card (hovered or selected)
  const activeDistrictRecord = useMemo(() => {
    const targetName = hoveredDistrictName || selectedDistrictName;
    if (!targetName) return null;
    return districtMap[targetName] || null;
  }, [hoveredDistrictName, selectedDistrictName, districtMap]);

  if (!loading && coverageData && coverageData.is_active === false) {
    return null;
  }

  return (
    <section className="py-16 bg-[#f5f6f8] border-t border-gray-200" id="coverage-map">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Section Header (Matches site design: clean kicker + bold heading + text intro) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest block mb-2">
            {coverageData?.badge || "Nationwide Footprint"}
          </span>
          <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mb-3">
            {coverageData?.heading || "Our Engineering Services Across Nepal"}
          </h2>
          <p className="text-gray-500 text-[14px] leading-relaxed">
            {coverageData?.subtext ||
              "From industrial cold storage and commercial reverse osmosis water treatment plants to dairy processing machinery and structural steel fabrication — explore our project footprint across Nepal."}
          </p>
        </div>

        {/* Map & District Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Nepal Map Container */}
          <div className="lg:col-span-8 bg-white border border-gray-200 shadow-sm p-5 sm:p-6 rounded flex flex-col justify-between min-h-[500px]">
            {/* Clean Card Subheader */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-gray-100">
              <div className="text-xs text-gray-600">
                Click any district on the map to inspect engineering projects and installed machinery.
              </div>
              <div className="text-xs text-gray-500 shrink-0">
                <span className="font-bold text-[#1b3a6e]">{highlightedList.length}</span> Active Hubs
              </div>
            </div>

            {/* Map Canvas */}
            <div className="w-full flex-1 flex items-center justify-center py-2 relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                  <svg
                    className="animate-spin h-7 w-7 text-[#c8391a] mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span className="text-xs">Loading Nepal District Map...</span>
                </div>
              ) : (
                <div className="w-full max-w-[860px] mx-auto nepal-district-map-container transition-all">
                  <NepalMap
                    data={nepalMapData}
                    colorMode="province"
                    provinceColors={PROVINCE_THEME_COLORS}
                    selectedProvince={selectedProvince}
                    highlightedDistricts={highlightedList}
                    highlightColor="#ffffff"
                    strokeColor="#475569"
                    strokeWidth={1}
                    hoverColor="#ffd700"
                    showLabels={true}
                    labelFontSize={8.5}
                    labelColor="#0f172a"
                    tooltipPosition="follow-cursor"
                    maxHeight="460px"
                    onDistrictHover={(name) => {
                      if (name) {
                        setHoveredDistrictName(name);
                      } else {
                        setHoveredDistrictName(null);
                      }
                    }}
                    onDistrictClick={(name) => {
                      setSelectedDistrictName(name);
                    }}
                    renderTooltip={(name) => {
                      const d = districtMap[name];
                      if (!d) {
                        return (
                          <div className="bg-[#1b3a6e] text-white px-3 py-1.5 rounded text-xs shadow-md">
                            <strong>{name}</strong>
                          </div>
                        );
                      }

                      return (
                        <div className="bg-[#1b3a6e] text-white p-3 rounded text-xs shadow-xl max-w-[240px] pointer-events-none border border-white/20">
                          <div className="flex items-center justify-between gap-2 border-b border-blue-400/30 pb-1 mb-1.5">
                            <span className="font-bold text-sm text-white">{name}</span>
                            <span className="text-[10px] text-blue-200">
                              {d.province} Province
                            </span>
                          </div>
                          {d.is_highlighted ? (
                            <>
                              <div className="text-amber-300 font-bold text-xs mb-1">
                                {d.projects_count || 1}+ Projects Installed
                              </div>
                              {d.services_summary && (
                                <div className="text-gray-200 text-[10px] line-clamp-2">
                                  {d.services_summary}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-gray-300 text-[10px] leading-snug">
                              Available for turnkey industrial deployments
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
              )}
            </div>

            {/* Clean Province Legend Bar */}
            <div className="pt-3 mt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium mr-1">Filter:</span>
                <button
                  type="button"
                  onClick={() => setSelectedProvince(null)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedProvince === null
                      ? "bg-[#1b3a6e] text-white font-semibold"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  All Nepal
                </button>
                {PROVINCES_LIST.filter((p) => p.id !== "all").map((p) => {
                  const isSelected = selectedProvince === p.id;
                  const color = PROVINCE_THEME_COLORS[p.id as Province]?.fill;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        setSelectedProvince(isSelected ? null : (p.id as Province))
                      }
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#1b3a6e] text-white font-semibold"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-xs shrink-0 border border-black/15"
                        style={{ backgroundColor: color }}
                      />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                <span className="w-3 h-3 rounded-xs bg-[#dc2626] border border-white shrink-0 shadow-xs ring-1 ring-red-400" />
                <span className="font-medium">Active Project Hub</span>
              </div>
            </div>
          </div>

          {/* District Spotlight Card */}
          <div className="lg:col-span-4 bg-white border border-gray-200 shadow-sm p-6 rounded flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="border-b border-gray-100 pb-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#c8391a] uppercase tracking-wider">
                    District Spotlight
                  </span>
                  {activeDistrictRecord?.province && (
                    <span className="text-xs text-gray-500 font-medium">
                      {activeDistrictRecord.province} Province
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#1b3a6e] mt-1">
                  {activeDistrictRecord?.district_name || selectedDistrictName || "Nepal"}
                </h3>
              </div>

              {activeDistrictRecord?.is_highlighted ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Completed Installations
                    </div>
                    <div className="text-xl font-bold text-[#1b3a6e]">
                      {activeDistrictRecord.projects_count || 1}+ Turnkey Projects
                    </div>
                  </div>

                  {activeDistrictRecord.services_summary && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                        Equipment &amp; Systems Deployed
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed font-medium bg-gray-50 p-3 rounded border border-gray-200">
                        {activeDistrictRecord.services_summary}
                      </p>
                    </div>
                  )}

                  {activeDistrictRecord.description && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                        Installation Overview
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {activeDistrictRecord.description}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center text-gray-500 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm font-bold text-gray-800">
                    Engineering Services Available
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                    We supply, install, and commission industrial machinery, cold rooms, and water treatment systems in {activeDistrictRecord?.district_name || selectedDistrictName} and across Nepal.
                  </p>
                </div>
              )}
            </div>

            {/* Action CTA inside spotlight card - Matches site button style */}
            <div className="pt-4 border-t border-gray-100 mt-6">
              <Link
                href={`/contact-us?district=${encodeURIComponent(
                  activeDistrictRecord?.district_name || selectedDistrictName
                )}#quote`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                <span>Request Project Inquiry</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
