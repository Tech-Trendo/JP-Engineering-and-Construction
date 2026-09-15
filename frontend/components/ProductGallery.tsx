"use client";

import { useState } from "react";
import type { PublicProductImage } from "@/lib/public-api";
import { getMediaUrl } from "@/lib/public-api";

export default function ProductGallery({
  images,
  productName,
  fallbackImage,
}: {
  images: PublicProductImage[];
  productName: string;
  fallbackImage?: string | null;
}) {
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.order - b.order;
  });

  const defaultActive =
    sortedImages.length > 0
      ? getMediaUrl(sortedImages[0].image)
      : getMediaUrl(fallbackImage) || "";

  const [activeImage, setActiveImage] = useState<string>(defaultActive);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative aspect-square max-h-[500px] w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex items-center justify-center p-4">
        {activeImage ? (
          <img
            src={activeImage}
            alt={productName}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="text-center p-8 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs font-medium">No photo uploaded in catalog</p>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex flex-wrap gap-2.5">
          {sortedImages.map((img) => {
            const imgSrc = getMediaUrl(img.image);
            const isSelected = activeImage === imgSrc;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImage(imgSrc)}
                className={`relative w-20 h-20 rounded border-2 overflow-hidden bg-white p-1 transition-all ${
                  isSelected
                    ? "border-[#c8391a] shadow-md scale-105"
                    : "border-gray-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={imgSrc}
                  alt={img.alt_text || productName}
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
