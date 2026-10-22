export interface Shop {
  id: string;
  name: string;
  description?: string;
  city: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  sold: number;
  rating: number;
  shopId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  shop?: Shop;
  category?: Category;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  items: Product[];
  meta: PaginationMeta;
}

export type ProductSortOption = 'newest' | 'price_asc' | 'price_desc' | 'best_selling';

export interface ProductQueryParams {
  search?: string;
  categoryId?: string;
  sort?: ProductSortOption;
  page?: number;
  limit?: number;
}
