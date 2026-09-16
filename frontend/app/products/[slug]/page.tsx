"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import ProductGallery from "@/components/ProductGallery";
import ContactForm from "@/components/ContactForm";
import FaqSection from "@/components/FaqSection";
import {
  getPublicProductDetail,
  getPublicSiteSettings,
  getMediaUrl,
  PublicProductDetail,
  PublicSiteSettings,
} from "@/lib/public-api";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<PublicProductDetail | null>(null);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function loadProduct() {
      setLoading(true);
      setHasError(false);
      setIsNotFound(false);
      try {
        const [pRes, sRes] = await Promise.allSettled([
          getPublicProductDetail(slug),
          getPublicSiteSettings(),
        ]);

        if (pRes.status === "fulfilled") {
          if (!pRes.value) {
            setIsNotFound(true);
          } else {
            setProduct(pRes.value);
          }
        } else {
          setHasError(true);
        }

        if (sRes.status === "fulfilled") {
          setSiteSettings(sRes.value);
        }
      } catch (err) {
        console.error(`[ProductDetailPage] Error loading product ${slug}:`, err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <>
        <div className="bg-[#1b3a6e] py-16 text-white animate-pulse">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="h-4 w-32 bg-white/20 rounded mb-4" />
            <div className="h-10 w-96 bg-white/30 rounded mb-2" />
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 py-12 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 h-96 bg-gray-200 rounded-lg" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-8 w-4/5 bg-gray-200 rounded" />
              <div className="h-24 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isNotFound) {
    return (
      <div className="py-20 bg-[#f8f9fb]">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <div className="p-12 border border-gray-200 bg-white rounded-xl max-w-lg mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              ?
            </div>
            <h2 className="text-xl font-bold text-[#1b3a6e] mb-2">Machine Not Found</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              The requested machinery specification could not be located in our catalog.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded shadow-sm hover:shadow transition-all"
            >
              Back to Machinery Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hasError || !product) {
    return (
      <div className="py-20 bg-[#f8f9fb]">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <div className="p-12 border border-red-200 bg-red-50 rounded-lg max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
              !
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Unable to load product</h2>
            <p className="text-red-700 text-sm mb-6 leading-relaxed">
              Unable to load product specifications from the backend API.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                Retry
              </button>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded transition-all"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const primaryCategory = product.categories[0];
  const primaryImageUrl =
    product.images.find((i) => i.is_primary)?.image ||
    product.images[0]?.image;

  return (
    <>
      <PageBanner
        title={product.name}
        breadcrumbs={[
          { label: "Machinery Catalog", href: "/products" },
          ...(primaryCategory
            ? [
                {
                  label: primaryCategory.name,
                  href: `/products#${primaryCategory.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Gallery Column */}
            <div className="lg:col-span-7">
              <ProductGallery
                images={product.images}
                productName={product.name}
                fallbackImage={primaryImageUrl}
              />

              {/* Engineering Highlights Strip */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                    Metallurgy
                  </span>
                  <span className="text-xs font-extrabold text-[#1b3a6e]">SS304 / SS316L</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                    Automation
                  </span>
                  <span className="text-xs font-extrabold text-[#1b3a6e]">Siemens PLC</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                    Sanitation
                  </span>
                  <span className="text-xs font-extrabold text-[#1b3a6e]">CIP Ready</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-gray-200 rounded-lg text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-0.5">
                    Field Support
                  </span>
                  <span className="text-xs font-extrabold text-[#1b3a6e]">Nepal Service</span>
                </div>
              </div>
            </div>

            {/* Product Overview & Quote Action Column */}
            <div className="lg:col-span-5 flex flex-col">
              {/* Category Breadcrumb / Clean Metadata (No Badges) */}
              {product.categories.length > 0 && (
                <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#c8391a] uppercase tracking-wider">
                  <span>Sector / Category:</span>
                  <div className="flex flex-wrap items-center gap-1">
                    {product.categories.map((c, i) => (
                      <Link
                        key={c.id}
                        href={`/products#${c.slug}`}
                        className="hover:underline"
                      >
                        {c.name}
                        {i < product.categories.length - 1 ? " • " : ""}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-black leading-tight mb-4">
                {product.name}
              </h2>

              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                {product.short_description}
              </p>

              {/* Quote CTA Box */}
              <div className="bg-[#f8f9fb] border border-gray-200 p-6 rounded-xl mb-6 space-y-4 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#c8391a]/10 flex items-center justify-center text-[#c8391a]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-[#1b3a6e] text-sm">Turnkey Machine Quotation</div>
                    <div className="text-xs text-gray-500">Custom capacity sizing within 24-48 hours</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <a
                    href="#inquiry"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded shadow-sm hover:shadow transition-all text-center"
                  >
                    <span>Instant Quote Inquiry</span>
                  </a>
                  <Link
                    href={`/contact-us?product=${product.id}&name=${encodeURIComponent(product.name)}#quote`}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded shadow-sm hover:shadow transition-all text-center"
                  >
                    <span>Consultation Form</span>
                  </Link>
                </div>

                {siteSettings?.primary_phone && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs">
                    <a
                      href={`tel:${siteSettings.primary_phone.replace(/[^\d+]/g, "")}`}
                      className="text-gray-600 hover:text-[#1b3a6e] font-semibold flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 text-[#c8391a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>Direct: {siteSettings.primary_phone}</span>
                    </a>
                    {siteSettings.primary_email && (
                      <a
                        href={`mailto:${siteSettings.primary_email}?subject=Inquiry%20regarding%20${encodeURIComponent(product.name)}`}
                        className="text-gray-600 hover:text-[#1b3a6e] font-semibold"
                      >
                        Email Inquiry
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Manufacturing & Reliability Guarantees */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-2.5 text-xs text-gray-600 bg-white">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>1-Year factory warranty covering fabrication &amp; drive components</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>On-site engineering installation, pipe fitting &amp; commissioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>Certified operator training and genuine spare parts availability in Nepal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description & Technical Specifications Deep-Dive */}
          <div className="mt-16 border-t border-gray-200 pt-12 space-y-14">
            {/* Technical Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1.5 h-6 bg-[#c8391a]" />
                  <h2 className="text-[#1b3a6e] text-xl md:text-2xl font-bold">
                    Technical Specifications &amp; Parameters
                  </h2>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-x-auto shadow-xs">
                  <table className="w-full min-w-[480px] sm:min-w-0 text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#1b3a6e] text-white text-xs uppercase tracking-wider">
                        <th className="py-3.5 px-5 font-semibold w-1/3">
                          Specification Parameter
                        </th>
                        <th className="py-3.5 px-5 font-semibold w-2/3">
                          Technical Value / Standard
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {product.specifications.map((spec, idx) => (
                        <tr
                          key={spec.id || idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="py-3.5 px-5 font-semibold text-[#1b3a6e] text-xs md:text-sm">
                            {spec.label}
                          </td>
                          <td className="py-3.5 px-5 text-gray-700 text-xs md:text-sm font-mono font-medium">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Detailed Description */}
            {product.full_description && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-1.5 h-6 bg-[#c8391a]" />
                  <h2 className="text-[#1b3a6e] text-xl md:text-2xl font-bold">
                    Product Description &amp; Engineering Overview
                  </h2>
                </div>
                <div className="prose max-w-none text-gray-700 text-sm md:text-base leading-relaxed bg-slate-50 p-6 md:p-8 rounded-xl border border-gray-200 whitespace-pre-line">
                  {product.full_description}
                </div>
              </div>
            )}

            {/* Turnkey Project Execution Workflow */}
            <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6 sm:p-10">
              <div className="max-w-2xl mb-8">
                <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                  Engineering Workflow
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1b3a6e] mt-1">
                  How We Deliver &amp; Integrate This Machinery
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  From custom throughput sizing to on-site commissioning and annual maintenance contracts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    step: "01",
                    title: "Capacity Sizing",
                    desc: "Custom production throughput sizing, mechanical drawings, and utility integration.",
                  },
                  {
                    step: "02",
                    title: "Precision SS Welding",
                    desc: "AISI 304/316L food contact fabrication, mirror polishing, and pressure vessel testing.",
                  },
                  {
                    step: "03",
                    title: "PLC Automation",
                    desc: "Siemens/Schneider control panel wiring, temperature data logging, and telemetry setup.",
                  },
                  {
                    step: "04",
                    title: "Commissioning & AMC",
                    desc: "On-site piping, hydrostatic testing, operator training, and local Nepal maintenance.",
                  },
                ].map((s) => (
                  <div key={s.step} className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                    <span className="text-3xl font-black text-[#1b3a6e]/15 block">{s.step}</span>
                    <h4 className="font-bold text-sm text-[#1b3a6e] mt-2 mb-1">{s.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Industries Served Cross-Linking (Internal Linking) */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest block">
                    Sector Applications
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#1b3a6e]">
                    Turnkey Industrial Sectors Served by this Equipment
                  </h3>
                </div>
                <Link
                  href="/industries"
                  className="text-xs font-bold text-[#1b3a6e] hover:text-[#c8391a] transition-colors shrink-0"
                >
                  View All Industrial Sectors →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {[
                  { name: "Dairy & Milk", slug: "dairy-industry" },
                  { name: "Beverages & Water", slug: "beverage-water-industry" },
                  { name: "Cold Storage", slug: "cold-storage-solutions" },
                  { name: "Food Processing", slug: "food-processing-industry" },
                  { name: "Pharmaceuticals", slug: "pharmaceutical-industry" },
                  { name: "Meat & Poultry", slug: "meat-processing-industry" },
                ].map((ind) => (
                  <Link
                    key={ind.slug}
                    href={`/industries/${ind.slug}`}
                    className="p-3 bg-slate-50 hover:bg-[#1b3a6e]/5 border border-gray-200 hover:border-[#1b3a6e] rounded-lg text-center transition-all group"
                  >
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-[#1b3a6e] block line-clamp-1">
                      {ind.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Embedded Instant Quote Form */}
            <div id="inquiry" className="bg-[#1b3a6e] text-white rounded-2xl p-6 sm:p-10 scroll-mt-24 shadow-md">
              <div className="max-w-2xl mb-8">
                <span className="text-[#c8391a] text-xs font-bold uppercase tracking-widest">
                  Direct Proposal
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold mt-1 mb-2">
                  Request a Formal Proposal for {product.name}
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  Provide your target capacity, dimensions, and project location.
                  Our mechanical engineering team will prepare an engineering specification sheet and cost estimate.
                </p>
              </div>

              <div className="bg-white text-gray-900 rounded-xl p-6 sm:p-8">
                <ContactForm
                  initialProductId={product.id}
                  initialProductName={product.name}
                />
              </div>
            </div>

            {/* Related Machinery */}
            {product.related_products && product.related_products.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#c8391a]" />
                    <h2 className="text-[#1b3a6e] text-xl md:text-2xl font-bold">
                      Related Machinery &amp; Equipment
                    </h2>
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded shadow-sm hover:shadow transition-all"
                  >
                    View All Catalog
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {product.related_products.map((rel) => (
                    <div
                      key={rel.id}
                      className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col bg-white group"
                    >
                      <Link
                        href={`/products/${rel.slug}`}
                        className="block h-44 bg-gray-100 overflow-hidden cursor-pointer"
                      >
                        {rel.primary_image ? (
                          <img
                            src={getMediaUrl(rel.primary_image)}
                            alt={rel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1b3a6e]/5 flex items-center justify-center text-gray-400 text-xs">
                            Industrial Machine
                          </div>
                        )}
                      </Link>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-[#1b3a6e] text-sm mb-1 group-hover:text-[#c8391a] line-clamp-1 transition-colors">
                            <Link href={`/products/${rel.slug}`}>
                              {rel.name}
                            </Link>
                          </h4>
                          <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                            {rel.short_description}
                          </p>
                        </div>
                        <div className="mt-auto">
                          <Link
                            href={`/products/${rel.slug}`}
                            className="w-full inline-flex items-center justify-center bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded shadow-sm hover:shadow transition-all text-center"
                          >
                            Specifications
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <FaqSection
        pageKey="product-detail"
        badge="Machinery FAQ"
        title={`${product.name} — Technical & Operational FAQs`}
        subtitle="Common engineering questions regarding throughput customization, food contact metallurgy, and field warranty."
      />
    </>
  );
}
