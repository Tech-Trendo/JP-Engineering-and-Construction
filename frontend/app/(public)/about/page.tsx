"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getPublicTeam,
  getPublicPartners,
  getPublicClients,
  PublicTeamMember,
  PublicPartner,
  PublicClient,
} from "@/lib/public-api";
import {
  Container,
  SectionHeading,
  Button,
} from "@/components/ui";

export default function AboutPage() {
  const [team, setTeam] = useState<PublicTeamMember[]>([]);
  const [partners, setPartners] = useState<PublicPartner[]>([]);
  const [clients, setClients] = useState<PublicClient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([getPublicTeam(), getPublicPartners(), getPublicClients()])
      .then(([t, p, c]) => {
        if (!isMounted) return;
        setTeam(Array.isArray(t) ? t : []);
        setPartners(Array.isArray(p) ? p : []);
        setClients(Array.isArray(c) ? c : []);
      })
      .catch((err) => {
        console.error("Failed to load about page data:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="py-10 sm:py-16 space-y-20">
      {/* 1. Hero & Company Overview */}
      <section>
        <Container size="default">
          <div className="max-w-3xl space-y-6">
            <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider">
              Company Profile & Leadership
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Precision engineering grounded in{" "}
              <span className="underline decoration-blue-500/50 decoration-4 underline-offset-8">
                structural integrity
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              JP Engineering & Construction (P) Ltd. is a leading manufacturer and supplier of machinery for various industrial sectors across Nepal. With a decade of field-proven installations, we deliver turnkey processing plants, dairy lines, cold storage refrigeration, community water treatment skids, solar energy pumping, and food packaging machinery.
            </p>

            <div className="pt-2">
              <Button href="/about/introduction" variant="primary" size="md">
                Read Full Corporate Introduction &rarr;
              </Button>
            </div>
          </div>

          {/* Three Architectural Capability Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-premium-card hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-blue-800 text-xs font-bold uppercase tracking-wider block">
                01. Certified Fabrication
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Food-Grade Stainless Skids
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Precision TIG/MIG sanitary welding on SS304/SS316 alloys compliant with food, beverage, and pharmaceutical quality requirements.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-premium-card hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-blue-800 text-xs font-bold uppercase tracking-wider block">
                02. Engineering Standards
              </span>
              <h3 className="text-base font-bold text-slate-900">
                ISO 9001:2015 Compliance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Factory pressure-testing, flow-rate calibration, and electrical safety validation prior to on-site commissioning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-premium-card hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-blue-800 text-xs font-bold uppercase tracking-wider block">
                03. Field Engineering
              </span>
              <h3 className="text-base font-bold text-slate-900">
                On-Site Dispatch & Spares
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trained process mechanics stationed nationwide for emergency troubleshooting, scheduled maintenance, and OEM component replacement.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Team Grid (Admin Managed TeamMember) - Alternating Surface Slate-50 */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <Container size="default">
          <SectionHeading
            layout="split"
            title="Engineering Team & Leadership"
            description="Our leadership comprises certified mechanical, electrical, and water process engineers overseeing project design and operational commissioning."
          />

          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Loading team directory...
            </div>
          ) : team.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Team members will be listed shortly.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl overflow-hidden bg-white border border-slate-200 p-5 space-y-4 shadow-premium-card hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="h-56 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 text-3xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {member.name}
                    </h4>
                    <p className="text-xs text-blue-700 font-medium mt-1">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 3. Partners Grid (Admin Managed Partners) - Surface White */}
      <section className="py-4">
        <Container size="default">
          <SectionHeading
            layout="split"
            title="Equipment & Technology Partners"
            description="We collaborate directly with global component leaders to integrate world-class pumps, compressors, and industrial controls into our machinery."
          />

          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Loading partner directory...
            </div>
          ) : partners.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Partner alliances will be published shortly.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="p-5 rounded-xl bg-white border border-slate-200/90 flex flex-col items-center justify-center text-center group h-28 shadow-xs hover:border-blue-500/40 hover:shadow-sm transition-all duration-200"
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-75 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                      {partner.name}
                    </span>
                  )}
                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-blue-700 mt-2 truncate max-w-[140px]"
                    >
                      Visit Website &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 4. Clients Grid (Admin Managed Clients) - Alternating Surface Slate-50 */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <Container size="default">
          <SectionHeading
            layout="split"
            title="Institutional & Enterprise Clients"
            description="Leading beverage plants, dairy cooperatives, healthcare institutions, and community water authorities operating JP machinery across Nepal."
          />

          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Loading client references...
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Client references will be displayed shortly.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="p-5 rounded-xl bg-white border border-slate-200/90 flex flex-col items-center justify-center text-center group h-28 shadow-xs hover:border-blue-500/40 hover:shadow-sm transition-all duration-200"
                >
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-75 group-hover:opacity-100"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                      {client.name}
                    </span>
                  )}
                  {client.website_url && (
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-blue-700 mt-2 truncate max-w-[140px]"
                    >
                      Client Profile &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 5. Consultation Bottom CTA - Duotone Midnight Navy with CAD Blueprint Grid */}
      <section>
        <Container size="default">
          <div className="rounded-3xl bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e3a8a]/30 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl bg-blueprint-grid">
            <div className="max-w-xl space-y-3">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                Technical Engagement
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Discuss Your Machinery Requirements
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect with our engineering staff to inspect available machinery models, schedule factory visits, or plan custom plant skids.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-4">
              <Button href="/contact" variant="accent" size="lg">
                Contact Engineering Desk &rarr;
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
