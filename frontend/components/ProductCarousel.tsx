"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { PublicProductListItem, getMediaUrl } from "@/lib/public-api";

interface ProductCarouselProps {
  products: PublicProductListItem[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive items per view
  useEffect(() => {
    function updateCardsPerPage() {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else if (window.innerWidth < 1280) {
        setCardsPerPage(3);
      } else {
        setCardsPerPage(4);
      }
    }

    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / cardsPerPage));
  const maxIndex = Math.max(0, products.length - cardsPerPage);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || products.length <= cardsPerPage) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, handleNext, products.length, cardsPerPage]);

  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-100 p-8 rounded bg-gray-50">
        <p className="text-gray-500 text-sm">No machinery products listed yet.</p>
      </div>
    );
  }

  // Calculate percentage shift for smooth translation
  const itemWidthPercent = 100 / cardsPerPage;
  const transformX = currentIndex * itemWidthPercent;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-bold text-[#1b3a6e]">{currentIndex + 1}</span> -{" "}
          <span className="font-bold text-[#1b3a6e]">
            {Math.min(currentIndex + cardsPerPage, products.length)}
          </span>{" "}
          of <span className="font-bold text-[#1b3a6e]">{products.length}</span> machines
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous machinery slide"
            className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-[#1b3a6e] hover:text-white hover:border-[#1b3a6e] text-[#1b3a6e] flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next machinery slide"
            className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-[#1b3a6e] hover:text-white hover:border-[#1b3a6e] text-[#1b3a6e] flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div className="overflow-hidden rounded-lg pb-2">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${transformX}%)`,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="shrink-0 px-2.5"
              style={{ width: `${itemWidthPercent}%` }}
            >
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:border-[#1b3a6e] transition-all flex flex-col h-full group/card">
                {/* Image Container */}
                <Link
                  href={`/products/${p.slug}`}
                  className="block relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer"
                >
                  {p.primary_image ? (
                    <img
                      src={getMediaUrl(p.primary_image)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1b3a6e]/5 flex flex-col items-center justify-center text-gray-400 text-xs">
                      <svg
                        className="w-10 h-10 text-gray-300 mb-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                        />
                      </svg>
                      <span>Industrial Machine</span>
                    </div>
                  )}
                </Link>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#1b3a6e] text-sm mb-1.5 group-hover/card:text-[#c8391a] transition-colors line-clamp-1 leading-snug">
                      <Link href={`/products/${p.slug}`} className="hover:text-[#c8391a] transition-colors">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
                      {p.short_description}
                    </p>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-2">
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-[#c8391a] hover:bg-[#a62d14] text-white text-[11px] font-bold uppercase tracking-wider py-2 rounded shadow-sm hover:shadow transition-all text-center"
                    >
                      Specifications
                    </Link>
                    <Link
                      href={`/contact-us?product=${p.id}&name=${encodeURIComponent(p.name)}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 bg-[#c8391a] hover:bg-[#a62d14] text-white text-[11px] font-bold uppercase tracking-wider py-2 rounded shadow-sm hover:shadow transition-all"
                    >
                      Quote
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageIndex = i * cardsPerPage;
            const isActive =
              currentIndex >= pageIndex &&
              currentIndex < pageIndex + cardsPerPage;

            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(Math.min(pageIndex, maxIndex))}
                aria-label={`Go to slide page ${i + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? "w-6 bg-[#c8391a]"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
