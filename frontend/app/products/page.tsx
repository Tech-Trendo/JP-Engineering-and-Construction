"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import FaqSection from "@/components/FaqSection";
import {
  getPublicCategories,
  getPublicProducts,
  getMediaUrl,
  PublicCategory,
  PublicProductListItem,
} from "@/lib/public-api";

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [products, setProducts] = useState<PublicProductListItem[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchProductsData() {
      setLoading(true);
      setHasError(false);
      try {
        const [catsRes, prodsRes] = await Promise.allSettled([
          getPublicCategories(),
          getPublicProducts(),
        ]);

        if (catsRes.status === "fulfilled") {
          setCategories(catsRes.value);
        } else {
          setHasError(true);
        }

        if (prodsRes.status === "fulfilled") {
          setProducts(prodsRes.value);
        } else {
          setHasError(true);
        }
      } catch (err) {
        console.error("[ProductsPage] fetch error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsData();
  }, []);

  return (
    <>
      <PageBanner
        title="Industrial Machinery &amp; Equipment Catalog"
        breadcrumbs={[{ label: "Machinery Catalog" }]}
      />

      <section className="py-12 bg-[#f8f9fb]">
        <div className="max-w-[1280px] mx-auto px-4">
          {loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-12 bg-white rounded border border-gray-200" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-white rounded border border-gray-200" />
                ))}
              </div>
            </div>
          ) : hasError ? (
            <div className="p-12 border border-red-200 bg-red-50 text-center rounded-lg max-w-lg mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                !
              </div>
              <h3 className="text-red-800 font-bold text-lg mb-1">
                Unable to load machinery catalog
              </h3>
              <p className="text-red-700 text-sm leading-relaxed mb-4">
                The machinery catalog could not be loaded from the backend API.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Category Navigation Bar */}
              {categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-10 bg-white p-4 border border-gray-200 shadow-sm sticky top-[72px] z-30">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2 hidden md:inline">
                    Jump to Category:
                  </span>
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`#${cat.slug}`}
                      className="px-3.5 py-1.5 text-[12px] font-bold text-[#1b3a6e] border border-gray-200 hover:border-[#1b3a6e] hover:bg-[#1b3a6e] hover:text-white transition-all rounded-sm"
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Categories & Products Listing */}
              {categories.length > 0 ? (
                <div className="space-y-16">
                  {categories.map((cat) => {
                    const categoryProducts = products.filter((p) =>
                      p.categories.some((c) => c.id === cat.id || c.slug === cat.slug)
                    );

                    return (
                      <div
                        key={cat.id}
                        id={cat.slug}
                        className="bg-white border border-gray-200 shadow-sm overflow-hidden scroll-mt-28"
                      >
                        {/* Category Header Banner */}
                        <div className="p-6 md:p-8 bg-[#f5f7fa] border-b border-gray-200 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                          <div className="max-w-[800px]">
                            <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                              Machinery Category
                            </span>
                            <h2 className="text-[#1b3a6e] text-2xl font-bold mt-1 mb-2">
                              {cat.name}
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {cat.description || ""}
                            </p>
                          </div>
                          {cat.icon_or_image && (
                            <div className="w-24 h-24 shrink-0 rounded overflow-hidden border border-gray-200 bg-white hidden md:block">
                              <img
                                src={getMediaUrl(cat.icon_or_image)}
                                alt={cat.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {/* Products Grid for this Category */}
                        <div className="p-6 md:p-8">
                          {categoryProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {categoryProducts.map((product) => (
                                <div
                                  key={product.id}
                                  className="border border-gray-200 rounded overflow-hidden hover:shadow-md hover:border-[#1b3a6e] transition-all flex flex-col group bg-white"
                                >
                                  <Link
                                    href={`/products/${product.slug}`}
                                    className="block relative aspect-square bg-white overflow-hidden flex items-center justify-center p-3 cursor-pointer"
                                  >
                                    {product.primary_image ? (
                                      <img
                                        src={getMediaUrl(product.primary_image)}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-white flex items-center justify-center text-gray-400 text-xs">
                                        Industrial Machine
                                      </div>
                                    )}
                                  </Link>
                                  <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                      <h3 className="text-[#1b3a6e] font-bold text-base mb-1.5 group-hover:text-[#c8391a] transition-colors leading-snug">
                                        <Link href={`/products/${product.slug}`} className="hover:text-[#c8391a] transition-colors">
                                          {product.name}
                                        </Link>
                                      </h3>
                                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                                        {product.short_description}
                                      </p>
                                    </div>
                                    <div className="flex gap-2 pt-3 border-t border-gray-100 mt-auto">
                                      <Link
                                        href={`/products/${product.slug}`}
                                        className="flex-1 inline-flex items-center justify-center bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider py-2 rounded shadow-sm hover:shadow transition-all"
                                      >
                                        Specifications
                                      </Link>
                                      <Link
                                        href={`/contact-us?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                                        className="flex-1 inline-flex items-center justify-center bg-[#1b3a6e] hover:bg-[#0f2347] text-white text-xs font-bold uppercase tracking-wider py-2 rounded shadow-sm hover:shadow transition-all"
                                      >
                                        Quote
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-10 border border-dashed border-gray-200 rounded p-6 bg-gray-50">
                              <p className="text-gray-400 text-xs">
                                Machinery models for {cat.name} are currently being added.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 bg-white border border-gray-200 p-8 rounded shadow-sm">
                  <p className="text-gray-500 text-sm">
                    Categories and machinery products are currently being configured.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <FaqSection
        pageKey="products"
        badge="Machinery & Procurement FAQ"
        title="Industrial Machinery FAQs"
        subtitle="Key information regarding manufacturing standards, customization, procurement, and field commissioning in Nepal."
        faqs={[
          {
            question: "What types of industrial machinery does JP Engineering manufacture in Nepal?",
            answer:
              "We manufacture and assemble complete processing equipment for dairy plants (pasteurizers, homogenizers, chilling vats, road tankers), water treatment facilities (commercial Reverse Osmosis, multi-grade filtration), cold storage infrastructure, food processing, and custom stainless steel vessels.",
          },
          {
            question: "Can machinery capacity and footprint be customized to our factory layout?",
            answer:
              "Yes. Every machine skid, storage tank, and conveyor assembly is custom engineered to match your target production throughput, ceiling height, and floor space constraints across Nepal.",
          },
          {
            question: "What food safety and steel metallurgy standards are maintained?",
            answer:
              "All product contact surfaces are fabricated from certified AISI 304 or AISI 316L stainless steel with sanitary TIG welding, mirror polishing (Ra < 0.8 µm), and full Clean-In-Place (CIP) compatibility.",
          },
          {
            question: "Do you integrate imported components and automation hardware?",
            answer:
              "Yes. We partner with and integrate genuine global components including Siemens and Schneider PLCs, Danfoss refrigeration compressors, Grundfos pumps, and Festo pneumatics with local programming and maintenance support.",
          },
          {
            question: "What is the typical fabrication and delivery timeline?",
            answer:
              "After engineering sign-off on CAD layouts, standard machinery units take 2 to 4 weeks, while comprehensive turnkey plants take 4 to 8 weeks including on-site pipe fitting and commissioning.",
          },
        ]}
      />
    </>
  );
}
