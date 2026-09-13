"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getPublicCategories,
  getPublicProducts,
  PublicCategory,
  PublicProductListItem,
  getMediaUrl,
} from "@/lib/public-api";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Container,
} from "@/components/ui";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [products, setProducts] = useState<PublicProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search filter query string
  const [searchQuery, setSearchQuery] = useState("");

  // Multi-category selection state: array of category slugs
  const [selectedCategorySlugs, setSelectedCategorySlugs] = useState<string[]>([]);

  // Sync state from URL search params on mount
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const slugs = categoryParam.split(",").map((s) => s.trim()).filter(Boolean);
      setSelectedCategorySlugs(slugs);
    }
    const qParam = searchParams.get("q");
    if (qParam) {
      setSearchQuery(qParam);
    }
  }, [searchParams]);

  // Fetch all categories and products once
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([getPublicCategories(), getPublicProducts()])
      .then(([cats, prods]) => {
        if (!isMounted) return;
        setCategories(Array.isArray(cats) ? cats : []);
        setProducts(Array.isArray(prods) ? prods : []);
      })
      .catch((err) => {
        console.error("Failed to load catalog data:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync selected filters to URL for shareability
  const updateUrlParams = (slugs: string[], search: string) => {
    const params = new URLSearchParams();
    if (slugs.length > 0) {
      params.set("category", slugs.join(","));
    }
    if (search.trim()) {
      params.set("q", search.trim());
    }
    const queryString = params.toString();
    router.replace(queryString ? `/products?${queryString}` : "/products", {
      scroll: false,
    });
  };

  // Toggle category checkbox
  const handleToggleCategory = (slug: string) => {
    const next = selectedCategorySlugs.includes(slug)
      ? selectedCategorySlugs.filter((s) => s !== slug)
      : [...selectedCategorySlugs, slug];

    setSelectedCategorySlugs(next);
    updateUrlParams(next, searchQuery);
  };

  // Reset all filters
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
          <div className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">
            Machinery Catalog & Plant Specifications
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Industrial Machinery & Processing Systems
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed font-normal">
            Filter our verified manufacturing equipment across community water treatment, dairy processing plants, commercial cold storage, solar pumping systems, and stainless steel fabrication lines.
          </p>
        </div>

        {/* Main Layout: Sticky Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* 1. Sticky Category Filter Sidebar */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-premium-card space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Filter Catalog
                </span>
                {(selectedCategorySlugs.length > 0 || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
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
                    placeholder="Search e.g. RO Plant, Pasteurizer, Freezer..."
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                      {selectedCategorySlugs.length} Active
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
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

              {/* Custom Plant Support Prompt */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <span className="font-bold text-slate-900 block">
                  Custom Engineering Solutions?
                </span>
                <p className="leading-relaxed">
                  Need customized plant capacity, specialized SS316 skids, or turnkey installation? Connect directly with our engineering desk.
                </p>
                <Link
                  href="/contact"
                  className="inline-block text-blue-700 font-semibold hover:underline"
                >
                  Contact Engineering Desk &rarr;
                </Link>
              </div>
            </div>
          </aside>

          {/* 2. Products Grid */}
          <main className="lg:col-span-9 space-y-6">
            {/* Results Count & Active Pills Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="text-xs text-slate-500">
                Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span>{" "}
                machinery models
              </div>

              {selectedCategorySlugs.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-500 mr-1">Filtered by:</span>
                  {selectedCategorySlugs.map((slug) => {
                    const catName = categories.find((c) => c.slug === slug)?.name || slug;
                    return (
                      <span
                        key={slug}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200 font-medium"
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
              <div className="p-16 text-center text-xs text-slate-400">
                Loading machinery catalog...
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
                    className="flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <Link
                        href={`/products/${prod.slug}`}
                        className="block relative h-48 w-full overflow-hidden bg-slate-900 border-b border-slate-200"
                      >
                        {prod.primary_image ? (
                          <img
                            src={getMediaUrl(prod.primary_image)}
                            alt={prod.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                            JP Specification
                          </div>
                        )}
                        {prod.is_featured && (
                          <span className="absolute top-3 left-3 bg-blue-700 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md shadow-xs">
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
                              className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80"
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>

                        <Link href={`/products/${prod.slug}`}>
                          <CardTitle className="group-hover:text-blue-700 transition-colors">
                            {prod.name}
                          </CardTitle>
                        </Link>
                        <CardDescription className="line-clamp-2 mt-2 text-xs">
                          {prod.short_description || "Industrial processing equipment engineered for continuous duty operations."}
                        </CardDescription>
                      </CardHeader>
                    </div>

                    {/* "View Details" + "Request Quote" */}
                    <CardFooter className="gap-2 pt-3">
                      <Button
                        href={`/products/${prod.slug}`}
                        variant="outline"
                        size="sm"
                        className="flex-1 justify-center text-xs font-semibold"
                      >
                        View Details
                      </Button>
                      <Button
                        href={`/contact?product=${prod.id}&name=${encodeURIComponent(prod.name)}`}
                        variant="accent"
                        size="sm"
                        className="flex-1 justify-center text-xs font-semibold"
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
        <div className="p-16 text-center text-xs text-slate-400">
          Loading catalog...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
