"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "./container";
import { Button } from "./button";
import { BrandLogo } from "./brand-logo";

const navLinks = [
  { name: "Equipment Catalog", href: "/products" },
  { name: "About & Team", href: "/about" },
  { name: "Procurement Quote", href: "/quotes" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 dark:bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)]"
          : "bg-white/85 dark:bg-[#0a0f1d]/85 backdrop-blur-xs border-b border-slate-200/60 dark:border-slate-800/60"
      }`}
    >
      <Container size="default">
        <div className="flex h-18 items-center justify-between gap-6">
          {/* Brand Monogram & Title */}
          <Link href="/" className="shrink-0">
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-xs font-semibold tracking-tight rounded-lg transition-all ${
                    isActive
                      ? "text-[#1e40af] dark:text-[#93c5fd] bg-[#eff6ff] dark:bg-[#1e40af]/20 shadow-2xs font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-[#1e40af] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Trigger (Quote CTA) */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              href="/quotes"
              variant="accent"
              size="sm"
              icon={
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              }
            >
              Request Quote
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1d] px-4 py-5 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-200 hover:bg-[#eff6ff] hover:text-[#1e40af] dark:hover:bg-slate-800"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              href="/quotes"
              variant="accent"
              className="w-full justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Request a Consultation / Quote
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
