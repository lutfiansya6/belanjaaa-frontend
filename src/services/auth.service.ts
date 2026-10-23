import { User, LoginInput, RegisterInput } from '@/types';

export interface AuthApiResponse {
  success: boolean;
  message: string;
  user?: User;
}

export const authService = {
  /**
   * Login user via Next.js route handler (sets httpOnly cookie)
   */
  async login(credentials: LoginInput): Promise<AuthApiResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await res.json().catch(() => ({ message: 'Gagal memproses respon server' }));

    if (!res.ok) {
      throw new Error(data.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
    }

    return data;
  },

  /**
   * Register new user via Next.js route handler (sets httpOnly cookie)
   */
  async register(input: RegisterInput): Promise<AuthApiResponse> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => ({ message: 'Gagal memproses respon server' }));

    if (!res.ok) {
      throw new Error(data.message || 'Registrasi gagal. Silakan coba lagi.');
    }

    return data;
  },

  /**
   * Logout user via Next.js route handler (clears httpOnly cookie)
   */
  async logout(): Promise<void> {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Gagal keluar sistem');
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      return data.user || null;
    } catch {
      return null;
    }
  },
};

export default authService;
