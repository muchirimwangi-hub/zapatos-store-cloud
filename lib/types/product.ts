export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  images: any; 
  category: string;
  subcategory?: string;
  brand?: string;
  is_active: boolean;
  is_featured: boolean;
  volume?: string;
  notes?: string[];
  ingredients?: string[];
  personality_tags?: string[];
  sku?: string;
  created_at?: string;
}

// This structure matches your Checkout and Store logic perfectly
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}