import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');

    return NextResponse.json({
      success: true,
      message: 'Berhasil keluar',
    });
  } catch (error) {
    console.error('Error in /api/auth/logout:', error);
    return NextResponse.json(
      { message: 'Gagal keluar sistem' },
      { status: 500 }
    );
  }
}
