"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { PublicProductListItem } from "@/lib/public-api";
import { Button, Badge } from "@/components/ui";

interface ProductSliderProps {
  products: PublicProductListItem[];
  className?: string;
}

export function ProductSlider({ products, className = "" }: ProductSliderProps) {
  // Filter products to those with a primary image, prioritizing featured products
  const displayProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const withImages = products.filter((p) => p.primary_image);
    const featured = withImages.filter((p) => p.is_featured);
    if (featured.length >= 3) return featured;
    if (withImages.length > 0) return withImages;
    return products;
  }, [products]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Initialize Embla with Autoplay plugin (4.5s delay, pause on mouse enter, resume after interaction)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 4500,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
      }),
    ]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Viewport & Track */}
      <div className="overflow-hidden rounded-3xl border border-slate-800/80 shadow-2xl bg-[#0a0f1d]" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {displayProducts.map((product, idx) => (
            <div
              key={product.id || idx}
              className="relative flex-[0_0_100%] min-w-0 h-[380px] sm:h-[460px] lg:h-[520px] overflow-hidden"
            >
              {/* Product Background Image (Lazy Loaded) */}
              {product.primary_image ? (
                <img
                  src={product.primary_image}
                  alt={product.name}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.82] transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1d] via-[#0f172a] to-[#1e3a8a]/30 flex items-center justify-center font-mono text-slate-500">
                  JP Fleet Specification
                </div>
              )}

              {/* Multi-layer duotone gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/60 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d]/90 via-[#0a0f1d]/40 to-transparent sm:max-w-2xl"></div>

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-end max-w-3xl z-10 space-y-4">
                {/* Category & Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-700/60 text-blue-200 text-[11px] font-mono uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                    Featured Machinery
                  </span>
                  {product.categories.slice(0, 2).map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700 backdrop-blur-xs"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>

                {/* Product Name */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {product.name}
                </h2>

                {/* Short Description */}
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-2xl leading-relaxed">
                  {product.short_description ||
                    "Industrial-duty turnkey machinery engineered for severe operational cycles and rigorous manufacturing standards."}
                </p>

                {/* Dual Action CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    href={`/products/${product.slug}`}
                    variant="primary"
                    size="sm"
                    className="font-semibold text-xs sm:text-sm"
                  >
                    View Specifications &rarr;
                  </Button>
                  <Button
                    href={`/contact?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                    variant="accent"
                    size="sm"
                    className="font-semibold text-xs sm:text-sm"
                  >
                    Request Quote
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Arrow Controls (Left / Right) */}
      <button
        onClick={scrollPrev}
        aria-label="Previous equipment slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-[#0a0f1d]/85 text-white border border-slate-700/80 flex items-center justify-center shadow-lg hover:bg-blue-700 hover:border-blue-600 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer z-20"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={scrollNext}
        aria-label="Next equipment slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-[#0a0f1d]/85 text-white border border-slate-700/80 flex items-center justify-center shadow-lg hover:bg-blue-700 hover:border-blue-600 transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer z-20"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Manual Clickable Dot Indicators */}
      <div className="absolute bottom-5 right-6 sm:right-10 flex items-center gap-2 z-20 bg-[#0a0f1d]/70 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-800">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            aria-label={`Go to equipment slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              selectedIndex === idx
                ? "w-7 h-2 bg-blue-500"
                : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
