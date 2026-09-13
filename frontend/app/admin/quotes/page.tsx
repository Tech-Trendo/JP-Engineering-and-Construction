"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminFetch, AdminQuote, unwrapAdminResults } from "@/lib/admin-api";

type QuoteStatusFilter = "all" | "new" | "contacted" | "closed";
type DateSortOrder = "desc" | "asc";

function QuotesContent() {
  const searchParams = useSearchParams();
  const { accessToken } = useAdminAuth();

  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<QuoteStatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<DateSortOrder>("desc");
  const [selectedQuote, setSelectedQuote] = useState<AdminQuote | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [statusUpdateMessage, setStatusUpdateMessage] = useState<string | null>(null);

  const fetchQuotes = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const endpoint =
        statusFilter === "all"
          ? "admin/quotes/"
          : `admin/quotes/?status=${statusFilter}`;
      const data = await adminFetch<unknown>(endpoint, {}, accessToken);
      setQuotes(unwrapAdminResults<AdminQuote>(data));
    } catch (err: unknown) {
      console.error("Failed to load quotes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync with searchParams on mount
  useEffect(() => {
    const initialStatus = searchParams.get("status") as QuoteStatusFilter;
    if (initialStatus && ["new", "contacted", "closed"].includes(initialStatus)) {
      setStatusFilter(initialStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchQuotes();
  }, [accessToken, statusFilter]);

  // Handle ?id=... from dashboard or external links
  useEffect(() => {
    const targetId = searchParams.get("id");
    if (targetId && quotes.length > 0) {
      const match = quotes.find((q) => String(q.id) === targetId);
      if (match) setSelectedQuote(match);
    }
  }, [searchParams, quotes]);

  const handleUpdateStatus = async (newStatus: "new" | "contacted" | "closed") => {
    if (!selectedQuote || !accessToken) return;
    try {
      setIsUpdatingStatus(true);
      setStatusUpdateMessage(null);
      const updated = await adminFetch<AdminQuote>(
        `admin/quotes/${selectedQuote.id}/`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        },
        accessToken
      );

      setSelectedQuote(updated);
      setQuotes((prev) =>
        prev.map((q) => (q.id === updated.id ? updated : q))
      );
      setStatusUpdateMessage(`Status updated to "${newStatus.toUpperCase()}".`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Sort quotes by date
  const sortedQuotes = [...quotes].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Quote Inquiries
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Review incoming prospective client inquiries and update consultation lifecycle status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Date: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {(["all", "new", "contacted", "closed"] as QuoteStatusFilter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              statusFilter === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {tab === "all" ? "All Inquiries" : tab}
          </button>
        ))}
      </div>

      {/* Quotes Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading quote inquiries...</div>
        ) : sortedQuotes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-300">No quote requests found</p>
            <p className="text-xs text-slate-500 mt-1">
              {statusFilter !== "all"
                ? `No requests currently marked with status "${statusFilter}".`
                : "No customer inquiries have been submitted yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Requester Name</th>
                  <th className="px-5 py-3 font-semibold">Email & Phone</th>
                  <th className="px-5 py-3 font-semibold">Product Requested</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Submitted Date</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="font-semibold text-white">{quote.full_name}</div>
                      {quote.company && (
                        <div className="text-[11px] text-slate-400 font-normal">{quote.company}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div>
                        <a
                          href={`mailto:${quote.email}`}
                          className="text-blue-400 hover:underline"
                        >
                          {quote.email}
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-400">{quote.phone}</div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      {quote.product_name ? (
                        <span className="font-medium text-slate-200">
                          {quote.product_name}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">General Inquiry</span>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          quote.status === "new"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : quote.status === "contacted"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                            : "bg-slate-700/40 text-slate-400 border border-slate-600/40"
                        }`}
                      >
                        {quote.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-400 text-[11px]">
                      {new Date(quote.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right">
                      <button
                        onClick={() => {
                          setSelectedQuote(quote);
                          setStatusUpdateMessage(null);
                        }}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                      >
                        View & Update &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quote Detail View Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 text-xs">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Inquiry #{selectedQuote.id}
                </span>
                <h2 className="text-base font-bold text-white mt-0.5">
                  Quote Details
                </h2>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {statusUpdateMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs">
                {statusUpdateMessage}
              </div>
            )}

            {/* Requester Info Card */}
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 text-[11px] block">Requester Name</span>
                  <span className="font-semibold text-white text-xs">{selectedQuote.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Company</span>
                  <span className="text-slate-300 text-xs">{selectedQuote.company || "N/A"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 text-[11px] block">Email Address</span>
                  <a
                    href={`mailto:${selectedQuote.email}`}
                    className="text-blue-400 hover:underline text-xs"
                  >
                    {selectedQuote.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Phone Number</span>
                  <a
                    href={`tel:${selectedQuote.phone}`}
                    className="text-slate-300 hover:text-white text-xs"
                  >
                    {selectedQuote.phone}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 text-[11px] block">Target Equipment</span>
                <span className="text-slate-200 font-medium text-xs">
                  {selectedQuote.product_name || "General inquiry (no specific model)"}
                </span>
              </div>
            </div>

            {/* Inquiry Message */}
            <div>
              <span className="text-slate-400 text-xs font-semibold block mb-1.5">
                Submitted Message / Request:
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedQuote.message}
              </div>
            </div>

            {/* Status Selector */}
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block">
                  Workflow Status:
                </label>
                <span className="text-[11px] text-slate-500">
                  Update to track outreach progress.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  disabled={isUpdatingStatus}
                  value={selectedQuote.status}
                  onChange={(e) =>
                    handleUpdateStatus(e.target.value as "new" | "contacted" | "closed")
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 cursor-pointer"
                >
                  <option value="new">NEW (Unread / Needs Action)</option>
                  <option value="contacted">CONTACTED (In Discussion)</option>
                  <option value="closed">CLOSED (Completed)</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-500">
              <span>
                Received: {new Date(selectedQuote.created_at).toLocaleString()}
              </span>
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminQuotesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-400">
          Loading quotes...
        </div>
      }
    >
      <QuotesContent />
    </Suspense>
  );
}
