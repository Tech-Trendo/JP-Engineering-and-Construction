"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  adminFetch,
  AdminProduct,
  AdminCategory,
} from "@/lib/admin-api";

interface LocalSpec {
  id?: number;
  label: string;
  value: string;
}

interface LocalImage {
  id?: number;
  file?: File | null;
  previewUrl: string;
  alt_text: string;
  is_primary: boolean;
}

interface ProductFormData {
  id?: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  category_ids: number[];
  is_active: boolean;
  is_featured: boolean;
  order: number;
  specifications: LocalSpec[];
  images: LocalImage[];
}

const emptyProductForm: ProductFormData = {
  name: "",
  slug: "",
  short_description: "",
  full_description: "",
  category_ids: [],
  is_active: true,
  is_featured: false,
  order: 0,
  specifications: [
    { label: "", value: "" },
  ],
  images: [],
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const { accessToken } = useAdminAuth();

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");

  // Form Drawer / Modal State
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProductFormData>(emptyProductForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Drag and drop image state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCatalog = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const [prods, cats] = await Promise.all([
        adminFetch<AdminProduct[]>("admin/products/", {}, accessToken),
        adminFetch<AdminCategory[]>("admin/categories/", {}, accessToken),
      ]);
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err: unknown) {
      console.error("Failed to load catalog data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, [accessToken]);

  // Handle ?action=new query param from quick links
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      handleOpenCreate();
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setFormData(emptyProductForm);
    setFormError(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (product: AdminProduct) => {
    setFormData({
      id: product.id,
      name: product.name,
      slug: product.slug,
      short_description: product.short_description || "",
      full_description: product.full_description || "",
      category_ids: product.categories.map((c) => c.id),
      is_active: product.is_active,
      is_featured: product.is_featured,
      order: product.order,
      specifications:
        product.specifications && product.specifications.length > 0
          ? product.specifications.map((s) => ({
              id: s.id,
              label: s.label,
              value: s.value,
            }))
          : [{ label: "", value: "" }],
      images:
        product.images && product.images.length > 0
          ? product.images.map((img) => ({
              id: img.id,
              previewUrl: typeof img.image === "string" ? img.image : "",
              alt_text: img.alt_text || "",
              is_primary: img.is_primary,
            }))
          : [],
    });
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Category Multi-select toggle
  const toggleCategory = (catId: number) => {
    setFormData((prev) => {
      const exists = prev.category_ids.includes(catId);
      return {
        ...prev,
        category_ids: exists
          ? prev.category_ids.filter((id) => id !== catId)
          : [...prev.category_ids, catId],
      };
    });
  };

  // Specifications repeaters
  const handleAddSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const handleRemoveSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (
    index: number,
    field: "label" | "value",
    val: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.specifications];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, specifications: updated };
    });
  };

  // Image Upload Handlers
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: LocalImage[] = [];
    const hasExistingPrimary = formData.images.some((img) => img.is_primary);

    Array.from(files).forEach((file, idx) => {
      const previewUrl = URL.createObjectURL(file);
      newImages.push({
        file,
        previewUrl,
        alt_text: file.name.replace(/\.[^/.]+$/, ""),
        is_primary: !hasExistingPrimary && idx === 0,
      });
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Reset input so re-selecting the same file works
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        is_primary: i === index,
      })),
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const removedWasPrimary = prev.images[index]?.is_primary;
      const filtered = prev.images.filter((_, i) => i !== index);
      if (removedWasPrimary && filtered.length > 0) {
        filtered[0].is_primary = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const handleImageAltChange = (index: number, alt_text: string) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index] = { ...updated[index], alt_text };
      return { ...prev, images: updated };
    });
  };

  // Drag & drop reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    setFormData((prev) => {
      const items = [...prev.images];
      const [draggedItem] = items.splice(draggedIndex, 1);
      items.splice(targetIndex, 0, draggedItem);
      return { ...prev, images: items };
    });
    setDraggedIndex(null);
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    setFormData((prev) => {
      const items = [...prev.images];
      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return prev;
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      return { ...prev, images: items };
    });
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      const payload = new FormData();
      payload.append("name", formData.name.trim());
      if (formData.slug.trim()) {
        payload.append("slug", formData.slug.trim());
      }
      payload.append("short_description", formData.short_description);
      payload.append("full_description", formData.full_description);
      payload.append("order", String(formData.order));
      payload.append("is_active", String(formData.is_active));
      payload.append("is_featured", String(formData.is_featured));

      // Categories as JSON array
      payload.append("category_ids", JSON.stringify(formData.category_ids));

      // Specifications
      const validSpecs = formData.specifications
        .filter((s) => s.label.trim() || s.value.trim())
        .map((s, idx) => ({
          label: s.label.trim(),
          value: s.value.trim(),
          order: idx,
        }));
      payload.append("specifications", JSON.stringify(validSpecs));

      // Images
      formData.images.forEach((img, idx) => {
        if (img.id) {
          payload.append(`images[${idx}]id`, String(img.id));
        }
        if (img.file) {
          payload.append(`images[${idx}]image`, img.file);
        } else if (img.previewUrl) {
          payload.append(`images[${idx}]image`, img.previewUrl);
        }
        payload.append(`images[${idx}]alt_text`, img.alt_text);
        payload.append(`images[${idx}]order`, String(idx));
        payload.append(`images[${idx}]is_primary`, String(img.is_primary));
      });

      if (formData.id) {
        await adminFetch(
          `admin/products/${formData.id}/`,
          {
            method: "PATCH",
            body: payload,
          },
          accessToken
        );
      } else {
        await adminFetch(
          "admin/products/",
          {
            method: "POST",
            body: payload,
          },
          accessToken
        );
      }

      setIsEditorOpen(false);
      await fetchCatalog();
    } catch (err: unknown) {
      console.error("Save product error:", err);
      setFormError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Are you sure you want to permanently delete this product and all associated images and specifications?")) {
      return;
    }

    try {
      setDeletingId(id);
      await adminFetch(`admin/products/${id}/`, { method: "DELETE" }, accessToken);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategoryId === "all" ||
      p.categories.some((c) => String(c.id) === filterCategoryId);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Products Catalog
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Manage heavy equipment items, multiple categories, technical specifications, and galleries.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <svg
            className="w-4 h-4 absolute left-3 top-2.5 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-blue-500"
          />
        </div>
        <div className="w-full sm:w-56">
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading products catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-300">No products found</p>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery || filterCategoryId !== "all"
                ? "Try adjusting your search query or category filter."
                : "Create your first equipment item to get started."}
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
            >
              + Create Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Image</th>
                  <th className="px-5 py-3 font-semibold">Product Name</th>
                  <th className="px-5 py-3 font-semibold">Categories</th>
                  <th className="px-5 py-3 font-semibold text-center">Specs</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((prod) => {
                  const primaryImg =
                    prod.images?.find((img) => img.is_primary)?.image ||
                    prod.images?.[0]?.image;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3 whitespace-nowrap">
                        {primaryImg && typeof primaryImg === "string" ? (
                          <img
                            src={primaryImg}
                            alt={prod.name}
                            className="h-10 w-10 rounded-lg object-cover bg-slate-800 border border-slate-700"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-[10px]">
                            No Img
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="font-semibold text-white">{prod.name}</div>
                        <div className="font-mono text-[11px] text-slate-400">{prod.slug}</div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {prod.categories && prod.categories.length > 0 ? (
                            prod.categories.map((cat) => (
                              <span
                                key={cat.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap"
                              >
                                {cat.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center whitespace-nowrap">
                        <span className="font-mono text-slate-300">
                          {prod.specifications?.length || 0}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                              prod.is_active
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-700/40 text-slate-400 border border-slate-600/40"
                            }`}
                          >
                            {prod.is_active ? "Active" : "Inactive"}
                          </span>
                          {prod.is_featured && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-slate-400 text-[11px]">
                        {new Date(prod.updated_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(prod)}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id)}
                          disabled={deletingId === prod.id}
                          className="text-xs font-semibold text-red-400 hover:text-red-300 transition disabled:opacity-50"
                        >
                          {deletingId === prod.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full-Feature Product Editor Modal / Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
              <div>
                <h2 className="text-base font-bold text-white">
                  {formData.id ? `Edit Product: ${formData.name}` : "Create New Product"}
                </h2>
                <p className="text-xs text-slate-400">
                  Configure details, multiple categories, dynamic specifications, and reorderable images.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {formError && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300">
                  {formError}
                </div>
              )}

              <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Basic Fields */}
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
                    1. Basic Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Product Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hydraulic Excavator JP-500"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Slug <span className="text-slate-500 font-normal">(optional, auto-derived from name)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. hydraulic-excavator-jp-500"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Short Description</label>
                    <textarea
                      rows={2}
                      placeholder="One or two sentences summarizing this machinery for listings..."
                      value={formData.short_description}
                      onChange={(e) =>
                        setFormData({ ...formData, short_description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Full Description</label>
                    <textarea
                      rows={4}
                      placeholder="Comprehensive product overview, engineering features, applications..."
                      value={formData.full_description}
                      onChange={(e) =>
                        setFormData({ ...formData, full_description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Display Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center sm:pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) =>
                            setFormData({ ...formData, is_active: e.target.checked })
                          }
                          className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 h-4 w-4"
                        />
                        <span className="text-slate-200 font-medium text-xs">Active in Catalog</span>
                      </label>
                    </div>

                    <div className="flex items-center sm:pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_featured}
                          onChange={(e) =>
                            setFormData({ ...formData, is_featured: e.target.checked })
                          }
                          className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 h-4 w-4"
                        />
                        <span className="text-slate-200 font-medium text-xs">Featured Item</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Multi-Select Categories */}
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-semibold text-slate-200">
                      2. Categories (Multi-Select)
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Selected: {formData.category_ids.length}
                    </span>
                  </div>

                  {categories.length === 0 ? (
                    <p className="text-slate-500 italic">
                      No categories available. Please create categories first.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                      {categories.map((cat) => {
                        const isSelected = formData.category_ids.includes(cat.id);
                        return (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => toggleCategory(cat.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition ${
                              isSelected
                                ? "bg-blue-600/20 border-blue-500 text-blue-300 font-semibold"
                                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                            }`}
                          >
                            <span
                              className={`h-3 w-3 rounded-xs border flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-blue-500 border-blue-400" : "border-slate-600"
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <span className="truncate">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 3. Dynamic Specifications Rows */}
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        3. Technical Specifications
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Add repeatable label/value pairs (e.g. Operating Weight, Bucket Capacity).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold border border-slate-700 transition"
                    >
                      + Add Specification
                    </button>
                  </div>

                  <div className="space-y-2 pt-1">
                    {formData.specifications.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 text-[11px] w-6 text-right">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Specification Label (e.g. Capacity)"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Value (e.g. 500 bottles/hour, 22.5 Tons)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          className="p-1.5 rounded-md text-red-400 hover:text-red-300 hover:bg-red-950/40"
                          title="Remove row"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Multi-Image Upload with Drag Reorder & Primary Toggle */}
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        4. Product Images Gallery
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Drag cards to reorder or use the arrow controls. Toggle radio to set the primary thumbnail.
                      </p>
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFilesSelected}
                        className="hidden"
                        id="multiImageInput"
                      />
                      <label
                        htmlFor="multiImageInput"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-sm transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        + Upload Images
                      </label>
                    </div>
                  </div>

                  {formData.images.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-8 text-center cursor-pointer transition"
                    >
                      <svg className="w-8 h-8 text-slate-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-slate-300 font-medium">Click to upload product images</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, WebP. Multiple selection enabled.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(idx)}
                          className={`relative rounded-xl border p-3 bg-slate-900 transition flex flex-col justify-between ${
                            img.is_primary
                              ? "border-blue-500 shadow-md ring-1 ring-blue-500/50"
                              : "border-slate-800 hover:border-slate-700"
                          } ${draggedIndex === idx ? "opacity-40" : ""}`}
                        >
                          <div>
                            {/* Card Top Badges & Actions */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                                #{idx + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(idx, "left")}
                                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                    title="Move left"
                                  >
                                    &larr;
                                  </button>
                                )}
                                {idx < formData.images.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleMoveImage(idx, "right")}
                                    className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                    title="Move right"
                                  >
                                    &rarr;
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-1 rounded bg-slate-800 text-red-400 hover:text-red-300 hover:bg-red-950/40 ml-1"
                                  title="Remove image"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Image Thumbnail */}
                            <div className="relative h-32 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800 mb-2.5">
                              <img
                                src={img.previewUrl}
                                alt={img.alt_text || "Product image"}
                                className="h-full w-full object-cover"
                              />
                              {img.is_primary && (
                                <span className="absolute top-2 left-2 bg-blue-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md shadow-md">
                                  Primary Image
                                </span>
                              )}
                            </div>

                            {/* Alt Text Input */}
                            <input
                              type="text"
                              placeholder="Alt text..."
                              value={img.alt_text}
                              onChange={(e) => handleImageAltChange(idx, e.target.value)}
                              className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] focus:outline-hidden focus:border-blue-500 mb-2"
                            />
                          </div>

                          {/* Set Primary Button */}
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className={`w-full py-1 rounded-md text-[11px] font-medium transition ${
                              img.is_primary
                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 cursor-default"
                                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                            }`}
                          >
                            {img.is_primary ? "✓ Primary" : "Set as Primary"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                form="productForm"
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving Product..." : formData.id ? "Update Product" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-slate-400">
          Loading catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
