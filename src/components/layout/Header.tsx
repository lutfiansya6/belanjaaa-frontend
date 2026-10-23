'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
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
  User as UserIcon,
  LogOut,
  Package,
  Shield,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const cartItemCount = 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

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

              {/* Auth Buttons / User Profile */}
              {isMounted && isAuthenticated && user ? (
                <div className="relative hidden sm:block" ref={dropdownRef}>
                  <button
                    type="button"
                    id="user-menu-button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 py-1 px-3 rounded-full bg-white/15 hover:bg-white/25 transition-all duration-150 border border-white/25 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                    aria-expanded={userMenuOpen}
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-200 text-orange-950 font-bold flex items-center justify-center text-xs shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate font-semibold text-xs sm:text-sm" id="header-user-name">
                      {user.name}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        userMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-50 text-gray-800 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-orange-50 to-amber-50/40 rounded-t-xl -mt-1.5">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="w-9 h-9 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold text-gray-900 truncate" id="menu-user-fullname">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 uppercase tracking-wider">
                            <Shield className="w-2.5 h-2.5" />
                            {user.role}
                          </span>
                          {user.shop && (
                            <span className="text-[11px] text-gray-600 truncate">
                              • {user.shop.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1 text-sm font-medium">
                        <Link
                          href="/profile"
                          id="menu-profile-link"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-gray-500" />
                          <span>Profil Saya</span>
                        </Link>
                        <Link
                          href="/orders"
                          id="menu-orders-link"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <Package className="w-4 h-4 text-gray-500" />
                          <span>Pesanan Saya</span>
                        </Link>
                        {user.shop && (
                          <div className="px-4 py-2 text-xs text-gray-500 flex items-center gap-2 border-t border-gray-100">
                            <Store className="w-3.5 h-3.5 text-orange-500" />
                            <span className="truncate">
                              Toko: <strong>{user.shop.name}</strong> ({user.shop.city})
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          type="button"
                          id="header-logout-btn"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          {isLoggingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                          ) : (
                            <LogOut className="w-4 h-4 text-rose-500" />
                          )}
                          <span>{isLoggingOut ? 'Sedang Keluar...' : 'Keluar'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
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
              )}

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
            {isMounted && isAuthenticated && user ? (
              <div className="pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold bg-orange-200/80 text-orange-900 px-2 py-0.5 rounded uppercase">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span>Profil Saya</span>
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>Pesanan Saya</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{isLoggingOut ? 'Sedang Keluar...' : 'Keluar dari Akun'}</span>
                  </button>
                </div>
              </div>
            ) : (
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
            )}

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
