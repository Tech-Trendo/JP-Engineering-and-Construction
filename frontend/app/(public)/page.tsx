"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getPublicCategories,
  getPublicProducts,
  getPublicPartners,
  getPublicClients,
  getPublicTeam,
  PublicCategory,
  PublicProductListItem,
  PublicPartner,
  PublicClient,
  PublicTeamMember,
} from "@/lib/public-api";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  SectionHeading,
  Badge,
  Container,
} from "@/components/ui";

export default function HomePage() {
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<PublicProductListItem[]>([]);
  const [partners, setPartners] = useState<PublicPartner[]>([]);
  const [clients, setClients] = useState<PublicClient[]>([]);
  const [team, setTeam] = useState<PublicTeamMember[]>([]);
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
    ])
      .then(([cats, prods, parts, clis, tm]) => {
        if (!isMounted) return;
        setCategories(Array.isArray(cats) ? cats : []);
        if (Array.isArray(prods)) {
          const featured = prods.filter((p) => p.is_featured);
          setFeaturedProducts(featured.length > 0 ? featured.slice(0, 6) : prods.slice(0, 6));
        }
        setPartners(Array.isArray(parts) ? parts : []);
        setClients(Array.isArray(clis) ? clis : []);
        setTeam(Array.isArray(tm) ? tm.slice(0, 4) : []);
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

  return (
    <div className="space-y-28 py-8 sm:py-16">
      {/* 1. Real Editorial Hero (Asymmetric, Confident Poppins, No Slider) */}
      <section className="relative">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-900 text-stone-200 border border-stone-800 text-[11px] font-mono uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Industrial Fleet & Construction Capabilities
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 dark:text-white leading-[1.08]">
                Engineering capacity at{" "}
                <span className="underline decoration-amber-500/60 decoration-4 underline-offset-8">
                  industrial scale
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-normal leading-relaxed max-w-2xl">
                JP Engineering & Construction supplies heavy civil earthmoving machinery, high-tonnage hydraulic excavators, and turnkey infrastructure engineering capabilities tailored for rigorous operational duty cycles.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  href="/products"
                  variant="accent"
                  size="lg"
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  }
                >
                  Explore Equipment Fleet
                </Button>
                <Button href="/contact" variant="outline" size="lg">
                  Request Technical Consultation
                </Button>
              </div>

              {/* Technical Credibility Strip */}
              <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-8 text-xs">
                <div>
                  <span className="font-mono text-xs text-stone-400 block uppercase">
                    Operating Standard
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    ISO 9001:2015 Compliant
                  </span>
                </div>
                <div>
                  <span className="font-mono text-xs text-stone-400 block uppercase">
                    Fleet Availability
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    Heavy Excavators & Rigging
                  </span>
                </div>
                <div>
                  <span className="font-mono text-xs text-stone-400 block uppercase">
                    Procurement Terms
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    Custom Duty Cycle Assessment
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero: Monolithic Technical Rig Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-stone-950 text-white p-7 sm:p-8 border border-stone-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">
                      Machinery Highlight
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                      Hydraulic Excavator JP-500
                    </h3>
                  </div>
                  <Badge variant="accent">Severe Duty</Badge>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-2 border-b border-stone-900">
                    <span className="text-stone-400">Operating Weight</span>
                    <span className="text-white font-semibold">22,500 kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-900">
                    <span className="text-stone-400">Bucket Capacity</span>
                    <span className="text-white font-semibold">1.20 m³</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-stone-900">
                    <span className="text-stone-400">Engine Power</span>
                    <span className="text-white font-semibold">130 kW @ 2000 rpm</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-stone-400">Hydraulic Pressure</span>
                    <span className="text-white font-semibold">34.3 MPa</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    href="/products/hydraulic-excavator-jp-500"
                    variant="accent"
                    size="sm"
                    className="w-full justify-center text-xs"
                  >
                    View Rig Specifications &rarr;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Intro / About Summary Statement */}
      <section className="border-y border-stone-200/80 dark:border-stone-800/80 bg-stone-100/40 dark:bg-stone-900/30 py-16">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase font-bold tracking-widest block">
                Engineering Commitment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-950 dark:text-white">
                Engineered for Reliability When Downtime Isn&apos;t an Option.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-4 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              <p>
                At JP Engineering & Construction, we operate at the intersection of heavy machinery asset management, specialized mechanical engineering, and turnkey civil project execution. Our fleet is maintained under strict preventative cycles to ensure relentless performance on excavation, trenching, and high-tonnage lifting operations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <div className="text-2xl font-black text-stone-950 dark:text-white font-mono">15+</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Years Industrial Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-stone-950 dark:text-white font-mono">100%</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Factory Pre-calibrated Fleet</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-600 font-mono">24/7</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Direct Engineering Support</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Featured Categories Grid */}
      <section>
        <Container size="default">
          <SectionHeading
            layout="split"
            eyebrow="Fleet Taxonomy"
            title="Heavy Equipment Categories"
            description="Explore our specialized machinery categories, structured to match major civil excavation, earthwork, and high-rise construction needs."
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
                className="group relative rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between hover:border-amber-500/60 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono text-stone-400">#{cat.order}</span>
                    <span className="h-2 w-2 rounded-full bg-stone-300 dark:bg-stone-700 group-hover:bg-amber-500 transition-colors"></span>
                  </div>
                  <h3 className="text-base font-bold text-stone-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || "Certified heavy machinery models pre-inspected for immediate site deployment."}
                  </p>
                </div>
                <div className="pt-6 flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 group-hover:text-amber-600 transition-colors">
                  <span>Browse Category</span>
                  <span>&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Featured Products */}
      <section className="bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800/80 py-20">
        <Container size="default">
          <SectionHeading
            layout="split"
            eyebrow="Fleet Highlights"
            title="Featured Industrial Machinery"
            description="Verified machinery units available for operational deployment. Review complete engineering specifications or request an immediate quote."
            action={
              <Button href="/products" variant="accent" size="sm">
                All Specifications &rarr;
              </Button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((prod) => (
              <Card key={prod.id} variant="default" className="flex flex-col justify-between">
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-stone-900 border-b border-stone-200 dark:border-stone-800">
                    {prod.primary_image ? (
                      <img
                        src={prod.primary_image}
                        alt={prod.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-stone-500 font-mono text-xs">
                        JP Fleet Spec
                      </div>
                    )}
                    {prod.is_featured && (
                      <span className="absolute top-3 left-3 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
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
                          className="inline-flex text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                    <CardTitle>{prod.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {prod.short_description || "High-torque hydraulic equipment built for continuous excavation and material handling."}
                    </CardDescription>
                  </CardHeader>
                </div>

                {/* Card Footer: "View Details" + "Request Quote" */}
                <CardFooter className="gap-2">
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

      {/* 5. Services Summary (Asymmetric editorial blocks, no generic 3-card clichés) */}
      <section>
        <Container size="default">
          <SectionHeading
            layout="left"
            eyebrow="Specialized Capabilities"
            title="Integrated Heavy Engineering Services"
            description="Beyond equipment leasing, JP Engineering delivers turnkey field support, hydraulic recalibration, and site logistics."
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Service Block 1: Monolithic Dark Block */}
            <div className="md:col-span-6 rounded-2xl bg-stone-900 text-white p-8 border border-stone-800 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest block mb-2">
                  01. Fleet Asset Leasing
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  Crawler Excavators & Earthmoving Logistics
                </h3>
                <p className="text-sm text-stone-400 mt-3 leading-relaxed">
                  Full multi-tonnage fleet supply with on-site certified field mechanics, spare hydraulic seals, and rapid component turnaround to maintain rigorous contract timelines.
                </p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-stone-300 border-t border-stone-800 pt-4">
                <li>• Pre-deployment hydrostatic pressure checks</li>
                <li>• Custom bucket attachments & hydraulic breakers</li>
                <li>• GPS telematics & fuel consumption telemetry</li>
              </ul>
            </div>

            {/* Service Block 2: Architectural Ghost Block */}
            <div className="md:col-span-6 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-amber-600 font-mono text-xs uppercase tracking-widest block mb-2">
                  02. Heavy Lifting & Rigging
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-stone-950 dark:text-white">
                  Rough Terrain & Mobile Crane Operations
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-3 leading-relaxed">
                  Engineered lift planning, counterweight balancing, and certified crane rigging for bridge girders, prefabricated steel structures, and heavy industrial plant setups.
                </p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 pt-4">
                <li>• Certified crane operators & rigger teams</li>
                <li>• Load moment indicators (LMI) calibration</li>
                <li>• Severe-terrain 4x4 off-road stability</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Partner & Client Logo Strip */}
      {(partners.length > 0 || clients.length > 0) && (
        <section className="py-16 border-y border-stone-200/80 dark:border-stone-800/80 bg-stone-100/30 dark:bg-stone-900/20">
          <Container size="default">
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <span className="text-[11px] font-mono text-stone-400 uppercase tracking-widest">
                  Industrial Alliances & Enterprise Clients
                </span>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight">
                  Trusted Across Critical Infrastructure
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
                {partners.concat(clients).slice(0, 6).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex flex-col items-center justify-center text-center group h-24"
                  >
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt={item.name}
                        className="max-h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                      />
                    ) : (
                      <span className="text-xs font-bold font-mono text-stone-400 group-hover:text-amber-600 transition-colors">
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

      {/* 7. Team Preview */}
      {team.length > 0 && (
        <section>
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
                  className="rounded-xl overflow-hidden bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 p-5 space-y-4"
                >
                  <div className="h-44 w-full rounded-lg overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-800">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-stone-500 text-2xl font-mono">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-950 dark:text-white">
                      {member.name}
                    </h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 8. High-Impact Consultation CTA Banner */}
      <section>
        <Container size="default">
          <div className="rounded-3xl bg-stone-950 text-white p-8 sm:p-12 lg:p-16 border border-stone-800 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl space-y-6">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest block">
                Technical Procurement
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Ready to deploy heavy infrastructure machinery?
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Speak directly with an equipment specialist. We assess ground conditions, tonnage requirements, and mobilization logistics to provide a firm, tailored proposal.
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
