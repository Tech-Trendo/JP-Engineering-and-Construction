import React from "react";
import { AdminAuthProvider } from "@/lib/admin-auth-context";
import { AdminShell } from "@/components/admin";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthProvider>
      <div style={{ fontFamily: "var(--font-poppins, 'Poppins', sans-serif)" }}>
        <AdminShell>{children}</AdminShell>
      </div>
    </AdminAuthProvider>
  );
}
