"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
  AdminSiteSettings,
  getMediaUrl,
} from "@/lib/admin-api";

type TabId = "identity" | "contact" | "socials" | "hero" | "stats" | "cta";

interface TabItem {
  id: TabId;
  label: string;
  shortLabel: string;
  description: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

const TABS: TabItem[] = [
  {
    id: "identity",
    label: "Company Identity & Logo",
    shortLabel: "Identity",
    description: "Website name, logo, slogan, and company description",
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact & Address",
    shortLabel: "Contact",
    description: "Phone numbers, official email, physical location & hours",
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    id: "socials",
    label: "Social Media Links",
    shortLabel: "Socials",
    description: "Facebook, X (Twitter), LinkedIn, and YouTube channels",
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    id: "hero",
    label: "Homepage Hero Banner",
    shortLabel: "Hero Banner",
    description: "Main headline, action buttons, and background imagery",
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "stats",
    label: "Key Numbers & Stats",
    shortLabel: "Statistics",
    description: "Experience, completed projects, and happy client numbers",
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "cta",
    label: "Bottom Quote Banner",
    shortLabel: "Call to Action",
    description: "The prominent persistent quote CTA at the bottom of the page",
    icon: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
];

function SiteSettingsContent() {
  const { accessToken } = useAdminAuth();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabId>("identity");

  useEffect(() => {
    const tabParam = (searchParams.get("tab") || searchParams.get("section")) as TabId;
    if (tabParam && ["identity", "contact", "socials", "hero", "stats", "cta"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const [formData, setFormData] = useState<AdminSiteSettings>({
    company_name: "",
    company_short_name: "",
    logo: null,
    tagline: "",
    company_description: "",
    founding_year: "",
    company_type: "",
    registration_number: "",
    pan_vat_number: "",
    employee_count: "",
    primary_phone: "",
    secondary_phone: "",
    primary_email: "",
    secondary_email: "",
    address: "",
    business_hours: "",
    map_location_text: "",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    youtube_url: "",
    hero_badge: "",
    hero_heading: "",
    hero_subtext: "",
    hero_image: null,
    hero_cta_primary_label: "",
    hero_cta_primary_link: "",
    hero_cta_secondary_label: "",
    hero_cta_secondary_link: "",
    stat_years_experience: "",
    stat_projects_completed: "",
    stat_happy_clients: "",
    stat_business_sectors: "",
    cta_heading: "",
    cta_subtext: "",
    cta_button_label: "",
    cta_button_link: "",
  });

  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;

    async function loadSettings() {
      try {
        const data = await getAdminSiteSettings(accessToken!);
        if (isMounted) {
          setFormData(data);
          if (data.hero_image) {
            setHeroImagePreview(getMediaUrl(data.hero_image));
          }
          if (data.logo || data.logo_url) {
            setLogoPreview(getMediaUrl(data.logo_url || data.logo));
          }
        }
      } catch (err: unknown) {
        console.error("Failed to load site settings:", err);
        if (isMounted) setErrorMessage("Failed to load existing site settings.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHeroImageFile(file);
      setHeroImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      if (heroImageFile || logoFile) {
        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
          if (
            key !== "hero_image" &&
            key !== "logo" &&
            key !== "logo_url" &&
            key !== "hero_image_url" &&
            val !== undefined &&
            val !== null
          ) {
            data.append(key, String(val));
          }
        });
        if (heroImageFile) {
          data.append("hero_image", heroImageFile);
        }
        if (logoFile) {
          data.append("logo", logoFile);
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "https://app.jpengineering.com.np/api/v1" : "http://127.0.0.1:8000/api/v1")}/admin/site-settings/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: data,
          }
        );

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to save site settings.");
        }

        const updated = await res.json();
        setFormData(updated);
        if (updated.hero_image) {
          setHeroImagePreview(getMediaUrl(updated.hero_image));
        }
        if (updated.logo || updated.logo_url) {
          setLogoPreview(getMediaUrl(updated.logo_url || updated.logo));
        }
        setHeroImageFile(null);
        setLogoFile(null);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hero_image: _heroImg, logo: _logo, ...payload } = formData;
        const updated = await updateAdminSiteSettings(accessToken, payload);
        setFormData(updated);
      }

      setSuccessMessage("Changes saved successfully! Your live website has been updated.");
      setTimeout(() => setSuccessMessage(null), 6000);
    } catch (err: unknown) {
      console.error("Save site settings error:", err);
      const message = err instanceof Error ? err.message : "Failed to save settings.";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-3 text-slate-400">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <p className="text-xs font-medium tracking-wide">Loading website settings...</p>
      </div>
    );
  }

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-6 max-w-5xl pb-24">
      {/* Friendly Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
              CMS Customizer
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Website Content &amp; Identity
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Update your company details, logo, contact numbers, and homepage sections. All changes update instantly on your live website.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shrink-0"
        >
          <span>View Live Website</span>
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-800/60 flex items-center justify-center text-emerald-300 shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-white text-xs px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-700/80 text-red-200 text-xs flex items-center gap-2.5 shadow-lg">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Modern Section Tabs Bar */}
      <div className="bg-[#0b1325] border border-slate-800 rounded-2xl p-1.5 shadow-inner">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left justify-center sm:justify-start ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="truncate">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: Company Profile & Identity */}
        {activeTab === "identity" && (
          <div className="bg-[#0b1325] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold text-sm">Step 1</span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base font-bold text-white">
                  Company Identity &amp; Branding
                </h2>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                This information defines the official company name, logo, slogan, and description shown on your website header and footer.
              </p>
            </div>

            {/* Logo Uploader */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-slate-200 text-xs font-bold">Official Company Logo</label>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Recommended: Transparent PNG or SVG logo image (looks sharp on both light and dark backgrounds).
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
                <div className="w-20 h-20 rounded-xl bg-white/10 p-2 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-slate-500 text-[10px]">No Logo</span>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition cursor-pointer inline-flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Choose Logo Image</span>
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Displayed in the navbar, footer, and admin panel.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Full Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  required
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="e.g. JP Engineering & Construction Pvt. Ltd."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  💡 Primary registered company name shown in page titles, header, footer, and copyright.
                </span>
              </div>

              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Short Brand Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="company_short_name"
                  required
                  value={formData.company_short_name}
                  onChange={handleChange}
                  placeholder="e.g. JP Engineering & Construction"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  💡 Compact name used in tight navigation spaces and mobile headers.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                Company Slogan / Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. Engineered for Extreme Industrial Performance"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                💡 Displayed directly underneath your company logo in the header and footer.
              </span>
            </div>

            <div>
              <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                About / Corporate Description
              </label>
              <textarea
                name="company_description"
                rows={4}
                value={formData.company_description}
                onChange={handleChange}
                placeholder="Brief paragraph describing your company's core services and expertise..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                💡 Displayed in the footer column and used for search engine previews (SEO).
              </span>
            </div>

            {/* Corporate Details */}
            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Corporate Details &amp; Team Size
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 text-[11px] font-medium mb-1">Established Year</label>
                  <input
                    type="text"
                    name="founding_year"
                    value={formData.founding_year}
                    onChange={handleChange}
                    placeholder="e.g. 2014"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] font-medium mb-1">Company Type</label>
                  <input
                    type="text"
                    name="company_type"
                    value={formData.company_type}
                    onChange={handleChange}
                    placeholder="e.g. Private Limited"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-[11px] font-medium mb-1">Team / Workforce Count</label>
                  <input
                    type="text"
                    name="employee_count"
                    value={formData.employee_count}
                    onChange={handleChange}
                    placeholder="e.g. 45+ Engineers"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Contact Details & Location */}
        {activeTab === "contact" && (
          <div className="bg-[#0b1325] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold text-sm">Step 2</span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base font-bold text-white">
                  Contact Information &amp; Office Hours
                </h2>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Manage telephone numbers, emails, physical address, and hours shown on your header topbar, contact page, and footer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Main Office Landline / Phone
                </label>
                <input
                  type="text"
                  name="primary_phone"
                  value={formData.primary_phone}
                  onChange={handleChange}
                  placeholder="e.g. 01-5385552"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  💡 Appears in the header top bar and footer with a direct tap-to-call link.
                </span>
              </div>

              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Direct Mobile / Sales Numbers
                </label>
                <input
                  type="text"
                  name="secondary_phone"
                  value={formData.secondary_phone}
                  onChange={handleChange}
                  placeholder="e.g. 9851112988, 9851158661, 9851158660"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  💡 Separate multiple numbers with commas. Each number will get an individual click-to-call button.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Official Inquiry Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="primary_email"
                  required
                  value={formData.primary_email}
                  onChange={handleChange}
                  placeholder="e.g. info@jpec.com.np"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  💡 Main email address for machinery consultations and inquiries.
                </span>
              </div>

              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Secondary / Sales Email (Optional)
                </label>
                <input
                  type="email"
                  name="secondary_email"
                  value={formData.secondary_email}
                  onChange={handleChange}
                  placeholder="e.g. sales@jpec.com.np"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  💡 Additional contact email displayed on the contact page.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Physical Office &amp; Factory Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu, Nepal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  💡 Physical street address shown on contact cards and footer.
                </span>
              </div>

              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Operating / Business Hours
                </label>
                <input
                  type="text"
                  name="business_hours"
                  value={formData.business_hours}
                  onChange={handleChange}
                  placeholder="e.g. Mon – Sat: 9:00 AM – 6:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  💡 Operating hours shown in the header top bar and footer.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                Location Landmark / Directions
              </label>
              <input
                type="text"
                name="map_location_text"
                value={formData.map_location_text}
                onChange={handleChange}
                placeholder="e.g. Kathmandu, Nepal"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                💡 Helpful driving instructions displayed alongside the map on the Contact Us page.
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: Social Media Links */}
        {activeTab === "socials" && (
          <div className="bg-[#0b1325] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold text-sm">Step 3</span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base font-bold text-white">
                  Social Media Links
                </h2>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Connect your official social media pages. Icons appear automatically in both the header bar and footer. Leave empty to hide any channel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <div className="w-6 h-6 rounded bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Facebook Page</span>
                </div>
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <div className="w-6 h-6 rounded bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span>X / Twitter Profile</span>
                </div>
                <input
                  type="url"
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourhandle"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <div className="w-6 h-6 rounded bg-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>LinkedIn Company Page</span>
                </div>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/yourcompany"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-200 text-xs font-semibold">
                  <div className="w-6 h-6 rounded bg-[#FF0000]/20 text-[#FF0000] flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>YouTube Channel</span>
                </div>
                <input
                  type="url"
                  name="youtube_url"
                  value={formData.youtube_url}
                  onChange={handleChange}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Homepage Hero Banner */}
        {activeTab === "hero" && (
          <div className="bg-[#0b1325] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold text-sm">Step 4</span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base font-bold text-white">
                  Homepage Hero Banner
                </h2>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Customize the top welcoming headline, subtext, background photograph, and call-to-action buttons on your homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Top Badge / Tag
                </label>
                <input
                  type="text"
                  name="hero_badge"
                  value={formData.hero_badge}
                  onChange={handleChange}
                  placeholder="e.g. Nepal's Premier Industrial Machinery"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Small highlighted pill above the title.
                </span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Main Hero Heading
                </label>
                <input
                  type="text"
                  name="hero_heading"
                  value={formData.hero_heading}
                  onChange={handleChange}
                  placeholder="e.g. Engineered Machinery & Turnkey Industrial Plants"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  The primary large headline visitors see when landing on the website.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                Hero Subheading / Paragraph
              </label>
              <textarea
                name="hero_subtext"
                rows={3}
                value={formData.hero_subtext}
                onChange={handleChange}
                placeholder="Specializing in cold storage facilities, water purification plants, automated dairy processing..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
              />
            </div>

            {/* Hero Background Photo */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <label className="block text-slate-200 text-xs font-bold">
                Hero Background Photo
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {heroImagePreview ? (
                  <div className="h-24 w-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0 shadow-md">
                    <img
                      src={heroImagePreview}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-44 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-xs shrink-0">
                    No photo selected
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition cursor-pointer inline-flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Upload New Background Photo</span>
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Recommended dimensions: 1920 x 800px (JPG or WebP).
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">
                  Primary Action Button (Solid Red)
                </span>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Button Text</label>
                  <input
                    type="text"
                    name="hero_cta_primary_label"
                    value={formData.hero_cta_primary_label}
                    onChange={handleChange}
                    placeholder="e.g. Explore Machinery"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Link Destination</label>
                  <input
                    type="text"
                    name="hero_cta_primary_link"
                    value={formData.hero_cta_primary_link}
                    onChange={handleChange}
                    placeholder="e.g. /products"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">
                  Secondary Action Button (Outline)
                </span>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Button Text</label>
                  <input
                    type="text"
                    name="hero_cta_secondary_label"
                    value={formData.hero_cta_secondary_label}
                    onChange={handleChange}
                    placeholder="e.g. Request a Quote"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Link Destination</label>
                  <input
                    type="text"
                    name="hero_cta_secondary_link"
                    value={formData.hero_cta_secondary_link}
                    onChange={handleChange}
                    placeholder="e.g. /contact-us"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Key Numbers & Metric Counters */}
        {activeTab === "stats" && (
          <div className="bg-[#0b1325] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold text-sm">Step 5</span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base font-bold text-white">
                  Homepage Highlight Metrics &amp; Achievements
                </h2>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                These numbers are showcased in the prominent counter bar on the homepage to establish credibility and trust with prospective clients.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-1">
                  1
                </div>
                <label className="block text-slate-200 text-xs font-semibold">
                  Years of Experience
                </label>
                <input
                  type="text"
                  name="stat_years_experience"
                  value={formData.stat_years_experience}
                  onChange={handleChange}
                  placeholder="e.g. 10+"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 block">Years active in industry</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs mb-1">
                  2
                </div>
                <label className="block text-slate-200 text-xs font-semibold">
                  Projects Completed
                </label>
                <input
                  type="text"
                  name="stat_projects_completed"
                  value={formData.stat_projects_completed}
                  onChange={handleChange}
                  placeholder="e.g. 500+"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 block">Turnkey plants delivered</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-1">
                  3
                </div>
                <label className="block text-slate-200 text-xs font-semibold">
                  Happy Clients
                </label>
                <input
                  type="text"
                  name="stat_happy_clients"
                  value={formData.stat_happy_clients}
                  onChange={handleChange}
                  placeholder="e.g. 350+"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 block">Satisfied client companies</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs mb-1">
                  4
                </div>
                <label className="block text-slate-200 text-xs font-semibold">
                  Machinery Sectors
                </label>
                <input
                  type="text"
                  name="stat_business_sectors"
                  value={formData.stat_business_sectors}
                  onChange={handleChange}
                  placeholder="e.g. 7"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm font-bold focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 block">Specialized industrial divisions</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Call To Action Banner */}
        {activeTab === "cta" && (
          <div className="bg-[#0b1325] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold text-sm">Step 6</span>
                <span className="text-slate-600">•</span>
                <h2 className="text-base font-bold text-white">
                  Bottom Call-To-Action (CTA) Banner
                </h2>
              </div>
              <p className="text-slate-400 text-xs mt-1">
                Customize the persistent blue banner displayed above the footer on the homepage encouraging visitors to request a quote.
              </p>
            </div>

            <div>
              <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                Banner Headline
              </label>
              <input
                type="text"
                name="cta_heading"
                value={formData.cta_heading}
                onChange={handleChange}
                placeholder="e.g. Ready to Start Your Project?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                💡 The large heading in the bottom banner.
              </span>
            </div>

            <div>
              <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                Banner Subtext
              </label>
              <textarea
                name="cta_subtext"
                rows={2}
                value={formData.cta_subtext}
                onChange={handleChange}
                placeholder="e.g. Contact our engineering team for a free consultation and project estimate."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 leading-relaxed"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                💡 Subtitle explaining what happens when they click the button.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Button Text
                </label>
                <input
                  type="text"
                  name="cta_button_label"
                  value={formData.cta_button_label}
                  onChange={handleChange}
                  placeholder="e.g. Get In Touch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-200 text-xs font-semibold mb-1.5">
                  Button Link Destination
                </label>
                <input
                  type="text"
                  name="cta_button_link"
                  value={formData.cta_button_link}
                  onChange={handleChange}
                  placeholder="e.g. /contact-us"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Floating / Sticky Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070e1c]/95 border-t border-slate-800 backdrop-blur-md px-4 py-3 sm:px-8 shadow-2xl">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Editing: <strong className="text-slate-200">{currentTab.label}</strong></span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-900/40 transition disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AdminSiteSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-72 flex-col items-center justify-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-xs font-medium tracking-wide">Loading website settings...</p>
        </div>
      }
    >
      <SiteSettingsContent />
    </Suspense>
  );
}

