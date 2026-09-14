"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  adminFetch,
  AdminHeroSlide,
  unwrapAdminResults,
  getMediaUrl,
} from "@/lib/admin-api";

interface SlideFormData {
  id?: number;
  title: string;
  badge: string;
  heading: string;
  subtext: string;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  order: number;
  is_active: boolean;
  file?: File | null;
  current_image?: string | null;
}

const emptySlideForm: SlideFormData = {
  title: "",
  badge: "",
  heading: "",
  subtext: "",
  primary_cta_label: "Explore Machinery",
  primary_cta_link: "/products",
  secondary_cta_label: "Request a Quote",
  secondary_cta_link: "/contact-us#quote",
  order: 0,
  is_active: true,
  file: null,
  current_image: null,
};

export default function AdminHeroSlidesPage() {
  const { accessToken } = useAdminAuth();
  const [slides, setSlides] = useState<AdminHeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<SlideFormData>(emptySlideForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const data = await adminFetch<unknown>("admin/hero-slides/", {}, accessToken);
      setSlides(unwrapAdminResults<AdminHeroSlide>(data));
    } catch (err: unknown) {
      console.error("Failed to fetch hero slides:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load hero slides.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [accessToken]);

  const handleOpenCreate = () => {
    setFormData(emptySlideForm);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide: AdminHeroSlide) => {
    setFormData({
      id: slide.id,
      title: slide.title,
      badge: slide.badge || "",
      heading: slide.heading,
      subtext: slide.subtext || "",
      primary_cta_label: slide.primary_cta_label || "Explore Machinery",
      primary_cta_link: slide.primary_cta_link || "/products",
      secondary_cta_label: slide.secondary_cta_label || "Request a Quote",
      secondary_cta_link: slide.secondary_cta_link || "/contact-us#quote",
      order: slide.order,
      is_active: slide.is_active,
      file: null,
      current_image: slide.image_url || (slide.image as string | null),
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (!formData.heading.trim()) {
      setErrorMessage("Headline is required.");
      return;
    }

    if (!formData.id && !formData.file) {
      setErrorMessage("Please select a background photo for the hero slide.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = new FormData();
      payload.append("title", formData.title.trim() || formData.heading.trim());
      payload.append("badge", formData.badge);
      payload.append("heading", formData.heading.trim());
      payload.append("subtext", formData.subtext);
      payload.append("primary_cta_label", formData.primary_cta_label);
      payload.append("primary_cta_link", formData.primary_cta_link);
      payload.append("secondary_cta_label", formData.secondary_cta_label);
      payload.append("secondary_cta_link", formData.secondary_cta_link);
      payload.append("order", String(formData.order));
      payload.append("is_active", String(formData.is_active));

      if (formData.file) {
        payload.append("image", formData.file);
      }

      if (formData.id) {
        await adminFetch<AdminHeroSlide>(
          `admin/hero-slides/${formData.id}/`,
          {
            method: "PATCH",
            body: payload,
          },
          accessToken
        );
      } else {
        await adminFetch<AdminHeroSlide>(
          "admin/hero-slides/",
          {
            method: "POST",
            body: payload,
          },
          accessToken
        );
      }

      setIsModalOpen(false);
      await fetchSlides();
    } catch (err: unknown) {
      console.error("Failed to save hero slide:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to save hero slide.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    const confirm = window.confirm("Are you sure you want to delete this hero slide?");
    if (!confirm) return;

    try {
      setDeletingId(id);
      await adminFetch(`admin/hero-slides/${id}/`, { method: "DELETE" }, accessToken);
      setSlides((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      console.error("Failed to delete hero slide:", err);
      alert(err instanceof Error ? err.message : "Failed to delete slide.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Homepage Hero Slides</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage the dynamic hero banner carousel, background machinery photography, headlines, and call-to-action buttons.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Hero Slide</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMessage && !isModalOpen && (
        <div className="p-4 bg-red-900/40 border border-red-800 text-red-200 rounded-lg text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-[#0a0f1d] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#1b3a6e] border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-sm">Loading hero slides...</span>
          </div>
        ) : slides.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm">No hero slides found.</p>
            <p className="text-xs mt-1 text-slate-600">Click &quot;Add New Hero Slide&quot; to configure your homepage banner.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0d1424] text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Background Image</th>
                  <th className="py-3.5 px-4">Slide Content</th>
                  <th className="py-3.5 px-4">CTAs</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-24 h-14 rounded bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
                        {slide.image_url || slide.image ? (
                          <img
                            src={getMediaUrl(slide.image_url || (slide.image as string))}
                            alt={slide.heading}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-500 font-bold uppercase">No Img</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      {slide.badge && (
                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-[#c8391a] mb-0.5">
                          {slide.badge}
                        </span>
                      )}
                      <div className="font-semibold text-white text-sm line-clamp-1">{slide.heading}</div>
                      <div className="text-xs text-slate-400 line-clamp-2 mt-1">{slide.subtext}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-300">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-300 font-medium">
                          1: {slide.primary_cta_label} ({slide.primary_cta_link})
                        </span>
                        {slide.secondary_cta_label && (
                          <span className="text-slate-400">
                            2: {slide.secondary_cta_label} ({slide.secondary_cta_link})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-xs">{slide.order}</td>
                    <td className="py-3 px-4">
                      {slide.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(slide)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded bg-indigo-950/50 border border-indigo-800 hover:bg-indigo-900/50 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        disabled={deletingId === slide.id}
                        className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded bg-red-950/50 border border-red-800 hover:bg-red-900/50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {deletingId === slide.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#0e1628] border border-slate-700 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0f1d]">
              <h2 className="text-lg font-bold text-white">
                {formData.id ? "Edit Hero Slide" : "Create Hero Slide"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-900/50 border border-red-700 text-red-200 text-xs rounded">
                  {errorMessage}
                </div>
              )}

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Internal Slide Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Turnkey Industrial Machinery"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nepal's Premier Manufacturer"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Main Headline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Main Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineered Machinery & Turnkey Industrial Plants"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 font-bold"
                />
              </div>

              {/* Subtext */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subtext / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Specializing in cold storage facilities, water purification plants, automated dairy processing..."
                  value={formData.subtext}
                  onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Primary CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Primary Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.primary_cta_label}
                    onChange={(e) => setFormData({ ...formData, primary_cta_label: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Primary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.primary_cta_link}
                    onChange={(e) => setFormData({ ...formData, primary_cta_link: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Secondary CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Secondary Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.secondary_cta_label}
                    onChange={(e) => setFormData({ ...formData, secondary_cta_label: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Secondary Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.secondary_cta_link}
                    onChange={(e) => setFormData({ ...formData, secondary_cta_link: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                    />
                    <span>Active in hero slider</span>
                  </label>
                </div>
              </div>

              {/* Background Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hero Background Image {!formData.id && "*"}
                </label>
                <div className="flex items-center gap-4">
                  {formData.current_image && (
                    <div className="w-24 h-14 rounded bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                      <img
                        src={getMediaUrl(formData.current_image)}
                        alt="Current background preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData({ ...formData, file: e.target.files[0] });
                      }
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  High-resolution machinery or industrial plant photo (recommended 1920x1080).
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : formData.id ? "Update Slide" : "Create Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
