'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User, LoginInput, RegisterInput } from '@/types';
import { authService, AuthApiResponse } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginInput) => Promise<AuthApiResponse>;
  register: (data: RegisterInput) => Promise<AuthApiResponse>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: user = null,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
    enabled: typeof window !== 'undefined',
  });

  const login = useCallback(
    async (credentials: LoginInput) => {
      const result = await authService.login(credentials);
      if (result.user) {
        queryClient.setQueryData(['auth', 'me'], result.user);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      }
      return result;
    },
    [queryClient]
  );

  const register = useCallback(
    async (data: RegisterInput) => {
      const result = await authService.register(data);
      if (result.user) {
        queryClient.setQueryData(['auth', 'me'], result.user);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      }
      return result;
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      queryClient.setQueryData(['auth', 'me'], null);
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    }
  }, [queryClient]);

  const refetchUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
