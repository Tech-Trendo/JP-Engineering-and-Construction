"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  getAdminDistricts,
  toggleAdminDistrictHighlight,
  updateAdminDistrict,
  createAdminDistrict,
  deleteAdminDistrict,
  getAdminCoverageSettings,
  updateAdminCoverageSettings,
  AdminDistrictCoverage,
  AdminCoverageSettings,
} from "@/lib/admin-api";
import { NepalMap } from "nepal-district-map";
import type { Province } from "nepal-district-map";
import { PROVINCE_THEME_COLORS } from "@/components/CoverageMapSection";

const ALL_PROVINCES: Province[] = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const PROVINCE_OPTIONS = [
  { id: "all", label: "All Provinces (77)" },
  { id: "Bagmati", label: "Bagmati" },
  { id: "Gandaki", label: "Gandaki" },
  { id: "Lumbini", label: "Lumbini" },
  { id: "Koshi", label: "Koshi" },
  { id: "Madhesh", label: "Madhesh" },
  { id: "Karnali", label: "Karnali" },
  { id: "Sudurpashchim", label: "Sudurpashchim" },
];

const PRESET_COLORS = [
  { label: "JP Red (Brand)", value: "#c8391a" },
  { label: "Navy Blue", value: "#1b3a6e" },
  { label: "Emerald Green", value: "#16a34a" },
  { label: "Golden Amber", value: "#d97706" },
  { label: "Vibrant Cyan", value: "#0284c7" },
];

interface DistrictFormData {
  id?: number;
  district_name: string;
  province: string;
  is_highlighted: boolean;
  projects_count: number;
  services_summary: string;
  description: string;
  highlight_color: string;
  order: number;
  is_active: boolean;
}

const emptyDistrictForm: DistrictFormData = {
  district_name: "",
  province: "Bagmati",
  is_highlighted: true,
  projects_count: 5,
  services_summary: "Commercial Cold Storage, RO Water Plant",
  description: "Turnkey engineering solutions and machinery installation.",
  highlight_color: "#c8391a",
  order: 0,
  is_active: true,
};

