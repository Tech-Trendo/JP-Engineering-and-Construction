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

  const phone = siteSettings?.primary_phone || "01-5385552";
  const email = siteSettings?.primary_email || "info@jpec.com.np";
  const hours = siteSettings?.business_hours;
  const companyName = siteSettings?.company_name || "JP Engineering & Construction Pvt. Ltd.";
  const tagline = siteSettings?.tagline || "Industrial Engineering & Machinery";

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
              {siteSettings?.twitter_url && (
                <a
                  href={siteSettings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 bg-white/10 hover:bg-[#c8391a] rounded-sm flex items-center justify-center transition-colors"
                  title="X"
                >
                  <span className="sr-only">X</span>
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {siteSettings?.linkedin_url && (
                <a
                  href={siteSettings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-5 h-5 bg-white/10 hover:bg-[#c8391a] rounded-sm flex items-center justify-center transition-colors"
                  title="LinkedIn"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-[48px] h-[48px] rounded flex items-center justify-center overflow-hidden bg-white shadow-sm border border-gray-100 p-0.5">
              <img
                src={getMediaUrl(siteSettings?.logo_url) || "/assets/logo.png"}
                alt={companyName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-[#1b3a6e] text-sm sm:text-base leading-tight group-hover:text-[#c8391a] transition-colors">
                {companyName}
              </div>
              {tagline ? (
                <div className="text-[10px] text-gray-500 leading-tight hidden sm:block">
                  {tagline}
                </div>
              ) : null}
            </div>
          </Link>

          {/* Desktop nav + CTA */}
          <div className="hidden lg:flex items-center">
            <nav className="flex items-center">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && openDropdown(item.label)}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-[24px] text-[13px] font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                      isActive(item.href)
                        ? "text-[#c8391a] border-[#c8391a]"
                        : "text-[#1b3a6e] border-transparent hover:text-[#c8391a] hover:border-[#c8391a]"
                    }`}
                  >
                    {item.label}
                    {item.dropdown && (
                      <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
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
                          className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-[#1b3a6e] hover:text-white border-b border-gray-50 last:border-0 transition-colors"
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
              className="ml-5 inline-flex items-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Request a Quote</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/contact-us#quote"
              className="bg-[#c8391a] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded"
            >
              Quote
            </Link>
            <button
              className="p-2 text-[#1b3a6e]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-xl max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-gray-100 last:border-0 pb-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    className={`block py-2 text-sm font-semibold uppercase tracking-wide ${
                      isActive(item.href) ? "text-[#c8391a]" : "text-[#1b3a6e]"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <button
                      onClick={() =>
                        setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                      }
                      className="p-2 text-gray-500 hover:text-[#1b3a6e]"
                    >
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          mobileExpanded === item.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
                {item.dropdown && mobileExpanded === item.label && (
                  <div className="pl-4 pb-2 space-y-1 bg-gray-50 rounded mt-1">
                    {item.dropdown.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block py-1.5 text-xs text-gray-600 hover:text-[#c8391a]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
