"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { submitQuote } from "@/lib/public-api";

interface ContactFormProps {
  initialProductId?: number;
  initialProductName?: string;
}

export default function ContactForm({
  initialProductId,
  initialProductName,
}: ContactFormProps = {}) {
  const searchParams = useSearchParams();
  const productIdParam = searchParams.get("product");
  const productNameParam = searchParams.get("name");

  const effectiveProductId =
    initialProductId !== undefined
      ? initialProductId
      : productIdParam
      ? parseInt(productIdParam, 10)
      : undefined;

  const effectiveProductName =
    initialProductName || productNameParam || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    productId: effectiveProductId,
    productName: effectiveProductName,
    message: "",
  });

  useEffect(() => {
    if (initialProductId !== undefined) {
      setForm((prev) => ({
        ...prev,
        productId: initialProductId,
        productName: initialProductName || prev.productName,
      }));
    } else if (productIdParam) {
      setForm((prev) => ({
        ...prev,
        productId: parseInt(productIdParam, 10),
        productName: productNameParam || prev.productName,
      }));
    }
  }, [initialProductId, initialProductName, productIdParam, productNameParam]);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setSubmitError(null);

    try {
      await submitQuote({
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        company: form.company.trim() || undefined,
        product: form.productId || undefined,
        message: form.productName
          ? `[Machinery Inquiry: ${form.productName}]\n${form.message}`
          : form.message,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Quote submission error:", err);
      const errMsg =
        err instanceof Error ? err.message : "Failed to submit quote request.";
      setSubmitError(
        errMsg.includes("429") || errMsg.includes("Throttled")
          ? "You have reached the submission rate limit. Please wait a moment or call our sales line directly."
          : "There was an error submitting your request. Please verify your details or call our team directly."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-8 text-center rounded-lg shadow-sm">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-[#1b3a6e] font-bold text-xl mb-2">
          Quote Request Received!
        </h3>
        <p className="text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          Thank you, <span className="font-semibold text-gray-800">{form.name}</span>. Your machinery inquiry has been logged in our engineering dashboard. Our sales engineers will review your specifications and contact you shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              email: "",
              phone: "",
              company: "",
              productId: undefined,
              productName: "",
              message: "",
            });
          }}
          className="mt-6 bg-[#1b3a6e] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded hover:bg-[#0f2347] transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form id="quote" onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Prefilled Product Context Banner */}
      {form.productName && (
        <div className="p-3 bg-[#f0f4f8] border border-[#1b3a6e]/20 rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#c8391a] text-xs font-bold uppercase tracking-wide">
              Regarding Machine:
            </span>
            <span className="font-bold text-[#1b3a6e] text-sm">
              {form.productName}
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm((f) => ({ ...f, productId: undefined, productName: "" }))
            }
            className="text-gray-400 hover:text-red-500 text-xs font-semibold"
          >
            Clear
          </button>
        </div>
      )}

      {submitError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#1b3a6e] mb-1 uppercase tracking-wide">
            Full Name <span className="text-[#c8391a]">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Er. Ramesh Sharma"
            className={`w-full border px-3.5 py-2.5 text-sm outline-none rounded focus:border-[#1b3a6e] transition-colors ${
              errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1b3a6e] mb-1 uppercase tracking-wide">
            Email Address <span className="text-[#c8391a]">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="ramesh@company.com"
            className={`w-full border px-3.5 py-2.5 text-sm outline-none rounded focus:border-[#1b3a6e] transition-colors ${
              errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#1b3a6e] mb-1 uppercase tracking-wide">
            Phone Number <span className="text-[#c8391a]">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+977-98XXXXXXXX"
            className={`w-full border px-3.5 py-2.5 text-sm outline-none rounded focus:border-[#1b3a6e] transition-colors ${
              errors.phone ? "border-red-400 bg-red-50" : "border-gray-300"
            }`}
          />
          {errors.phone && (
            <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1b3a6e] mb-1 uppercase tracking-wide">
            Company / Organization (Optional)
          </label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            placeholder="e.g. Kathmandu Industrial Corp"
            className="w-full border border-gray-300 px-3.5 py-2.5 text-sm outline-none rounded focus:border-[#1b3a6e] transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#1b3a6e] mb-1 uppercase tracking-wide">
          Machinery Specifications / Requirements <span className="text-[#c8391a]">*</span>
        </label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Please describe capacity requirements (e.g. 50 MT Cold Room, 2000 LPH Water Plant), site dimensions, power availability, or preferred delivery timeframe..."
          className={`w-full border px-3.5 py-2.5 text-sm outline-none rounded focus:border-[#1b3a6e] transition-colors resize-none ${
            errors.message ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
        />
        {errors.message && (
          <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto bg-[#c8391a] hover:bg-[#a62d14] disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
      >
        {submitting ? "Submitting Quote Request..." : "Submit Quote Request"}
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </button>
    </form>
  );
}
