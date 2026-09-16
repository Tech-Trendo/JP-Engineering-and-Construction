"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  adminFetch,
  unwrapAdminResults,
  AdminQuote,
  AdminProduct,
  AdminCategory,
  AdminHeroSlide,
  AdminIndustry,
  AdminTeamMember,
  AdminPartner,
  AdminClient,
  AdminSiteSettings,
  getMediaUrl,
} from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const { accessToken } = useAdminAuth();

  const [siteSettings, setSiteSettings] = useState<AdminSiteSettings | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [slides, setSlides] = useState<AdminHeroSlide[]>([]);
  const [industries, setIndustries] = useState<AdminIndustry[]>([]);
  const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([]);
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingQuoteId, setUpdatingQuoteId] = useState<number | null>(null);
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;

    async function loadAllCMSData() {
      try {
        const [
          settingsRes,
          productsRes,
          categoriesRes,
          slidesRes,
          industriesRes,
          teamRes,
          partnersRes,
          clientsRes,
          quotesRes,
        ] = await Promise.all([
          adminFetch<AdminSiteSettings>("admin/site-settings/", {}, accessToken!).catch(() => null),
          adminFetch<unknown>("admin/products/", {}, accessToken!).catch(() => ({ results: [] })),
          adminFetch<unknown>("admin/categories/", {}, accessToken!).catch(() => ({ results: [] })),
          adminFetch<unknown>("admin/hero-slides/", {}, accessToken!).catch(() => ({ results: [] })),
          adminFetch<unknown>("admin/industries/", {}, accessToken!).catch(() => ({ results: [] })),
          adminFetch<unknown>("admin/team/", {}, accessToken!).catch(() => ({ results: [] })),
          adminFetch<unknown>("admin/partners/", {}, accessToken!).catch(() => ({ results: [] })),
          adminFetch<unknown>("admin/clients/", {}, accessToken!).catch(() => ({ results: [] })),
          adminFetch<unknown>("admin/quotes/", {}, accessToken!).catch(() => ({ results: [] })),
        ]);

        if (isMounted) {
          if (settingsRes) setSiteSettings(settingsRes);
          setProducts(unwrapAdminResults<AdminProduct>(productsRes));
          setCategories(unwrapAdminResults<AdminCategory>(categoriesRes));
          setSlides(unwrapAdminResults<AdminHeroSlide>(slidesRes));
          setIndustries(unwrapAdminResults<AdminIndustry>(industriesRes));
          setTeamMembers(unwrapAdminResults<AdminTeamMember>(teamRes));
          setPartners(unwrapAdminResults<AdminPartner>(partnersRes));
          setClients(unwrapAdminResults<AdminClient>(clientsRes));
          setQuotes(unwrapAdminResults<AdminQuote>(quotesRes));
        }
      } catch (err) {
        console.error("Failed to load CMS dashboard content:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAllCMSData();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const handleUpdateQuoteStatus = async (
    quoteId: number,
    newStatus: "new" | "contacted" | "closed"
  ) => {
    if (!accessToken) return;
    setUpdatingQuoteId(quoteId);
    try {
      await adminFetch(`admin/quotes/${quoteId}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      }, accessToken);

      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );
      setQuoteSuccessMsg(`Inquiry status updated to "${newStatus}"!`);
      setTimeout(() => setQuoteSuccessMsg(null), 3000);
    } catch (err) {
      console.error("Failed to update quote status:", err);
    } finally {
      setUpdatingQuoteId(null);
    }
  };

  const newQuotes = quotes.filter((q) => q.status === "new");

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 text-slate-400">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
        <p className="text-sm font-semibold tracking-wide text-slate-200">
          Loading Website Management Portal...
        </p>
        <span className="text-xs text-slate-400">
          Gathering all website sections, content, and inquiries
        </span>
      </div>
    );
  }

  const logoUrl = siteSettings?.logo_url || siteSettings?.logo
    ? getMediaUrl(siteSettings.logo_url || siteSettings.logo)
    : "/assets/logo.webp";

  const companyName = siteSettings?.company_name || "JP Engineering & Construction Pvt. Ltd.";

  return (
    <div className="space-y-6 max-w-6xl pb-20">
      {/* 1. Executive Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f2347] via-[#1b3a6e] to-[#152e57] text-white p-6 sm:p-8 shadow-xs border border-slate-800/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/15">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live CMS Workspace
              </span>
              <span className="text-xs text-slate-300">JP Engineering &amp; Construction</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Website Content Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
              Manage all public website content, machinery catalog products, staff profiles, and incoming quote inquiries.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#1b3a6e] text-xs font-bold shadow-xs transition group"
            >
              <span>View Public Website</span>
              <svg className="w-4 h-4 text-[#1b3a6e] group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <a
              href="#section-quotes"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold shadow-xs transition"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Inquiries ({newQuotes.length} New)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <a
          href="#section-quotes"
          className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Customer Inquiries</span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:text-[#c8391a] transition">
            {quotes.length}
          </p>
          <span className={`text-[11px] font-medium mt-0.5 block ${newQuotes.length > 0 ? "text-[#c8391a]" : "text-slate-500"}`}>
            {newQuotes.length > 0 ? `${newQuotes.length} pending review` : "All reviewed"}
          </span>
        </a>

        <a
          href="#section-products"
          className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Machinery Catalog</span>
            <span className="p-2 rounded-lg bg-blue-50 text-[#1b3a6e]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:text-[#1b3a6e] transition">
            {products.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Across {categories.length} Categories
          </span>
        </a>

        <a
          href="#section-slides"
          className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hero Slides</span>
            <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:text-purple-700 transition">
            {slides.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">Homepage banners</span>
        </a>

        <a
          href="#section-team"
          className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Team &amp; Partners</span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:text-emerald-700 transition">
            {teamMembers.length + partners.length}
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            {teamMembers.length} Staff, {partners.length} Partners
          </span>
        </a>
      </div>

      {/* 3. Jump Navigation Bar */}
      <div className="sticky top-2 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2.5 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5 px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Quick Jump to Section:
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <a href="#section-identity" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            1. Identity &amp; Logo
          </a>
          <a href="#section-contact" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            2. Contact &amp; Address
          </a>
          <a href="#section-hero" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            3. Hero Headline
          </a>
          <a href="#section-slides" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            4. Hero Slides
          </a>
          <a href="#section-products" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            5. Machinery Catalog
          </a>
          <a href="#section-categories" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            6. Categories
          </a>
          <a href="#section-industries" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            7. Industries
          </a>
          <a href="#section-stats" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            8. Key Numbers
          </a>
          <a href="#section-team" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            9. Team Profiles
          </a>
          <a href="#section-partners" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            10. Partners &amp; Clients
          </a>
          <a href="#section-cta" className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#1b3a6e] hover:text-white text-slate-700 font-medium border border-slate-200/80 whitespace-nowrap transition">
            11. Bottom Banner
          </a>
          <a href="#section-quotes" className="px-3 py-1.5 rounded-lg bg-[#c8391a] hover:bg-[#a62d14] text-white font-bold whitespace-nowrap transition shadow-2xs">
            12. Customer Inquiries
          </a>
        </div>
      </div>

      {/* 4. Section by Section Container */}
      <div className="space-y-6">

        {/* SECTION 1: Identity & Logo */}
        <section
          id="section-identity"
          className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1b3a6e] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  Section 1 of 12 • Header &amp; Footer
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-700 font-medium">Live on Website</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Company Identity &amp; Official Logo</span>
              </h2>
              <p className="text-xs text-slate-500">
                Company name, brand logo, and general description displayed in navigation and search tags.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=identity"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shrink-0 shadow-2xs transition"
            >
              <span>Edit Brand &amp; Logo</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-medium block">Current Official Logo</span>
              <div className="mt-2.5 h-14 w-32 rounded-lg bg-white p-1.5 border border-slate-200 flex items-center justify-center overflow-hidden shadow-2xs">
                <img src={logoUrl} alt={companyName} className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
              <span className="text-[11px] text-slate-500 font-medium block">Official Company Name</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{companyName}</p>
              <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
                <span className="text-slate-400">Tagline: </span>
                {siteSettings?.tagline || "Turnkey Industrial Engineering & Construction"}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Contact Numbers & Address */}
        <section
          id="section-contact"
          className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1b3a6e] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  Section 2 of 12 • Top Bar &amp; Contact Page
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-emerald-700 font-medium">Click-to-Call Active</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Contact Numbers, Email &amp; Office Location</span>
              </h2>
              <p className="text-xs text-slate-500">
                Official phone numbers, inquiries email, and physical head office address.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=contact"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shrink-0 shadow-2xs transition"
            >
              <span>Update Contact Details</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-medium block">Office Landline</span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {siteSettings?.primary_phone || "—"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-medium block">Mobile &amp; Hotlines</span>
              <p className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                {siteSettings?.secondary_phone || "—"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-medium block">Official Inquiry Email</span>
              <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                {siteSettings?.primary_email || "—"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-medium block">Office Address &amp; Hours</span>
              <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                {siteSettings?.address || "—"}
              </p>
              <span className="text-[10.5px] text-slate-500 mt-1 block truncate">
                {siteSettings?.business_hours || "—"}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: Homepage Hero Banner */}
        <section
          id="section-hero"
          className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1b3a6e] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  Section 3 of 12 • Above The Fold
                </span>
                <span className="text-xs text-slate-500 font-medium">Homepage Main Banner</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Homepage Hero Banner &amp; Welcome Headline</span>
              </h2>
              <p className="text-xs text-slate-500">
                The primary headline, badge, and call-to-action buttons visitors see when the website loads.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=hero"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shrink-0 shadow-2xs transition"
            >
              <span>Edit Hero Copy &amp; Buttons</span>
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#1b3a6e] bg-blue-100/70 px-2 py-0.5 rounded">
              {siteSettings?.hero_badge || "Turnkey Industrial Engineering"}
            </span>
            <p className="text-base font-bold text-slate-900 mt-1 leading-snug">
              {siteSettings?.hero_heading || "Powering Industry with Reliable Engineering & Infrastructure"}
            </p>
            <p className="text-xs text-slate-600 line-clamp-2">
              {siteSettings?.hero_subtext || "Complete turnkey solutions for industrial machinery, water treatment, cold chain facilities, and heavy construction."}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 rounded bg-[#1b3a6e] text-white font-semibold shadow-2xs">
                Primary CTA: {siteSettings?.hero_cta_primary_label || "Explore Machinery"}
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-300 font-semibold shadow-2xs">
                Secondary CTA: {siteSettings?.hero_cta_secondary_label || "Request Quote"}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 4: Hero Slides Carousel */}
        <section
          id="section-slides"
          className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-100">
                  Section 4 of 12 • Slideshow
                </span>
                <span className="text-xs text-slate-500 font-medium">{slides.length} active slides</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <span>Hero Promotional Slides Carousel</span>
              </h2>
              <p className="text-xs text-slate-500">
                Rotating promotional banners featuring project photography, machinery, and slogans.
              </p>
            </div>
            <Link
              href="/admin/hero-slides"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shrink-0 shadow-2xs transition"
            >
              <span>Manage Slides Carousel</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {slides.slice(0, 3).map((slide) => (
              <div key={slide.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="h-24 rounded-lg bg-slate-200 overflow-hidden relative shadow-2xs">
                  {slide.image_url || slide.image ? (
                    <img
                      src={getMediaUrl(slide.image_url || (typeof slide.image === "string" ? slide.image : ""))}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Photo
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white">
                    Order: {slide.order}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{slide.title}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{slide.heading}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Machinery & Products Catalog */}
        <section
          id="section-products"
          className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1b3a6e] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  Section 5 of 12 • Product Catalog
                </span>
                <span className="text-xs text-slate-500 font-medium">{products.length} Machines Listed</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Machinery &amp; Industrial Equipment Catalog</span>
              </h2>
              <p className="text-xs text-slate-500">
                Manage machinery products, technical specifications, and photo galleries.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition"
              >
                <span>Manage Machinery</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {products.slice(0, 4).map((p) => {
              const img = p.images?.find((i) => i.is_primary)?.image || p.images?.[0]?.image;
              const imgUrl = typeof img === "string" ? getMediaUrl(img) : "";
              return (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="h-28 rounded-lg bg-slate-200 overflow-hidden relative shadow-2xs">
                    {imgUrl ? (
                      <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Machinery
                      </div>
                    )}
                    {p.is_featured && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#c8391a] text-[9px] font-bold text-white shadow-2xs">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate" title={p.name}>
                    {p.name}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {p.categories?.[0]?.name || "Equipment"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 6 & 7: Categories & Industries in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECTION 6: Categories */}
          <section
            id="section-categories"
            className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Section 6 • Taxonomy
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Product Categories</span>
                </h3>
              </div>
              <Link
                href="/admin/categories"
                className="text-xs font-semibold text-[#1b3a6e] hover:underline"
              >
                Manage ({categories.length}) &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </section>

          {/* SECTION 7: Industries */}
          <section
            id="section-industries"
            className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  Section 7 • Solutions
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Industries We Serve</span>
                </h3>
              </div>
              <Link
                href="/admin/industries"
                className="text-xs font-semibold text-[#1b3a6e] hover:underline"
              >
                Manage ({industries.length}) &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <span
                  key={ind.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                >
                  {ind.name}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* SECTION 8: Key Numbers & Statistics */}
        <section
          id="section-stats"
          className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1b3a6e] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  Section 8 of 12 • Achievements Counter
                </span>
                <span className="text-xs text-slate-500 font-medium">Proven Track Record</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Key Numbers &amp; Company Achievements</span>
              </h2>
              <p className="text-xs text-slate-500">
                The 4 prominent counter metrics displayed on the homepage.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=stats"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shrink-0 shadow-2xs transition"
            >
              <span>Update Numbers &amp; Stats</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6e]">
                {siteSettings?.stat_years_experience || "25+"}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-1">Years Experience</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6e]">
                {siteSettings?.stat_projects_completed || "500+"}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-1">Projects Completed</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6e]">
                {siteSettings?.stat_happy_clients || "300+"}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-1">Happy Clients</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#1b3a6e]">
                {siteSettings?.stat_business_sectors || "6"}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-1">Business Sectors</p>
            </div>
          </div>
        </section>

        {/* SECTION 9 & 10: Team, Partners & Clients in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECTION 9: Team Profiles */}
          <section
            id="section-team"
            className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  Section 9 • Staff &amp; Leadership
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Team Profiles</span>
                </h3>
              </div>
              <Link
                href="/admin/team"
                className="text-xs font-semibold text-[#1b3a6e] hover:underline"
              >
                Manage ({teamMembers.length}) &rarr;
              </Link>
            </div>
            <div className="space-y-2">
              {teamMembers.slice(0, 3).map((tm) => (
                <div key={tm.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    {tm.photo ? (
                      <img src={getMediaUrl(tm.photo)} alt={tm.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-semibold">
                        {tm.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{tm.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{tm.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 10: Partners & Clients */}
          <section
            id="section-partners"
            className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  Section 10 • Trust Logos
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Partners &amp; Clients</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/partners"
                  className="text-xs font-semibold text-[#1b3a6e] hover:underline"
                >
                  Partners ({partners.length})
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  href="/admin/clients"
                  className="text-xs font-semibold text-[#1b3a6e] hover:underline"
                >
                  Clients ({clients.length})
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...partners, ...clients].slice(0, 8).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* SECTION 11: Bottom Call-To-Action Banner */}
        <section
          id="section-cta"
          className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1b3a6e] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  Section 11 of 12 • Bottom Quote Banner
                </span>
                <span className="text-xs text-slate-500 font-medium">Persistent CTA</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Bottom Call-To-Action Banner</span>
              </h2>
              <p className="text-xs text-slate-500">
                The banner above the footer encouraging visitors to request an engineering consultation.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=cta"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shrink-0 shadow-2xs transition"
            >
              <span>Edit Bottom Banner</span>
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                {siteSettings?.cta_heading || "Ready to Discuss Your Industrial Engineering Project?"}
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {siteSettings?.cta_subtext || "Contact our experienced engineering team today for a free technical consultation and customized quote."}
              </p>
            </div>
            <span className="px-4 py-2 rounded-lg bg-[#c8391a] text-white text-xs font-bold shrink-0 shadow-xs">
              {siteSettings?.cta_button_label || "Request a Quote"} &rarr;
            </span>
          </div>
        </section>

        {/* SECTION 12: Customer Inquiries & Leads Table */}
        <section
          id="section-quotes"
          className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c8391a] bg-red-50 px-2.5 py-0.5 rounded border border-red-100">
                  Section 12 of 12 • Incoming Leads
                </span>
                {newQuotes.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c8391a] text-white shadow-2xs">
                    {newQuotes.length} New Inquiries
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#1b3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>Customer Inquiries &amp; Quote Requests</span>
              </h2>
              <p className="text-xs text-slate-500">
                Direct quote inquiries submitted by website visitors with instant contact shortcuts.
              </p>
            </div>
            <Link
              href="/admin/quotes"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-[#1b3a6e] border border-slate-200 text-xs font-semibold shrink-0 transition shadow-2xs"
            >
              <span>View All Inquiries ({quotes.length}) &rarr;</span>
            </Link>
          </div>

          {quoteSuccessMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{quoteSuccessMsg}</span>
            </div>
          )}

          {quotes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 rounded-xl bg-slate-50 border border-slate-200">
              No quote requests submitted yet. When customers submit requests on your website, they will appear here instantly.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Client / Company</th>
                    <th className="px-4 py-3 font-semibold">Direct Contact</th>
                    <th className="px-4 py-3 font-semibold">Machinery Requested</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {quotes.slice(0, 6).map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        <div>{quote.full_name}</div>
                        {quote.company && (
                          <span className="text-[11px] text-slate-500 font-normal block">
                            {quote.company}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div>
                          <a
                            href={`mailto:${quote.email}`}
                            className="text-[#1b3a6e] hover:underline font-semibold"
                            title="Send email"
                          >
                            {quote.email}
                          </a>
                        </div>
                        {quote.phone && (
                          <div className="mt-0.5">
                            <a
                              href={`tel:${quote.phone}`}
                              className="text-[11px] text-slate-600 hover:text-[#1b3a6e]"
                              title="Call phone"
                            >
                              {quote.phone}
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {quote.product_name ? (
                          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#1b3a6e] text-xs font-medium">
                            {quote.product_name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">General Inquiry</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            quote.status === "new"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : quote.status === "contacted"
                              ? "bg-blue-50 text-[#1b3a6e] border border-blue-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {quote.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {quote.status !== "contacted" && (
                            <button
                              onClick={() => handleUpdateQuoteStatus(quote.id, "contacted")}
                              disabled={updatingQuoteId === quote.id}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1b3a6e] text-[11px] font-semibold border border-blue-200 transition cursor-pointer"
                            >
                              Mark Contacted
                            </button>
                          )}
                          <Link
                            href={`/admin/quotes?id=${quote.id}`}
                            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[11px] font-semibold transition"
                          >
                            Details &rarr;
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
