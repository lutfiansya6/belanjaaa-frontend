'use client';

import React from 'react';
import { ArrowUpDown, X, Sparkles, Flame, ArrowUp, ArrowDown } from 'lucide-react';
import { ProductSortOption, Category } from '@/types';

interface ProductSortBarProps {
  totalItems: number;
  currentSort: ProductSortOption;
  onSortChange: (sort: ProductSortOption) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  selectedCategory?: Category;
  onClearCategory?: () => void;
}

const SORT_OPTIONS: { label: string; value: ProductSortOption; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Terbaru', value: 'newest', icon: Sparkles },
  { label: 'Terlaris', value: 'best_selling', icon: Flame },
  { label: 'Harga Terendah', value: 'price_asc', icon: ArrowUp },
  { label: 'Harga Tertinggi', value: 'price_desc', icon: ArrowDown },
];

export default function ProductSortBar({
  totalItems,
  currentSort,
  onSortChange,
  searchQuery,
  onClearSearch,
  selectedCategory,
  onClearCategory,
}: ProductSortBarProps) {
  const hasActiveFilters = Boolean(searchQuery || selectedCategory);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-3.5 sm:p-4 shadow-xs space-y-3">
      {/* Top row: Results counter and sorting selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Total results */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            Daftar Produk
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
            {totalItems} item
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline-flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan:
          </span>

          {/* Desktop sort button tabs */}
          <div className="hidden sm:inline-flex items-center p-1 bg-slate-100 rounded-xl gap-1">
            {SORT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = currentSort === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onSortChange(opt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile sort dropdown select */}
          <div className="sm:hidden w-full flex items-center gap-2">
            <label htmlFor="mobile-sort-select" className="text-xs text-gray-500 font-medium flex items-center gap-1 flex-shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5" /> Urutkan:
            </label>
            <select
              id="mobile-sort-select"
              value={currentSort}
              onChange={(e) => onSortChange(e.target.value as ProductSortOption)}
              className="flex-1 py-2 px-3 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills (if any) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 flex-wrap">
          <span className="text-xs text-gray-400 font-medium">Filter aktif:</span>

          {/* Category Chip */}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 text-xs font-medium border border-orange-200">
              <span>Kategori: {selectedCategory.name}</span>
              {onClearCategory && (
                <button
                  type="button"
                  onClick={onClearCategory}
                  className="hover:text-orange-900 focus:outline-none"
                  aria-label="Hapus filter kategori"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          )}

          {/* Search Query Chip */}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
              <span>Cari: &ldquo;{searchQuery}&rdquo;</span>
              {onClearSearch && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="hover:text-amber-950 focus:outline-none"
                  aria-label="Hapus filter pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
