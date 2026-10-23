import { NextResponse } from 'next/server';
import { serverFetch, getAuthToken, extractErrorMessage } from '@/lib/server-api';

export async function GET() {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json({ addresses: [] });
    }

    const backendRes = await serverFetch('/addresses', { method: 'GET' });
    const data = await backendRes.json().catch(() => []);

    if (!backendRes.ok) {
      if (backendRes.status === 401) {
        return NextResponse.json({ addresses: [] });
      }
      return NextResponse.json(
        { message: extractErrorMessage(data, 'Gagal mengambil daftar alamat') },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({ addresses: Array.isArray(data) ? data : [] });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in GET /api/addresses:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memuat daftar alamat' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { message: 'Silakan masuk ke akun Anda terlebih dahulu' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || !body.recipientName || !body.phone || !body.street || !body.city) {
      return NextResponse.json(
        { message: 'Mohon lengkapi nama penerima, nomor telepon, alamat jalan, dan kota' },
        { status: 400 }
      );
    }

    const backendRes = await serverFetch('/addresses', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: extractErrorMessage(data, 'Gagal menambahkan alamat baru') },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in POST /api/addresses:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat menambahkan alamat' },
      { status: 500 }
    );
  }
}
