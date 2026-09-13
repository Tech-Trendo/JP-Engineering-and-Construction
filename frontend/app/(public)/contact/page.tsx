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
          <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">
            Technical Consultation & Quotations
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Contact & Machinery Quotations
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed font-normal">
            Submit your machinery specifications or contact our engineering desk directly. Every project inquiry receives a formal technical proposal and capacity assessment.
          </p>
        </div>

        {/* Two-Column Layout: Contact Details + Quote Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 1. Contact Information & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Headquarters Card */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-premium-card space-y-3">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider block">
                Manufacturing & Fabrication Facility
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                JP Engineering & Construction (P) Ltd.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Industrial Corridor Sector 4B<br />
                Kathmandu & Birgunj Manufacturing skids<br />
                Bagmati Province, Nepal
              </p>
            </div>

            {/* Direct Communication Channels */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200 shadow-premium-card space-y-5 text-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
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

              <div className="space-y-1 pt-3 border-t border-slate-100">
                <span className="text-slate-500 block">Technical Desk & Support:</span>
                <a
                  href="tel:+977014123456"
                  className="font-semibold text-slate-900 hover:text-blue-700 transition"
                >
                  +977-01-4123456 / +977-9801234567
                </a>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-100">
                <span className="text-slate-500 block">Engineering Hours:</span>
                <span className="text-slate-600 block leading-relaxed">
                  Sunday – Friday: 08:30 – 17:30 (NPT)<br />
                  Emergency On-Call Support for Plant Breakdowns
                </span>
              </div>
            </div>

            {/* SLA Commitment with subtle blueprint grid */}
            <div className="p-6 rounded-2xl bg-[#0a0f1d] text-white border border-slate-800 shadow-xl space-y-2 text-xs bg-blueprint-grid">
              <span className="text-blue-400 font-semibold uppercase tracking-wider block">
                Technical Response Guarantee
              </span>
              <p className="text-slate-300 leading-relaxed">
                All submitted inquiries are assigned to certified mechanical & water process engineers, with initial capacity validation delivered within 24 business hours.
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
        <div className="py-24 text-center text-xs text-slate-400">
          Loading contact portal...
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
