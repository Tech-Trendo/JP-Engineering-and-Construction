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
    <div className="py-12 sm:py-16 space-y-16">
      <Container size="default">
        {/* Header */}
        <div className="pb-8 border-b border-stone-200 dark:border-stone-800 mb-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-stone-500">
              Technical Procurement & Consultation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-950 dark:text-white leading-[1.1]">
            Contact & Quote Request
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 mt-2 leading-relaxed font-normal">
            Submit your equipment mobilization requirements or contact our engineering dispatch desk directly. Every inquiry receives a dedicated technical proposal.
          </p>
        </div>

        {/* Two-Column Layout: Contact Details + Quote Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* 1. Contact Information & Office Details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Headquarters Card */}
            <div className="p-7 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-4">
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest block">
                Primary Operations Facility
              </span>
              <h3 className="text-lg font-bold text-stone-950 dark:text-white">
                JP Engineering Fabrication Yard
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed font-mono">
                Industrial Corridor Sector 4B, Plot 18-22<br />
                Heavy Engineering & Civil Infrastructure Zone<br />
                P.O. Box 48201
              </p>
            </div>

            {/* Direct Communication Channels */}
            <div className="p-7 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-5 text-xs">
              <span className="text-[11px] font-mono text-stone-400 font-bold uppercase tracking-widest block">
                Direct Channels
              </span>

              <div className="space-y-1">
                <span className="text-stone-400 block">General & Quotation Inquiries:</span>
                <a
                  href="mailto:inquiry@jp-engineering.com"
                  className="font-semibold text-stone-950 dark:text-white hover:text-amber-600 transition"
                >
                  inquiry@jp-engineering.com
                </a>
              </div>

              <div className="space-y-1 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-stone-400 block">Fleet Dispatch Desk:</span>
                <a
                  href="tel:+15559283401"
                  className="font-semibold text-stone-950 dark:text-white hover:text-amber-600 transition"
                >
                  +1 (555) 928-3401
                </a>
              </div>

              <div className="space-y-1 pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-stone-400 block">Operating Hours:</span>
                <span className="font-mono text-stone-600 dark:text-stone-300 block">
                  Monday – Friday: 07:00 – 18:00 (EST)<br />
                  24/7 On-Call Support for Active Contracts
                </span>
              </div>
            </div>

            {/* SLA Commitment */}
            <div className="p-6 rounded-2xl bg-stone-900 text-white border border-stone-800 space-y-2 text-xs">
              <span className="text-amber-500 font-mono font-bold uppercase tracking-wider block">
                Response Guarantee
              </span>
              <p className="text-stone-300 leading-relaxed">
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
        <div className="py-24 text-center text-xs font-mono text-stone-400">
          Loading contact portal...
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
