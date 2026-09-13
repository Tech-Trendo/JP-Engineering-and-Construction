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
    <div className="space-y-24 py-6 sm:py-12">
      {/* 1. Real Editorial Hero (Duotone Midnight Navy with Deep Brand Blue Accent) */}
      <section className="relative">
        <Container size="default">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e3a8a]/25 text-white border border-slate-800/80 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
            {/* Subtle background glow effect */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-blue-900/15 blur-3xl"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Hero Content */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-[11px] font-mono uppercase tracking-[0.2em] text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6] animate-pulse"></span>
                  Industrial Fleet & Machinery Capabilities
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                  Engineering capacity at{" "}
                  <span className="underline decoration-blue-500/60 decoration-4 underline-offset-8">
                    industrial scale
                  </span>
                  .
                </h1>

                <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
                  JP Engineering & Construction supplies heavy civil earthmoving machinery, water & bottling systems, and turnkey infrastructure engineering capabilities tailored for rigorous operational duty cycles.
                </p>

                {/* Action Buttons: Accent for Quote, Primary/Outline for Fleet */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
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
                  <Button href="/products" variant="outline" size="lg">
                    Explore Equipment Fleet
                  </Button>
                </div>

                {/* Technical Credibility Strip */}
                <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-8 text-xs">
                  <div>
                    <span className="font-mono text-xs text-slate-400 block uppercase">
                      Operating Standard
                    </span>
                    <span className="font-semibold text-white">
                      ISO 9001:2015 Compliant
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate-400 block uppercase">
                      Fleet Availability
                    </span>
                    <span className="font-semibold text-white">
                      Pre-inspected & Calibrated
                    </span>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-slate-400 block uppercase">
                      Experience
                    </span>
                    <span className="font-semibold text-amber-400">
                      10+ Years in Industry
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Hero: Monolithic Technical Rig Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl bg-[#0a0f1d] text-white p-7 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block">
                        Machinery Highlight
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                        Hydraulic Excavator JP-500
                      </h3>
                    </div>
                    <Badge variant="accent">Severe Duty</Badge>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-900">
                      <span className="text-slate-400">Operating Weight</span>
                      <span className="text-white font-semibold">22,500 kg</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900">
                      <span className="text-slate-400">Bucket Capacity</span>
                      <span className="text-white font-semibold">1.20 m³</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-900">
                      <span className="text-slate-400">Engine Power</span>
                      <span className="text-white font-semibold">130 kW @ 2000 rpm</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400">Hydraulic Pressure</span>
                      <span className="text-white font-semibold">34.3 MPa</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      href="/products/hydraulic-excavator-jp-500"
                      variant="primary"
                      size="sm"
                      className="w-full justify-center text-xs font-semibold"
                    >
                      View Rig Specifications &rarr;
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
              eyebrow="Visual Fleet Showcase"
              title="Equipment In Action"
              description="Browse high-resolution imagery and certified operational parameters of our featured machinery units. Slides advance automatically every 4.5 seconds."
              action={
                <Button href="/products" variant="outline" size="sm">
                  Full Fleet Catalog &rarr;
                </Button>
              }
            />
            <div className="mt-6">
              <ProductSlider products={allProducts} />
            </div>
          </Container>
        </section>
      )}

      {/* 3. Intro / About Summary Statement (Alternating Surface: Slate-50) */}
      <section className="border-y border-slate-200/80 bg-slate-50 py-16 sm:py-20">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[11px] font-mono text-blue-800 uppercase font-bold tracking-widest block">
                Corporate Introduction
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Reliable Engineering for Rigorous Industrial Demands.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-5 text-sm text-slate-600 leading-relaxed">
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-black text-slate-900 font-mono">10+</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">Years Industrial Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 font-mono">100%</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">Factory Pre-calibrated Fleet</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-700 font-mono">24/7</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">Direct Engineering Support</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Featured Categories Grid (Surface: Crisp White) */}
      <section className="py-4">
        <Container size="default">
          <SectionHeading
            layout="split"
            eyebrow="Fleet Taxonomy"
            title="Heavy Equipment Categories"
            description="Explore our specialized machinery categories, structured to match major civil excavation, earthwork, water processing, and industrial plant needs."
            action={
              <Button href="/products" variant="outline" size="sm">
                View Full Catalog &rarr;
              </Button>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative rounded-2xl bg-white border border-slate-200/90 p-6 flex flex-col justify-between shadow-premium-card hover:shadow-premium-hover hover:-translate-y-1 hover:border-blue-600/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono text-slate-400">#{cat.order}</span>
                    <span className="h-2 w-2 rounded-full bg-slate-200 group-hover:bg-blue-600 transition-colors"></span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || "Certified heavy machinery models pre-inspected for immediate site deployment."}
                  </p>
                </div>
                <div className="pt-6 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                  <span>Browse Category</span>
                  <span>&rarr;</span>
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
            eyebrow="Fleet Highlights"
            title="Featured Industrial Machinery"
            description="Verified machinery units available for operational deployment. Review complete engineering specifications or request an immediate quote."
            action={
              <Button href="/products" variant="primary" size="sm">
                All Specifications &rarr;
              </Button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <Card key={prod.id} variant="default" className="flex flex-col justify-between">
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-slate-200">
                    {prod.primary_image ? (
                      <img
                        src={prod.primary_image}
                        alt={prod.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-400 font-mono text-xs">
                        JP Fleet Spec
                      </div>
                    )}
                    {prod.is_featured && (
                      <span className="absolute top-3 left-3 bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider font-mono">
                        Featured Rig
                      </span>
                    )}
                  </div>

                  <CardHeader>
                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {prod.categories.map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                    <CardTitle>{prod.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {prod.short_description || "High-torque equipment built for continuous duty cycles and material handling."}
                    </CardDescription>
                  </CardHeader>
                </div>

                {/* Card Footer: "View Details" (outline) + "Request Quote" (warm accent) */}
                <CardFooter className="gap-2 pt-3">
                  <Button
                    href={`/products/${prod.slug}`}
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-center text-xs"
                  >
                    View Details
                  </Button>
                  <Button
                    href={`/contact?product=${prod.id}&name=${encodeURIComponent(prod.name)}`}
                    variant="accent"
                    size="sm"
                    className="flex-1 justify-center text-xs"
                  >
                    Request Quote
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. Services Summary (Surface: Crisp White, Asymmetric Editorial Blocks) */}
      <section className="py-4">
        <Container size="default">
          <SectionHeading
            layout="left"
            eyebrow="Specialized Capabilities"
            title="Integrated Heavy Engineering Services"
            description="Beyond equipment procurement, JP Engineering delivers turnkey field support, hydraulic recalibration, and site logistics."
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Service Block 1: Monolithic Midnight Navy Block */}
            <div className="md:col-span-6 rounded-2xl bg-[#0a0f1d] text-white p-8 sm:p-10 border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl">
              <div>
                <span className="text-blue-400 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                  01. Fleet Asset Deployment
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Crawler Excavators & Earthmoving Logistics
                </h3>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Full multi-tonnage fleet supply with on-site certified field mechanics, spare hydraulic seals, and rapid component turnaround to maintain rigorous contract timelines.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-slate-300 border-t border-slate-800 pt-5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  <span>Pre-deployment hydrostatic pressure checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  <span>Custom bucket attachments & hydraulic breakers</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                  <span>GPS telematics & telemetry tracking</span>
                </li>
              </ul>
            </div>

            {/* Service Block 2: Architectural White Block */}
            <div className="md:col-span-6 rounded-2xl bg-white border border-slate-200 p-8 sm:p-10 shadow-premium-card flex flex-col justify-between space-y-6">
              <div>
                <span className="text-blue-700 font-mono text-xs uppercase tracking-widest block mb-2 font-bold">
                  02. Heavy Lifting & Plant Rigging
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                  Rough Terrain & Mobile Crane Operations
                </h3>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Engineered lift planning, counterweight balancing, and certified crane rigging for bridge girders, prefabricated steel structures, and heavy industrial plant setups.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-slate-500 border-t border-slate-200 pt-5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  <span>Certified crane operators & rigger teams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  <span>Load moment indicators (LMI) calibration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  <span>Severe-terrain 4x4 off-road stability</span>
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
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  Industrial Alliances & Enterprise Clients
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Trusted Across Critical Infrastructure
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
                      <span className="text-xs font-bold font-mono text-slate-500 group-hover:text-blue-700 transition-colors">
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

      {/* 8. Team Preview (Surface: Crisp White) */}
      {team.length > 0 && (
        <section className="py-4">
          <Container size="default">
            <SectionHeading
              layout="split"
              eyebrow="Leadership & Technical Staff"
              title="Engineering Management"
              description="Guided by certified structural and mechanical engineers ensuring operational compliance across all active civil projects."
              action={
                <Button href="/about" variant="outline" size="sm">
                  Meet the Full Team &rarr;
                </Button>
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 text-2xl font-mono">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {member.name}
                    </h4>
                    <p className="text-xs text-blue-700 font-mono font-medium mt-0.5">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 9. High-Impact Consultation CTA Banner (Duotone Midnight Navy) */}
      <section>
        <Container size="default">
          <div className="rounded-3xl bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e3a8a]/25 text-white p-8 sm:p-12 lg:p-16 border border-slate-800/80 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
                Technical Procurement
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Ready to deploy heavy infrastructure machinery?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Speak directly with an equipment specialist. We assess ground conditions, capacity requirements, and mobilization logistics to provide a firm, tailored proposal.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button href="/contact" variant="accent" size="lg">
                  Submit Project Inquiry
                </Button>
                <Button href="/products" variant="outline" size="lg">
                  Review All Specifications
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
