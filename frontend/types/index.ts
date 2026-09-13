export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: Category;
  image?: string;
  specifications?: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: 'pending' | 'reviewed' | 'contacted';
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  created_at: string;
  updated_at: string;
}

export interface PartnerClient {
  id: number;
  name: string;
  type: 'partner' | 'client';
  logo?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}
