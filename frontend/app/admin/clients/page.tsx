"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminFetch, AdminClient, unwrapAdminResults, getMediaUrl } from "@/lib/admin-api";

interface ClientFormData {
  id?: number;
  name: string;
  website_url: string;
  order: number;
  is_active: boolean;
  file?: File | null;
  current_logo?: string | null;
}

const emptyClientForm: ClientFormData = {
  name: "",
  website_url: "",
  order: 0,
  is_active: true,
  file: null,
  current_logo: null,
};

export default function AdminClientsPage() {
  const { accessToken } = useAdminAuth();
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ClientFormData>(emptyClientForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchClients = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const data = await adminFetch<unknown>("admin/clients/", {}, accessToken);
      setClients(unwrapAdminResults<AdminClient>(data));
    } catch (err: unknown) {
      console.error("Failed to load clients:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load clients.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [accessToken]);

  const handleOpenCreate = () => {
    setFormData(emptyClientForm);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: AdminClient) => {
    setFormData({
      id: client.id,
      name: client.name,
      website_url: client.website_url || "",
      order: client.order,
      is_active: client.is_active,
      file: null,
      current_logo: client.logo,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (!formData.name.trim()) {
      setErrorMessage("Client name is required.");
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
          `admin/clients/${formData.id}/`,
          {
            method: "PATCH",
            body: payload,
          },
          accessToken
        );
      } else {
        await adminFetch(
          "admin/clients/",
          {
            method: "POST",
            body: payload,
          },
          accessToken
        );
      }

      setIsModalOpen(false);
      await fetchClients();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save client.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Are you sure you want to remove this client?")) return;

    try {
      setDeletingId(id);
      await adminFetch(`admin/clients/${id}/`, { method: "DELETE" }, accessToken);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete client.");
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
            Clients
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage enterprise clients, construction projects, and reference logos.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">No clients found</p>
            <p className="text-xs text-slate-500 mt-1">Showcase your trusted enterprise clients and project partners.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              + Add Client
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Logo</th>
                  <th className="px-5 py-3.5">Client Name</th>
                  <th className="px-5 py-3.5">Website</th>
                  <th className="px-5 py-3.5 text-center">Order</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {client.logo ? (
                        <img
                          src={getMediaUrl(client.logo)}
                          alt={client.name}
                          className="h-9 w-16 rounded-md object-contain bg-slate-50 p-1 border border-slate-200"
                        />
                      ) : (
                        <div className="h-9 w-16 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                          LOGO
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {client.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {client.website_url ? (
                        <a
                          href={client.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1b3a6e] hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <span className="truncate max-w-[200px]">{client.website_url}</span>
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap font-mono text-slate-600 font-medium">
                      {client.order}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          client.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {client.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right space-x-3">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="text-xs font-semibold text-[#1b3a6e] hover:text-[#152e57] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        disabled={deletingId === client.id}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        {deletingId === client.id ? "Deleting..." : "Delete"}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {formData.id ? "Edit Client" : "Add Client"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
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
                  Client / Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Rail Corporation, Apex Infra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://client-company.com"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 font-mono text-[11px] shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Logo Upload</label>
                {formData.current_logo && !formData.file && (
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={getMediaUrl(formData.current_logo)}
                      alt="Current logo"
                      className="h-8 w-14 rounded-md object-contain bg-slate-50 p-1 border border-slate-200"
                    />
                    <span className="text-[11px] text-slate-500">Current logo uploaded</span>
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
                  {isSubmitting ? "Saving..." : formData.id ? "Update Client" : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
