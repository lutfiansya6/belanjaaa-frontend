'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '@/services/address.service';
import { Address, CreateAddressInput } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export const ADDRESSES_QUERY_KEY = ['addresses'] as const;

export function useAddresses() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const {
    data: addresses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Address[]>({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: () => addressService.getAddresses(),
    enabled: typeof window !== 'undefined' && isAuthenticated,
  });

  const createAddressMutation = useMutation({
    mutationFn: (input: CreateAddressInput) => addressService.createAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateAddressInput> }) =>
      addressService.updateAddress(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });

  const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0] || null;

  return {
    addresses,
    defaultAddress,
    isLoading: isAuthenticated ? isLoading : false,
    isError,
    error,
    refetch,
    createAddress: createAddressMutation.mutateAsync,
    isCreatingAddress: createAddressMutation.isPending,
    updateAddress: updateAddressMutation.mutateAsync,
    isUpdatingAddress: updateAddressMutation.isPending,
    deleteAddress: deleteAddressMutation.mutateAsync,
    isDeletingAddress: deleteAddressMutation.isPending,
  };
}

export default useAddresses;
