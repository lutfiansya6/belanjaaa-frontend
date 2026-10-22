import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';
import { ProductQueryParams } from '@/types';

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (params: ProductQueryParams) => [...PRODUCT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
  categories: () => ['categories'] as const,
};

export function useProducts(params: ProductQueryParams) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: () => productService.getProducts(params),
    placeholderData: (previousData) => previousData, // smooth pagination transition
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.categories(),
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 10, // Categories don't change often, cache for 10 minutes
  });
}
