"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminFetch, unwrapAdminResults, AdminQuote } from "@/lib/admin-api";
import { getPublicSiteSettings, getMediaUrl } from "@/lib/public-api";

interface NavItem {
  name: string;
  href: string;
  badgeKey?: "quotes";
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

interface NavGroup {
  sectionTitle: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    sectionTitle: "Overview",
    items: [
      {
        name: "CMS Dashboard",
        href: "/admin/dashboard",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        ),
      },
      {
        name: "Customer Inquiries",
        href: "/admin/quotes",
        badgeKey: "quotes",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        ),
      },
    ],
  },
  {
    sectionTitle: "Website Content & Branding",
    items: [
      {
        name: "Site Settings & Logo",
        href: "/admin/site-settings",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        name: "Hero Slides & Banners",
        href: "/admin/hero-slides",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        name: "Industries We Serve",
        href: "/admin/industries",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
    ],
  },
  {
    sectionTitle: "Machinery Catalog",
    items: [
      {
        name: "Products & Machines",
        href: "/admin/products",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
      },
      {
        name: "Product Categories",
        href: "/admin/categories",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        ),
      },
    ],
  },
  {
    sectionTitle: "Company & Trust",
    items: [
      {
        name: "Our Team",
        href: "/admin/team",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        name: "Business Partners",
        href: "/admin/partners",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        name: "Client Roster",
        href: "/admin/clients",
        icon: (props) => (
          <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, accessToken, logout } = useAdminAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newQuotesCount, setNewQuotesCount] = useState<number>(0);
  const [companyName, setCompanyName] = useState<string>("JP Engineering & Construction Pvt. Ltd.");
  const [logoUrl, setLogoUrl] = useState<string>("/assets/logo.webp");

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    let isMounted = true;
    getPublicSiteSettings()
      .then((s) => {
        if (isMounted) {
          if (s.company_name) setCompanyName(s.company_name);
          if (s.logo_url) setLogoUrl(getMediaUrl(s.logo_url) || "/assets/logo.webp");
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!accessToken || isLoginPage) return;
    let isMounted = true;
    adminFetch<unknown>("admin/quotes/?status=new", {}, accessToken)
      .then((data) => {
        if (isMounted) {
          const items = unwrapAdminResults<AdminQuote>(data);
          setNewQuotesCount(items.length);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [accessToken, pathname, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080d1a] text-slate-100 font-sans antialiased">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0f1d] border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center shrink-0 p-0.5 border border-white/20 overflow-hidden">
            <img src={logoUrl} alt={companyName} className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-semibold text-xs tracking-wide text-white block truncate max-w-[170px]">
              {companyName}
            </span>
            <span className="text-[10px] text-blue-400 font-medium">Admin CMS</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex flex-col justify-between w-full md:w-68 bg-[#0a0f1d] border-r border-slate-800 p-4 shrink-0 z-20 overflow-y-auto`}
      >
        <div className="space-y-4">
          {/* Logo / Brand Header Card */}
          <div className="hidden md:flex flex-col gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 p-1 border border-white/20 overflow-hidden shadow-inner">
                <img src={logoUrl} alt={companyName} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xs font-bold tracking-tight text-white truncate" title={companyName}>
                  {companyName}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] text-emerald-400 font-medium">CMS Active</span>
                </div>
              </div>
            </div>

            {/* View Live Website Button */}
            <Link
              href="/"
              target="_blank"
              className="mt-1 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-semibold border border-blue-500/30 transition shadow-sm group"
            >
              <span>View Public Website</span>
              <svg className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>

          {/* Grouped Navigation Links */}
          <nav className="space-y-4">
            {navGroups.map((group) => (
              <div key={group.sectionTitle} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group.sectionTitle}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      item.href === "/admin/dashboard"
                        ? pathname === "/admin/dashboard"
                        : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/30 font-semibold"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? "text-white" : "text-slate-400"
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>
                        {item.badgeKey === "quotes" && newQuotesCount > 0 && (
                          <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-sm">
                            {newQuotesCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Session & Logout */}
        <div className="pt-5 mt-6 border-t border-slate-800">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="truncate pr-2">
              <p className="text-xs font-medium text-slate-200 truncate">
                {user?.username ? `@${user.username}` : "Staff Admin"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] text-emerald-400 font-mono">Staff Authorized</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900/40 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[#080d1a] p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
