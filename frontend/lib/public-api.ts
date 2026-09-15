import { apiClient, ApiError } from "./api";

/**
 * Normalizes any backend media URL to a relative path (`/media/...`)
 * so it routes through Next.js proxy rewrites without CORS blocks.
 */
/**
 * Normalizes any backend media URL to a local relative path (`/media/...`)
 * so all assets are served directly with maximum performance and zero 404s.
 */
export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return "";

  // If it's a third-party external URL (e.g. unsplash), return as is
  if (
    (url.startsWith("http://") || url.startsWith("https://")) &&
    !url.includes("jpengineering.com.np") &&
    !url.includes("127.0.0.1") &&
    !url.includes("localhost")
  ) {
    return url;
  }

  // Extract relative /media/... path if full backend origin was included
  const mediaIdx = url.indexOf("/media/");
  if (mediaIdx !== -1) {
    return url.substring(mediaIdx);
  }

  // If path starts with media/ (no leading slash)
  if (url.startsWith("media/")) {
    return `/${url}`;
  }

  // If already relative /assets/ or /images/
  if (url.startsWith("/assets/") || url.startsWith("/images/")) {
    return url;
  }

  // Otherwise treat as a media root relative path
  const clean = url.startsWith("/") ? url.substring(1) : url;
  return `/media/${clean}`;
}

export interface PublicCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_or_image: string | null;
  order: number;
}

export interface PublicProductCategorySnippet {
  id: number;
  name: string;
  slug: string;
}

export interface PublicProductListItem {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  categories: PublicProductCategorySnippet[];
  primary_image: string | null;
  is_featured: boolean;
  order: number;
}

export interface PublicProductImage {
  id: number;
  image: string;
  alt_text: string;
  order: number;
  is_primary: boolean;
}

export interface PublicProductSpecification {
  id: number;
  label: string;
  value: string;
  order: number;
}

export interface PublicProductDetail {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  categories: PublicProductCategorySnippet[];
  images: PublicProductImage[];
  specifications: PublicProductSpecification[];
  related_products: PublicProductListItem[];
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface PublicTeamMember {
  id: number;
  name: string;
  designation: string;
  photo: string | null;
  order: number;
}

export interface PublicPartner {
  id: number;
  name: string;
  logo: string | null;
  website_url: string;
  order: number;
}

export interface PublicClient {
  id: number;
  name: string;
  logo: string | null;
  website_url: string;
  order: number;
}

export interface PublicSiteContent {
  id?: number;
  title: string;
  short_intro: string;
  full_intro: string;
  updated_at?: string;
}

export interface PublicSiteSettings {
  id?: number;
  company_name: string;
  company_short_name: string;
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
  hero_image_url: string | null;
  logo?: string | null;
  logo_url?: string | null;
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
  iso_certificate_image?: string | null;
  iso_certificate_image_url?: string | null;
  iso_scope?: string;
  iso_accreditation?: string;
  iso_issue_date?: string;
  iso_expiry_date?: string;
  updated_at?: string;
}

export interface PublicHeroSlide {
  id: number;
  title: string;
  badge: string;
  heading: string;
  subtext: string;
  image: string;
  image_url: string | null;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  order: number;
  is_active: boolean;
}

export interface PublicIndustry {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_or_image: string | null;
  icon_or_image_url: string | null;
  categories_count: number;
  products_count: number;
  order: number;
}

export interface PublicIndustryDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_or_image: string | null;
  icon_or_image_url: string | null;
  categories: PublicCategory[];
  products: PublicProductListItem[];
  order: number;
}

export interface QuoteSubmitData {
  full_name: string;
  email: string;
  phone: string;
  company?: string;
  product?: number | null;
  message: string;
}

export interface QuoteSubmitResponse {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

function unwrapResults<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results: T[] }).results)
  ) {
    return (data as { results: T[] }).results;
  }
  return [];
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  return apiClient<PublicSiteSettings>("public/site-settings/");
}

export async function getPublicSiteContent(): Promise<PublicSiteContent> {
  return apiClient<PublicSiteContent>("public/site-content/");
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const data = await apiClient<unknown>("public/categories/");
  return unwrapResults<PublicCategory>(data);
}

export async function getPublicProducts(params?: {
  category?: string | string[];
  q?: string;
  is_featured?: boolean;
}): Promise<PublicProductListItem[]> {
  const searchParams = new URLSearchParams();

  if (params?.category) {
    if (Array.isArray(params.category)) {
      params.category.forEach((c) => searchParams.append("category", c));
    } else {
      searchParams.append("category", params.category);
    }
  }

  if (params?.q) {
    searchParams.append("q", params.q);
  }

  if (params?.is_featured !== undefined) {
    searchParams.append("is_featured", String(params.is_featured));
  }

  const queryStr = searchParams.toString();
  const endpoint = queryStr ? `public/products/?${queryStr}` : "public/products/";
  const data = await apiClient<unknown>(endpoint);
  return unwrapResults<PublicProductListItem>(data);
}

export async function getPublicProductDetail(
  slug: string
): Promise<PublicProductDetail | null> {
  try {
    return await apiClient<PublicProductDetail>(`public/products/${slug}/`);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    console.error(`[public-api getPublicProductDetail failed for ${slug}]:`, err);
    throw err;
  }
}

export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  const data = await apiClient<unknown>("public/team/");
  return unwrapResults<PublicTeamMember>(data);
}

export async function getPublicPartners(): Promise<PublicPartner[]> {
  const data = await apiClient<unknown>("public/partners/");
  return unwrapResults<PublicPartner>(data);
}

export async function getPublicClients(): Promise<PublicClient[]> {
  const data = await apiClient<unknown>("public/clients/");
  return unwrapResults<PublicClient>(data);
}

export async function submitQuote(
  data: QuoteSubmitData
): Promise<QuoteSubmitResponse> {
  return apiClient<QuoteSubmitResponse>("public/quotes/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPublicHeroSlides(): Promise<PublicHeroSlide[]> {
  const data = await apiClient<unknown>("public/site-settings/hero-slides/");
  return unwrapResults<PublicHeroSlide>(data);
}

export async function getPublicIndustries(): Promise<PublicIndustry[]> {
  const data = await apiClient<unknown>("public/industries/");
  return unwrapResults<PublicIndustry>(data);
}

export async function getPublicIndustryDetail(
  slug: string
): Promise<PublicIndustryDetail | null> {
  try {
    return await apiClient<PublicIndustryDetail>(`public/industries/${slug}/`);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    console.error(`[public-api getPublicIndustryDetail failed for ${slug}]:`, err);
    throw err;
  }
}


