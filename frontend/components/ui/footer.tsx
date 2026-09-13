import React from "react";
import Link from "next/link";
import { Container } from "./container";
import { BrandLogo } from "./brand-logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0f1d] text-slate-300 border-t border-slate-800/80 mt-24">
      {/* Top Banner / Consultation Callout */}
      <div className="border-b border-slate-800/80 bg-[#0f172a]/60 py-12">
        <Container size="default">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold font-mono text-[#60a5fa] uppercase tracking-widest">
                Technical Consultation & Procurement
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Precision Equipment Engineered for Demanding Operations.
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Connect directly with our engineering team to assess duty cycles, custom rig specifications, and project logistics.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/quotes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
              >
                Request Quote
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Multi-Column Directory */}
      <div className="py-16">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Column 1: Brand & Identity */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/">
                <BrandLogo size="md" />
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Providing industrial water treatment, heavy thermal refrigeration, sanitary dairy processing, bottling lines, and structural fabrication machinery.
              </p>
              
              {/* Consistently Styled Social / Channel Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="mailto:inquiry@jp-engineering.com"
                  className="h-8 w-8 rounded-lg bg-[#0f172a] border border-slate-800 hover:border-[#38bdf8] hover:text-[#38bdf8] text-slate-400 flex items-center justify-center transition-colors"
                  aria-label="Corporate Email"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a
                  href="tel:+977014258901"
                  className="h-8 w-8 rounded-lg bg-[#0f172a] border border-slate-800 hover:border-[#38bdf8] hover:text-[#38bdf8] text-slate-400 flex items-center justify-center transition-colors"
                  aria-label="Direct Phone Desk"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-lg bg-[#0f172a] border border-slate-800 hover:border-[#38bdf8] hover:text-[#38bdf8] text-slate-400 flex items-center justify-center transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>

              <div className="pt-2 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-200">Headquarters & Engineering Works:</p>
                <p className="font-mono text-[11px] text-slate-400">
                  Industrial Corridor Sector 4B, Heavy Engineering Zone
                </p>
                <p className="text-slate-400">Direct Dispatch Desk: inquiry@jp-engineering.com</p>
              </div>
            </div>

            {/* Column 2: Machinery Catalog */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Equipment Fleet
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/products?category=water-treatment" className="hover:text-[#60a5fa] transition">
                    Water Treatment Plants
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=cold-storage-refrigeration" className="hover:text-[#60a5fa] transition">
                    Cold Storage & Freezers
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=dairy-machinery" className="hover:text-[#60a5fa] transition">
                    Dairy & Homogenizers
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=juice-beverage-bottling" className="hover:text-[#60a5fa] transition">
                    Beverage Bottling Lines
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=steel-fabrication" className="hover:text-[#60a5fa] transition">
                    CNC Laser & Fabrication
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#60a5fa] transition">
                    View Full Catalog &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Solutions & Quality */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Solutions
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/products?category=solar-heat-pump" className="hover:text-[#60a5fa] transition">
                    Solar Thermal & Heat Pumps
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=water-treatment" className="hover:text-[#60a5fa] transition">
                    Process Filtration Skids
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#60a5fa] transition">
                    Quality & ISO Standards
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#60a5fa] transition">
                    OEM Partner Network
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Governance & Staff */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Governance
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-[#60a5fa] transition">
                    Executive Leadership
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#60a5fa] transition">
                    Contact & Locations
                  </Link>
                </li>
                <li className="pt-2">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] border border-slate-800 text-[11px] text-slate-400 hover:text-white hover:border-[#1e40af] transition"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                    Staff Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6 text-xs text-slate-400">
        <Container size="default">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              &copy; {currentYear} JP Engineering & Construction Ltd. All engineering specifications subject to technical verification.
            </p>
            <p className="font-mono text-[11px] text-slate-400 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              ISO 9001:2015 Certified Engineering Operations
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
