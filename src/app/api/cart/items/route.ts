import { NextResponse } from 'next/server';
import { serverFetch, getAuthToken, extractErrorMessage } from '@/lib/server-api';

export async function POST(request: Request) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { message: 'Silakan masuk ke akun Anda terlebih dahulu untuk menambahkan produk ke keranjang' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.productId) {
      return NextResponse.json(
        { message: 'Data produk tidak valid' },
        { status: 400 }
      );
    }

    const backendRes = await serverFetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: extractErrorMessage(data, 'Gagal menambahkan produk ke keranjang') },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in POST /api/cart/items:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat menambahkan produk ke keranjang' },
      { status: 500 }
    );
  }
}
