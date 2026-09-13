"use client";

import React, { useState, useEffect } from "react";
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
  Card,
  Button,
  Badge,
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
      {/* 1. Hero & Company Introduction */}
      <section>
        <Container size="default">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-blue-800">
                Company Profile & Leadership
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
              Precision engineering grounded in{" "}
              <span className="underline decoration-blue-500/50 decoration-4 underline-offset-8">
                structural integrity
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              JP Engineering & Construction was established with a clear mandate: provide heavy construction enterprises with certified mechanical assets, rigorous preventative duty-cycle management, and turnkey infrastructure execution.
            </p>
          </div>

          {/* Three Architectural Capability Pillars (Asymmetric) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-premium-card hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-blue-800 font-mono text-xs font-bold uppercase tracking-widest block">
                01. Certified Equipment
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Pre-calibrated Fleet Assets
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every unit in our catalog undergoes rigorous hydrostatic pressure and hydraulic seal testing before release to any jobsite.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-premium-card hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-blue-800 font-mono text-xs font-bold uppercase tracking-widest block">
                02. Engineering Governance
              </span>
              <h3 className="text-base font-bold text-slate-900">
                ISO 9001:2015 Standards
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adhering to strict occupational safety codes, ground stability modeling, and lifting capacity margins on all civil contracts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-premium-card hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-200">
              <span className="text-blue-800 font-mono text-xs font-bold uppercase tracking-widest block">
                03. Dedicated Mechanics
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Field Dispatch & Rigging
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Stationed mobile workshop vans equipped with OEM replacement components and on-site hydraulic technicians.
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
            eyebrow="Leadership & Technical Direction"
            title="Engineering Team"
            description="Our personnel comprises certified structural, mechanical, and geotechnical specialists overseeing asset maintenance and project execution."
          />

          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono text-slate-400">
              Loading team directory...
            </div>
          ) : team.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Team members will be listed shortly.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <div className="h-full w-full flex items-center justify-center font-bold text-slate-400 text-3xl font-mono">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {member.name}
                    </h4>
                    <p className="text-xs text-blue-700 font-mono font-medium mt-1">
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
            eyebrow="Supply Chain & Component Manufacturers"
            title="Equipment & Technology Partners"
            description="We collaborate directly with tier-one OEM machinery manufacturers and certified hydraulic component fabricators."
          />

          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono text-slate-400">
              Loading partner directory...
            </div>
          ) : partners.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Partner alliances will be published shortly.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
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
                    <span className="text-xs font-bold font-mono text-slate-500 group-hover:text-blue-700 transition-colors">
                      {partner.name}
                    </span>
                  )}
                  {partner.website_url && (
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-400 hover:text-blue-700 mt-2 truncate max-w-[120px]"
                    >
                      Visit Site &rarr;
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
            eyebrow="Project References"
            title="Enterprise Clients"
            description="Organizations and engineering firms that rely on JP Engineering for mission-critical excavation and civil mobilization."
          />

          {isLoading ? (
            <div className="p-12 text-center text-xs font-mono text-slate-400">
              Loading client references...
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Client references will be displayed shortly.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
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
                    <span className="text-xs font-bold font-mono text-slate-500 group-hover:text-blue-700 transition-colors">
                      {client.name}
                    </span>
                  )}
                  {client.website_url && (
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-400 hover:text-blue-700 mt-2 truncate max-w-[120px]"
                    >
                      Project Profile &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* 5. Consultation Bottom CTA - Duotone Midnight Navy */}
      <section>
        <Container size="default">
          <div className="rounded-3xl bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e3a8a]/25 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-2xl">
            <div className="max-w-xl space-y-3">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block">
                Technical Engagement
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Discuss Your Machinery Requirements
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect with our engineering staff to inspect available fleet items or review custom attachments.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
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
