"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { LOGO_URL } from "@/lib/constants";

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
    <div className="flex min-h-screen items-center justify-center bg-[#070d19] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-[#0a0f1d] p-8 shadow-2xl text-white">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white p-1.5 border border-slate-700 shadow-md">
            <img src={LOGO_URL} alt="JP Engineering" className="h-full w-full object-contain" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Sign in with authorized staff credentials
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-800/80 bg-red-950/40 p-4 text-xs text-red-300"
          >
            <p className="font-semibold">Authentication Error</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-slate-300"
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
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 shadow-sm text-white placeholder-slate-500 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 text-xs"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2.5 shadow-sm text-white placeholder-slate-500 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600 text-xs"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-lg bg-blue-700 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
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
        </form>
      </div>
    </div>
  );
}
