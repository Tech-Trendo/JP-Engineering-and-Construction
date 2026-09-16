"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { adminFetch, AdminTeamMember, unwrapAdminResults, getMediaUrl } from "@/lib/admin-api";

interface TeamFormData {
  id?: number;
  name: string;
  designation: string;
  order: number;
  is_active: boolean;
  file?: File | null;
  current_photo?: string | null;
}

const emptyTeamForm: TeamFormData = {
  name: "",
  designation: "",
  order: 0,
  is_active: true,
  file: null,
  current_photo: null,
};

export default function AdminTeamPage() {
  const { accessToken } = useAdminAuth();
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<TeamFormData>(emptyTeamForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchTeam = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const data = await adminFetch<unknown>("admin/team/", {}, accessToken);
      setMembers(unwrapAdminResults<AdminTeamMember>(data));
    } catch (err: unknown) {
      console.error("Failed to load team:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load team.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [accessToken]);

  const handleOpenCreate = () => {
    setFormData(emptyTeamForm);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: AdminTeamMember) => {
    setFormData({
      id: member.id,
      name: member.name,
      designation: member.designation,
      order: member.order,
      is_active: member.is_active,
      file: null,
      current_photo: member.photo,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (!formData.name.trim()) {
      setErrorMessage("Member name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = new FormData();
      payload.append("name", formData.name.trim());
      payload.append("designation", formData.designation.trim());
      payload.append("order", String(formData.order));
      payload.append("is_active", String(formData.is_active));

      if (formData.file) {
        payload.append("photo", formData.file);
      }

      if (formData.id) {
        await adminFetch(
          `admin/team/${formData.id}/`,
          {
            method: "PATCH",
            body: payload,
          },
          accessToken
        );
      } else {
        await adminFetch(
          "admin/team/",
          {
            method: "POST",
            body: payload,
          },
          accessToken
        );
      }

      setIsModalOpen(false);
      await fetchTeam();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to save team member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Are you sure you want to remove this team member?")) return;

    try {
      setDeletingId(id);
      await adminFetch(`admin/team/${id}/`, { method: "DELETE" }, accessToken);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete team member.");
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
            Team Members
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Manage engineering and leadership staff profiles displayed on the public site.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Team Member
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading team roster...</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">No team members found</p>
            <p className="text-xs text-slate-500 mt-1">Add your leadership and engineering staff profiles.</p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1b3a6e] hover:bg-[#152e57] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              + Add Member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Photo</th>
                  <th className="px-5 py-3.5">Full Name</th>
                  <th className="px-5 py-3.5">Designation</th>
                  <th className="px-5 py-3.5 text-center">Order</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {member.photo ? (
                        <img
                          src={getMediaUrl(member.photo)}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover bg-slate-100 border border-slate-200"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {member.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {member.designation}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap font-mono text-slate-600 font-medium">
                      {member.order}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          member.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right space-x-3">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="text-xs font-semibold text-[#1b3a6e] hover:text-[#152e57] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        disabled={deletingId === member.id}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        {deletingId === member.id ? "Deleting..." : "Delete"}
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
                {formData.id ? "Edit Team Member" : "Add Team Member"}
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
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Designation / Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Mechanical Engineer"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#1b3a6e] focus:ring-2 focus:ring-[#1b3a6e]/15 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Photo Upload</label>
                {formData.current_photo && !formData.file && (
                  <div className="mb-2 flex items-center gap-2">
                    <img
                      src={getMediaUrl(formData.current_photo)}
                      alt="Current"
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 bg-slate-100"
                    />
                    <span className="text-[11px] text-slate-500">Current photo uploaded</span>
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
                  {isSubmitting ? "Saving..." : formData.id ? "Update Member" : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
