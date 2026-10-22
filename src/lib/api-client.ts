/**
 * API Client (Fetch Wrapper)
 * Configured with base URL from NEXT_PUBLIC_API_URL
 */

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export class ApiError extends Error {
  public status: number;
  public data: unknown;
  public statusText: string;

  constructor(status: number, statusText: string, data: unknown, message?: string) {
    super(message || (typeof data === 'object' && data !== null && 'message' in data ? String((data as { message: unknown }).message) : `HTTP Error ${status}: ${statusText}`));
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  token?: string;
}

export interface ApiClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  getToken?: () => string | null | undefined;
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private getToken?: () => string | null | undefined;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = (config.baseUrl || BASE_API_URL).replace(/\/+$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.defaultHeaders,
    };
    this.getToken = config.getToken;
  }

  /**
   * Set authentication token provider
   */
  public setTokenProvider(getToken: () => string | null | undefined) {
    this.getToken = getToken;
  }

  /**
   * Core request method
   */
  public async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, body, headers, token, ...customConfig } = options;

    // Build URL with query parameters
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    // Resolve Authorization token
    const resolvedToken =
      token ||
      (this.getToken ? this.getToken() : null) ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('access_token') || sessionStorage.getItem('access_token')
        : null);

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...(headers as Record<string, string>),
    };

    if (resolvedToken) {
      requestHeaders.Authorization = `Bearer ${resolvedToken}`;
    }

    // Determine payload body
    let serializedBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      if (
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        body instanceof Blob ||
        typeof body === 'string'
      ) {
        serializedBody = body as BodyInit;
        // Don't enforce Content-Type for FormData (browser sets boundary automatically)
        if (body instanceof FormData) {
          delete requestHeaders['Content-Type'];
        }
      } else {
        serializedBody = JSON.stringify(body);
      }
    }

    const response = await fetch(url.toString(), {
      ...customConfig,
      headers: requestHeaders,
      body: serializedBody,
    });

    // Parse response
    let responseData: unknown = null;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }
    } else {
      try {
        const text = await response.text();
        responseData = text ? text : null;
      } catch {
        responseData = null;
      }
    }

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText, responseData);
    }

    return responseData as T;
  }

  public get<T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  public put<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public patch<T = unknown>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  public delete<T = unknown>(endpoint: string, options?: Omit<RequestOptions, 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
