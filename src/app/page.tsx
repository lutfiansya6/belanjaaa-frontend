'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  Laptop,
  Shirt,
  Smartphone,
  Utensils,
  Car,
  HeartPulse,
  Gamepad2,
  ArrowRight,
  Database,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const categories = [
    { name: 'Gadget & HP', icon: Smartphone, count: '1.2k+ item' },
    { name: 'Elektronik', icon: Laptop, count: '850+ item' },
    { name: 'Fashion & Pakaian', icon: Shirt, count: '3.4k+ item' },
    { name: 'Makanan & Minuman', icon: Utensils, count: '940+ item' },
    { name: 'Gaming & Hobi', icon: Gamepad2, count: '620+ item' },
    { name: 'Kesehatan & Kecantikan', icon: HeartPulse, count: '1.1k+ item' },
    { name: 'Otomotif & Aksesoris', icon: Car, count: '480+ item' },
    { name: 'Semua Kategori', icon: ShoppingBag, count: 'Lihat Semua' },
  ];

  return (
    <div className="min-h-full pb-16">
      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-8">
        {/* Marketplace Banner / Hero Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/10">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -top-20 w-80 h-80 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 px-6 sm:px-12 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Marketplace Modern & Terpercaya</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Belanja Praktis, <br className="hidden sm:inline" />
                Semua Kebutuhan <span className="text-amber-200 underline decoration-wavy decoration-amber-300">Ada di Sini</span>
              </h1>

              <p className="text-sm sm:text-base text-orange-100 font-normal leading-relaxed">
                Nikmati pengalaman belanja online terbaik dengan jutaan produk berkualitas,
                promo flash sale setiap hari, dan garansi gratis ongkir tanpa syarat.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link
                  href="/kategori"
                  className="px-6 py-3 rounded-xl bg-white text-orange-600 font-bold text-sm shadow-md hover:bg-orange-50 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 group"
                >
                  <span>Mulai Belanja</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#system-status"
                  className="px-5 py-3 rounded-xl bg-orange-700/60 hover:bg-orange-700 text-white font-medium text-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <Database className="w-4 h-4 text-amber-200" />
                  <span>Status Sistem API</span>
                </a>
              </div>
            </div>

            {/* Hero Quick Highlight Card */}
            <div className="w-full md:w-80 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl space-y-4 text-white">
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <span className="text-xs font-semibold tracking-wide uppercase text-amber-200">
                  ⚡ Flash Promo Spesial
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400 text-orange-950 font-bold">
                  Aktif
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg text-amber-200">
                    %
                  </div>
                  <div>
                    <p className="text-sm font-bold">Diskon Hingga 70%</p>
                    <p className="text-xs text-orange-100">Katalog gadget & fashion terbaru</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg text-amber-200">
                    🚚
                  </div>
                  <div>
                    <p className="text-sm font-bold">Gratis Ongkir Xtra</p>
                    <p className="text-xs text-orange-100">Pengiriman kilat ke seluruh wilayah</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-orange-200">
                  *Syarat dan ketentuan promo berlaku
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Categories Bar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block" />
              Kategori Terpopuler
            </h2>
            <Link
              href="/kategori"
              className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
            >
              Lihat Semua Kategori <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="group flex flex-col items-center p-4 rounded-xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all flex items-center justify-center mb-2.5 shadow-xs">
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {cat.count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* System & Architecture Status Card */}
        <section
          id="system-status"
          className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Frontend Siap Terhubung
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Infrastruktur & Arsitektur Frontend
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Proyek telah dikonfigurasi dengan standar performa tinggi untuk platform e-commerce.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Next.js 16 (App Router)
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                TypeScript
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* API Client Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm">
                <Database className="w-4 h-4" />
                API Client Wrapper
              </div>
              <p className="text-xs text-gray-600">
                Fetch wrapper terintegrasi dengan URL dasar backend:
              </p>
              <div className="p-2 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-800 break-all select-all">
                NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
              </div>
              <p className="text-[11px] text-gray-500">
                Mendukung otomatis Authorization Bearer, typed responses, serta penanganan error standar.
              </p>
            </div>

            {/* TanStack Query Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm">
                <Layers className="w-4 h-4" />
                @tanstack/react-query
              </div>
              <p className="text-xs text-gray-600">
                QueryClientProvider terkonfigurasi dengan caching cerdas di sisi klien:
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 list-disc list-inside">
                <li>Stale time: 60 detik</li>
                <li>Garbage collection: 5 menit</li>
                <li>Auto-retry & refetch prevention</li>
              </ul>
            </div>

            {/* Styling & Layout Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                Tailwind & Marketplace UI
              </div>
              <p className="text-xs text-gray-600">
                Desain responsif dengan palet oranye hangat:
              </p>
              <ul className="text-[11px] text-gray-500 space-y-1 list-disc list-inside">
                <li>Header lengkap (search, cart, login/daftar)</li>
                <li>Footer informasi layanan & pembayaran</li>
                <li>Kompatibel perangkat seluler & desktop</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
