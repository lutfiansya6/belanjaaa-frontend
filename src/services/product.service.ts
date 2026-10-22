import apiClient from '@/lib/api-client';
import { Product, ProductsResponse, Category, ProductQueryParams } from '@/types';

export const productService = {
  /**
   * Fetch paginated list of products with optional search, category, sort, and pagination filters
   */
  async getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
    const queryParams: Record<string, string | number> = {};

    if (params?.search && params.search.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params?.categoryId && params.categoryId.trim()) {
      queryParams.categoryId = params.categoryId.trim();
    }
    if (params?.sort) {
      queryParams.sort = params.sort;
    }
    if (params?.page && params.page > 0) {
      queryParams.page = params.page;
    }
    if (params?.limit && params.limit > 0) {
      queryParams.limit = params.limit;
    }

    return apiClient.get<ProductsResponse>('/products', {
      params: queryParams,
    });
  },

  /**
   * Fetch single product detail by ID
   */
  async getProductById(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`);
  },

  /**
   * Fetch all product categories
   */
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>('/categories');
  },
};

export default productService;
