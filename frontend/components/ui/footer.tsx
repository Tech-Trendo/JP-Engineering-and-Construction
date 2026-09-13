import React from "react";
import Link from "next/link";
import { Container } from "./container";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 mt-24">
      {/* Top Banner / Consultation Callout */}
      <div className="border-b border-stone-800/80 bg-stone-900/40 py-12">
        <Container size="default">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold font-mono text-amber-500 uppercase tracking-widest">
                Technical Consultation & Procurement
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Precision Equipment Engineered for Demanding Operations.
              </h3>
              <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                Connect directly with our engineering team to assess duty cycles, custom rig specifications, and project logistics.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <Link
                href="/quotes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
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
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center font-extrabold text-amber-500 text-xs tracking-wider">
                  JP
                </div>
                <span className="text-sm font-extrabold tracking-tight text-white">
                  JP ENGINEERING & CONSTRUCTION
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
                Providing industrial earthmoving, heavy infrastructure machinery, and turnkey civil construction support across regional operations.
              </p>
              <div className="pt-2 text-xs text-stone-400 space-y-1">
                <p className="font-semibold text-stone-200">Headquarters & Fabrication Facility:</p>
                <p className="font-mono text-[11px] text-stone-400">
                  Industrial Corridor Sector 4B, Heavy Engineering Zone
                </p>
                <p className="text-stone-400">Direct Desk: inquiry@jp-engineering.com</p>
              </div>
            </div>

            {/* Column 2: Machinery Catalog */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 font-mono">
                Equipment
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <Link href="/products?category=heavy-machinery" className="hover:text-amber-400 transition">
                    Heavy Machinery
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=earthmoving-equipment" className="hover:text-amber-400 transition">
                    Earthmoving Fleet
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=concrete-equipment" className="hover:text-amber-400 transition">
                    Concrete Technology
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-amber-400 transition">
                    All Specifications
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Solutions & Quality */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 font-mono">
                Solutions
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <Link href="/products?category=heavy-machinery" className="hover:text-amber-400 transition">
                    Civil Infrastructure
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=heavy-machinery" className="hover:text-amber-400 transition">
                    Contract Rigging & Cranes
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-amber-400 transition">
                    Safety & Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-amber-400 transition">
                    Partner Network
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Administration & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 font-mono">
                Governance
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <Link href="/about" className="hover:text-amber-400 transition">
                    Leadership Team
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-amber-400 transition">
                    Contact & Locations
                  </Link>
                </li>
                <li className="pt-2">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-[11px] text-stone-400 hover:text-white hover:border-stone-700 transition"
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
      <div className="border-t border-stone-900 py-6 text-xs text-stone-400">
        <Container size="default">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              &copy; {currentYear} JP Engineering & Construction Ltd. All engineering specifications subject to technical verification.
            </p>
            <p className="font-mono text-[11px] text-stone-400">
              ISO 9001:2015 Certified Operations
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
