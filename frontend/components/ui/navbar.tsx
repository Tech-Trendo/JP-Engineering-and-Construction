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
          ? "bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800/90 shadow-xs"
          : "bg-white/80 dark:bg-stone-950/80 backdrop-blur-xs border-b border-stone-200/50 dark:border-stone-800/50"
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
                  className={`px-3 py-2 text-xs font-semibold tracking-tight rounded-md transition-colors ${
                    isActive
                      ? "text-stone-950 dark:text-white bg-stone-100 dark:bg-stone-900"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-900/50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Trigger */}
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
              className="p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 focus:outline-hidden"
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
        <div className="md:hidden border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 py-5 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold rounded-md text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-stone-950 dark:hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
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
