import { NextResponse } from 'next/server';
import { serverFetch, getAuthToken, extractErrorMessage } from '@/lib/server-api';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { message: 'Silakan masuk ke akun Anda terlebih dahulu' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => null);

    const backendRes = await serverFetch(`/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body || {}),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: extractErrorMessage(data, 'Gagal memperbarui alamat') },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in PATCH /api/addresses/[id]:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat memperbarui alamat' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { message: 'Silakan masuk ke akun Anda terlebih dahulu' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const backendRes = await serverFetch(`/addresses/${id}`, {
      method: 'DELETE',
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: extractErrorMessage(data, 'Gagal menghapus alamat') },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    console.error('Error in DELETE /api/addresses/[id]:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan pada server saat menghapus alamat' },
      { status: 500 }
    );
  }
}
