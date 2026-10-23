import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_API_URL } from '@/lib/api-client';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const backendRes = await fetch(`${BASE_API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!backendRes.ok) {
      // If token is invalid or expired, clear the cookie
      if (backendRes.status === 401) {
        cookieStore.delete('auth_token');
      }
      return NextResponse.json({ user: null }, { status: backendRes.status });
    }

    const user = await backendRes.json();
    return NextResponse.json({ user });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { user: null, message: 'Gagal mengambil data profil' },
      { status: 500 }
    );
  }
}
