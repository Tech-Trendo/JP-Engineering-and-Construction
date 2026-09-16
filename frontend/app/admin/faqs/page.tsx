"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/lib/admin-auth-context";
import {
  AdminFaq,
  getAdminFaqs,
  createAdminFaq,
  updateAdminFaq,
  deleteAdminFaq,
} from "@/lib/admin-api";

interface FaqFormData {
  id?: number;
  question: string;
  answer: string;
  page: string;
  category: string;
  order: number;
  is_active: boolean;
}

const emptyForm: FaqFormData = {
  question: "",
  answer: "",
  page: "products",
  category: "",
  order: 0,
  is_active: true,
};

const PAGE_OPTIONS = [
  { value: "all", label: "All Pages / Global" },
  { value: "products", label: "Products Page & Catalog" },
  { value: "industries", label: "Industries We Serve" },
  { value: "contact", label: "Contact Us" },
  { value: "introduction", label: "About Us - Introduction" },
  { value: "company-profile", label: "About Us - Company Profile" },
  { value: "our-team", label: "About Us - Our Team" },
  { value: "our-clients", label: "About Us - Our Clients" },
  { value: "our-partners", label: "About Us - Business Partners" },
];

export default function AdminFaqsPage() {
  const { accessToken } = useAdminAuth();
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>("all-filter");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FaqFormData>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchFaqs = async () => {
    if (!accessToken) return;
    try {
      setIsLoading(true);
      const data = await getAdminFaqs(accessToken);
      setFaqs(data);
    } catch (err: unknown) {
      console.error("Failed to load FAQs:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to load FAQs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [accessToken]);

  const handleOpenCreate = () => {
    const defaultPage = selectedTab !== "all-filter" ? selectedTab : "products";
    setFormData({
      ...emptyForm,
      page: defaultPage,
      order: faqs.length + 1,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: AdminFaq) => {
    setFormData({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      page: faq.page,
      category: faq.category || "",
      order: faq.order,
      is_active: faq.is_active,
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    if (!formData.question.trim()) {
      setErrorMessage("Question is required.");
      return;
    }
    if (!formData.answer.trim()) {
      setErrorMessage("Answer is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        page: formData.page,
        category: formData.category.trim(),
        order: Number(formData.order) || 0,
        is_active: formData.is_active,
      };

      if (formData.id) {
        await updateAdminFaq(accessToken, formData.id, payload);
      } else {
        await createAdminFaq(accessToken, payload);
      }

      await fetchFaqs();
      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error("Failed to save FAQ:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to save FAQ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (faq: AdminFaq) => {
    if (!accessToken) return;
    try {
      await updateAdminFaq(accessToken, faq.id, { is_active: !faq.is_active });
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === faq.id ? { ...item, is_active: !item.is_active } : item
        )
      );
    } catch (err) {
      console.error("Failed to toggle FAQ status:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    try {
      setIsDeleting(true);
      await deleteAdminFaq(accessToken, id);
      setFaqs((prev) => prev.filter((item) => item.id !== id));
      setDeletingId(null);
    } catch (err: unknown) {
      console.error("Failed to delete FAQ:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete FAQ.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter items based on active tab and search query
  const filteredFaqs = faqs.filter((faq) => {
    const matchesTab =
      selectedTab === "all-filter" ? true : faq.page === selectedTab;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.category && faq.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getPageBadge = (page: string) => {
    switch (page) {
      case "products":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "industries":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "contact":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "introduction":
      case "company-profile":
      case "our-team":
      case "our-clients":
      case "our-partners":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              FAQ Management CMS
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-[#1b3a6e]">
              {faqs.length} Total
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, reorder, and publish frequently asked questions for public subpages.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1b3a6e] hover:bg-[#152e57] rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add New FAQ
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        {/* Scrollable Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedTab("all-filter")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedTab === "all-filter"
                ? "bg-[#1b3a6e] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Subpages ({faqs.length})
          </button>
          {PAGE_OPTIONS.map((opt) => {
            const count = faqs.filter((f) => f.page === opt.value).length;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelectedTab(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTab === opt.value
                    ? "bg-[#1b3a6e] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {opt.label.split(" - ")[1] || opt.label.split(" ")[0]} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1b3a6e]/20 focus:border-[#1b3a6e]"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <div className="w-8 h-8 border-3 border-gray-300 border-t-[#1b3a6e] rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading FAQs...</p>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 p-8">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1b3a6e] flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900">No FAQs found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No FAQs matched your search term "${searchQuery}".`
              : "No questions added for this subpage yet."}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1b3a6e] rounded-lg cursor-pointer"
          >
            + Create First FAQ
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 w-14 text-center">Order</th>
                  <th className="py-3 px-4 w-36">Target Page</th>
                  <th className="py-3 px-4">Question & Answer</th>
                  <th className="py-3 px-4 w-28">Category</th>
                  <th className="py-3 px-4 w-24 text-center">Status</th>
                  <th className="py-3 px-4 w-28 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 text-xs font-mono font-medium text-gray-700">
                        {faq.order}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-md border uppercase tracking-wider ${getPageBadge(
                          faq.page
                        )}`}
                      >
                        {faq.page}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-semibold text-gray-900 text-sm">{faq.question}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      {faq.category ? (
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 italic">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center align-top">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(faq)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          faq.is_active
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title="Click to toggle active state"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            faq.is_active ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        ></span>
                        {faq.is_active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(faq)}
                          className="p-1.5 text-gray-500 hover:text-[#1b3a6e] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Edit FAQ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(faq.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete FAQ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {formData.id ? "Edit FAQ" : "Add New FAQ"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Target Page <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.page}
                    onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3a6e]/20 focus:border-[#1b3a6e]"
                  >
                    {PAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Topic / Category (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Fabrication, Metallurgy, AMC"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3a6e]/20 focus:border-[#1b3a6e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What food safety standards are maintained?"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3a6e]/20 focus:border-[#1b3a6e]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Detailed explanation, technical specifications, and guidance..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3a6e]/20 focus:border-[#1b3a6e]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Display Order (Priority)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3a6e]/20 focus:border-[#1b3a6e]"
                  />
                </div>

                <div className="pt-4 sm:pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="w-4 h-4 text-[#1b3a6e] rounded border-gray-300 focus:ring-[#1b3a6e]"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      Publish to public website
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1b3a6e] hover:bg-[#152e57] rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : formData.id ? "Update FAQ" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete this FAQ?</h3>
            <p className="text-xs text-gray-500 mt-2">
              Are you sure you want to delete this question? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