export default function AdminCoveragePage() {
  const { accessToken } = useAdminAuth();

  const [districts, setDistricts] = useState<AdminDistrictCoverage[]>([]);
  const [settings, setSettings] = useState<AdminCoverageSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [highlightFilter, setHighlightFilter] = useState<"all" | "highlighted" | "unhighlighted">("all");

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<DistrictFormData>(emptyDistrictForm);
  const [isSavingDistrict, setIsSavingDistrict] = useState(false);

  // Section Copy Form
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<AdminCoverageSettings>({
    coverage_is_active: true,
    coverage_badge: "Nationwide Service Coverage",
    coverage_heading: "Our Engineering Services Across Nepal",
    coverage_subtext: "",
    coverage_stat_districts: "25+",
    coverage_stat_projects: "150+",
    coverage_stat_provinces: "7",
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Map preview selected province
  const [previewProvince, setPreviewProvince] = useState<Province | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const loadData = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const [districtsData, settingsData] = await Promise.all([
        getAdminDistricts(accessToken),
        getAdminCoverageSettings(accessToken),
      ]);
      setDistricts(districtsData);
      setSettings(settingsData);
      setSettingsForm(settingsData);
    } catch (err: unknown) {
      console.error("Failed to load coverage data:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load coverage data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [accessToken]);

  // Derived highlighted district names for map
  const highlightedNames = useMemo(() => {
    return districts.filter((d) => d.is_highlighted).map((d) => d.district_name);
  }, [districts]);

  // Formatted data dictionary for Admin NepalMap
  // Highlighting: Highlighted districts get solid vibrant brand color (#c8391a or custom color)
  // Non-highlighted districts omit color so they take their respective PROVINCE color!
  const adminMapData = useMemo(() => {
    const dataObj: Record<
      string,
      { color?: string; tooltip?: string; [key: string]: unknown }
    > = {};

    districts.forEach((d) => {
      if (d.is_highlighted) {
        dataObj[d.district_name] = {
          color: d.highlight_color || "#c8391a",
          tooltip: `${d.district_name}: ${d.projects_count || 1}+ Projects (Active)`,
        };
      } else {
        dataObj[d.district_name] = {
          tooltip: `${d.district_name} (${d.province} Province)`,
        };
      }
    });

    return dataObj;
  }, [districts]);

  // Total projects logged
  const totalProjectsLogged = useMemo(() => {
    return districts
      .filter((d) => d.is_highlighted)
      .reduce((acc, curr) => acc + (curr.projects_count || 0), 0);
  }, [districts]);

  // Distinct provinces represented in highlights
  const provincesCoveredCount = useMemo(() => {
    const set = new Set(
      districts.filter((d) => d.is_highlighted).map((d) => d.province)
    );
    return set.size;
  }, [districts]);

  // Filtered districts list for table
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      const matchesSearch =
        d.district_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.services_summary || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProvince =
        provinceFilter === "all" || d.province === provinceFilter;

      const matchesHighlight =
        highlightFilter === "all" ||
        (highlightFilter === "highlighted" && d.is_highlighted) ||
        (highlightFilter === "unhighlighted" && !d.is_highlighted);

      return matchesSearch && matchesProvince && matchesHighlight;
    });
  }, [districts, searchQuery, provinceFilter, highlightFilter]);

  // Handle single-click highlight toggle
  const handleToggleHighlight = async (district: AdminDistrictCoverage) => {
    if (!accessToken || togglingId !== null) return;
    const nextState = !district.is_highlighted;

    // Optimistic UI update
    setDistricts((prev) =>
      prev.map((item) =>
        item.id === district.id ? { ...item, is_highlighted: nextState } : item
      )
    );
    setTogglingId(district.id);

    try {
      const updated = await toggleAdminDistrictHighlight(
        accessToken,
        district.id,
        nextState
      );
      // Synchronize with server response
      setDistricts((prev) =>
        prev.map((item) => (item.id === district.id ? updated : item))
      );
      showToast(
        `${district.district_name} is now ${
          nextState ? "HIGHLIGHTED on the map" : "unhighlighted"
        }.`
      );
    } catch (err: unknown) {
      console.error("Toggle highlight error:", err);
      // Revert optimistic update
      setDistricts((prev) =>
        prev.map((item) =>
          item.id === district.id
            ? { ...item, is_highlighted: district.is_highlighted }
            : item
        )
      );
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to toggle highlight."
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (district: AdminDistrictCoverage) => {
    setEditingDistrict({
      id: district.id,
      district_name: district.district_name,
      province: district.province,
      is_highlighted: district.is_highlighted,
      projects_count: district.projects_count,
      services_summary: district.services_summary || "",
      description: district.description || "",
      highlight_color: district.highlight_color || "#c8391a",
      order: district.order,
      is_active: district.is_active,
    });
    setIsEditModalOpen(true);
  };

  // Save district details
  const handleSaveDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !editingDistrict.id) return;

    try {
      setIsSavingDistrict(true);
      const updated = await updateAdminDistrict(
        accessToken,
        editingDistrict.id,
        editingDistrict
      );
      setDistricts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setIsEditModalOpen(false);
      showToast(`Updated details for ${updated.district_name}.`);
    } catch (err: unknown) {
      console.error("Save district error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save district details."
      );
    } finally {
      setIsSavingDistrict(false);
    }
  };

  // Save section settings copy
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    try {
      setIsSavingSettings(true);
      const updated = await updateAdminCoverageSettings(accessToken, settingsForm);
      setSettings(updated);
      setSettingsForm(updated);
      showToast("Homepage coverage section copy updated successfully!");
      setIsSettingsOpen(false);
    } catch (err: unknown) {
      console.error("Save settings error:", err);
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to update section settings."
      );
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-medium border border-emerald-500">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Website Content & Branding</span>
            <span>/</span>
            <span className="font-semibold text-gray-800">Nationwide Coverage Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b3a6e]">
            Nationwide Coverage & District Map
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Control which districts of Nepal are highlighted on the public homepage map, customize project statistics, and edit services delivered in each district.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-all shadow-2xs cursor-pointer"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{isSettingsOpen ? "Close Section Copy" : "Edit Section Copy & Stats"}</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="font-bold underline ml-4 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Section Copy Editor Panel (Collapsible) */}
      {isSettingsOpen && (
        <form
          onSubmit={handleSaveSettings}
          className="mb-8 p-5 sm:p-6 bg-white rounded-2xl border border-blue-200 shadow-sm transition-all"
        >
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#1b3a6e]">Homepage Section Copy & Metrics</h2>
              <p className="text-xs text-gray-500">Edit the title, description, and counters rendered above the map on the public site.</p>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settingsForm.coverage_is_active}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, coverage_is_active: e.target.checked })
                }
                className="w-4 h-4 text-[#c8391a] rounded focus:ring-0"
              />
              <span>Section Visible on Homepage</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Small Pill Badge</label>
              <input
                type="text"
                value={settingsForm.coverage_badge}
                onChange={(e) => setSettingsForm({ ...settingsForm, coverage_badge: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1b3a6e]"
                placeholder="e.g. Nationwide Service Coverage"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Main Section Heading</label>
              <input
                type="text"
                value={settingsForm.coverage_heading}
                onChange={(e) => setSettingsForm({ ...settingsForm, coverage_heading: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1b3a6e]"
                placeholder="e.g. Our Engineering Services Across Nepal"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">Section Subtext / Description</label>
              <textarea
                rows={2}
                value={settingsForm.coverage_subtext}
                onChange={(e) => setSettingsForm({ ...settingsForm, coverage_subtext: e.target.value })}
                className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1b3a6e]"
                placeholder="Describe your engineering footprint and project reach across Nepal..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3 md:col-span-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Districts Counter (e.g. 25+)</label>
                <input
                  type="text"
                  value={settingsForm.coverage_stat_districts}
                  onChange={(e) => setSettingsForm({ ...settingsForm, coverage_stat_districts: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Projects Counter (e.g. 150+)</label>
                <input
                  type="text"
                  value={settingsForm.coverage_stat_projects}
                  onChange={(e) => setSettingsForm({ ...settingsForm, coverage_stat_projects: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Provinces Counter (e.g. 7)</label>
                <input
                  type="text"
                  value={settingsForm.coverage_stat_provinces}
                  onChange={(e) => setSettingsForm({ ...settingsForm, coverage_stat_provinces: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1b3a6e] hover:bg-[#152e57] rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSavingSettings ? "Saving Settings..." : "Save Section Copy"}
            </button>
          </div>
        </form>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Highlighted Districts</span>
            <span className="w-2 h-2 rounded-full bg-[#c8391a]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#c8391a] mt-2">
            {highlightedNames.length}{" "}
            <span className="text-xs font-medium text-gray-400">/ 77 Districts</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {((highlightedNames.length / 77) * 100).toFixed(0)}% of Nepal highlighted
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Logged Projects</span>
            <span className="w-2 h-2 rounded-full bg-[#1b3a6e]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6e] mt-2">
            {totalProjectsLogged}+
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Across {highlightedNames.length} active hubs
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Provinces Covered</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {provincesCoveredCount}{" "}
            <span className="text-xs font-medium text-gray-400">/ 7 Provinces</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Nationwide reach active
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Public Status</span>
            <span className={`w-2 h-2 rounded-full ${settings?.coverage_is_active ? "bg-green-500" : "bg-gray-400"}`} />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-2">
            {settings?.coverage_is_active ? "Active on Site" : "Hidden"}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Controlled in Section Copy
          </div>
        </div>
      </div>

      {/* Live Interactive Map Preview Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200/80 shadow-2xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-gray-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1b3a6e]">Live Nepal Map Preview</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                Live CMS Sync
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Reflects exactly what visitors see on the homepage. Toggling districts in the table below updates this map instantly.
            </p>
          </div>

          {/* Preview province filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-gray-400">Filter Preview:</span>
            {PROVINCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPreviewProvince(opt.id === "all" ? null : (opt.id as Province))}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  (opt.id === "all" && previewProvince === null) || previewProvince === opt.id
                    ? "bg-[#1b3a6e] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                {opt.label.replace(" (77)", "")}
              </button>
            ))}
          </div>
        </div>

        {/* The Live Map */}
        <div className="w-full flex flex-col items-center justify-center py-2 bg-slate-50/50 rounded-xl border border-slate-100 min-h-[360px]">
          {isLoading ? (
            <div className="text-xs text-gray-400 py-20">Loading map preview...</div>
          ) : (
            <>
              <div className="w-full max-w-[820px] mx-auto [&_text]:[paint-order:stroke_fill] [&_text]:[stroke:rgba(255,255,255,0.95)] [&_text]:[stroke-width:2.5px] [&_text]:[stroke-linejoin:round]">
                <NepalMap
                  data={adminMapData}
                  colorMode="province"
                  provinceColors={PROVINCE_THEME_COLORS}
                  selectedProvince={previewProvince}
                  highlightedDistricts={highlightedNames}
                  highlightColor="#1b3a6e"
                  strokeColor="#64748b"
                  strokeWidth={0.8}
                  hoverColor="#ffd700"
                  showLabels={true}
                  labelFontSize={8}
                  labelColor="#0f172a"
                  tooltipPosition="follow-cursor"
                  maxHeight="390px"
                  onDistrictClick={(name) => {
                    const target = districts.find((d) => d.district_name === name);
                    if (target) handleToggleHighlight(target);
                  }}
                />
              </div>

              {/* Province Color Legend Bar */}
              <div className="w-full pt-3 px-4 border-t border-slate-200/60 mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Provinces:
                  </span>
                  {Object.entries(PROVINCE_THEME_COLORS).map(([pName, pTheme]) => {
                    const isSelected = previewProvince === pName;
                    return (
                      <button
                        key={pName}
                        type="button"
                        onClick={() =>
                          setPreviewProvince(isSelected ? null : (pName as Province))
                        }
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-[#1b3a6e] font-bold bg-white shadow-2xs"
                            : "hover:bg-slate-200/60 text-gray-700"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-xs border border-black/10 shrink-0"
                          style={{
                            backgroundColor: pTheme.fill,
                            borderColor: pTheme.stroke,
                          }}
                        />
                        <span>{pName}</span>
                      </button>
                    );
                  })}

                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-100 text-[#c8391a] text-[11px] font-bold border border-red-200">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#c8391a] border border-white" />
                    <span>Active Hub (Highlighted)</span>
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 italic">
                  Click any district directly on the map to toggle its highlight
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* District Manager Table & Search */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search district, province, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b3a6e] bg-gray-50/50"
              />
            </div>

            {/* Province Filter Dropdown */}
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#1b3a6e]"
            >
              {PROVINCE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Highlight Filter Dropdown */}
            <select
              value={highlightFilter}
              onChange={(e) => setHighlightFilter(e.target.value as "all" | "highlighted" | "unhighlighted")}
              className="text-xs py-2 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 focus:outline-none focus:border-[#1b3a6e]"
            >
              <option value="all">All Highlight Statuses</option>
              <option value="highlighted">Highlighted Only ({highlightedNames.length})</option>
              <option value="unhighlighted">Unhighlighted Only ({77 - highlightedNames.length})</option>
            </select>
          </div>

          <div className="text-xs text-gray-500">
            Showing <strong className="text-gray-800">{filteredDistricts.length}</strong> of 77 districts
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-[11px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">District & Province</th>
                <th className="py-3.5 px-4 text-center">Highlighted on Map</th>
                <th className="py-3.5 px-4 text-center">Projects Count</th>
                <th className="py-3.5 px-4">Key Machinery / Services</th>
                <th className="py-3.5 px-4">Highlight Color</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDistricts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                    No districts match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDistricts.map((district) => {
                  const isTogglingThis = togglingId === district.id;

                  return (
                    <tr
                      key={district.id}
                      className={`hover:bg-blue-50/30 transition-colors ${
                        district.is_highlighted ? "bg-red-50/10" : ""
                      }`}
                    >
                      {/* District Name & Province */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                          <span>{district.district_name}</span>
                          {district.is_highlighted && (
                            <span className="w-2 h-2 rounded-full bg-[#c8391a]" />
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {district.province} Province
                        </div>
                      </td>

                      {/* 1-Click Highlight Toggle Switch */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          disabled={isTogglingThis}
                          onClick={() => handleToggleHighlight(district)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            district.is_highlighted ? "bg-[#c8391a]" : "bg-gray-200"
                          } ${isTogglingThis ? "opacity-50" : ""}`}
                          title={
                            district.is_highlighted
                              ? "Click to remove highlight"
                              : "Click to highlight on map"
                          }
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              district.is_highlighted ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="block text-[10px] text-gray-400 mt-1">
                          {district.is_highlighted ? "Active" : "Off"}
                        </span>
                      </td>

                      {/* Projects Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            district.is_highlighted
                              ? "bg-red-100 text-[#c8391a]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {district.projects_count || 0} Projects
                        </span>
                      </td>

                      {/* Services Summary */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-gray-800 font-medium truncate" title={district.services_summary}>
                          {district.services_summary || (
                            <span className="text-gray-300 italic">None logged yet</span>
                          )}
                        </div>
                        {district.description && (
                          <div className="text-[11px] text-gray-400 truncate mt-0.5">
                            {district.description}
                          </div>
                        )}
                      </td>

                      {/* Highlight Color */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-200 shadow-2xs"
                            style={{ backgroundColor: district.highlight_color || "#c8391a" }}
                          />
                          <span className="text-[11px] text-gray-500 font-mono">
                            {district.highlight_color || "#c8391a"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(district)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[#1b3a6e] font-bold text-xs transition-all shadow-2xs cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Edit Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit District Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1b3a6e]">
                  Edit District: {editingDistrict.district_name}
                </h3>
                <span className="text-xs text-gray-500">
                  {editingDistrict.province} Province
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDistrict} className="space-y-4">
              {/* Highlight toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <label className="text-xs font-bold text-gray-800 block">
                    Highlight on Nepal Map
                  </label>
                  <span className="text-[11px] text-gray-500">
                    If active, this district glows with brand highlight on public map.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingDistrict({
                      ...editingDistrict,
                      is_highlighted: !editingDistrict.is_highlighted,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    editingDistrict.is_highlighted ? "bg-[#c8391a]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      editingDistrict.is_highlighted ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Projects count */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Completed / Active Projects Count
                </label>
                <input
                  type="number"
                  min={0}
                  value={editingDistrict.projects_count}
                  onChange={(e) =>
                    setEditingDistrict({
                      ...editingDistrict,
                      projects_count: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1b3a6e]"
                  required
                />
              </div>

              {/* Services Summary */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Services & Machinery Summary
                </label>
                <input
                  type="text"
                  value={editingDistrict.services_summary}
                  onChange={(e) =>
                    setEditingDistrict({
                      ...editingDistrict,
                      services_summary: e.target.value,
                    })
                  }
                  placeholder="e.g. Commercial Cold Storage, RO Water Plant, Dairy Vats"
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1b3a6e]"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Displayed prominently in tooltip and district spotlight card.
                </span>
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Installation Overview & Notes
                </label>
                <textarea
                  rows={3}
                  value={editingDistrict.description}
                  onChange={(e) =>
                    setEditingDistrict({
                      ...editingDistrict,
                      description: e.target.value,
                    })
                  }
                  placeholder="Key installations completed, client sectors, or regional notes..."
                  className="w-full text-xs p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-[#1b3a6e]"
                />
              </div>

              {/* Highlight Color */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Highlight Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editingDistrict.highlight_color}
                    onChange={(e) =>
                      setEditingDistrict({
                        ...editingDistrict,
                        highlight_color: e.target.value,
                      })
                    }
                    className="w-10 h-10 p-0 border border-gray-200 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingDistrict.highlight_color}
                    onChange={(e) =>
                      setEditingDistrict({
                        ...editingDistrict,
                        highlight_color: e.target.value,
                      })
                    }
                    className="w-28 text-xs p-2 rounded-lg border border-gray-300 font-mono"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((pc) => (
                      <button
                        key={pc.value}
                        type="button"
                        onClick={() =>
                          setEditingDistrict({
                            ...editingDistrict,
                            highlight_color: pc.value,
                          })
                        }
                        className="w-6 h-6 rounded-full border border-gray-200 shadow-2xs cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: pc.value }}
                        title={pc.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDistrict}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#c8391a] hover:bg-[#b03014] rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSavingDistrict ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
