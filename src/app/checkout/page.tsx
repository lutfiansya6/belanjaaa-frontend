'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function CheckoutPage() {
  const { user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 animate-pulse">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
          <div className="h-64 bg-white rounded-3xl border border-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Checkout Pengiriman</h1>
            <p className="text-sm text-gray-500">Konfirmasi pesanan dan informasi pengiriman Anda</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-orange-800 uppercase tracking-wider">Pemesan</p>
              <p className="text-base font-bold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
              <span>Akun Terverifikasi</span>
            </div>
          </div>

          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <p className="text-sm text-gray-500">Halaman checkout pesanan siap digunakan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
