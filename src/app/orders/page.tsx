'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function OrdersPage() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Pesanan Saya</h1>
            <p className="text-sm text-gray-500">Kelola dan pantau status pesanan belanja Anda</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Belanja Lagi</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Riwayat Pesanan</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Halo {isMounted && user?.name ? user.name : 'Pelanggan'}, Anda belum memiliki pesanan aktif saat ini. Jelajahi aneka produk menarik sekarang!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Mulai Belanja</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
