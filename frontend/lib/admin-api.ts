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
  tiktok_url?: string;
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
  coverage_is_active?: boolean;
  coverage_badge?: string;
  coverage_heading?: string;
  coverage_subtext?: string;
  coverage_stat_districts?: string;
  coverage_stat_projects?: string;
  coverage_stat_provinces?: string;
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

export async function getAdminSiteContent(token: string): Promise<AdminSiteContent> {
  return adminFetch<AdminSiteContent>("admin/site-content/", { method: "GET" }, token);
}

export async function updateAdminSiteContent(
  token: string,
  data: Partial<AdminSiteContent>
): Promise<AdminSiteContent> {
  return adminFetch<AdminSiteContent>(
    "admin/site-content/",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    token
  );
}

export interface AdminFaq {
  id: number;
  question: string;
  answer: string;
  page: string;
  category: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAdminFaqs(token: string, page?: string): Promise<AdminFaq[]> {
  const endpoint = page ? `admin/faqs/?page=${encodeURIComponent(page)}` : "admin/faqs/";
  const data = await adminFetch<unknown>(endpoint, { method: "GET" }, token);
  return unwrapAdminResults<AdminFaq>(data);
}

export async function createAdminFaq(
  token: string,
  data: Partial<AdminFaq>
): Promise<AdminFaq> {
  return adminFetch<AdminFaq>(
    "admin/faqs/",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    token
  );
}

export async function updateAdminFaq(
  token: string,
  id: number,
  data: Partial<AdminFaq>
): Promise<AdminFaq> {
  return adminFetch<AdminFaq>(
    `admin/faqs/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    token
  );
}

export async function deleteAdminFaq(token: string, id: number): Promise<void> {
  await adminFetch<unknown>(
    `admin/faqs/${id}/`,
    {
      method: "DELETE",
    },
    token
  );
}

export interface AdminDistrictCoverage {
  id: number;
  district_name: string;
  province: string;
  is_highlighted: boolean;
  projects_count: number;
  services_summary: string;
  description: string;
  highlight_color: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminCoverageSettings {
  coverage_is_active: boolean;
  coverage_badge: string;
  coverage_heading: string;
  coverage_subtext: string;
  coverage_stat_districts: string;
  coverage_stat_projects: string;
  coverage_stat_provinces: string;
}

export async function getAdminDistricts(token: string): Promise<AdminDistrictCoverage[]> {
  const data = await adminFetch<unknown>("admin/coverage-districts/", { method: "GET" }, token);
  return unwrapAdminResults<AdminDistrictCoverage>(data);
}

export async function toggleAdminDistrictHighlight(
  token: string,
  id: number,
  isHighlighted?: boolean
): Promise<AdminDistrictCoverage> {
  return adminFetch<AdminDistrictCoverage>(
    `admin/coverage-districts/${id}/toggle-highlight/`,
    {
      method: "POST",
      body: JSON.stringify(isHighlighted !== undefined ? { is_highlighted: isHighlighted } : {}),
    },
    token
  );
}

export async function updateAdminDistrict(
  token: string,
  id: number,
  data: Partial<AdminDistrictCoverage>
): Promise<AdminDistrictCoverage> {
  return adminFetch<AdminDistrictCoverage>(
    `admin/coverage-districts/${id}/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    token
  );
}

export async function createAdminDistrict(
  token: string,
  data: Partial<AdminDistrictCoverage>
): Promise<AdminDistrictCoverage> {
  return adminFetch<AdminDistrictCoverage>(
    "admin/coverage-districts/",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    token
  );
}

export async function deleteAdminDistrict(token: string, id: number): Promise<void> {
  await adminFetch<unknown>(
    `admin/coverage-districts/${id}/`,
    {
      method: "DELETE",
    },
    token
  );
}

export async function getAdminCoverageSettings(token: string): Promise<AdminCoverageSettings> {
  return adminFetch<AdminCoverageSettings>("admin/coverage-settings/", { method: "GET" }, token);
}

export async function updateAdminCoverageSettings(
  token: string,
  data: Partial<AdminCoverageSettings>
): Promise<AdminCoverageSettings> {
  return adminFetch<AdminCoverageSettings>(
    "admin/coverage-settings/",
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    token
  );
}


