import { cookies } from 'next/headers';
import { BASE_API_URL } from '@/lib/api-client';

/**
 * Helper to retrieve auth_token from Next.js server cookie store
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value || null;
  } catch {
    return null;
  }
}

/**
 * Server-side authenticated fetch to backend NestJS API
 */
export async function serverFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const url = `${BASE_API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  return fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });
}

/**
 * Parse backend error message into readable Indonesian string
 */
export function extractErrorMessage(data: unknown, fallbackMessage: string): string {
  if (data && typeof data === 'object') {
    const message = (data as { message?: string | string[] }).message;
    if (typeof message === 'string') {
      return message;
    }
    if (Array.isArray(message) && message.length > 0) {
      return message.join(', ');
    }
  }
  return fallbackMessage;
}
