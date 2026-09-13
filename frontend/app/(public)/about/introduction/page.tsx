"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getPublicSiteContent, PublicSiteContent } from "@/lib/public-api";
import { Container, Button } from "@/components/ui";

const FALLBACK_FULL_INTRO = `JP Engineering & Construction (P) Ltd. is a leading manufacturer and supplier of machinery for various industrial sectors since 10 years. Our product range includes machinery for community-based water treatment systems, industrial water plants, dairy plants, industrial refrigeration, solar energy and irrigation, solar energy and heat pump system and meat mincing and packaging.

The company provides water treatment systems for schools, colleges, hospitals, public institutions, and corporate houses. These systems are designed to effectively treat water and make it safe for human consumption. The industrial water plants offered by the company include equipment for the bottle and jar sections, ensuring efficient water processing for industrial use.

In the dairy industry, JP Engineering & Construction (P) Ltd. provides machinery for the production of various dairy products such as pouch milk, curd, ghee, ice cream, cheese, panir, khuwa, and bottled dairy products. Their dairy industrial plant machinery is designed to meet the highest standards of quality and efficiency.

The company also specializes in industrial refrigeration systems, providing equipment for the storage of vaccines, vegetables, fruits, dairy products, medicines, and similar products. We offer complete solutions, including refrigeration units and their necessary spare parts and equipment.

JP Engineering & Construction (P) Ltd. is also a leader in the development of solar energy and irrigation systems. Their solar irrigation systems use solar power to provide water for irrigation, making them environmentally friendly and cost-effective. Additionally, the company provides solar energy and heat pump systems for hotels, hostels, hospitals, and corporate houses, ensuring energy efficiency and cost savings.

In addition to the above, the company is also involved in steel fabrication work, which includes tanker fabrication, SS tank fabrication, vessel fabrication, basin fabrication, kitchen shelf fabrication, and other equipment fabrication. The company is looking to expand its scope of operations into the construction industry, and has already begun offering construction services to its clients.

Finally, the company offers meat mincing and packaging machinery, including meat grinders, vacuum packaging machines, plastic sealer machines, sausage stuffers, and similar equipment. These machines are designed to meet the needs of the meat processing industry and are built to the highest standards of quality and performance.

In conclusion, JP Engineering & Construction (P) Ltd. is a one-stop solution for all machinery needs in various industrial sectors including some construction work (the scope of construction is limited at the moment at JP Engineering but we are looking forward to increasing our working area in the field of construction as well). We provide high-quality and efficient machinery, designed to meet the specific needs of our clients along with technical support, with a focus on customer satisfaction and a commitment to excellence. JP Engineering & Construction (P) Ltd. is a reliable and trustworthy partner for all machinery needs.`;

export default function AboutIntroductionPage() {
  const [content, setContent] = useState<PublicSiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getPublicSiteContent()
      .then((data) => {
        if (isMounted && data) {
          setContent(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load site content:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const fullIntroText = content?.full_intro || FALLBACK_FULL_INTRO;
  const paragraphs = fullIntroText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="py-10 sm:py-16 space-y-16">
      <Container size="default">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 pb-6 border-b border-slate-200 mb-8 font-medium">
          <Link href="/" className="hover:text-blue-700 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/about" className="hover:text-blue-700 transition">
            About Us
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">
            Company Introduction
          </span>
        </nav>

        {/* Page Header */}
        <div className="max-w-4xl space-y-4 pb-10 border-b border-slate-200">
          <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
            Corporate Background & Manufacturing Scope
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            About JP Engineering & Construction (P) Ltd.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            A comprehensive overview of our engineering capabilities, multi-sector machinery manufacturing, and technical infrastructure services across 10 years of operations.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8">
          {/* Left Column: Formatted Full Introduction Paragraphs */}
          <div className="lg:col-span-8 space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
            {paragraphs.map((paragraph, index) => (
              <div
                key={index}
                className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-premium-card hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="text-xs font-bold text-blue-700 shrink-0 mt-1 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {paragraph}
                  </p>
                </div>
              </div>
            ))}

            {/* Bottom Navigation CTAs */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              <Button href="/products" variant="primary" size="lg">
                Explore Equipment Catalog &rarr;
              </Button>
              <Button href="/contact" variant="accent" size="lg">
                Request a Custom Quote
              </Button>
            </div>
          </div>

          {/* Right Column: Architectural Highlights Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            {/* Quick Metrics Card with Blueprint Grid */}
            <div className="p-6 rounded-2xl bg-[#0a0f1d] text-white border border-slate-800 shadow-xl space-y-5 bg-blueprint-grid">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                At a Glance
              </span>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Industry Presence</span>
                  <span className="text-white font-semibold">10+ Years Continuous</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Primary Focus</span>
                  <span className="text-white font-semibold">Turnkey Industrial Plants</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Quality Standard</span>
                  <span className="text-white font-semibold">ISO 9001:2015 Compliant</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400 font-medium">Field Support</span>
                  <span className="text-blue-400 font-semibold">24/7 Technical Dispatch</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  href="/contact"
                  variant="accent"
                  size="sm"
                  className="w-full justify-center text-xs font-semibold"
                >
                  Contact Engineering Desk &rarr;
                </Button>
              </div>
            </div>

            {/* Specialized Sectors Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-premium-card space-y-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Seven Key Manufacturing Divisions
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Community & Industrial Water Treatment</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Turnkey Dairy Processing Plants</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Industrial Cold Storage & Blast Freezers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Juice, Beverage & Bottling Machinery</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Solar Energy & Heat Pump Systems</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Structural Steel & Vessel Fabrication</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Meat Mincing & Packaging Lines</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
