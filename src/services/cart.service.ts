import { CartResponse } from '@/types';

export const cartService = {
  /**
   * Mengambil data keranjang belanja pengguna saat ini
   */
  async getCart(): Promise<CartResponse> {
    const res = await fetch('/api/cart', {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal memuat keranjang belanja');
    }

    return (
      data || {
        id: '',
        userId: '',
        items: [],
        totalItems: 0,
        totalAmount: 0,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  /**
   * Menambahkan produk ke dalam keranjang
   */
  async addToCart(productId: string, quantity = 1): Promise<CartResponse> {
    const res = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal menambahkan produk ke keranjang');
    }

    return data;
  },

  /**
   * Mengubah jumlah item produk di keranjang
   */
  async updateQuantity(itemId: string, quantity: number): Promise<CartResponse> {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal mengubah jumlah produk');
    }

    return data;
  },

  /**
   * Menghapus item tertentu dari keranjang
   */
  async removeItem(itemId: string): Promise<CartResponse> {
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: 'DELETE',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal menghapus produk dari keranjang');
    }

    return data;
  },

  /**
   * Mengosongkan keranjang
   */
  async clearCart(): Promise<CartResponse> {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal mengosongkan keranjang');
    }

    return data;
  },
};

export default cartService;
