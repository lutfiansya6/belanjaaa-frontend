import { NextResponse } from 'next/server';
import { serverFetch, getAuthToken, extractErrorMessage } from '@/lib/server-api';

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ orders: [] });
    }

    const backendRes = await serverFetch('/orders', { method: 'GET' });
    const data = await backendRes.json().catch(() => []);

    if (!backendRes.ok) {
      if (backendRes.status === 401) {
        return NextResponse.json({ orders: [] });
      }
      return NextResponse.json(
        { message: extractErrorMessage(data, 'Gagal mengambil daftar pesanan') },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({ orders: Array.isArray(data) ? data : [] });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memuat daftar pesanan' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { message: 'Silakan masuk ke akun Anda terlebih dahulu untuk membuat pesanan' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const backendRes = await serverFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(body || {}),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          message: extractErrorMessage(
            data,
            'Gagal membuat pesanan. Silakan periksa kembali keranjang dan alamat Anda.'
          ),
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat membuat pesanan' },
      { status: 500 }
    );
  }
}
