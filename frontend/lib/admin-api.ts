const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://app.jpengineering.com.np/api/v1"
    : "http://localhost:8000/api/v1");

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
  previewUrl?: string;
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

export interface AdminHeroSlide {
  id: number;
  title: string;
  badge: string;
  heading: string;
  subtext: string;
  image: string | File | null;
  image_url?: string | null;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminIndustry {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_or_image: string | File | null;
  icon_or_image_url?: string | null;
  categories: number[];
  categories_details?: { id: number; name: string; slug: string }[];
  products_count?: number;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminSiteSettings {
  id?: number;
  company_name: string;
  company_short_name: string;
  logo: string | null;
  logo_url?: string | null;
  tagline: string;
  company_description: string;
  founding_year: string;
  company_type: string;
  registration_number: string;
  pan_vat_number: string;
  employee_count: string;
  primary_phone: string;
  secondary_phone: string;
  primary_email: string;
  secondary_email: string;
  address: string;
  business_hours: string;
  map_location_text: string;
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
  youtube_url: string;
  hero_badge: string;
  hero_heading: string;
  hero_subtext: string;
  hero_image: string | null;
  hero_image_url?: string | null;
  hero_cta_primary_label: string;
  hero_cta_primary_link: string;
  hero_cta_secondary_label: string;
  hero_cta_secondary_link: string;
  stat_years_experience: string;
  stat_projects_completed: string;
  stat_happy_clients: string;
  stat_business_sectors: string;
  cta_heading: string;
  cta_subtext: string;
  cta_button_label: string;
  cta_button_link: string;
  iso_certified?: boolean;
  iso_standard?: string;
  iso_certificate_number?: string;
  iso_certificate_image?: string | File | null;
  iso_certificate_image_url?: string | null;
  iso_scope?: string;
  iso_accreditation?: string;
  iso_issue_date?: string;
  iso_expiry_date?: string;
  updated_at?: string;
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
    cache: "no-store",
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
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results: unknown[] }).results)
  ) {
    return (data as { results: T[] }).results;
  }
  return [];
}

export async function getAdminSiteSettings(token: string): Promise<AdminSiteSettings> {
  return adminFetch<AdminSiteSettings>("admin/site-settings/", { method: "GET" }, token);
}

export async function updateAdminSiteSettings(
  token: string,
  data: Partial<AdminSiteSettings>
): Promise<AdminSiteSettings> {
  return adminFetch<AdminSiteSettings>(
    "admin/site-settings/",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    token
  );
}
