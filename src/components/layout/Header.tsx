'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  Menu,
  X,
  Store,
  ChevronDown,
  Sparkles,
  Smartphone,
  HelpCircle,
} from 'lucide-react';

const popularKeywords = [
  'Powerbank',
  'Jam Tangan',
  'Mouse',
  'Hoodie',
  'Blouse',
  'Kamera',
];

function HeaderSearchForm({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const executeSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();
    if (trimmed) {
      params.set('search', trimmed);
    } else {
      params.delete('search');
    }
    params.delete('page');

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    executeSearch('');
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    executeSearch(tag);
  };

  return (
    <div className="flex-1 max-w-2xl mx-2">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk impianmu (misal: Powerbank, Hoodie)..."
            id="search-input"
            className="w-full pl-4 pr-20 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Hapus kata pencarian"
              className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            aria-label="Cari"
            id="search-submit-btn"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-2 rounded-md sm:rounded-lg shadow transition-all duration-150 active:scale-95 flex items-center justify-center"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </form>

      {/* Trending tags (Desktop only) */}
      <div className="hidden lg:flex items-center gap-2 mt-1.5 text-xs text-orange-100 overflow-hidden whitespace-nowrap">
        <span className="flex items-center gap-1 font-semibold text-amber-200">
          <Sparkles className="w-3 h-3" /> Tren:
        </span>
        {popularKeywords.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className="hover:text-white hover:underline transition-colors focus:outline-none"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function HeaderSearchBar() {
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';

  return <HeaderSearchForm key={currentSearch} initialSearch={currentSearch} />;
}

function SearchBarFallback() {
  return (
    <div className="flex-1 max-w-2xl mx-2">
      <div className="w-full h-11 bg-white/20 rounded-xl animate-pulse" />
    </div>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = 0;

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* Top Utility Bar (Desktop) */}
      <div className="bg-orange-700 text-orange-100 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <Smartphone className="w-3.5 h-3.5" />
              Download Aplikasi
            </span>
            <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <Store className="w-3.5 h-3.5" />
              Mulai Jual di Marketplace
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">
              Mitra & Afiliasi
            </span>
          </div>

          <div className="flex items-center space-x-5">
            <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <Bell className="w-3.5 h-3.5" />
              Notifikasi
            </span>
            <span className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <HelpCircle className="w-3.5 h-3.5" />
              Bantuan
            </span>
            <span className="hover:text-white cursor-pointer transition-colors flex items-center gap-0.5">
              Bahasa Indonesia <ChevronDown className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 md:gap-6">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0"
              id="brand-logo"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white text-orange-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Store className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                  TOKO<span className="text-amber-200">ORANYE</span>
                </span>
                <span className="text-[10px] sm:text-xs text-orange-100 tracking-wider uppercase font-medium -mt-1 hidden sm:block">
                  Marketplace Terpercaya
                </span>
              </div>
            </Link>

            {/* Search Input Bar (Wrapped in Suspense) */}
            <Suspense fallback={<SearchBarFallback />}>
              <HeaderSearchBar />
            </Suspense>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Wishlist Icon (Desktop) */}
              <Link
                href="/wishlist"
                aria-label="Daftar Keinginan"
                className="hidden md:flex p-2 rounded-lg text-white hover:bg-white/15 transition-colors relative"
              >
                <Heart className="w-6 h-6" />
              </Link>

              {/* Shopping Cart Icon */}
              <Link
                href="/cart"
                id="cart-button"
                aria-label="Keranjang Belanja"
                className="relative p-2.5 rounded-xl text-white hover:bg-white/15 transition-all duration-150 flex items-center justify-center group"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span
                  id="cart-badge"
                  className="absolute -top-1 -right-1 bg-amber-300 text-orange-950 font-bold text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-md border-2 border-orange-600"
                >
                  {cartItemCount}
                </span>
              </Link>

              <div className="hidden sm:block h-7 w-px bg-white/30" />

              {/* Auth Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  id="login-button"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white hover:bg-white/15 border border-white/40 hover:border-white transition-all duration-150"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  id="register-button"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold text-orange-700 bg-white hover:bg-orange-50 shadow-sm transition-all duration-150 active:scale-95"
                >
                  Daftar
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                aria-label="Toggle mobile menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg text-white hover:bg-white/15 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Bar (Desktop) */}
        <div className="bg-orange-600/90 border-t border-orange-400/30 text-white text-xs sm:text-sm py-2 px-4 hidden md:block backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar font-medium">
              <Link href="/?sort=newest" className="flex items-center gap-1.5 hover:text-amber-200 transition-colors">
                <Menu className="w-4 h-4" />
                <span>Katalog Produk</span>
              </Link>
              <Link href="/?sort=best_selling" className="hover:text-amber-200 transition-colors flex items-center gap-1">
                <span className="text-amber-300 font-bold">⚡</span> Produk Terlaris
              </Link>
              <span className="hover:text-amber-200 transition-colors cursor-pointer">
                Official Store
              </span>
              <span className="hover:text-amber-200 transition-colors cursor-pointer">
                Gratis Ongkir XTRA
              </span>
              <span className="hover:text-amber-200 transition-colors cursor-pointer">
                Voucher Diskon
              </span>
            </div>

            <div className="text-orange-200 text-xs font-normal">
              Garansi 100% Original & Aman
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200 shadow-xl px-4 py-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gray-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-3 rounded-lg text-sm font-semibold text-orange-600 border border-orange-500 hover:bg-orange-50 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 px-3 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                Daftar
              </Link>
            </div>

            <div className="flex flex-col space-y-2 text-sm text-gray-700 font-medium">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-1.5 hover:text-orange-600"
              >
                <Store className="w-4 h-4 text-orange-500" />
                Semua Produk
              </Link>
              <Link
                href="/?sort=best_selling"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-1.5 hover:text-orange-600"
              >
                <span className="text-orange-500 font-bold">⚡</span> Produk Terlaris
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
