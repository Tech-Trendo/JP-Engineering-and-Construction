"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAdminAuth();

  const isLoginPage = pathname === "/admin/login";

  // Login page has its own clean, centered layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              JP
            </div>
            <h2 className="text-xl font-bold tracking-wide">JP Admin</h2>
          </div>

          <nav className="mt-8 space-y-1.5">
            <Link
              href="/admin/dashboard"
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                pathname === "/admin/dashboard"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-800 space-y-3">
          <div className="text-xs text-gray-400">
            <p className="font-medium text-gray-300 truncate">
              {user?.username ? `@${user.username}` : "Staff Admin"}
            </p>
            <p className="text-[11px] text-emerald-400 mt-0.5">Staff Authorized</p>
          </div>
          <button
            onClick={() => logout()}
            className="w-full text-left text-xs font-medium text-red-400 hover:text-red-300 transition py-1"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
