"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getPublicSiteSettings,
  getPublicCategories,
  getPublicIndustries,
  getPublicProducts,
  type PublicSiteSettings,
  type PublicCategory,
  type PublicIndustry,
  type PublicProductListItem,
} from "@/lib/public-api";

export default function ConditionalShell({
  siteSettings: initialSettings,
  categories: initialCategories,
  industries: initialIndustries,
  products: initialProducts,
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

  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | undefined>(initialSettings);
  const [categories, setCategories] = useState<PublicCategory[]>(initialCategories || []);
  const [industries, setIndustries] = useState<PublicIndustry[]>(initialIndustries || []);
  const [products, setProducts] = useState<PublicProductListItem[]>(initialProducts || []);

  useEffect(() => {
    if (isAdmin) return;

    // Fetch live data directly from browser to guarantee live backend connection
    getPublicSiteSettings()
      .then((data) => setSiteSettings(data))
      .catch((err) => console.error("[Shell] siteSettings fetch failed:", err));

    getPublicCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("[Shell] categories fetch failed:", err));

    getPublicIndustries()
      .then((data) => setIndustries(data))
      .catch((err) => console.error("[Shell] industries fetch failed:", err));

    getPublicProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error("[Shell] products fetch failed:", err));
  }, [isAdmin]);

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
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      <Footer
        siteSettings={siteSettings}
        categories={categories}
        industries={industries}
      />
    </>
  );
}
