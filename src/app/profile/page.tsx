'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Store,
  Calendar,
  LogOut,
  Package,
  Heart,
  CreditCard,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isMounted || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-44 bg-slate-200 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="md:col-span-2 h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Belum Masuk Akun</h1>
        <p className="text-sm text-gray-500 mb-6">
          Silakan masuk ke akun Anda untuk melihat dan mengelola profil.
        </p>
        <Link
          href="/login?callbackUrl=/profile"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 shadow-md transition-colors"
        >
          Masuk Sekarang
        </Link>
      </div>
    );
  }

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '2024';

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 sm:p-8 text-white shadow-xl shadow-orange-500/10">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white text-orange-600 flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white truncate" id="profile-name">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-amber-100 uppercase tracking-wider">
                  <Shield className="w-3 h-3" />
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-orange-100 flex items-center justify-center sm:justify-start gap-1.5 truncate">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{user.email}</span>
              </p>
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-4 text-xs text-orange-200">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Bergabung sejak {formattedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  Akun Terverifikasi
                </span>
              </div>
            </div>

            <button
              type="button"
              id="profile-logout-button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-all duration-150 backdrop-blur-sm active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Quick Links */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 px-2 mb-2">
              Menu Akun
            </h2>
            <Link
              href="/orders"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-semibold">Pesanan Saya</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="text-sm font-semibold">Wishlist Produk</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <div className="flex items-center justify-between p-3 rounded-xl text-gray-400 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">Metode Pembayaran</span>
              </div>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                Segera
              </span>
            </div>
          </div>

          {/* Right Column: Detailed Account Information */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Informasi Pribadi
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                  <dt className="text-xs font-medium text-gray-500 mb-1">Nama Lengkap</dt>
                  <dd className="font-semibold text-gray-900">{user.name}</dd>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                  <dt className="text-xs font-medium text-gray-500 mb-1">Alamat Email</dt>
                  <dd className="font-semibold text-gray-900 truncate">{user.email}</dd>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                  <dt className="text-xs font-medium text-gray-500 mb-1">Nomor Telepon</dt>
                  <dd className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{user.phone || 'Belum diatur'}</span>
                  </dd>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50/70 border border-gray-100">
                  <dt className="text-xs font-medium text-gray-500 mb-1">Peran Pengguna (Role)</dt>
                  <dd className="font-semibold text-gray-900 uppercase">{user.role}</dd>
                </div>
              </dl>
            </div>

            {/* Shop Information (if seller) */}
            {user.shop && (
              <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm bg-gradient-to-br from-white to-orange-50/30">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-orange-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Informasi Toko Saya</h2>
                    <p className="text-xs text-gray-500">Anda terdaftar sebagai penjual aktif</p>
                  </div>
                </div>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3.5 rounded-xl bg-white border border-orange-100">
                    <dt className="text-xs font-medium text-gray-500 mb-1">Nama Toko</dt>
                    <dd className="font-bold text-orange-700">{user.shop.name}</dd>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-orange-100">
                    <dt className="text-xs font-medium text-gray-500 mb-1">Kota / Domisili Toko</dt>
                    <dd className="font-semibold text-gray-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span>{user.shop.city}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
