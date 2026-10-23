import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BASE_API_URL } from '@/lib/api-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Nama, email, dan kata sandi wajib diisi' },
        { status: 400 }
      );
    }

    const payload: { name: string; email: string; password: string; phone?: string } = {
      name: name.trim(),
      email: email.trim(),
      password,
    };

    if (phone && phone.trim()) {
      payload.phone = phone.trim();
    }

    const backendRes = await fetch(`${BASE_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      const errorMessage =
        (data && typeof data === 'object' && 'message' in data && data.message)
          ? Array.isArray(data.message)
            ? data.message.join(', ')
            : String(data.message)
          : 'Pendaftaran gagal. Silakan periksa kembali data Anda.';

      return NextResponse.json(
        { message: errorMessage },
        { status: backendRes.status }
      );
    }

    const { accessToken, user } = data;

    if (accessToken) {
      // Set HTTP-only cookie automatically upon registration
      const cookieStore = await cookies();
      cookieStore.set('auth_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'Registrasi berhasil',
      user,
    });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat mencoba registrasi' },
      { status: 500 }
    );
  }
}
