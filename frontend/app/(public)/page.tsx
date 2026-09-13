"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getPublicCategories,
  getPublicProducts,
  getPublicPartners,
  getPublicClients,
  getPublicTeam,
  getPublicSiteContent,
  PublicCategory,
  PublicProductListItem,
  PublicPartner,
  PublicClient,
  PublicTeamMember,
  PublicSiteContent,
} from "@/lib/public-api";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  SectionHeading,
  Badge,
  Container,
} from "@/components/ui";
import { ProductSlider } from "@/components/home/product-slider";

const DEFAULT_SHORT_INTRO =
  "JP Engineering & Construction (P) Ltd. is a leading manufacturer and supplier of machinery for various industrial sectors since 10 years. Our product range includes machinery for community-based water treatment systems, industrial water plants, dairy plants, industrial refrigeration, solar energy and irrigation, solar energy and heat pump system and meat mincing and packaging. The company provides water treatment systems for schools, colleges, hospitals, public institutions, and corporate houses.";

export default function HomePage() {
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [allProducts, setAllProducts] = useState<PublicProductListItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<PublicProductListItem[]>([]);
  const [partners, setPartners] = useState<PublicPartner[]>([]);
  const [clients, setClients] = useState<PublicClient[]>([]);
  const [team, setTeam] = useState<PublicTeamMember[]>([]);
  const [siteContent, setSiteContent] = useState<PublicSiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      getPublicCategories(),
      getPublicProducts(),
      getPublicPartners(),
      getPublicClients(),
      getPublicTeam(),
      getPublicSiteContent().catch(() => null),
    ])
      .then(([cats, prods, parts, clis, tm, content]) => {
        if (!isMounted) return;
        setCategories(Array.isArray(cats) ? cats : []);
        if (Array.isArray(prods)) {
          setAllProducts(prods);
          const featured = prods.filter((p) => p.is_featured);
          setFeaturedProducts(featured.length > 0 ? featured.slice(0, 6) : prods.slice(0, 6));
        }
        setPartners(Array.isArray(parts) ? parts : []);
        setClients(Array.isArray(clis) ? clis : []);
        setTeam(Array.isArray(tm) ? tm.slice(0, 4) : []);
        if (content) {
          setSiteContent(content);
        }
      })
      .catch((err) => {
        console.error("Failed to load homepage data:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const shortIntroText = siteContent?.short_intro || DEFAULT_SHORT_INTRO;

  return (
    <div className="space-y-20 py-6 sm:py-10">
      {/* 1. Real Editorial Hero (Duotone Midnight Navy with CAD Blueprint Grid Texture) */}
      <section className="relative">
        <Container size="default">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e3a8a]/30 text-white border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden bg-blueprint-grid">
            {/* Ambient Lighting Accents */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-900/20 blur-3xl"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Hero Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-xs font-semibold text-blue-200">
                  Industrial Machinery & Processing Plants
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Engineering machinery at{" "}
                  <span className="underline decoration-blue-500/60 decoration-4 underline-offset-8">
                    industrial scale
                  </span>
                  .
                </h1>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                  JP Engineering & Construction (P) Ltd. designs, manufactures, and commissions precision industrial machinery — from community & industrial water plants and dairy machinery to cold chain refrigeration, solar systems, and food packaging skids.
                </p>

                {/* Varied Actions: Primary warm accent button paired with clean inline text link */}
                <div className="flex flex-wrap items-center gap-5 pt-2">
                  <Button
                    href="/contact"
                    variant="accent"
                    size="lg"
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    }
                  >
                    Request Equipment Quote
                  </Button>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors group"
                  >
                    <span>Browse Machine Catalog</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>

                {/* Technical Credibility Strip in Clean Poppins */}
                <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-8 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Quality Compliance</span>
                    <span className="font-semibold text-white">ISO 9001:2015 & Sanitary Standards</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Manufacturing Heritage</span>
                    <span className="font-semibold text-white">10+ Years Operational Deployment</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Field Readiness</span>
                    <span className="font-semibold text-amber-400">Pre-tested & Calibrated</span>
                  </div>
                </div>
              </div>

              {/* Right Hero: Monolithic Technical Machinery Spec Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-[#0a0f1d]/90 text-white p-7 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6 bg-blueprint-grid-subtle backdrop-blur-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                        Featured Installation
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-1">
                        Industrial Reverse Osmosis Plant
                      </h3>
                    </div>
                    <Badge variant="accent">Turnkey Skid</Badge>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800/80">
                      <span className="text-slate-400 font-medium">Processing Capacity</span>
                      <span className="text-white font-semibold">10,000 LPH Continuous</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800/80">
                      <span className="text-slate-400 font-medium">Permeate Recovery Rate</span>
                      <span className="text-white font-semibold">Up to 75% Recovery</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800/80">
                      <span className="text-slate-400 font-medium">Structure & Skid</span>
                      <span className="text-white font-semibold">SS316 Food-Grade Stainless Steel</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400 font-medium">Automation</span>
                      <span className="text-white font-semibold">Automated PLC / Touchscreen SCADA</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      href="/products/industrial-reverse-osmosis-water-treatment-plant"
                      variant="primary"
                      size="sm"
                      className="w-full justify-center text-xs font-semibold"
                    >
                      View Plant Specifications &rarr;
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Interactive Machinery Showcase Slider (Embla Carousel) */}
      {allProducts.length > 0 && (
        <section className="py-2">
          <Container size="default">
            <SectionHeading
              layout="split"
              title="Industrial Machinery in Operation"
              description="Review photographic documentation and calibrated operational parameters of our primary processing lines and mechanical systems."
              action={
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <span>Complete Machinery Catalog</span>
                  <span>&rarr;</span>
                </Link>
              }
            />
            <div className="mt-6">
              <ProductSlider products={allProducts} />
            </div>
          </Container>
        </section>
      )}

      {/* 3. Intro / About Summary Statement (The ONLY place for the 3-column stats row) */}
      <section className="border-y border-slate-200/80 bg-slate-50 py-16 sm:py-20">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
                Corporate Introduction
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Reliable Engineering for Rigorous Industrial Demands.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-6 text-slate-600 leading-relaxed">
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                {shortIntroText}
              </p>

              {/* Prominent Read More Link to full /about/introduction page */}
              <div className="pt-1">
                <Button
                  href="/about/introduction"
                  variant="primary"
                  size="sm"
                  className="font-semibold text-xs inline-flex items-center gap-2"
                >
                  <span>Read Full Company Profile</span>
                  <span>&rarr;</span>
                </Button>
              </div>

              {/* Sole 3-column metric bar on the site */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-3xl font-black text-slate-900">10+</div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">Years Industrial Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">Factory Pre-commissioned Fleet</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-blue-700">24/7</div>
                  <div className="text-xs text-slate-600 mt-1 font-medium">Direct Engineering Support</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Featured Categories Grid (7 Real Divisions) */}
      <section className="py-4">
        <Container size="default">
          <SectionHeading
            layout="split"
            title="Manufacturing & Machinery Divisions"
            description="Explore our seven specialized machinery engineering divisions delivering turn-key plants and certified machinery across Nepal."
            action={
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
              >
                <span>All Categories</span>
                <span>&rarr;</span>
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-4">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`group relative rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-premium-card hover:shadow-premium-hover hover:-translate-y-1 hover:border-blue-600/40 transition-all duration-200 ${
                  idx === 0 ? "sm:col-span-2 lg:col-span-2 bg-gradient-to-br from-white via-blue-50/20 to-white" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      Division {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all text-sm font-bold">
                      &rarr;
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || "Certified machinery lines engineered for continuous commercial duty cycles."}
                  </p>
                </div>
                <div className="pt-6 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors border-t border-slate-100 mt-4">
                  <span>Explore Equipment</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Featured Products (Alternating Surface: Slate-50) */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-20">
        <Container size="default">
          <SectionHeading
            layout="split"
            title="Featured Industrial Machinery"
            description="Verified machinery units available for operational deployment. Review complete engineering specifications or request an immediate quote."
            action={
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
              >
                <span>View All Products</span>
                <span>&rarr;</span>
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {featuredProducts.map((prod) => (
              <Card key={prod.id} variant="default" className="flex flex-col justify-between group">
                <div>
                  {/* Thumbnail with subtle hover zoom */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-900 border-b border-slate-200">
                    {prod.primary_image ? (
                      <img
                        src={prod.primary_image}
                        alt={prod.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                        JP Machinery Asset
                      </div>
                    )}
                    {prod.is_featured && (
                      <span className="absolute top-3 left-3 bg-blue-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs">
                        Featured Equipment
                      </span>
                    )}
                  </div>

                  <CardHeader>
                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {prod.categories.map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                    <CardTitle className="group-hover:text-blue-700 transition-colors">
                      {prod.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 text-xs">
                      {prod.short_description || "Industrial-grade equipment built for continuous duty cycles and high efficiency."}
                    </CardDescription>
                  </CardHeader>
                </div>

                {/* Card Footer: "View Details" (outline) + "Request Quote" (warm accent) */}
                <CardFooter className="gap-2 pt-3">
                  <Button
                    href={`/products/${prod.slug}`}
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-center text-xs font-semibold"
                  >
                    View Details
                  </Button>
                  <Button
                    href={`/contact?product=${prod.id}&name=${encodeURIComponent(prod.name)}`}
                    variant="accent"
                    size="sm"
                    className="flex-1 justify-center text-xs font-semibold"
                  >
                    Request Quote
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Capabilities & Services (Asymmetric Duo: Midnight Blueprint Card + Architectural White Card) */}
      <section className="py-6">
        <Container size="default">
          <SectionHeading
            layout="left"
            title="Turnkey Engineering Capabilities"
            description="Beyond machinery manufacturing, JP Engineering delivers end-to-end plant fabrication, sanitary piping installation, and preventive maintenance programs."
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Capability 1: Monolithic Midnight Navy Block with CAD Blueprint Grid */}
            <div className="md:col-span-6 rounded-2xl bg-[#0a0f1d] text-white p-8 sm:p-10 border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl bg-blueprint-grid">
              <div>
                <span className="text-blue-400 font-semibold text-xs uppercase tracking-wider block mb-2">
                  01. Design & Plant Engineering
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Turnkey Plant Engineering & Skid Fabrication
                </h3>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Complete design, custom fabrication, and on-site integration of food-grade SS304/SS316 process vessels, high-pressure pump skids, and automated PLC control systems.
                </p>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-5">
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0"></span>
                  <span>Custom skid engineering, P&ID documentation & 3D layout</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0"></span>
                  <span>TIG/MIG sanitary welding compliant with food & dairy standards</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0"></span>
                  <span>Pre-shipment hydrostatic, flow-rate, and pressure testing</span>
                </li>
              </ul>
            </div>

            {/* Capability 2: Architectural Crisp White Block */}
            <div className="md:col-span-6 rounded-2xl bg-white border border-slate-200 p-8 sm:p-10 shadow-premium-card flex flex-col justify-between space-y-6">
              <div>
                <span className="text-blue-700 font-semibold text-xs uppercase tracking-wider block mb-2">
                  02. Field Support & Maintenance
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Preventive Servicing, Calibration & Spares
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Dedicated field engineering teams across Nepal providing routine membrane chemical cleaning, ammonia compressor overhauls, sensor calibrations, and genuine spare parts.
                </p>
              </div>
              <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-200 pt-5">
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></span>
                  <span>24/7 technical emergency response for industrial water & cold chains</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></span>
                  <span>Annual maintenance contracts (AMC) with guaranteed SLA turnaround</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0"></span>
                  <span>Direct inventory of Danfoss, Grundfos, and Alfa Laval spares</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Partner & Client Logo Strip (Alternating Surface: Slate-50) */}
      {(partners.length > 0 || clients.length > 0) && (
        <section className="py-16 bg-slate-50 border-y border-slate-200/80">
          <Container size="default">
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Technology Partners & Institutional Clients
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Trusted Across Critical Water, Agro & Cold Chain Projects
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-5 items-center">
                {partners.concat(clients).slice(0, 6).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200/80 flex flex-col items-center justify-center text-center group h-24 shadow-xs hover:border-blue-500/40 hover:shadow-sm transition-all duration-200"
                  >
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="max-h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-75 group-hover:opacity-100"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 8. Technical Leadership Preview */}
      {team.length > 0 && (
        <section className="py-4">
          <Container size="default">
            <SectionHeading
              layout="split"
              title="Engineering Management"
              description="Guided by licensed mechanical, electrical, and process engineers ensuring design integrity across every installation."
              action={
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <span>Meet Our Engineers</span>
                  <span>&rarr;</span>
                </Link>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl overflow-hidden bg-white border border-slate-200 p-5 space-y-4 shadow-premium-card hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 text-2xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {member.name}
                    </h4>
                    <p className="text-xs text-blue-700 font-medium mt-0.5">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 9. Consultation CTA Banner (Duotone Midnight Navy with CAD Blueprint Grid) */}
      <section>
        <Container size="default">
          <div className="rounded-3xl bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e3a8a]/30 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 relative overflow-hidden shadow-2xl bg-blueprint-grid">
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                Direct Engineering Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Ready to engineer your industrial plant machinery?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Speak directly with an equipment specialist. We assess water chemistry, plant capacity, cooling loads, and electrical integration to deliver a comprehensive technical proposal.
              </p>
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Button href="/contact" variant="accent" size="lg">
                  Submit Project Inquiry
                </Button>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 hover:text-white transition-colors group"
                >
                  <span>Explore Machinery Catalog</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
