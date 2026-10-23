import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_API_URL } from '@/lib/api-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BASE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      const errorMessage =
        (data && typeof data === 'object' && 'message' in data && data.message)
          ? Array.isArray(data.message)
            ? data.message.join(', ')
            : String(data.message)
          : 'Login gagal. Periksa kembali email dan kata sandi Anda.';

      return NextResponse.json(
        { message: errorMessage },
        { status: backendRes.status }
      );
    }

    const { accessToken, user } = data;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Token otentikasi tidak ditemukan dari server' },
        { status: 500 }
      );
    }

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      message: data.message || 'Login berhasil',
      user,
    });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat mencoba login' },
      { status: 500 }
    );
  }
}
