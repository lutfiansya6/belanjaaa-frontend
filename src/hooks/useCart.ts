'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { CartResponse } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export const CART_QUERY_KEY = ['cart'] as const;

export function useCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const {
    data: cart,
    isLoading,
    isError,
    error,
    refetch: refetchCart,
  } = useQuery<CartResponse>({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCart(),
    enabled: typeof window !== 'undefined' && isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds
  });

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
      cartService.addToCart(productId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateQuantity(itemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(CART_QUERY_KEY, updatedCart);
    },
  });

  const totalItems = isAuthenticated && cart ? cart.totalItems : 0;
  const totalAmount = isAuthenticated && cart ? cart.totalAmount : 0;
  const items = isAuthenticated && cart ? cart.items : [];

  return {
    cart,
    items,
    totalItems,
    totalAmount,
    isLoading: isAuthenticated ? isLoading : false,
    isError,
    error,
    refetchCart,
    addToCart: addToCartMutation.mutateAsync,
    isAddingToCart: addToCartMutation.isPending,
    updateQuantity: updateQuantityMutation.mutateAsync,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    removeItem: removeItemMutation.mutateAsync,
    isRemovingItem: removeItemMutation.isPending,
    clearCart: clearCartMutation.mutateAsync,
    isClearingCart: clearCartMutation.isPending,
  };
}

export default useCart;
