import React from "react";
import Image from "next/image";
import { LOGO_URL, SITE_CONFIG } from "@/lib/constants";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  lightBackground?: boolean;
}

export function BrandLogo({
  className = "",
  size = "md",
  showText = true,
  lightBackground = false,
}: BrandLogoProps) {
  const sizeMap = {
    sm: { img: 32, box: "h-8 w-8", title: "text-xs", sub: "text-[9px]" },
    md: { img: 40, box: "h-10 w-10", title: "text-sm", sub: "text-[10px]" },
    lg: { img: 52, box: "h-13 w-13", title: "text-base", sub: "text-xs" },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <div
        className={`${current.box} rounded-lg bg-white p-1 border border-stone-200/80 dark:border-stone-800 shadow-xs shrink-0 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105`}
      >
        <Image
          src={LOGO_URL}
          alt={SITE_CONFIG.name}
          width={current.img}
          height={current.img}
          className="h-full w-full object-contain"
          priority
        />
      </div>
      {showText && (
        <div>
          <div
            className={`font-extrabold tracking-tight leading-none transition-colors ${
              lightBackground
                ? "text-stone-950"
                : "text-stone-950 dark:text-white group-hover:text-amber-500"
            } ${current.title}`}
          >
            {SITE_CONFIG.shortName.toUpperCase()}
          </div>
          <span
            className={`font-semibold tracking-wider uppercase block mt-0.5 ${
              lightBackground ? "text-stone-500" : "text-stone-500 dark:text-stone-400"
            } ${current.sub}`}
          >
            {SITE_CONFIG.subTitle}
          </span>
        </div>
      )}
    </div>
  );
}
