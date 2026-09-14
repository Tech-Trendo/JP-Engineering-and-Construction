"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type {
  PublicSiteSettings,
  PublicCategory,
  PublicIndustry,
  PublicProductListItem,
} from "@/lib/public-api";

export default function ConditionalShell({
  siteSettings,
  categories,
  industries,
  products,
  children,
}: {
  siteSettings?: PublicSiteSettings;
  categories?: PublicCategory[];
  industries?: PublicIndustry[];
  products?: PublicProductListItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header
        siteSettings={siteSettings}
        categories={categories}
        industries={industries}
        products={products}
      />
      <main className="flex-1">{children}</main>
      <Footer
        siteSettings={siteSettings}
        categories={categories}
        industries={industries}
      />
    </>
  );
}
