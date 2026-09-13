"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";

function ContactContent() {
  const searchParams = useSearchParams();
  const rawProduct = searchParams.get("product");
  const initialProductId = rawProduct ? parseInt(rawProduct) : null;
  const initialProductName = searchParams.get("name") || null;

  return (
    <div className="py-10 sm:py-16 space-y-16">
      <Container size="default">
        {/* Header */}
        <div className="pb-8 border-b border-slate-200 mb-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-blue-800">
              Technical Procurement & Consultation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Contact & Quote Request
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-normal">
            Submit your equipment mobilization requirements or contact our engineering dispatch desk directly. Every inquiry receives a dedicated technical proposal.
          </p>
        </div>

        {/* Two-Column Layout: Contact Details + Quote Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 1. Contact Information & Office Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Headquarters Card */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-premium-card space-y-4">
              <span className="text-[11px] font-mono text-blue-800 font-bold uppercase tracking-widest block">
                Primary Operations Facility
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                JP Engineering Fabrication Yard
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-mono">
                Industrial Corridor Sector 4B, Plot 18-22<br />
                Heavy Engineering & Civil Infrastructure Zone<br />
                Kathmandu & Birgunj Operations Hub
              </p>
            </div>

            {/* Direct Communication Channels */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-premium-card space-y-5 text-xs">
              <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-widest block">
                Direct Channels
              </span>

              <div className="space-y-1">
                <span className="text-slate-500 block">General & Quotation Inquiries:</span>
                <a
                  href="mailto:inquiry@jp-engineering.com"
                  className="font-semibold text-slate-900 hover:text-blue-700 transition"
                >
                  inquiry@jp-engineering.com
                </a>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-slate-500 block">Fleet Dispatch Desk:</span>
                <a
                  href="tel:+977014123456"
                  className="font-semibold text-slate-900 hover:text-blue-700 transition"
                >
                  +977-01-4123456 / +977-9801234567
                </a>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-slate-500 block">Operating Hours:</span>
                <span className="font-mono text-slate-600 block">
                  Sunday – Friday: 08:00 – 18:00 (NPT)<br />
                  24/7 On-Call Support for Active Contracts
                </span>
              </div>
            </div>

            {/* SLA Commitment */}
            <div className="p-6 rounded-2xl bg-[#0a0f1d] text-white border border-slate-800 shadow-xl space-y-2 text-xs">
              <span className="text-blue-400 font-mono font-bold uppercase tracking-wider block">
                Response Guarantee
              </span>
              <p className="text-slate-300 leading-relaxed">
                All submitted quote inquiries are reviewed by licensed mechanical & civil engineers with a comprehensive assessment delivered within 24 business hours.
              </p>
            </div>
          </div>

          {/* 2. Embedded Quote Request Form (with auto-fill support) */}
          <div className="lg:col-span-7">
            <QuoteForm
              initialProductId={initialProductId}
              initialProductName={initialProductName}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs font-mono text-slate-400">
          Loading contact portal...
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
