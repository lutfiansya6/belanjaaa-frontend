import { Address, CreateAddressInput } from '@/types';

export const addressService = {
  /**
   * Mengambil daftar alamat pengiriman pengguna
   */
  async getAddresses(): Promise<Address[]> {
    const res = await fetch('/api/addresses', {
      method: 'GET',
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({ addresses: [] }));

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal memuat daftar alamat');
    }

    return data.addresses || [];
  },

  /**
   * Menambahkan alamat baru
   */
  async createAddress(input: CreateAddressInput): Promise<Address> {
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal menambahkan alamat');
    }

    return data;
  },

  /**
   * Mengubah atau menetapkan alamat sebagai default
   */
  async updateAddress(id: string, input: Partial<CreateAddressInput>): Promise<Address> {
    const res = await fetch(`/api/addresses/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal memperbarui alamat');
    }

    return data;
  },

  /**
   * Menghapus alamat
   */
  async deleteAddress(id: string): Promise<void> {
    const res = await fetch(`/api/addresses/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.message || 'Gagal menghapus alamat');
    }
  },
};

export default addressService;
