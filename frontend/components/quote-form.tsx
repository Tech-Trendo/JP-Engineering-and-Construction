"use client";

import React, { useState, useEffect } from "react";
import {
  submitQuote,
  getPublicProducts,
  PublicProductListItem,
} from "@/lib/public-api";
import { Button, Badge } from "@/components/ui";

export interface QuoteFormProps {
  initialProductId?: number | null;
  initialProductName?: string | null;
  onSuccess?: () => void;
  className?: string;
}

export function QuoteForm({
  initialProductId = null,
  initialProductName = null,
  onSuccess,
  className = "",
}: QuoteFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    initialProductId
  );
  const [selectedProductName, setSelectedProductName] = useState<string | null>(
    initialProductName
  );
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState<PublicProductListItem[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync initial props when passed dynamically
  useEffect(() => {
    if (initialProductId !== undefined && initialProductId !== null) {
      setSelectedProductId(initialProductId);
    }
    if (initialProductName) {
      setSelectedProductName(initialProductName);
    }
  }, [initialProductId, initialProductName]);

  // Fetch product list for the dropdown
  useEffect(() => {
    let isMounted = true;
    setIsLoadingProducts(true);
    getPublicProducts()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setProducts(data);
          // If we had initialProductId but no name, find the name
          if (selectedProductId && !selectedProductName) {
            const match = data.find((p) => p.id === selectedProductId);
            if (match) setSelectedProductName(match.name);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load products for quote form:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingProducts(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProductId, selectedProductName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Valid email address is required.");
      return;
    }
    if (!phone.trim()) {
      setErrorMessage("Contact phone number is required.");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Please include details about your inquiry or project scope.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitQuote({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: company.trim() || undefined,
        product: selectedProductId,
        message: message.trim(),
      });

      setSuccessMessage(
        res.message ||
          "Thank you for reaching out. Your quote request has been received and our engineering team will contact you shortly."
      );
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to submit quote inquiry. Please check your network and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className={`p-8 rounded-2xl bg-stone-900 border border-stone-800 text-white text-center space-y-4 shadow-xl ${className}`}>
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-white">
          Quote Inquiry Submitted
        </h3>
        <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
          {successMessage}
        </p>
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSuccessMessage(null)}
          >
            Submit Another Inquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 sm:p-8 rounded-2xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5 text-xs ${className}`}
    >
      <div>
        <h3 className="text-lg font-bold tracking-tight text-stone-950 dark:text-white">
          Request a Technical Quote
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Specify your equipment requirements, site timeline, and duty cycle. Direct response within 24 hours.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Pre-Selected Target Product Badge */}
      {selectedProductName && (
        <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-stone-400 uppercase">
              Target Rig:
            </span>
            <span className="font-semibold text-stone-900 dark:text-white">
              {selectedProductName}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedProductId(null);
              setSelectedProductName(null);
            }}
            className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 underline"
          >
            Change
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
            Full Name <span className="text-amber-600">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-xs"
          />
        </div>

        <div>
          <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
            Corporate Email <span className="text-amber-600">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="e.g. john@constructco.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
            Phone Number <span className="text-amber-600">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. +1 (555) 019-2834"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-xs"
          />
        </div>

        <div>
          <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
            Company / Organization <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Apex Civil Infrastructure Ltd"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-xs"
          />
        </div>
      </div>

      {/* Equipment Selector (if not already locked by prefill) */}
      {!selectedProductName && (
        <div>
          <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
            Target Machinery / Equipment <span className="text-stone-400 font-normal">(optional)</span>
          </label>
          <select
            value={selectedProductId || ""}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value) : null;
              setSelectedProductId(val);
              const found = products.find((p) => p.id === val);
              setSelectedProductName(found ? found.name : null);
            }}
            className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-xs"
          >
            <option value="">General Machinery Inquiry (No specific model)</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
          Project Scope / Message <span className="text-amber-600">*</span>
        </label>
        <textarea
          rows={4}
          required
          placeholder="Describe your operational requirements, site location, required attachments, or duty cycle expectations..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-xs leading-relaxed"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          isLoading={isSubmitting}
          className="w-full justify-center text-xs sm:text-sm font-semibold uppercase tracking-wider"
        >
          Submit Quote Inquiry
        </Button>
      </div>

      <p className="text-[11px] text-stone-500 text-center">
        Zero obligation. Technical duty cycle assessment provided by licensed engineers.
      </p>
    </form>
  );
}
