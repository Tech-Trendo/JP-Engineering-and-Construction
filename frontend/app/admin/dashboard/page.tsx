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
    : "/assets/logo.png";

  const companyName = siteSettings?.company_name || "JP Engineering & Construction Pvt. Ltd.";

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* 1. Friendly Welcome Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/60 border border-blue-800/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Website Connected
              </span>
              <span className="text-xs text-slate-400">Non-Technical CMS Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Website Content Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Welcome back! Every section of your public website is divided below into simple, easy-to-manage cards. Click on any section to update text, photos, phone numbers, or products.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 transition group"
            >
              <span>View Public Website</span>
              <svg className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
            <a
              href="#section-quotes"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Inquiries ({newQuotes.length} New)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Quick Key Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <a
          href="#section-quotes"
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Customer Inquiries</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">💬</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2 group-hover:text-amber-400 transition">
            {quotes.length}
          </p>
          <span className="text-[11px] text-amber-400 font-medium">
            {newQuotes.length > 0 ? `${newQuotes.length} need response` : "All caught up"}
          </span>
        </a>

        <a
          href="#section-products"
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Machinery Catalog</span>
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">📦</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2 group-hover:text-blue-400 transition">
            {products.length}
          </p>
          <span className="text-[11px] text-blue-400 font-medium">
            {categories.length} Categories
          </span>
        </a>

        <a
          href="#section-slides"
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Hero Slides</span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">🎞️</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2 group-hover:text-purple-400 transition">
            {slides.length}
          </p>
          <span className="text-[11px] text-purple-400 font-medium">Homepage banners</span>
        </a>

        <a
          href="#section-team"
          className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition block group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Trust &amp; Team</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">👥</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2 group-hover:text-emerald-400 transition">
            {teamMembers.length + partners.length}
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">
            {teamMembers.length} staff, {partners.length} partners
          </span>
        </a>
      </div>

      {/* 3. Sticky Jump Navigation Bar */}
      <div className="sticky top-2 z-30 bg-[#0b1325]/95 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5 px-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            📍 Jump Directly to Website Section:
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <a href="#section-identity" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            🏢 1. Identity &amp; Logo
          </a>
          <a href="#section-contact" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            📞 2. Contact &amp; Address
          </a>
          <a href="#section-hero" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            🖼️ 3. Homepage Hero
          </a>
          <a href="#section-slides" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            🎞️ 4. Hero Slides
          </a>
          <a href="#section-products" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            📦 5. Machinery Catalog
          </a>
          <a href="#section-categories" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            🏷️ 6. Categories
          </a>
          <a href="#section-industries" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            🏭 7. Industries
          </a>
          <a href="#section-stats" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            📊 8. Key Numbers
          </a>
          <a href="#section-team" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            👥 9. Team Profiles
          </a>
          <a href="#section-partners" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            🤝 10. Partners &amp; Clients
          </a>
          <a href="#section-cta" className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 font-medium whitespace-nowrap transition">
            📢 11. Bottom Quote Banner
          </a>
          <a href="#section-quotes" className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold whitespace-nowrap transition">
            💬 12. Customer Inquiries
          </a>
        </div>
      </div>

      {/* 4. Section by Section Container */}
      <div className="space-y-6">

        {/* SECTION 1: Identity & Logo */}
        <section
          id="section-identity"
          className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
                  Section 1 of 12 • Header &amp; Footer
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Live on Website</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                🏢 Company Identity &amp; Official Logo
              </h2>
              <p className="text-xs text-slate-400">
                This controls the company name, website logo, and business description displayed across all pages.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=identity"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 shadow-md transition"
            >
              <span>✏️ Edit Brand &amp; Logo</span>
            </Link>
          </div>

          {/* Current Values Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-medium block">Current Official Logo</span>
              <div className="mt-2.5 h-14 w-32 rounded-xl bg-white/10 p-1.5 border border-white/20 flex items-center justify-center overflow-hidden">
                <img src={logoUrl} alt={companyName} className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 sm:col-span-2">
              <span className="text-[11px] text-slate-400 font-medium block">Official Company Name</span>
              <p className="text-sm font-bold text-white mt-1.5">{companyName}</p>
              <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <span className="text-slate-400">Tagline: </span>
                {siteSettings?.tagline || "Turnkey Industrial Engineering & Construction"}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-blue-950/30 border border-blue-800/30 p-3 text-xs text-blue-200 flex items-center gap-2">
            <span>💡</span>
            <span>
              <strong>Helpful Tip:</strong> Any update to the company name or logo updates the public header, footer, and admin title automatically.
            </span>
          </div>
        </section>

        {/* SECTION 2: Contact Numbers & Address */}
        <section
          id="section-contact"
          className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
                  Section 2 of 12 • Top Bar &amp; Contact Page
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Click-to-Call Active</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                📞 Contact Numbers, Email &amp; Office Location
              </h2>
              <p className="text-xs text-slate-400">
                Phone numbers, hotline numbers, inquiry email, and physical office address.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=contact"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 shadow-md transition"
            >
              <span>📞 Update Contact Details</span>
            </Link>
          </div>

          {/* Current Values Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-medium block">Office Landline</span>
              <p className="text-sm font-bold text-white mt-1">
                {siteSettings?.primary_phone || "01-5385552"}
              </p>
              <span className="text-[10px] text-emerald-400 mt-1 block">Click-to-call enabled</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-medium block">Mobile &amp; Hotlines</span>
              <p className="text-xs font-bold text-white mt-1 leading-snug">
                {siteSettings?.secondary_phone || "9851112988, 9851158661, 9851158660"}
              </p>
              <span className="text-[10px] text-blue-400 mt-1 block">3 Direct Lines</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-medium block">Official Inquiry Email</span>
              <p className="text-xs font-bold text-white mt-1 truncate">
                {siteSettings?.primary_email || "info@jpec.com.np"}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">Quotes delivered here</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 font-medium block">Office Address &amp; Hours</span>
              <p className="text-xs font-bold text-white mt-1 truncate">
                {siteSettings?.address || "Kathmandu, Nepal"}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block truncate">
                {siteSettings?.business_hours || "Sun - Fri: 9:00 AM - 6:00 PM"}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: Homepage Hero Banner */}
        <section
          id="section-hero"
          className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
                  Section 3 of 12 • Above The Fold
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Homepage Main Banner</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                🖼️ Homepage Hero Banner &amp; Welcome Headline
              </h2>
              <p className="text-xs text-slate-400">
                The primary headline, badge, and call-to-action buttons visitors see when the website loads.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=hero"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 shadow-md transition"
            >
              <span>✏️ Edit Hero Headline &amp; Buttons</span>
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/70 px-2 py-0.5 rounded border border-blue-800/50">
              {siteSettings?.hero_badge || "Turnkey Industrial Engineering"}
            </span>
            <p className="text-base sm:text-lg font-bold text-white mt-2 leading-snug">
              {siteSettings?.hero_heading || "Powering Industry with Reliable Engineering & Infrastructure"}
            </p>
            <p className="text-xs text-slate-300 line-clamp-2">
              {siteSettings?.hero_subtext || "Complete turnkey solutions for industrial machinery, water treatment, cold chain facilities, and heavy construction."}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 rounded bg-blue-600 text-white font-semibold">
                Button 1: {siteSettings?.hero_cta_primary_label || "Explore Machinery"}
              </span>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-semibold">
                Button 2: {siteSettings?.hero_cta_secondary_label || "Request Quote"}
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 4: Hero Slides Carousel */}
        <section
          id="section-slides"
          className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded border border-purple-800/40">
                  Section 4 of 12 • Slideshow
                </span>
                <span className="text-xs text-slate-400 font-medium">{slides.length} active slides</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                🎞️ Hero Promotional Slides Carousel
              </h2>
              <p className="text-xs text-slate-400">
                Rotating promotional banners featuring project photography, machinery, and slogans.
              </p>
            </div>
            <Link
              href="/admin/hero-slides"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0 shadow-md transition"
            >
              <span>🎞️ Manage Slides Carousel</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {slides.slice(0, 3).map((slide) => (
              <div key={slide.id} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="h-24 rounded-xl bg-slate-800 overflow-hidden relative">
                  {slide.image_url || slide.image ? (
                    <img
                      src={getMediaUrl(slide.image_url || (typeof slide.image === "string" ? slide.image : ""))}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                      No Photo
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[10px] text-white">
                    Order: {slide.order}
                  </span>
                </div>
                <p className="text-xs font-bold text-white truncate">{slide.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-1">{slide.heading}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Machinery & Products Catalog */}
        <section
          id="section-products"
          className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
                  Section 5 of 12 • Product Catalog
                </span>
                <span className="text-xs text-slate-400 font-medium">{products.length} Machines Listed</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                📦 Machinery &amp; Industrial Equipment Catalog
              </h2>
              <p className="text-xs text-slate-400">
                Manage your machinery products, technical specifications, and photo galleries.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
              >
                <span>➕ Add &amp; Manage Machinery</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {products.slice(0, 4).map((p) => {
              const img = p.images?.find((i) => i.is_primary)?.image || p.images?.[0]?.image;
              const imgUrl = typeof img === "string" ? getMediaUrl(img) : "";
              return (
                <div key={p.id} className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="h-28 rounded-xl bg-slate-800 overflow-hidden relative">
                    {imgUrl ? (
                      <img src={imgUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        Machinery
                      </div>
                    )}
                    {p.is_featured && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-bold text-slate-950">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white truncate" title={p.name}>
                    {p.name}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
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
            className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 space-y-4 shadow-xl scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  Section 6 • Taxonomy
                </span>
                <h3 className="text-base font-bold text-white mt-1">🏷️ Product Categories</h3>
              </div>
              <Link
                href="/admin/categories"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Manage ({categories.length}) &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-300"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </section>

          {/* SECTION 7: Industries */}
          <section
            id="section-industries"
            className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 space-y-4 shadow-xl scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded">
                  Section 7 • Solutions
                </span>
                <h3 className="text-base font-bold text-white mt-1">🏭 Industries We Serve</h3>
              </div>
              <Link
                href="/admin/industries"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                Manage ({industries.length}) &rarr;
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <span
                  key={ind.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-300"
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
          className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
                  Section 8 of 12 • Achievements Counter
                </span>
                <span className="text-xs text-slate-400 font-medium">Proven Track Record</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                📊 Key Numbers &amp; Company Achievements
              </h2>
              <p className="text-xs text-slate-400">
                The 4 prominent counter numbers displayed on the homepage building client trust.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=stats"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 shadow-md transition"
            >
              <span>✏️ Update Numbers &amp; Stats</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">
                {siteSettings?.stat_years_experience || "15+"}
              </p>
              <p className="text-xs font-medium text-slate-300 mt-1">Years Experience</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                {siteSettings?.stat_projects_completed || "120+"}
              </p>
              <p className="text-xs font-medium text-slate-300 mt-1">Projects Completed</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                {siteSettings?.stat_happy_clients || "80+"}
              </p>
              <p className="text-xs font-medium text-slate-300 mt-1">Happy Clients</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">
                {siteSettings?.stat_business_sectors || "10+"}
              </p>
              <p className="text-xs font-medium text-slate-300 mt-1">Business Sectors</p>
            </div>
          </div>
        </section>

        {/* SECTION 9 & 10: Team, Partners & Clients in 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SECTION 9: Team Profiles */}
          <section
            id="section-team"
            className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 space-y-4 shadow-xl scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded">
                  Section 9 • Staff &amp; Leadership
                </span>
                <h3 className="text-base font-bold text-white mt-1">👥 Team Profiles</h3>
              </div>
              <Link
                href="/admin/team"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300"
              >
                Manage ({teamMembers.length}) &rarr;
              </Link>
            </div>
            <div className="space-y-2">
              {teamMembers.slice(0, 3).map((tm) => (
                <div key={tm.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="h-8 w-8 rounded-full bg-slate-800 overflow-hidden shrink-0">
                    {tm.photo ? (
                      <img src={getMediaUrl(tm.photo)} alt={tm.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-xs text-slate-400">👤</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{tm.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{tm.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 10: Partners & Clients */}
          <section
            id="section-partners"
            className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 space-y-4 shadow-xl scroll-mt-24"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded">
                  Section 10 • Trust Logos
                </span>
                <h3 className="text-base font-bold text-white mt-1">🤝 Partners &amp; Clients</h3>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/partners"
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  Partners ({partners.length})
                </Link>
                <span className="text-slate-600">•</span>
                <Link
                  href="/admin/clients"
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  Clients ({clients.length})
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...partners, ...clients].slice(0, 8).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
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
          className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-800/40">
                  Section 11 of 12 • Bottom Quote Banner
                </span>
                <span className="text-xs text-slate-400 font-medium">Persistent CTA</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                📢 Bottom Call-To-Action (Quote Request Banner)
              </h2>
              <p className="text-xs text-slate-400">
                The high-visibility banner above the footer encouraging visitors to request an engineering consultation.
              </p>
            </div>
            <Link
              href="/admin/site-settings?tab=cta"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 shadow-md transition"
            >
              <span>✏️ Edit Bottom Banner</span>
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">
                {siteSettings?.cta_heading || "Ready to Discuss Your Industrial Engineering Project?"}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {siteSettings?.cta_subtext || "Contact our experienced engineering team today for a free technical consultation and customized turnkey quote."}
              </p>
            </div>
            <span className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shrink-0 shadow">
              {siteSettings?.cta_button_label || "Request a Free Quote"} &rarr;
            </span>
          </div>
        </section>

        {/* SECTION 12: Customer Inquiries & Leads Table */}
        <section
          id="section-quotes"
          className="rounded-3xl bg-[#0a1020] border border-slate-800 p-6 sm:p-7 space-y-4 shadow-xl scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
                  Section 12 of 12 • Incoming Leads
                </span>
                {newQuotes.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                    {newQuotes.length} New Inquiries
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                💬 Customer Inquiries &amp; Machinery Quote Requests
              </h2>
              <p className="text-xs text-slate-400">
                Direct quote inquiries submitted by website visitors. You can call or email customers directly with 1 click.
              </p>
            </div>
            <Link
              href="/admin/quotes"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shrink-0 border border-slate-700 transition"
            >
              <span>View All Quotes ({quotes.length}) &rarr;</span>
            </Link>
          </div>

          {quoteSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <span>✅</span>
              <span>{quoteSuccessMsg}</span>
            </div>
          )}

          {quotes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              No quote requests submitted yet. When customers submit requests on your website, they will appear here instantly.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 font-bold">Client / Company</th>
                    <th className="px-4 py-3 font-bold">Direct Contact</th>
                    <th className="px-4 py-3 font-bold">Machinery Requested</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {quotes.slice(0, 6).map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-800/50 transition">
                      <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                        <div>{quote.full_name}</div>
                        {quote.company && (
                          <span className="text-[11px] text-slate-400 font-normal block">
                            {quote.company}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${quote.email}`}
                            className="text-blue-400 hover:text-blue-300 text-xs font-semibold"
                            title="Send email"
                          >
                            ✉️ {quote.email}
                          </a>
                        </div>
                        {quote.phone && (
                          <div className="mt-0.5">
                            <a
                              href={`tel:${quote.phone}`}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300"
                              title="Call phone"
                            >
                              📞 {quote.phone}
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {quote.product_name ? (
                          <span className="px-2 py-0.5 rounded bg-blue-950/70 border border-blue-800/40 text-blue-300 text-xs font-medium">
                            {quote.product_name}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">General Inquiry</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            quote.status === "new"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : quote.status === "contacted"
                              ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
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
                              className="px-2.5 py-1 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-[11px] font-semibold border border-sky-500/30 transition cursor-pointer"
                            >
                              Mark Contacted
                            </button>
                          )}
                          <Link
                            href={`/admin/quotes?id=${quote.id}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition"
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
