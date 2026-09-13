"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getPublicProducts,
  getPublicCategories,
  PublicProductListItem,
  PublicCategory,
} from "@/lib/public-api";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Container,
  Badge,
} from "@/components/ui";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<PublicProductListItem[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>([]);

  // Sync state with URL params on initial load
  useEffect(() => {
    const catQuery = searchParams.get("category");
    if (catQuery) {
      const slugs = catQuery.split(",").map((s) => s.trim()).filter(Boolean);
      setSelectedCategorySlugs(slugs);
    }
    const qQuery = searchParams.get("q");
    if (qQuery) {
      setSearchQuery(qQuery);
    }
  }, [searchParams]);

  // Load catalog & categories
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([getPublicProducts(), getPublicCategories()])
      .then(([prods, cats]) => {
        if (!isMounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch((err) => {
        console.error("Failed to load catalog:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Toggle multi-category selection
  const handleToggleCategory = (slug: string) => {
    setSelectedCategorySlugs((prev) => {
      const exists = prev.includes(slug);
      const updated = exists
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];

      // Update URL search query
      const params = new URLSearchParams();
      if (updated.length > 0) {
        params.set("category", updated.join(","));
      }
      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }
      const newUrl = params.toString() ? `/products?${params.toString()}` : "/products";
      router.replace(newUrl, { scroll: false });

      return updated;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategorySlugs([]);
    setSearchQuery("");
    router.replace("/products", { scroll: false });
  };

  // Filter products by search query and multi-category M2M relationship
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Search text filter
      const matchesSearch =
        !searchQuery.trim() ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.slug.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Multi-category filter: product must belong to at least one of the selected categories (if any selected)
      const matchesCategory =
        selectedCategorySlugs.length === 0 ||
        prod.categories.some((c) => selectedCategorySlugs.includes(c.slug));

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategorySlugs]);

  return (
    <div className="py-10 sm:py-16">
      <Container size="default">
        {/* Page Header */}
        <div className="pb-8 border-b border-slate-200 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-blue-800">
              Fleet Catalog & Machinery Specifications
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Heavy Equipment Inventory
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed font-normal">
            Filter our certified industrial earthmoving machinery, water bottling plants, cold storage equipment, and construction rigs. Direct manufacturer specifications with immediate quote procurement.
          </p>
        </div>

        {/* Main Layout: Sticky Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* 1. Sticky Category Filter Sidebar */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-premium-card space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold font-mono text-slate-900 uppercase tracking-wider">
                  Filter Catalog
                </span>
                {(selectedCategorySlugs.length > 0 || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Search Equipment
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Excavator, JP-500, Bottling..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Multi-Category Filter (Checkboxes) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-slate-700">
                    Categories
                  </label>
                  {selectedCategorySlugs.length > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {selectedCategorySlugs.length} Active
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isChecked = selectedCategorySlugs.includes(cat.slug);
                    return (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-3 p-2 rounded-lg border text-xs cursor-pointer select-none transition ${
                          isChecked
                            ? "bg-blue-50 border-blue-200 text-blue-900 font-semibold"
                            : "bg-transparent border-transparent hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCategory(cat.slug)}
                          className="h-4 w-4 rounded-xs border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        />
                        <span className="truncate">{cat.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Duty Cycle Support Prompt */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-2">
                <span className="font-bold text-slate-900 block">
                  Custom Fleet Requirements?
                </span>
                <p>
                  Need specialized attachments, factory tooling, or multi-rig mobilizing? Connect directly with our dispatch engineering desk.
                </p>
                <Link
                  href="/contact"
                  className="inline-block text-blue-700 font-semibold hover:underline"
                >
                  Contact Desk &rarr;
                </Link>
              </div>
            </div>
          </aside>

          {/* 2. Products Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* Results Count & Active Pills Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="text-xs font-mono text-slate-500">
                Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span>{" "}
                machinery models
              </div>

              {selectedCategorySlugs.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 mr-1">Filtered by:</span>
                  {selectedCategorySlugs.map((slug) => {
                    const catName = categories.find((c) => c.slug === slug)?.name || slug;
                    return (
                      <span
                        key={slug}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                      >
                        {catName}
                        <button
                          onClick={() => handleToggleCategory(slug)}
                          className="hover:text-red-600 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="p-16 text-center text-xs text-slate-400 font-mono">
                Loading equipment catalog...
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="p-16 rounded-2xl bg-white border border-slate-200 text-center space-y-4 shadow-premium-card">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  No Machinery Matches Active Filters
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search keyword or clearing selected category filters.
                </p>
                <Button variant="outline" size="sm" onClick={handleResetFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              /* Product Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <Card
                    key={prod.id}
                    variant="default"
                    className="flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <Link
                        href={`/products/${prod.slug}`}
                        className="block relative h-48 w-full overflow-hidden bg-slate-900 border-b border-slate-200 group"
                      >
                        {prod.primary_image ? (
                          <img
                            src={prod.primary_image}
                            alt={prod.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400 font-mono text-xs">
                            JP Specification
                          </div>
                        )}
                        {prod.is_featured && (
                          <span className="absolute top-3 left-3 bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-xs font-mono">
                            Featured
                          </span>
                        )}
                      </Link>

                      <CardHeader>
                        {/* Categories M2M Badges */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {prod.categories.map((c) => (
                            <span
                              key={c.id}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80"
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>

                        <Link href={`/products/${prod.slug}`}>
                          <CardTitle className="hover:text-blue-700 transition-colors">
                            {prod.name}
                          </CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-2 mt-2">
                          {prod.short_description || "Certified heavy engineering rig engineered for continuous duty operations."}
                        </CardDescription>
                      </CardHeader>
                    </div>

                    {/* "View Details" + "Request Quote" */}
                    <CardFooter className="gap-2 pt-3">
                      <Button
                        href={`/products/${prod.slug}`}
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-center text-xs"
                      >
                        View Details
                      </Button>
                      <Button
                        href={`/contact?product=${prod.id}&name=${encodeURIComponent(prod.name)}`}
                        variant="accent"
                        size="sm"
                        className="flex-1 justify-center text-xs"
                      >
                        Request Quote
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-16 text-center text-xs text-slate-400 font-mono">
          Loading catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
