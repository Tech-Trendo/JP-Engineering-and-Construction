import React from "react";
import { Navbar, Footer } from "@/components/ui";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafaf9] dark:bg-[#111215] text-stone-900 dark:text-stone-100 antialiased selection:bg-amber-500/20">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
