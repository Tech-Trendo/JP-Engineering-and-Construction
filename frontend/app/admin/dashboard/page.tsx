"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  adminFetch,
  AdminProduct,
  AdminQuote,
  AdminCategory,
} from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const { user, accessToken, isLoading: isAuthLoading } = useAdminAuth();
  const [productCount, setProductCount] = useState<number>(0);
  const [newQuotesCount, setNewQuotesCount] = useState<number>(0);
  const [totalQuotesCount, setTotalQuotesCount] = useState<number>(0);
  const [categoryCount, setCategoryCount] = useState<number>(0);
  const [recentQuotes, setRecentQuotes] = useState<AdminQuote[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;
    setIsLoadingStats(true);
    setError(null);

    Promise.all([
      adminFetch<AdminProduct[]>("admin/products/", {}, accessToken),
      adminFetch<AdminQuote[]>("admin/quotes/", {}, accessToken),
      adminFetch<AdminCategory[]>("admin/categories/", {}, accessToken),
    ])
      .then(([products, quotes, categories]) => {
        if (!isMounted) return;
        setProductCount(Array.isArray(products) ? products.length : 0);
        setCategoryCount(Array.isArray(categories) ? categories.length : 0);

        if (Array.isArray(quotes)) {
          setTotalQuotesCount(quotes.length);
          const newQuotes = quotes.filter((q) => q.status === "new");
          setNewQuotesCount(newQuotes.length);
          setRecentQuotes(quotes.slice(0, 5));
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Dashboard data fetch error:", err);
          setError("Failed to load dashboard metrics. Check backend connection.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingStats(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  if (isAuthLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center space-x-3 text-slate-400">
          <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium">Validating admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            System Overview
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Welcome, <span className="text-slate-200 font-medium">@{user?.username || "admin"}</span>. Administrative operations console for JP Engineering.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products?action=new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
          <Link
            href="/admin/quotes"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            Review Quotes
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products Count */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Products</span>
            <div className="text-2xl font-bold text-white mt-1">
              {isLoadingStats ? "..." : productCount}
            </div>
            <Link
              href="/admin/products"
              className="text-[11px] text-blue-400 hover:text-blue-300 mt-1 inline-block font-medium"
            >
              View catalog &rarr;
            </Link>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>

        {/* New Quotes Count */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">New Quote Inquiries</span>
              {newQuotesCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {isLoadingStats ? "..." : newQuotesCount}
            </div>
            <Link
              href="/admin/quotes?status=new"
              className="text-[11px] text-amber-400 hover:text-amber-300 mt-1 inline-block font-medium"
            >
              {newQuotesCount > 0 ? "Needs review &rarr;" : "All caught up"}
            </Link>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        </div>

        {/* Total Quotes Count */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Total Inquiries</span>
            <div className="text-2xl font-bold text-white mt-1">
              {isLoadingStats ? "..." : totalQuotesCount}
            </div>
            <Link
              href="/admin/quotes"
              className="text-[11px] text-slate-400 hover:text-slate-300 mt-1 inline-block font-medium"
            >
              View history &rarr;
            </Link>
          </div>
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>

        {/* Categories Count */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Categories</span>
            <div className="text-2xl font-bold text-white mt-1">
              {isLoadingStats ? "..." : categoryCount}
            </div>
            <Link
              href="/admin/categories"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 mt-1 inline-block font-medium"
            >
              Manage &rarr;
            </Link>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <h2 className="text-sm font-semibold text-white mb-3">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/products"
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/40 text-center transition group"
          >
            <span className="block text-xs font-medium text-slate-200 group-hover:text-blue-400">Products</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Catalog & Specs</span>
          </Link>
          <Link
            href="/admin/categories"
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/40 text-center transition group"
          >
            <span className="block text-xs font-medium text-slate-200 group-hover:text-emerald-400">Categories</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Taxonomy</span>
          </Link>
          <Link
            href="/admin/quotes"
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 text-center transition group"
          >
            <span className="block text-xs font-medium text-slate-200 group-hover:text-amber-400">Quotes</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Inquiries</span>
          </Link>
          <Link
            href="/admin/team"
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/40 text-center transition group"
          >
            <span className="block text-xs font-medium text-slate-200 group-hover:text-purple-400">Team</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Staff Profiles</span>
          </Link>
          <Link
            href="/admin/partners"
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/40 text-center transition group"
          >
            <span className="block text-xs font-medium text-slate-200 group-hover:text-sky-400">Partners</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Partner Logos</span>
          </Link>
          <Link
            href="/admin/clients"
            className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/40 text-center transition group"
          >
            <span className="block text-xs font-medium text-slate-200 group-hover:text-indigo-400">Clients</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Client References</span>
          </Link>
        </div>
      </div>

      {/* Recent Quotes Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Inquiries</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest submitted quote requests</p>
          </div>
          <Link
            href="/admin/quotes"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            View all quotes &rarr;
          </Link>
        </div>

        {isLoadingStats ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading recent quotes...</div>
        ) : recentQuotes.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No quote requests received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Requester</th>
                  <th className="px-5 py-3 font-semibold">Contact</th>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3 font-medium text-white whitespace-nowrap">
                      {quote.full_name}
                      {quote.company && (
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {quote.company}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-300">
                      <div>{quote.email}</div>
                      <div className="text-[11px] text-slate-500">{quote.phone}</div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-slate-300">
                      {quote.product_name ? (
                        <span className="text-blue-400">{quote.product_name}</span>
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
                      })}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/quotes?id=${quote.id}`}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
