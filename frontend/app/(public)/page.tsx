import React from "react";
import Link from "next/link";
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
  return (
    <div className="space-y-24 py-10 sm:py-16">
      {/* 1. Real Editorial Hero (Asymmetric layout, confident typography, no generic slider) */}
      <section className="relative">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content: Confident Typographic Scale */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-stone-900 text-stone-200 border border-stone-800 text-[11px] font-mono uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Industrial Infrastructure & Fleet Solutions
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-950 dark:text-white leading-[1.08]">
                Engineering capacity at{" "}
                <span className="underline decoration-amber-500/60 decoration-4 underline-offset-8">
                  industrial scale
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-normal leading-relaxed max-w-2xl">
                JP Engineering & Construction provides heavy civil earthmoving machinery, high-tonnage hydraulic excavators, and precision infrastructure support engineered for severe duty cycles.
              </p>

              {/* Action Triggers */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  href="/products"
                  variant="accent"
                  size="lg"
                  icon={
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
                  }
                >
                  Explore Equipment Fleet
                </Button>
                <Button href="/quotes" variant="outline" size="lg">
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
                    Pricing Transparency
                  </span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    Direct Quote by Duty Cycle
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic: Monolithic Architectural Feature Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-stone-950 text-white p-7 sm:p-8 border border-stone-800 shadow-xl space-y-6">
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

                {/* Technical Specification Matrix */}
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
                    href="/quotes"
                    variant="accent"
                    size="sm"
                    className="w-full justify-center text-xs"
                  >
                    Request Rig Availability &rarr;
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Design System Components Showcase (Interactive review for user) */}
      <section className="py-12 bg-stone-100/60 dark:bg-stone-900/40 border-y border-stone-200/80 dark:border-stone-800/80">
        <Container size="default">
          <div className="space-y-12">
            <SectionHeading
              layout="split"
              eyebrow="Design System Foundation"
              title="Design System & Component Palette"
              description="A custom, restrained design language built in components/ui/. Built with charcoal/graphite neutrals, industrial safety amber, and strict typography rules."
              badge={<Badge variant="accent">Visual Review Mode</Badge>}
            />

            {/* Buttons Showcase */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                1. Button Component Variants (`components/ui/button.tsx`)
              </h3>
              <div className="flex flex-wrap items-center gap-3 p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <Button variant="primary">Primary (Graphite)</Button>
                <Button variant="accent">Accent (Amber CTA)</Button>
                <Button variant="outline">Outline (Hairline)</Button>
                <Button variant="secondary">Secondary (Stone)</Button>
                <Button variant="ghost">Ghost Action</Button>
                <Button variant="accent" size="sm">Small Accent</Button>
                <Button variant="primary" size="lg">Large Primary</Button>
              </div>
            </div>

            {/* Badges Showcase */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                2. Badge Component Variants (`components/ui/badge.tsx`)
              </h3>
              <div className="flex flex-wrap items-center gap-3 p-6 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <Badge variant="accent" dot>Safety Amber</Badge>
                <Badge variant="neutral" dot>Graphite Neutral</Badge>
                <Badge variant="outline">Technical Outline</Badge>
                <Badge variant="success" dot>Operational Status</Badge>
                <Badge variant="accent" size="md">Medium Spec</Badge>
              </div>
            </div>

            {/* Asymmetric Cards Showcase (No generic centered 3-card row) */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                3. Architectural Card Layouts (`components/ui/card.tsx`)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Wide Editorial Card (8 columns) */}
                <Card variant="editorial" className="md:col-span-8 p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="accent">Asymmetric Editorial Block</Badge>
                      <span className="text-xs font-mono text-stone-400">REF: ARCH-01</span>
                    </div>
                    <h4 className="text-2xl font-bold tracking-tight text-white max-w-md">
                      Civil & Structural Earthmoving Solutions
                    </h4>
                    <p className="text-sm text-stone-300 font-normal leading-relaxed max-w-xl">
                      Engineered for high-volume material handling, deep trenching, and complex grade management without generic template clichés.
                    </p>
                  </div>
                  <div className="pt-8 flex items-center justify-between border-t border-stone-800 mt-6">
                    <span className="text-xs font-mono text-stone-400">
                      Standard: ISO Machinery Protocol
                    </span>
                    <Button variant="accent" size="sm">
                      Inspect Fleet &rarr;
                    </Button>
                  </div>
                </Card>

                {/* Vertical Ghost Technical Card (4 columns) */}
                <Card variant="ghost" className="md:col-span-4 p-6 flex flex-col justify-between">
                  <div>
                    <Badge variant="outline" className="mb-3">Rig Specifications</Badge>
                    <h4 className="text-lg font-bold tracking-tight text-stone-900 dark:text-white">
                      Duty Cycle Ratings
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                      Continuous multi-shift operations with zero-compromise hydraulic seal engineering.
                    </p>
                    <div className="mt-4 space-y-2 border-t border-stone-200 dark:border-stone-800 pt-3 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Availability</span>
                        <span className="font-semibold text-stone-900 dark:text-stone-100">99.2% Uptime</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Hydraulic Warranty</span>
                        <span className="font-semibold text-stone-900 dark:text-stone-100">5,000 Hours</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-6 w-full justify-center">
                    Review Standards
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. SectionHeading Alignment Demos */}
      <section>
        <Container size="default">
          <div className="space-y-12">
            {/* Left Layout Demo */}
            <SectionHeading
              layout="left"
              eyebrow="Precision Fabrication"
              title="Built for the Toughest Civil Environments"
              description="Every piece in our inventory is backed by complete maintenance logs, calibrated hydraulics, and operator-ready deployment."
              action={
                <Button href="/quotes" variant="primary">
                  Request Equipment Availability
                </Button>
              }
            />

            {/* Interactive Card Grid with Asymmetric Sizing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="interactive">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="neutral">Excavation</Badge>
                    <span className="text-[11px] font-mono text-stone-400">CAT-01</span>
                  </div>
                  <CardTitle>Crawler Excavators</CardTitle>
                  <CardDescription>
                    High break-out force with low ground pressure steel tracks for muddy terrain.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-mono text-stone-500 space-y-1">
                    <div>Capacity: 1.0m³ to 2.5m³</div>
                    <div>Operating Weight: 20T to 50T</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Explore Models
                  </span>
                  <span className="text-amber-600 font-bold">&rarr;</span>
                </CardFooter>
              </Card>

              <Card variant="interactive">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="neutral">Lifting</Badge>
                    <span className="text-[11px] font-mono text-stone-400">CAT-02</span>
                  </div>
                  <CardTitle>Rough Terrain Cranes</CardTitle>
                  <CardDescription>
                    Telescopic booms with 4-wheel drive navigation for unpaved construction sites.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-mono text-stone-500 space-y-1">
                    <div>Capacity: 25T to 75T</div>
                    <div>Boom Reach: Up to 45m</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Explore Models
                  </span>
                  <span className="text-amber-600 font-bold">&rarr;</span>
                </CardFooter>
              </Card>

              <Card variant="interactive">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="neutral">Earthwork</Badge>
                    <span className="text-[11px] font-mono text-stone-400">CAT-03</span>
                  </div>
                  <CardTitle>Heavy Bulldozers</CardTitle>
                  <CardDescription>
                    Hydrostatic drive bulldozers with laser-guided blade controls for fine grading.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs font-mono text-stone-500 space-y-1">
                    <div>Engine Power: 150HP to 350HP</div>
                    <div>Blade Capacity: Semi-U / Straight</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Explore Models
                  </span>
                  <span className="text-amber-600 font-bold">&rarr;</span>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
