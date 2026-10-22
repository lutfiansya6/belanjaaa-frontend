'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate pagination range with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Number of pages to show around current page

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) {
      pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages || isLoading) return;
    onPageChange(page);

    // Smooth scroll to top of products grid
    const targetElement = document.getElementById('products-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      aria-label="Navigasi Halaman"
      className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 pb-2"
    >
      <div className="text-xs text-gray-500 font-medium">
        Halaman <span className="font-bold text-gray-800">{currentPage}</span> dari{' '}
        <span className="font-bold text-gray-800">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 transition-all shadow-2xs"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((item, index) => {
            if (typeof item === 'string') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center text-xs text-gray-400 select-none"
                >
                  ...
                </span>
              );
            }

            const isCurrent = item === currentPage;
            return (
              <button
                key={`page-${item}`}
                type="button"
                onClick={() => handlePageClick(item)}
                disabled={isLoading}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-8 sm:w-9 h-8 sm:h-9 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs ${
                  isCurrent
                    ? 'bg-orange-600 text-white shadow-xs shadow-orange-600/30 ring-2 ring-orange-500/20'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 disabled:hover:border-gray-200 transition-all shadow-2xs"
          aria-label="Halaman Selanjutnya"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
