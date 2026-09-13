"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminFetch, AdminClient, unwrapAdminResults } from "@/lib/admin-api";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Clients
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Manage enterprise clients, construction projects, and reference logos.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Client
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-300">No clients found</p>
            <p className="text-xs text-slate-500 mt-1">Showcase your trusted enterprise clients and project partners.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
            >
              + Add Client
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Logo</th>
                  <th className="px-5 py-3 font-semibold">Client Name</th>
                  <th className="px-5 py-3 font-semibold">Website</th>
                  <th className="px-5 py-3 font-semibold text-center">Order</th>
                  <th className="px-5 py-3 font-semibold text-center">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3 whitespace-nowrap">
                      {client.logo ? (
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="h-9 w-16 rounded-md object-contain bg-slate-950 p-1 border border-slate-800"
                        />
                      ) : (
                        <div className="h-9 w-16 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                          LOGO
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-white whitespace-nowrap">
                      {client.name}
                    </td>
                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                      {client.website_url ? (
                        <a
                          href={client.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span className="truncate max-w-[200px]">{client.website_url}</span>
                          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center whitespace-nowrap font-mono text-slate-300">
                      {client.order}
                    </td>
                    <td className="px-5 py-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          client.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700/40 text-slate-400 border border-slate-600/40"
                        }`}
                      >
                        {client.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        disabled={deletingId === client.id}
                        className="text-xs font-semibold text-red-400 hover:text-red-300 transition disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                {formData.id ? "Edit Client" : "Add Client"}
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
                  Client / Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metro Rail Corporation, Apex Infra"
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
                  placeholder="https://client-company.com"
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
                      src={formData.current_logo}
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
