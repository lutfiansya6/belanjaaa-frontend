import { Order } from '@/types';

export const orderService = {
  /**
   * Mengambil riwayat pesanan milik pengguna
   */
  async getOrders(): Promise<Order[]> {
    const res = await fetch('/api/orders', {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({ orders: [] }));

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal memuat riwayat pesanan');
    }

    return data.orders || [];
  },

  /**
   * Membuat pesanan baru dari seluruh item di keranjang belanja
   */
  async createOrder(addressId?: string): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ addressId }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal membuat pesanan');
    }

    return data;
  },
};

export default orderService;
