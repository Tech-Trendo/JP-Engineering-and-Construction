"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login(username, password);

      if (result.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Authentication failed. Please verify credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative brand elements */}
      <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-[#0f2347] to-[#1b3a6e] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8 rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f2347] border border-[#1b3a6e] shadow-md shadow-[#0f2347]/20">
            <span className="text-white font-black text-2xl tracking-tighter">JP</span>
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
            Staff Portal Sign In
          </h2>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            JP Engineering &amp; Construction CMS
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700"
          >
            <p className="font-bold flex items-center gap-1.5">
              <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Authentication Error
            </p>
            <p className="mt-1 text-slate-600">{error}</p>
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter staff username"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 shadow-2xs text-slate-900 placeholder:text-slate-400 focus:border-[#1b3a6e] focus:outline-hidden focus:ring-2 focus:ring-[#1b3a6e]/15 text-xs transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 shadow-2xs text-slate-900 placeholder:text-slate-400 focus:border-[#1b3a6e] focus:outline-hidden focus:ring-2 focus:ring-[#1b3a6e]/15 text-xs transition-colors"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-[#1b3a6e]/20 transition-all focus:outline-hidden focus:ring-2 focus:ring-[#1b3a6e]/20 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                  Authenticating...
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#1b3a6e] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Public Website
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
