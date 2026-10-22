'use client';

import React from 'react';
import {
  Zap,
  Smartphone,
  Laptop,
  Coffee,
  Car,
  Shirt,
  Sparkles,
  Heart,
  Grid,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Category } from '@/types';

// Map icon string from API to Lucide icon
function getCategoryIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case 'zap':
      return Zap;
    case 'smartphone':
      return Smartphone;
    case 'laptop':
      return Laptop;
    case 'coffee':
      return Coffee;
    case 'car':
      return Car;
    case 'shirt':
      return Shirt;
    case 'sparkles':
      return Sparkles;
    case 'heart':
      return Heart;
    default:
      return Grid;
  }
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId?: string) => void;
  isLoading?: boolean;
}

export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading,
}: CategoryFilterProps) {
  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs space-y-5">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm sm:text-base">
          <Filter className="w-4 h-4 text-orange-500" />
          <span>Kategori Produk</span>
        </div>
        {selectedCategoryId && (
          <button
            type="button"
            onClick={() => onSelectCategory(undefined)}
            className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 hover:underline"
            title="Hapus filter kategori"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Categories List */}
      <div className="space-y-1">
        {/* All Categories Option */}
        <button
          type="button"
          onClick={() => onSelectCategory(undefined)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            !selectedCategoryId
              ? 'bg-orange-500 text-white font-bold shadow-xs shadow-orange-500/20'
              : 'text-gray-700 hover:bg-orange-50/60 hover:text-orange-600'
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Grid className={`w-4 h-4 flex-shrink-0 ${!selectedCategoryId ? 'text-white' : 'text-gray-400'}`} />
            <span className="truncate">Semua Kategori</span>
          </div>
          {!selectedCategoryId && <Check className="w-4 h-4 flex-shrink-0" />}
        </button>

        {isLoading ? (
          // Loading skeleton for categories
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={`cat-skel-${idx}`}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl animate-pulse"
            >
              <div className="w-4 h-4 rounded bg-slate-200" />
              <div className="h-4 bg-slate-200 rounded w-3/4" />
            </div>
          ))
        ) : (
          categories.map((category) => {
            const IconComponent = getCategoryIcon(category.icon);
            const isSelected = selectedCategoryId === category.id;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? undefined : category.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                  isSelected
                    ? 'bg-orange-500 text-white font-bold shadow-xs shadow-orange-500/20'
                    : 'text-gray-700 hover:bg-orange-50/60 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <IconComponent
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-orange-500'
                    }`}
                  />
                  <span className="truncate">{category.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
              </button>
            );
          })
        )}
      </div>

      {/* Trust & Guarantee Perks */}
      <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>100% Produk Original</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span>Pengiriman Cepat Seluruh RI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>Proteksi Garansi Belanja</span>
        </div>
      </div>
    </aside>
  );
}
