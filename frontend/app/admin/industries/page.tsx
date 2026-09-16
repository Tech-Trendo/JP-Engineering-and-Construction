"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  adminFetch,
  AdminIndustry,
  AdminCategory,
  unwrapAdminResults,
  getMediaUrl,
} from "@/lib/admin-api";

interface IndustryFormData {
  id?: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  is_active: boolean;
  categories: number[];
  file?: File | null;
  current_image?: string | null;
}

const emptyIndustryForm: IndustryFormData = {
  name: "",
  slug: "",
  description: "",
  order: 0,
  is_active: true,
  categories: [],
  file: null,
  current_image: null,
};

export default function AdminIndustriesPage() {
  const { accessToken } = useAdminAuth();
  const [industries, setIndustries] = useState<AdminIndustry[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<IndustryFormData>(emptyIndustryForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const [indsData, catsData] = await Promise.all([
        adminFetch<unknown>("admin/industries/", {}, accessToken),
        adminFetch<unknown>("admin/categories/", {}, accessToken),
      ]);
      setIndustries(unwrapAdminResults<AdminIndustry>(indsData));
      setCategories(unwrapAdminResults<AdminCategory>(catsData));
    } catch (err: unknown) {
      console.error("Failed to fetch industries data:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load industries.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const handleOpenCreate = () => {
    setFormData(emptyIndustryForm);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ind: AdminIndustry) => {
    setFormData({
      id: ind.id,
      name: ind.name,
      slug: ind.slug,
      description: ind.description || "",
      order: ind.order,
      is_active: ind.is_active,
      categories: ind.categories || [],
      file: null,
      current_image: ind.icon_or_image_url || (ind.icon_or_image as string | null),
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const toggleCategorySelection = (catId: number) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(catId);
      if (exists) {
        return { ...prev, categories: prev.categories.filter((id) => id !== catId) };
      } else {
        return { ...prev, categories: [...prev.categories, catId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (!formData.name.trim()) {
      setErrorMessage("Industry name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = new FormData();
      payload.append("name", formData.name.trim());
      if (formData.slug.trim()) {
        payload.append("slug", formData.slug.trim());
      }
      payload.append("description", formData.description);
      payload.append("order", String(formData.order));
      payload.append("is_active", String(formData.is_active));

      // Append selected category IDs
      formData.categories.forEach((catId) => {
        payload.append("categories", String(catId));
      });

      if (formData.file) {
        payload.append("icon_or_image", formData.file);
      }

      if (formData.id) {
        await adminFetch<AdminIndustry>(
          `admin/industries/${formData.id}/`,
          {
            method: "PATCH",
            body: payload,
          },
          accessToken
        );
      } else {
        await adminFetch<AdminIndustry>(
          "admin/industries/",
          {
            method: "POST",
            body: payload,
          },
          accessToken
        );
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err: unknown) {
      console.error("Failed to save industry:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to save industry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    const confirm = window.confirm(
      "Are you sure you want to delete this industry sector? Products will not be deleted, only unlinked."
    );
    if (!confirm) return;

    try {
      setDeletingId(id);
      await adminFetch(`admin/industries/${id}/`, { method: "DELETE" }, accessToken);
      setIndustries((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      console.error("Failed to delete industry:", err);
      alert(err instanceof Error ? err.message : "Failed to delete industry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Industries &amp; Sectors
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Configure industrial sectors (e.g. Dairy &amp; Milk, Fruits &amp; Agro, Beverages &amp; Water)
            and group machinery categories and products.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Industry</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {errorMessage && !isModalOpen && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-800">
            &times;
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#1b3a6e] border-t-transparent rounded-full animate-spin mb-3" />
            <span>Loading industries...</span>
          </div>
        ) : industries.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm font-bold text-slate-800">No industry sectors found.</p>
            <p className="text-xs mt-1 text-slate-500">Click &quot;Add New Industry&quot; to create your first sector.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-5">Image</th>
                  <th className="py-3.5 px-5">Sector Name</th>
                  <th className="py-3.5 px-5">Categories</th>
                  <th className="py-3.5 px-5">Products</th>
                  <th className="py-3.5 px-5">Order</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {industries.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="w-12 h-10 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                        {ind.icon_or_image_url || ind.icon_or_image ? (
                          <img
                            src={getMediaUrl(ind.icon_or_image_url || (ind.icon_or_image as string))}
                            alt={ind.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase">No Img</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      <div>{ind.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">/{ind.slug}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {ind.categories_details && ind.categories_details.length > 0 ? (
                          ind.categories_details.map((c) => (
                            <span
                              key={c.id}
                              className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                            >
                              {c.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None linked</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-700">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1b3a6e] border border-blue-200">
                        {ind.products_count ?? 0} machines
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 font-mono text-xs font-medium">{ind.order}</td>
                    <td className="py-3.5 px-5">
                      {ind.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-3">
                      <button
                        onClick={() => handleOpenEdit(ind)}
                        className="text-xs font-semibold text-[#1b3a6e] hover:text-[#152e57] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ind.id)}
                        disabled={deletingId === ind.id}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {deletingId === ind.id ? "Deleting..." : "Delete"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id ? "Edit Industry Sector" : "Create Industry Sector"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-xl leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Industry Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dairy & Milk Industry"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Slug <span className="text-slate-400 font-normal">(Optional - auto generated if blank)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. dairy-milk-industry"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 font-mono text-[11px] shadow-2xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the machinery, turnkey plants, and applications for this industry..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                />
              </div>

              {/* Categories Assignment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Linked Machinery Categories
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                  {categories.map((cat) => {
                    const isChecked = formData.categories.includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-2.5 p-2 rounded-lg text-xs cursor-pointer transition-colors border ${
                          isChecked
                            ? "bg-[#1b3a6e] border-[#1b3a6e] text-white font-semibold shadow-2xs"
                            : "bg-white border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategorySelection(cat.id)}
                          className="rounded text-[#1b3a6e] focus:ring-0"
                        />
                        <span className="truncate">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Products in these categories will automatically appear under this industry tab.
                </p>
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-[#1b3a6e] focus:ring-0"
                    />
                    <span>Active on site</span>
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sector Image / Thumbnail
                </label>
                <div className="flex items-center gap-4">
                  {formData.current_image && (
                    <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={getMediaUrl(formData.current_image)}
                        alt="Preview"
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
                    className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : formData.id ? "Update Industry" : "Create Industry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
