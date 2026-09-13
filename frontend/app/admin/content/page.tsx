"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  getAdminSiteContent,
  updateAdminSiteContent,
  AdminSiteContent,
} from "@/lib/admin-api";

export default function AdminContentPage() {
  const { accessToken } = useAdminAuth();

  const [title, setTitle] = useState("");
  const [shortIntro, setShortIntro] = useState("");
  const [fullIntro, setFullIntro] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (!accessToken) return;
    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getAdminSiteContent(accessToken)
      .then((data) => {
        if (!isMounted) return;
        setTitle(data.title || "");
        setShortIntro(data.short_intro || "");
        setFullIntro(data.full_intro || "");
        setUpdatedAt(data.updated_at || null);
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error("Failed to fetch admin site content:", err);
          setErrorMessage(
            err instanceof Error ? err.message : "Failed to load corporate content."
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage("Site / Corporate Title cannot be empty.");
      return;
    }
    if (!shortIntro.trim()) {
      setErrorMessage("Home Page Short Introduction cannot be empty.");
      return;
    }
    if (!fullIntro.trim()) {
      setErrorMessage("Full Corporate Introduction cannot be empty.");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateAdminSiteContent(accessToken, {
        title: title.trim(),
        short_intro: shortIntro.trim(),
        full_intro: fullIntro.trim(),
      });

      setTitle(updated.title);
      setShortIntro(updated.short_intro);
      setFullIntro(updated.full_intro);
      setUpdatedAt(updated.updated_at || new Date().toISOString());
      setSuccessMessage("Corporate introduction copy has been saved successfully!");
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to update corporate content."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fullIntroParagraphs = fullIntro
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (isLoading) {
    return (
      <div className="py-20 text-center font-mono text-xs text-slate-400">
        Loading corporate content editor...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Corporate Introduction CMS
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Site Introduction Content
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit the homepage introduction summary and the comprehensive multi-paragraph company profile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about/introduction"
            target="_blank"
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            View Live Page &rarr;
          </Link>
        </div>
      </div>

      {/* Status Alerts */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center justify-between">
          <span>✓ {successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-200 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center justify-between">
          <span>⚠ {errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-red-200 font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Editor / Preview Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab("edit")}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeTab === "edit"
              ? "bg-blue-700 text-white shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          Editor Form
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            activeTab === "preview"
              ? "bg-blue-700 text-white shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
          }`}
        >
          Live Preview ({fullIntroParagraphs.length} Paragraphs)
        </button>
        {updatedAt && (
          <span className="ml-auto font-mono text-[10px] text-slate-500">
            Last updated: {new Date(updatedAt).toLocaleString()}
          </span>
        )}
      </div>

      {activeTab === "edit" ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Corporate Title Field */}
          <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Corporate / Legal Entity Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="JP Engineering & Construction (P) Ltd."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                The official company name rendered in heading bars and metadata.
              </span>
            </div>
          </div>

          {/* Home Page Short Version */}
          <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-white">
                  Home Page Short Introduction
                </label>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Appears in Section 2 on the home page with the &quot;Read Full Company Profile&quot; link.
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {shortIntro.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={4}
              required
              value={shortIntro}
              onChange={(e) => setShortIntro(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed placeholder-slate-500 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Full Page Long Version */}
          <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-semibold text-white">
                  Full Corporate Introduction (/about/introduction)
                </label>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Separate paragraphs with blank lines. Each paragraph will be rendered as a dedicated card on the public page.
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                {fullIntroParagraphs.length} paragraphs • {fullIntro.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              rows={14}
              required
              value={fullIntro}
              onChange={(e) => setFullIntro(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed font-mono placeholder-slate-500 focus:border-blue-600 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        /* Live Preview Tab */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">
              Home Page Preview
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {shortIntro}
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">
              Full /about/introduction Page Paragraphs ({fullIntroParagraphs.length})
            </span>
            {fullIntroParagraphs.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#0a0f1d] border border-slate-800 space-y-1.5"
              >
                <span className="text-[10px] font-mono text-blue-400 font-bold">
                  Paragraph #{idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
