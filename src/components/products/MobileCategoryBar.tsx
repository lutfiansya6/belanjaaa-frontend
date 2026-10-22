'use client';

import React from 'react';
import { Filter, Grid } from 'lucide-react';
import { Category } from '@/types';

interface MobileCategoryBarProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId?: string) => void;
  onOpenMobileFilter?: () => void;
  activeFilterCount?: number;
}

export default function MobileCategoryBar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenMobileFilter,
  activeFilterCount = 0,
}: MobileCategoryBarProps) {
  return (
    <div className="lg:hidden w-full flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      {/* Filter trigger button */}
      {onOpenMobileFilter && (
        <button
          type="button"
          onClick={onOpenMobileFilter}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 transition-colors ${
            activeFilterCount > 0
              ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
              : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-orange-600 text-[10px] flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}

      {/* "Semua" Chip */}
      <button
        type="button"
        onClick={() => onSelectCategory(undefined)}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all ${
          !selectedCategoryId
            ? 'bg-orange-600 text-white shadow-xs'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300'
        }`}
      >
        <Grid className="w-3.5 h-3.5" />
        <span>Semua</span>
      </button>

      {/* Category Chips */}
      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(isSelected ? undefined : cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
              isSelected
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
