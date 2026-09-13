import { apiClient } from "./api";

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

export interface QuoteSubmitData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  product?: number | null;
  message: string;
}

export interface QuoteSubmitResponse {
  success: boolean;
  message: string;
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

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const data = await apiClient<unknown>("public/categories/");
  return unwrapResults<PublicCategory>(data);
}

export async function getPublicProducts(params?: {
  category?: string | string[];
  q?: string;
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

  const queryStr = searchParams.toString();
  const endpoint = queryStr ? `public/products/?${queryStr}` : "public/products/";
  const data = await apiClient<unknown>(endpoint);
  return unwrapResults<PublicProductListItem>(data);
}

export async function getPublicProductDetail(
  slug: string
): Promise<PublicProductDetail> {
  return apiClient<PublicProductDetail>(`public/products/${slug}/`);
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

export async function getPublicSiteContent(): Promise<PublicSiteContent> {
  return apiClient<PublicSiteContent>("public/site-content/");
}
