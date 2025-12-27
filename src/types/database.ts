// Database types for Supabase tables

export interface Portfolio {
  id?: string;
  type: string;
  name: string;
  description: string;
  programming_language: string;
  live_demo_url?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateReview {
  reviewer_name: string;
  review_text: string;
  rating: number;
  created_at?: string;
}

export interface Template {
  id?: string;
  name: string;
  description: string;
  programming_language: string;
  price: number;
  review?: number;
  image?: string;
  images?: string[];
  reviews?: TemplateReview[];
  created_at?: string;
  updated_at?: string;
}

export interface MarketplaceReview {
  reviewer_name: string;
  review_text: string;
  rating: number;
  created_at?: string;
}

export interface MarketplaceItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  review?: number;
  type: 'plugin' | 'api' | 'vps' | 'server';
  image?: string;
  images?: string[];
  reviews?: MarketplaceReview[];
  created_at?: string;
  updated_at?: string;
}

