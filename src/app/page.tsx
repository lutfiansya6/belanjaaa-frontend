'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  PackageSearch,
  AlertCircle,
  X,
  Truck,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ProductSortOption } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';
import CategoryFilter from '@/components/products/CategoryFilter';
import MobileCategoryBar from '@/components/products/MobileCategoryBar';
import ProductSortBar from '@/components/products/ProductSortBar';
import Pagination from '@/components/ui/Pagination';

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract query parameters from URL
  const searchQuery = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const sortParam = (searchParams.get('sort') as ProductSortOption) || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories & products
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useCategories();

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useProducts({
    search: searchQuery || undefined,
    categoryId: categoryId || undefined,
    sort: sortParam,
    page: currentPage,
    limit: 10,
  });

  const products = productsData?.items || [];
  const meta = productsData?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  // Helper to update URL query parameters smoothly
  const updateUrlParams = (newParams: Record<string, string | number | undefined | null>) => {
    const current = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        current.delete(key);
      } else {
        current.set(key, String(value));
      }
    });

    const queryString = current.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  // Filter & pagination handlers
  const handleSelectCategory = (newCatId?: string) => {
    updateUrlParams({
      categoryId: newCatId,
      page: 1, // Reset page on category change
    });
    setMobileFilterOpen(false);
  };

  const handleSortChange = (newSort: ProductSortOption) => {
    updateUrlParams({
      sort: newSort,
      page: 1, // Reset page on sort change
    });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({
      page: newPage,
    });
  };

  const handleClearSearch = () => {
    updateUrlParams({
      search: undefined,
      page: 1,
    });
  };

  const handleClearCategory = () => {
    updateUrlParams({
      categoryId: undefined,
      page: 1,
    });
  };

  const handleResetAllFilters = () => {
    router.push('/');
  };

  const activeFilterCount = (categoryId ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-full pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 space-y-6">
        {/* Marketplace Hero Promo Banner (Compact on mobile, rich on desktop) */}
        {!searchQuery && currentPage === 1 && !categoryId && (
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/10">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-1/4 -top-20 w-64 h-64 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Marketplace Modern Indonesia</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug">
                  Belanja Nyaman, <br className="hidden sm:inline" />
                  Pilihan Lengkap <span className="text-amber-200 underline decoration-wavy decoration-amber-300">Harga Terbaik</span>
                </h1>

                <p className="text-xs sm:text-sm text-orange-100 font-normal leading-relaxed max-w-lg">
                  Katalog produk terlengkap mulai dari gadget, elektronik, hingga fashion.
                  Nikmati gratis ongkir dan promo flash sale setiap saat!
                </p>

                <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <a
                    href="#products-section"
                    className="px-5 py-2.5 rounded-xl bg-white text-orange-600 font-bold text-xs sm:text-sm shadow-md hover:bg-orange-50 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>Jelajahi Produk</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <div className="flex items-center gap-4 text-xs text-orange-100 font-medium">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-200" /> Bebas Ongkir
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-200" /> Jaminan Asli
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick highlight cards */}
              <div className="hidden lg:grid grid-cols-2 gap-3 w-80 text-white">
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-amber-200 mb-2">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold">Pengiriman Kilat</h4>
                  <p className="text-[11px] text-orange-100 mt-0.5">Dikirim dari kota terdekat</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-amber-200 mb-2">
                    %
                  </div>
                  <h4 className="text-xs font-bold">Cashback & Diskon</h4>
                  <p className="text-[11px] text-orange-100 mt-0.5">Promo hemat setiap hari</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Mobile Category Scroll Bar (Visible on mobile & tablet) */}
        <MobileCategoryBar
          categories={categories}
          selectedCategoryId={categoryId}
          onSelectCategory={handleSelectCategory}
          onOpenMobileFilter={() => setMobileFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Main Content Layout: Sidebar Filter + Products Grid */}
        <div id="products-section" className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Desktop Left Sidebar: Category Filter */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-28">
            <CategoryFilter
              categories={categories}
              selectedCategoryId={categoryId}
              onSelectCategory={handleSelectCategory}
              isLoading={categoriesLoading}
            />
          </div>

          {/* Right Main Column: Sorting Bar + Product Grid + Pagination */}
          <div className="flex-1 w-full space-y-4">
            {/* Sorting & Filter status bar */}
            <ProductSortBar
              totalItems={meta.total}
              currentSort={sortParam}
              onSortChange={handleSortChange}
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
              selectedCategory={selectedCategory}
              onClearCategory={handleClearCategory}
            />

            {/* Products Grid State */}
            {productsLoading ? (
              <ProductGridSkeleton count={10} />
            ) : productsError ? (
              /* Error State */
              <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-3 my-4">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Gagal Memuat Daftar Produk
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  Terjadi gangguan saat menghubungkan ke server API backend. Pastikan server backend sedang aktif di port 3001.
                </p>
                <button
                  type="button"
                  onClick={() => refetchProducts()}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  Coba Muat Ulang
                </button>
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-12 text-center space-y-4 my-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Produk Tidak Ditemukan
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                    {searchQuery
                      ? `Tidak ada produk yang cocok dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain atau bersihkan filter.`
                      : 'Belum ada produk untuk kategori yang dipilih saat ini.'}
                  </p>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Semua Filter
                  </button>
                )}
              </div>
            ) : (
              /* Product Cards Grid: 2 cols on mobile, 3 on sm/md, 4 on lg/xl */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!productsLoading && meta.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={meta.totalPages}
                onPageChange={handlePageChange}
                isLoading={productsLoading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal / Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base">Filter Kategori</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <CategoryFilter
                categories={categories}
                selectedCategoryId={categoryId}
                onSelectCategory={handleSelectCategory}
                isLoading={categoriesLoading}
              />
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  handleResetAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 shadow-xs"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <ProductGridSkeleton count={10} />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
