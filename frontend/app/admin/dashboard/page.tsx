"use client";

import React from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminDashboardPage() {
  const { user, accessToken, isLoading, logout } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center space-x-3 text-gray-500">
          <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-medium">Validating admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 dark:border-gray-800 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back to the JP Engineering & Construction administration portal.
          </p>
        </div>
        <div>
          <button
            onClick={() => logout()}
            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Session Verification Status Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 dark:border-emerald-900/50 dark:bg-emerald-950/30">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-emerald-600 p-2 text-white">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-emerald-950 dark:text-emerald-300">
              Authenticated Staff Session Active
            </h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-400">
              Your access token is kept strictly in-memory. Refreshing the browser automatically preserves your session using the secure httpOnly cookie.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-white/80 px-2.5 py-1 font-mono text-emerald-900 shadow-sm dark:bg-gray-900 dark:text-emerald-300">
                Staff Status: {user?.is_staff ? "Authorized (is_staff=True)" : "Active"}
              </span>
              <span className="rounded-md bg-white/80 px-2.5 py-1 font-mono text-emerald-900 shadow-sm dark:bg-gray-900 dark:text-emerald-300">
                User: {user?.username || "Staff Administrator"}
              </span>
              <span className="rounded-md bg-white/80 px-2.5 py-1 font-mono text-emerald-900 shadow-sm dark:bg-gray-900 dark:text-emerald-300">
                Access Token: {accessToken ? "Loaded in Memory" : "Refreshing..."}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Management Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Products & Categories
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage catalog items, images, and flexible specifications.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quote Inquiries
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Review customer quote requests and update status.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Showcase & Partners
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Manage team profiles, partner logos, and client references.
          </p>
        </div>
      </div>
    </div>
  );
}
