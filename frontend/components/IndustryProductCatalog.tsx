"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicCategory, PublicProductListItem, getMediaUrl } from "@/lib/public-api";

interface IndustryProductCatalogProps {
  products: PublicProductListItem[];
  categories: PublicCategory[];
  industryName: string;
}

export default function IndustryProductCatalog({
  products = [],
  categories = [],
  industryName,
}: IndustryProductCatalogProps) {
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const filtered =
    selectedCat === "all"
      ? products
      : products.filter((p) => p.categories?.some((c) => c.slug === selectedCat));

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
            Filter Machinery by Category:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCat("all")}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                selectedCat === "all"
                  ? "bg-[#1b3a6e] text-white shadow-xs"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All Machinery ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) =>
                p.categories?.some((c) => c.slug === cat.slug)
              ).length;
              const isSelected = selectedCat === cat.slug;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.slug)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#1b3a6e] text-white shadow-xs"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 p-8">
          <p className="text-sm font-semibold text-gray-700">No machinery matching this category filter.</p>
          <button
            type="button"
            onClick={() => setSelectedCat("all")}
            className="text-xs font-semibold text-[#1b3a6e] hover:underline mt-2 cursor-pointer"
          >
            Show all {products.length} {industryName} products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const primaryCat = product.categories?.[0]?.name || "Machinery";
            const imgSrc = getMediaUrl(product.primary_image) || "/images/hero-machinery.jpg";

            return (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 flex flex-col group"
              >
                {/* Photo */}
                <Link
                  href={`/products/${product.slug}`}
                  className="block relative h-52 bg-gray-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </Link>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 leading-snug group-hover:text-[#c8391a] transition-colors line-clamp-2">
                      <Link href={`/products/${product.slug}`} className="hover:text-[#c8391a] transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {product.short_description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#c8391a] hover:bg-[#a62d14] text-white text-[11px] font-bold uppercase tracking-wider py-2 rounded shadow-sm hover:shadow transition-all"
                    >
                      <span>Specifications</span>
                    </Link>

                    <Link
                      href={`/contact-us?product=${product.id}&industry=${encodeURIComponent(
                        industryName
                      )}#quote`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#c8391a] hover:bg-[#a62d14] text-white text-[11px] font-bold uppercase tracking-wider py-2 rounded shadow-sm hover:shadow transition-all text-center"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
