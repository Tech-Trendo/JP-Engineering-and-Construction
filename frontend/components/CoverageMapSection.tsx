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

  // Formatted data dictionary for NepalMap choropleth/coloring
  const nepalMapData = useMemo(() => {
    const dataObj: Record<
      string,
      { color?: string; tooltip?: string; [key: string]: unknown }
    > = {};

    Object.values(districtMap).forEach((d) => {
      if (d.is_highlighted) {
        dataObj[d.district_name] = {
          color: d.highlight_color || "#c8391a",
          tooltip: `${d.district_name}: ${d.projects_count || 1}+ Projects`,
        };
      } else {
        dataObj[d.district_name] = {
          color: "#e2e8f0",
          tooltip: d.district_name,
        };
      }
    });

    return dataObj;
  }, [districtMap]);

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
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] border-y border-gray-200 relative overflow-hidden">
      {/* Subtle background tech accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#c8391a] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#c8391a] animate-pulse" />
            {coverageData?.badge || "Nationwide Service Coverage"}
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b3a6e] tracking-tight mb-4">
            {coverageData?.heading || "Our Engineering Services Across Nepal"}
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {coverageData?.subtext ||
              "From industrial cold storage and commercial reverse osmosis water treatment plants to dairy processing machinery, solar setups, and structural steel fabrication — explore the districts across Nepal where JP Engineering & Construction delivers trusted engineering solutions."}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10">
          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c8391a]">
              {coverageData?.stat_districts || `${highlightedList.length}+`}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              Districts Served
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6e]">
              {coverageData?.stat_projects || "150+"}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              Projects Completed
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#c8391a]">
              {coverageData?.stat_provinces || "7"}
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              Provinces Covered
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6e]">
              25+
            </div>
            <div className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">
              Years in Engineering
            </div>
          </div>
        </div>

        {/* Province Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-semibold text-gray-400 mr-1 hidden sm:inline">
            Filter Region:
          </span>
          {PROVINCES_LIST.map((item) => {
            const isSelected =
              item.id === "all"
                ? selectedProvince === null
                : selectedProvince === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedProvince(item.id === "all" ? null : (item.id as Province));
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1b3a6e] text-white shadow-sm font-semibold scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Map & District Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Nepal Map Canvas */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-sm relative min-h-[460px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#c8391a]" />
                <span className="text-xs font-bold text-gray-700">
                  Highlighted Districts ({highlightedList.length} Active Hubs)
                </span>
              </div>
              <div className="text-[11px] text-gray-400 italic">
                Hover or click any district to inspect projects
              </div>
            </div>

            {/* Map Container */}
            <div className="w-full flex-1 flex items-center justify-center py-2 relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                  <svg
                    className="animate-spin h-8 w-8 text-[#c8391a] mb-3"
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
                <div className="w-full max-w-[850px] mx-auto transition-all">
                  <NepalMap
                    selectedProvince={selectedProvince}
                    highlightedDistricts={highlightedList}
                    highlightColor="#c8391a"
                    colorMode="flat"
                    baseColor="#e2e8f0"
                    strokeColor="#94a3b8"
                    strokeWidth={0.6}
                    hoverColor="#1b3a6e"
                    showLabels={true}
                    labelFontSize={8.5}
                    labelColor="#334155"
                    tooltipPosition="follow-cursor"
                    maxHeight="440px"
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
                          <div className="bg-[#1b3a6e] text-white px-3 py-1.5 rounded-md text-xs shadow-md">
                            <strong>{name}</strong>
                          </div>
                        );
                      }

                      return (
                        <div className="bg-[#1b3a6e] text-white p-3 rounded-lg text-xs shadow-xl max-w-[220px] pointer-events-none">
                          <div className="flex items-center justify-between gap-2 border-b border-blue-400/30 pb-1 mb-1.5">
                            <span className="font-bold text-sm text-white">{name}</span>
                            <span className="text-[10px] text-blue-200">
                              {d.province}
                            </span>
                          </div>
                          {d.is_highlighted ? (
                            <>
                              <div className="text-amber-300 font-semibold text-[11px] mb-1">
                                {d.projects_count || 1}+ Turnkey Projects
                              </div>
                              {d.services_summary && (
                                <div className="text-gray-200 text-[10px] line-clamp-2 mb-1">
                                  {d.services_summary}
                                </div>
                              )}
                              <div className="text-[9px] text-green-300 font-medium">
                                Active Service Hub
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-300 text-[10px]">
                              Available for turnkey engineering deployments
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                </div>
              )}
            </div>

            {/* Map Legend Bar */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#c8391a]" />
                  <span className="font-medium text-gray-700">
                    Active Projects Deployed
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#e2e8f0] border border-gray-300" />
                  <span className="text-gray-500">Service Reachable</span>
                </div>
              </div>
              <div className="text-[11px] text-gray-400">
                Data configured directly via Admin CMS
              </div>
            </div>
          </div>

          {/* District Spotlight Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    District Spotlight
                  </span>
                  <h3 className="text-2xl font-bold text-[#1b3a6e] mt-0.5">
                    {activeDistrictRecord?.district_name || selectedDistrictName || "Nepal"}
                  </h3>
                </div>
                {activeDistrictRecord?.province && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1b3a6e] border border-blue-100">
                    {activeDistrictRecord.province}
                  </span>
                )}
              </div>

              {activeDistrictRecord?.is_highlighted ? (
                <div className="space-y-4">
                  {/* Status badge */}
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Active Engineering Operations
                  </div>

                  {/* Project Counter */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-3.5">
                    <div className="text-xs font-medium text-gray-600">
                      Completed & Active Installations
                    </div>
                    <div className="text-2xl font-extrabold text-[#c8391a] mt-0.5">
                      {activeDistrictRecord.projects_count || 1}+ Projects
                    </div>
                  </div>

                  {/* Services Delivered */}
                  {activeDistrictRecord.services_summary && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Key Solutions Deployed:
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        {activeDistrictRecord.services_summary}
                      </p>
                    </div>
                  )}

                  {/* Case study / summary notes */}
                  {activeDistrictRecord.description && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Installation Overview:
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {activeDistrictRecord.description}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-gray-500 space-y-3">
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
                  <h4 className="text-sm font-bold text-gray-700">
                    {activeDistrictRecord?.district_name || selectedDistrictName} is Ready for Deployment
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                    JP Engineering & Construction provides full turnkey industrial machinery, cold storage, and water treatment engineering nationwide.
                  </p>
                </div>
              )}
            </div>

            {/* Action CTA inside spotlight card */}
            <div className="pt-4 border-t border-gray-100 mt-6">
              <Link
                href={`/contact-us?district=${encodeURIComponent(
                  activeDistrictRecord?.district_name || selectedDistrictName
                )}#quote`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#c8391a] hover:bg-[#b03014] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Request Project in {activeDistrictRecord?.district_name || selectedDistrictName}</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Select Prominent Hubs Chips */}
        {highlightedList.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 mr-2">
                Quick Explore Key Hubs:
              </span>
              {highlightedList.slice(0, 10).map((dName) => {
                const isSelected =
                  (hoveredDistrictName || selectedDistrictName) === dName;
                const distInfo = districtMap[dName];

                return (
                  <button
                    key={dName}
                    type="button"
                    onClick={() => setSelectedDistrictName(dName)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#c8391a] text-white shadow-xs"
                        : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-white" : "bg-[#c8391a]"
                      }`}
                    />
                    <span>{dName}</span>
                    {distInfo?.projects_count ? (
                      <span
                        className={`text-[10px] px-1 rounded ${
                          isSelected
                            ? "bg-red-900/40 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {distInfo.projects_count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
