"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminFetch, AdminCategory, unwrapAdminResults, getMediaUrl } from "@/lib/admin-api";

interface CategoryFormData {
  id?: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  is_active: boolean;
  file?: File | null;
  current_image?: string | null;
}

const emptyCategoryForm: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  order: 0,
  is_active: true,
  file: null,
  current_image: null,
};

export default function AdminCategoriesPage() {
  const { accessToken } = useAdminAuth();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<CategoryFormData>(emptyCategoryForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const data = await adminFetch<unknown>("admin/categories/", {}, accessToken);
      setCategories(unwrapAdminResults<AdminCategory>(data));
    } catch (err: unknown) {
      console.error("Failed to fetch categories:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [accessToken]);

  const handleOpenCreate = () => {
    setFormData(emptyCategoryForm);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: AdminCategory) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      order: category.order,
      is_active: category.is_active,
      file: null,
      current_image: category.icon_or_image,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (!formData.name.trim()) {
      setErrorMessage("Category name is required.");
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

      if (formData.file) {
        payload.append("icon_or_image", formData.file);
      }

      if (formData.id) {
        // Update
        await adminFetch<AdminCategory>(
          `admin/categories/${formData.id}/`,
          {
            method: "PATCH",
            body: payload,
          },
          accessToken
        );
      } else {
        // Create
        await adminFetch<AdminCategory>(
          "admin/categories/",
          {
            method: "POST",
            body: payload,
          },
          accessToken
        );
      }

      setIsModalOpen(false);
      setFormData(emptyCategoryForm);
      await fetchCategories();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Are you sure you want to delete this category? Products linked to it will remain, but will lose this category tag.")) {
      return;
    }

    try {
      setDeletingId(id);
      await adminFetch(`admin/categories/${id}/`, { method: "DELETE" }, accessToken);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete category.");
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
            Categories
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage product classifications and catalog taxonomy.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">No categories found</p>
            <p className="text-xs text-slate-500 mt-1">Get started by creating your first product category.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              + Create Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Icon / Image</th>
                  <th className="px-5 py-3.5">Category Name</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5 text-center">Order</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {cat.icon_or_image ? (
                        <img
                          src={getMediaUrl(cat.icon_or_image)}
                          alt={cat.name}
                          className="h-9 w-9 rounded-lg object-cover bg-slate-100 border border-slate-200"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                          CAT
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {cat.name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {cat.slug}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                      {cat.description || <span className="text-slate-400 italic">No description</span>}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap font-mono text-slate-600 font-medium">
                      {cat.order}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          cat.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right space-x-3">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="text-xs font-semibold text-[#1b3a6e] hover:text-[#152e57] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deletingId === cat.id}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        {deletingId === cat.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Earthmoving Equipment"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Slug <span className="text-slate-400 font-normal">(optional, auto-generated from name)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. earthmoving-equipment"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 font-mono text-[11px] shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this product classification..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Icon or Image</label>
                {formData.current_image && !formData.file && (
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={getMediaUrl(formData.current_image)}
                      alt="Current"
                      className="h-10 w-10 rounded-md object-cover border border-slate-200 bg-slate-100"
                    />
                    <span className="text-[11px] text-slate-500">Current file uploaded</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, file });
                  }}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                  />
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="rounded border-slate-300 text-[#1b3a6e] focus:ring-0 h-4 w-4"
                    />
                    <span className="text-slate-800 font-medium text-xs">Active Status</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : formData.id ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
