"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui";
import { QuoteForm } from "@/components/quote-form";

function QuotesContent() {
  const searchParams = useSearchParams();
  const rawProduct = searchParams.get("product");
  const initialProductId = rawProduct ? parseInt(rawProduct) : null;
  const initialProductName = searchParams.get("name") || null;

  return (
    <div className="py-12 sm:py-16">
      <Container size="default">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2 pb-6 border-b border-stone-200 dark:border-stone-800">
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 uppercase font-bold tracking-widest block">
              Direct Technical Procurement
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950 dark:text-white">
              Request Machinery Quote
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Submit project parameters, duty cycles, and target equipment. Direct consultation with licensed field engineers.
            </p>
          </div>

          <QuoteForm
            initialProductId={initialProductId}
            initialProductName={initialProductName}
          />
        </div>
      </Container>
    </div>
  );
}

export default function QuotesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs font-mono text-stone-400">
          Loading quote procurement portal...
        </div>
      }
    >
      <QuotesContent />
    </Suspense>
  );
}
