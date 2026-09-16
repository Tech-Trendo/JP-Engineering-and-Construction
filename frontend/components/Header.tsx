"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { getMediaUrl, type PublicSiteSettings, type PublicCategory, type PublicIndustry, type PublicProductListItem } from "@/lib/public-api";

type NavChild = { label: string; href: string };
type NavDropdownItem = { label: string; href: string; children?: NavChild[] };
type NavItem = {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
};

export default function Header({
  siteSettings,
  categories = [],
  industries = [],
  products = [],
}: {
  siteSettings?: PublicSiteSettings;
  categories?: PublicCategory[];
  industries?: PublicIndustry[];
  products?: PublicProductListItem[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  function openDropdown(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const phone = siteSettings?.primary_phone;
  const email = siteSettings?.primary_email;
  const hours = siteSettings?.business_hours;
  const companyName = siteSettings?.company_name || "JP Engineering and Construction Pvt Ltd";
  const tagline = siteSettings?.tagline || "";

  const industryDropdown: NavDropdownItem[] = [
    { label: "All Industrial Sectors", href: "/industries" },
    ...industries.map((ind) => ({
      label: ind.name,
      href: `/industries/${ind.slug}`,
    })),
  ];

  const productDropdown: NavDropdownItem[] = [
    { label: "All Machinery & Equipment Catalog", href: "/products" },
    ...products.slice(0, 7).map((p) => ({
      label: p.name,
      href: `/products/${p.slug}`,
    })),
    ...categories.map((c) => ({
      label: `Category: ${c.name}`,
      href: `/products#${c.slug}`,
    })),
  ];

  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    {
      label: "About Us",
      href: "/about/introduction",
      dropdown: [
        { label: "Introduction", href: "/about/introduction" },
        { label: "Our Team", href: "/about/our-team" },
        { label: "Our Clients", href: "/about/our-clients" },
        { label: "Our Partners", href: "/about/our-partners" },
        { label: "Company Profile", href: "/about/company-profile" },
      ],
    },
    {
      label: "Industries",
      href: "/industries",
      dropdown: industryDropdown,
    },
    {
      label: "Products",
      href: "/products",
      dropdown: productDropdown,
    },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <header
      className={`w-full z-50 sticky top-0 transition-shadow duration-200 ${scrolled ? "shadow-md" : ""}`}
    >
      {/* Top bar */}
      <div className="bg-[#0f2347] text-white text-xs py-2">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            {phone ? (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-1.5 hover:text-gray-300 transition-colors font-medium"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{phone}</span>
              </a>
            ) : null}
            {siteSettings?.secondary_phone ? (
              <div className="hidden lg:flex items-center gap-2 text-gray-300 text-[11px]">
                <span className="text-gray-500">|</span>
                {siteSettings.secondary_phone.split(",").map((num, idx) => {
                  const clean = num.trim();
                  return (
                    <a
                      key={idx}
                      href={`tel:${clean.replace(/[^\d+]/g, "")}`}
                      className="hover:text-white transition-colors"
                    >
                      {clean}
                    </a>
                  );
                })}
              </div>
            ) : null}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="hidden sm:flex items-center gap-1.5 hover:text-gray-300 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{email}</span>
              </a>
            ) : null}
            <span className="hidden xl:inline-block text-gray-400 text-[11px]">|</span>
            <Link
              href="/#iso-certified"
              className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-[11px] font-normal tracking-wide"
              title="View ISO 9001:2015 Certificate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span>An {siteSettings?.iso_standard || "ISO 9001:2015"} Certified Company</span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            {hours ? <span className="text-gray-300">{hours}</span> : null}
            <div className="flex items-center gap-2 ml-2">
              {siteSettings?.facebook_url && (
                <a
                  href={siteSettings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 bg-white/10 hover:bg-[#c8391a] rounded-sm flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <span className="sr-only">Facebook</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                  </svg>
                </a>
              )}
              {(siteSettings?.tiktok_url || true) && (
                <a
                  href={siteSettings?.tiktok_url || "https://tiktok.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 bg-white/10 hover:bg-[#c8391a] rounded-sm flex items-center justify-center transition-colors"
                  title="TikTok"
                >
                  <span className="sr-only">TikTok</span>
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 00-1-.08A6.34 6.34 0 003 15.66a6.34 6.34 0 0010.86 4.43c.25-.26.47-.54.66-.84V10.22a8.28 8.28 0 005.07 1.73V8.5a4.84 4.84 0 01-.0-.01z" />
                  </svg>
                </a>
              )}
              {siteSettings?.youtube_url && (
                <a
                  href={siteSettings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 bg-white/10 hover:bg-[#c8391a] rounded-sm flex items-center justify-center transition-colors"
                  title="YouTube"
                >
                  <span className="sr-only">YouTube</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between h-[72px]">
          {/* Logo & Brand Identity */}
          <div className="flex items-center min-w-0 mr-2 xl:mr-4 shrink">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0 group py-1">
              <div className="w-[38px] h-[38px] sm:w-[46px] sm:h-[46px] rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-white shadow-xs border border-gray-200 p-0.5">
                <img
                  src={getMediaUrl(siteSettings?.logo_url) || "/assets/logo.webp"}
                  alt={companyName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                {/* Brand Name: In mobile 2 lines, on desktop 1 line */}
                <div className="font-bold text-[#1b3a6e] text-[12px] sm:text-[15px] xl:text-[16px] leading-[1.2] group-hover:text-[#c8391a] transition-colors tracking-tight">
                  <span className="block sm:hidden">
                    <span className="block font-extrabold text-[#1b3a6e] leading-tight">JP Engineering &amp; Construction</span>
                    <span className="block text-[10.5px] font-semibold text-slate-600 leading-tight">Pvt. Ltd.</span>
                  </span>
                  <span className="hidden sm:inline whitespace-nowrap">
                    {companyName}
                  </span>
                </div>
                {/* ISO Certification in header: always visible in mobile & desktop */}
                <div className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold leading-tight mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{siteSettings?.iso_standard || "ISO 9001:2015"} Certified</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop nav + CTA */}
          <div className="hidden lg:flex items-center shrink-0">
            <nav className="flex items-center shrink-0">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative shrink-0"
                  onMouseEnter={() => item.dropdown && openDropdown(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-2.5 xl:px-3.5 py-[24px] text-[12px] xl:text-[13px] font-semibold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap shrink-0 ${
                      isActive(item.href)
                        ? "text-[#c8391a] border-[#c8391a]"
                        : "text-[#1b3a6e] border-transparent hover:text-[#c8391a] hover:border-[#c8391a]"
                    }`}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    {item.dropdown && (
                      <svg className="w-3 h-3 ml-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.dropdown && activeDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 min-w-[240px] z-50 py-1"
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      {item.dropdown.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#1b3a6e] hover:text-white border-b border-gray-50 last:border-0 transition-colors whitespace-nowrap"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Persistent Quote CTA */}
            <Link
              href="/contact-us#quote"
              className="ml-2.5 xl:ml-4 inline-flex items-center gap-1.5 xl:gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-3.5 xl:px-4 py-2 xl:py-2.5 rounded shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Request a Quote</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/contact-us#quote"
              className="bg-[#c8391a] hover:bg-[#a62d14] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1.5 rounded shadow-2xs transition-colors"
            >
              Quote
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-[#1b3a6e] hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {/* Horizontal 3 lines icon / Close icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide-Down Accordion Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-2xl max-h-[calc(100vh-76px)] overflow-y-auto">
          <div className="p-4 space-y-2">
            {/* Top Brand & ISO Bar inside mobile drawer */}
            <div className="pb-3 mb-2 border-b border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[#1b3a6e] font-extrabold text-[12px] truncate mr-2">
                JP Engineering &amp; Construction
              </span>
              <Link
                href="/#iso-certified"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-semibold text-[10.5px] shrink-0 hover:bg-emerald-100 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{siteSettings?.iso_standard || "ISO 9001:2015"}</span>
              </Link>
            </div>

            {/* Navigation Items with Expandable Accordions */}
            {navItems.map((item) => {
              const isExpanded = mobileExpanded === item.label;
              const hasDropdown = Boolean(item.dropdown && item.dropdown.length > 0);

              if (hasDropdown) {
                return (
                  <div key={item.label} className="border-b border-slate-100 pb-1.5">
                    <div
                      onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 cursor-pointer select-none transition-colors"
                    >
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isExpanded ? "text-[#c8391a]" : "text-[#1b3a6e]"
                        }`}
                      >
                        {item.label}
                      </span>
                      <svg
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-[#c8391a]" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {isExpanded && (
                      <div className="pl-3 pr-2 py-2 space-y-1 bg-slate-50/80 rounded-xl border border-slate-200/60 mt-1 mb-2">
                        {item.dropdown?.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#c8391a] hover:bg-white rounded-lg transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                            <span className="leading-snug">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={item.label} className="border-b border-slate-100 pb-1">
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive(item.href)
                        ? "text-[#c8391a] bg-[#c8391a]/5"
                        : "text-[#1b3a6e] hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              );
            })}

            {/* Quick Contact & Socials at Drawer Bottom */}
            <div className="pt-3 mt-2 space-y-3">
              <Link
                href="/contact-us#quote"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider py-3 rounded-lg shadow-sm transition-colors text-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>Request a Free Quote</span>
              </Link>

              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-[#1b3a6e]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>Call: {phone}</span>
                </a>
              )}

              {/* Social Channels: Facebook, TikTok, YouTube */}
              <div className="flex items-center justify-center gap-4 pt-1">
                {siteSettings?.facebook_url && (
                  <a
                    href={siteSettings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1877F2] text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                    title="Facebook"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                    </svg>
                  </a>
                )}
                {(siteSettings?.tiktok_url || true) && (
                  <a
                    href={siteSettings?.tiktok_url || "https://tiktok.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-black text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                    title="TikTok"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 00-1-.08A6.34 6.34 0 003 15.66a6.34 6.34 0 0010.86 4.43c.25-.26.47-.54.66-.84V10.22a8.28 8.28 0 005.07 1.73V8.5a4.84 4.84 0 01-.0-.01z" />
                    </svg>
                  </a>
                )}
                {siteSettings?.youtube_url && (
                  <a
                    href={siteSettings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FF0000] text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                    title="YouTube"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
