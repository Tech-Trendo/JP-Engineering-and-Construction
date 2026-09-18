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
  tiktok_url?: string;
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
  coverage_is_active?: boolean;
  coverage_badge?: string;
  coverage_heading?: string;
  coverage_subtext?: string;
  coverage_stat_districts?: string;
  coverage_stat_projects?: string;
  coverage_stat_provinces?: string;
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

export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  id: 1,
  company_name: "JP Engineering & Construction Pvt. Ltd.",
  company_short_name: "JP Engineering & Construction Pvt. Ltd.",
  tagline: "A trusted name in Nepal's engineering sector",
  company_description:
    "A leading engineering company in Nepal specializing in cold storage, water systems, dairy processing, steel fabrication, solar energy, and construction.",
  founding_year: "1998",
  company_type: "Private Limited",
  registration_number: "",
  pan_vat_number: "",
  employee_count: "150+",
  primary_phone: "01-5385552",
  secondary_phone: "9851112988, 9851158661, 9851158660",
  primary_email: "info@jpec.com.np",
  secondary_email: "",
  address: "Kathmandu, Nepal",
  business_hours: "Mon - Sat: 9:00 AM - 6:00 PM",
  map_location_text: "Kathmandu, Nepal",
  facebook_url: "https://facebook.com",
  tiktok_url: "https://tiktok.com",
  twitter_url: "",
  linkedin_url: "",
  youtube_url: "https://youtube.com",
  hero_badge: "Engineering Excellence",
  hero_heading: "JP Engineering & Construction Pvt. Ltd.",
  hero_subtext:
    "A trusted name in Nepal's engineering sector — delivering integrated solutions in cold storage, water treatment, dairy processing, steel fabrication, renewable energy, and construction since 1998.",
  hero_image: null,
  hero_image_url: null,
  hero_cta_primary_label: "About Us",
  hero_cta_primary_link: "/about/introduction",
  hero_cta_secondary_label: "Contact Us",
  hero_cta_secondary_link: "/contact-us",
  stat_years_experience: "25+",
  stat_projects_completed: "500+",
  stat_happy_clients: "300+",
  stat_business_sectors: "6",
  cta_heading: "Ready to Start Your Project?",
  cta_subtext: "Contact our engineering team for a free consultation and project estimate.",
  cta_button_label: "Get In Touch",
  cta_button_link: "/contact-us",
  iso_certified: true,
  iso_standard: "ISO 9001:2015",
  iso_certificate_number: "129594/A/0001/UK/En",
  iso_certificate_image: null,
  iso_certificate_image_url: null,
  iso_scope:
    "Manufacturing and Assembly of Reverse Osmosis Plant, Dairy Equipment's (Pasteurizer, Homogenizer, Chilling Vat, Road Milk Tanker), Cold Storage Equipment's, Solar Energy & Heat Pump System, Steel Fabrication",
  iso_accreditation: "URS / UKAS Management Systems (0043) / IAF Multilateral Recognition Arrangement",
  iso_issue_date: "18 November 2023",
  iso_expiry_date: "17 November 2026",
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    return await apiClient<PublicSiteSettings>("public/site-settings/");
  } catch (err) {
    console.warn("[public-api getPublicSiteSettings failed, using fallback defaults]:", err);
    return DEFAULT_SITE_SETTINGS;
  }
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

export interface PublicFaq {
  id: number;
  question: string;
  answer: string;
  page: string;
  category?: string;
  order: number;
}

export async function getPublicFaqs(page?: string): Promise<PublicFaq[]> {
  try {
    const endpoint = page ? `public/faqs/?page=${encodeURIComponent(page)}` : "public/faqs/";
    const data = await apiClient<unknown>(endpoint);
    return unwrapResults<PublicFaq>(data);
  } catch (err) {
    console.warn(`[public-api getPublicFaqs failed for page=${page}]:`, err);
    return [];
  }
}

export interface PublicDistrictCoverage {
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
}

export interface PublicCoverageStats {
  highlighted_count: number;
  total_districts: number;
  total_projects: number;
  provinces_count: number;
}

export interface PublicCoverageData {
  is_active: boolean;
  badge: string;
  heading: string;
  subtext: string;
  stat_districts: string;
  stat_projects: string;
  stat_provinces: string;
  highlighted_districts: string[];
  districts: PublicDistrictCoverage[];
  stats: PublicCoverageStats;
}

export async function getPublicCoverage(): Promise<PublicCoverageData> {
  try {
    const data = await apiClient<PublicCoverageData>("public/site-settings/coverage/");
    return data;
  } catch (err) {
    console.warn("[public-api getPublicCoverage failed]:", err);
    return {
      is_active: false,
      badge: "Nationwide Footprint",
      heading: "Our Engineering Services Across Nepal",
      subtext: "",
      stat_districts: "",
      stat_projects: "",
      stat_provinces: "",
      highlighted_districts: [],
      districts: [],
      stats: {
        highlighted_count: 0,
        total_districts: 0,
        total_projects: 0,
        provinces_count: 0,
      },
    };
  }
}



