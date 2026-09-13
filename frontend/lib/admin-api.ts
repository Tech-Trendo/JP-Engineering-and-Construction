const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export { getMediaUrl } from "./public-api";

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_or_image: string | null;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminProductImage {
  id?: number;
  image?: string | File | null;
  alt_text: string;
  order: number;
  is_primary: boolean;
}

export interface AdminProductSpecification {
  id?: number;
  label: string;
  value: string;
  order: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  categories: { id: number; name: string; slug: string }[];
  category_ids?: number[];
  images: AdminProductImage[];
  specifications: AdminProductSpecification[];
  is_active: boolean;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface AdminQuote {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  product: number | null;
  product_name?: string | null;
  message: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
  updated_at: string;
}

export interface AdminTeamMember {
  id: number;
  name: string;
  designation: string;
  photo: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminPartner {
  id: number;
  name: string;
  logo: string | null;
  website_url: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminClient {
  id: number;
  name: string;
  logo: string | null;
  website_url: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminSiteContent {
  id?: number;
  title: string;
  short_intro: string;
  full_intro: string;
  created_at?: string;
  updated_at?: string;
}

export async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  if (cleanEndpoint.startsWith("api/v1/")) {
    cleanEndpoint = cleanEndpoint.slice("api/v1/".length);
  }
  const url = `${API_BASE_URL}/${cleanEndpoint}`;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `API Error [${response.status}]`;
    try {
      const errorJson = await response.json();
      if (typeof errorJson === "object" && errorJson !== null) {
        const messages = Object.entries(errorJson).map(([key, val]) => {
          if (Array.isArray(val)) return `${key}: ${val.join(", ")}`;
          if (typeof val === "string") return `${key}: ${val}`;
          return `${key}: ${JSON.stringify(val)}`;
        });
        errorDetail = messages.join(" | ") || errorDetail;
      }
    } catch {
      const errorText = await response.text().catch(() => "");
      if (errorText) errorDetail = `${errorDetail}: ${errorText}`;
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export function unwrapAdminResults<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && "results" in data && Array.isArray((data as { results: unknown[] }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

export async function getAdminSiteContent(token: string): Promise<AdminSiteContent> {
  return adminFetch<AdminSiteContent>("admin/site-content/", { method: "GET" }, token);
}

export async function updateAdminSiteContent(
  token: string,
  data: Partial<AdminSiteContent>
): Promise<AdminSiteContent> {
  return adminFetch<AdminSiteContent>("admin/site-content/", {
    method: "PATCH",
    body: JSON.stringify(data),
  }, token);
}
