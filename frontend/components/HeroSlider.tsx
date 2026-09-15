"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PublicSiteSettings, PublicHeroSlide, getMediaUrl } from "@/lib/public-api";

interface HeroSliderProps {
  siteSettings: PublicSiteSettings | null;
  slides?: PublicHeroSlide[];
}

interface SlideItem {
  id: number;
  image: string;
  badge: string;
  heading: string;
  subtext: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel: string;
  secondaryLink: string;
}

export default function HeroSlider({ siteSettings, slides: dynamicSlides = [] }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mainHeroImage =
    (siteSettings && getMediaUrl(siteSettings.hero_image_url || siteSettings.hero_image)) ||
    "/images/hero-machinery.webp";

  const slides: SlideItem[] =
    dynamicSlides.length > 0
      ? dynamicSlides.map((s) => ({
          id: s.id,
          image: getMediaUrl(s.image_url || s.image) || mainHeroImage,
          badge: s.badge || "",
          heading: s.heading,
          subtext: s.subtext,
          primaryLabel: s.primary_cta_label || "Explore Machinery",
          primaryLink: s.primary_cta_link || "/products",
          secondaryLabel: s.secondary_cta_label || "Request a Quote",
          secondaryLink: s.secondary_cta_link || "/contact-us#quote",
        }))
      : [
          {
            id: 1,
            image: mainHeroImage,
            badge: siteSettings?.hero_badge || "",
            heading: siteSettings?.hero_heading || "",
            subtext: siteSettings?.hero_subtext || "",
            primaryLabel: siteSettings?.hero_cta_primary_label || "Explore Machinery",
            primaryLink: siteSettings?.hero_cta_primary_link || "/products",
            secondaryLabel: siteSettings?.hero_cta_secondary_label || "Request a Quote",
            secondaryLink: siteSettings?.hero_cta_secondary_link || "/contact-us#quote",
          },
        ];

  const handleNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay timer (5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  return (
    <section
      className="relative min-h-[540px] md:min-h-[620px] flex items-center bg-[#071324] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Carousel Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Real Background Image */}
            <img
              src={slide.image}
              alt={slide.heading}
              className={`w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
            />

            {/* Gradient Overlays: Subtle darkening on left for crisp text contrast while keeping background machinery clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#071324]/90 via-[#0a1b33]/60 to-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/80 via-transparent to-black/30" />
          </div>
        );
      })}

      {/* Slide Text Content Container */}
      <div className="relative z-20 max-w-[1280px] mx-auto px-4 py-16 md:py-24 w-full">
        <div className="max-w-[740px]">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            if (!isActive) return null;

            return (
              <div
                key={slide.id}
                className="transition-all duration-700 ease-out transform translate-y-0 opacity-100"
              >
                {/* Main Heading */}
                <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] mb-5 tracking-tight drop-shadow-md">
                  {slide.heading}
                </h1>

                {/* Subtext */}
                <p className="text-gray-100 text-base sm:text-lg leading-relaxed mb-8 max-w-[660px] font-normal drop-shadow-sm">
                  {slide.subtext}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {slide.primaryLabel && (
                    <Link
                      href={slide.primaryLink}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded shadow-sm hover:shadow transition-all group cursor-pointer text-center"
                    >
                      <span>{slide.primaryLabel}</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  )}
                  {slide.secondaryLabel && (
                    <Link
                      href={slide.secondaryLink}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3.5 rounded shadow-sm hover:shadow transition-all cursor-pointer text-center"
                    >
                      {slide.secondaryLabel}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev / Next Navigation Arrows (visible on tablet/desktop) */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#c8391a] text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-[#c8391a] text-white backdrop-blur-sm border border-white/20 items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Slide Indicators & Auto Progress */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
        {slides.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                isActive
                  ? "w-8 bg-[#c8391a] shadow-md"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
