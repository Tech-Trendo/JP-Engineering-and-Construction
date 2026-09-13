"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminFetch, AdminPartner, unwrapAdminResults, getMediaUrl } from "@/lib/admin-api";

interface PartnerFormData {
  id?: number;
  name: string;
  website_url: string;
  order: number;
  is_active: boolean;
  file?: File | null;
  current_logo?: string | null;
}

const emptyPartnerForm: PartnerFormData = {
  name: "",
  website_url: "",
  order: 0,
  is_active: true,
  file: null,
  current_logo: null,
};

export default function AdminPartnersPage() {
  const { accessToken } = useAdminAuth();
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<PartnerFormData>(emptyPartnerForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPartners = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const data = await adminFetch<unknown>("admin/partners/", {}, accessToken);
      setPartners(unwrapAdminResults<AdminPartner>(data));
    } catch (err: unknown) {
      console.error("Failed to load partners:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load partners.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [accessToken]);

  const handleOpenCreate = () => {
    setFormData(emptyPartnerForm);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (partner: AdminPartner) => {
    setFormData({
      id: partner.id,
      name: partner.name,
      website_url: partner.website_url || "",
      order: partner.order,
      is_active: partner.is_active,
      file: null,
      current_logo: partner.logo,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (!formData.name.trim()) {
      setErrorMessage("Partner name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("website_url", formData.website_url.trim());
      payload.append("order", String(formData.order));
      payload.append("is_active", String(formData.is_active));

      if (formData.file) {
        payload.append("logo", formData.file);
      }

      if (formData.id) {
        await adminFetch(
          `admin/partners/${formData.id}/`,
          {
            method: "PATCH",
            body: payload,
          },
          accessToken
        );
      } else {
        await adminFetch(
          "admin/partners/",
          {
            method: "POST",
            body: payload,
          },
          accessToken
        );
      }

      setIsModalOpen(false);
      await fetchPartners();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save partner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Are you sure you want to remove this partner?")) return;

    try {
      setDeletingId(id);
      await adminFetch(`admin/partners/${id}/`, { method: "DELETE" }, accessToken);
      setPartners((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete partner.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Partners
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Manage technology suppliers, equipment partners, and manufacturer logos.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Partner
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading partners...</div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-300">No partners found</p>
            <p className="text-xs text-slate-500 mt-1">Add your equipment and component manufacturing partners.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
            >
              + Add Partner
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Logo</th>
                  <th className="px-5 py-3 font-semibold">Partner Name</th>
                  <th className="px-5 py-3 font-semibold">Website</th>
                  <th className="px-5 py-3 font-semibold text-center">Order</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3 whitespace-nowrap">
                      {partner.logo ? (
                        <img
                          src={getMediaUrl(partner.logo)}
                          alt={partner.name}
                          className="h-9 w-16 rounded-md object-contain bg-slate-950 p-1 border border-slate-800"
                        />
                      ) : (
                        <div className="h-9 w-16 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                          LOGO
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-white whitespace-nowrap">
                      {partner.name}
                    </td>
                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                      {partner.website_url ? (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span className="truncate max-w-[200px]">{partner.website_url}</span>
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center whitespace-nowrap font-mono text-slate-300">
                      {partner.order}
                    </td>
                    <td className="px-5 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          partner.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700/40 text-slate-400 border border-slate-600/40"
                        }`}
                      >
                        {partner.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(partner)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(partner.id)}
                        disabled={deletingId === partner.id}
                        className="text-xs font-semibold text-red-400 hover:text-red-300 transition disabled:opacity-50"
                      >
                        {deletingId === partner.id ? "Deleting..." : "Delete"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                {formData.id ? "Edit Partner" : "Add Partner"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Partner / Brand Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Caterpillar, Komatsu, Bosch"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://partner-company.com"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Logo Upload</label>
                {formData.current_logo && !formData.file && (
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={getMediaUrl(formData.current_logo)}
                      alt="Current logo"
                      className="h-8 w-14 rounded-md object-contain bg-slate-950 p-1 border border-slate-700"
                    />
                    <span className="text-[11px] text-slate-400">Current logo uploaded</span>
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
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-blue-500"
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
                      className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 h-4 w-4"
                    />
                    <span className="text-slate-200 font-medium text-xs">Active Status</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : formData.id ? "Update Partner" : "Create Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
