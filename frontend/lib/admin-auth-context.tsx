"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

interface AdminAuthContextType {
  accessToken: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  // In-memory access token (never written to localStorage or document.cookie)
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.access);
        return true;
      } else {
        setAccessToken(null);
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error("Failed to refresh admin session:", err);
      setAccessToken(null);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore in-memory access token on initial page load / refresh
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = async (
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error:
            data.detail ||
            data.non_field_errors?.[0] ||
            "Authentication failed. Please check your credentials.",
        };
      }

      // Store access token in memory state
      setAccessToken(data.access);
      if (data.user) {
        setUser(data.user);
      }
      return { success: true };
    } catch (err) {
      console.error("Login request failed:", err);
      return {
        success: false,
        error: "A network error occurred. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      // Clear in-memory state
      setAccessToken(null);
      setUser(null);
      router.push("/admin/login");
      router.refresh();
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
