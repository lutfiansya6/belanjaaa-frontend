import { NextResponse } from 'next/server';
import { serverFetch, getAuthToken, extractErrorMessage } from '@/lib/server-api';

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({
        id: '',
        userId: '',
        items: [],
        totalItems: 0,
        totalAmount: 0,
        updatedAt: new Date().toISOString(),
      });
    }

    const backendRes = await serverFetch('/cart', { method: 'GET' });
    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      if (backendRes.status === 401) {
        return NextResponse.json({
          id: '',
          userId: '',
          items: [],
          totalItems: 0,
          totalAmount: 0,
          updatedAt: new Date().toISOString(),
        });
      }
      return NextResponse.json(
        { message: extractErrorMessage(data, 'Gagal mengambil data keranjang') },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in GET /api/cart:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat memuat keranjang' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { message: 'Silakan masuk ke akun Anda terlebih dahulu' },
        { status: 401 }
      );
    }

    const backendRes = await serverFetch('/cart', { method: 'DELETE' });
    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: extractErrorMessage(data, 'Gagal mengosongkan keranjang') },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in DELETE /api/cart:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mengosongkan keranjang' },
      { status: 500 }
    );
  }
}
