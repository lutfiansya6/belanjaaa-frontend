import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs animate-pulse flex flex-col">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-slate-200 relative">
        <div className="absolute top-2 left-2 w-16 h-5 bg-slate-300 rounded-md" />
      </div>

      {/* Content Skeleton */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Title lines */}
          <div className="h-3.5 bg-slate-200 rounded-md w-full" />
          <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
        </div>

        <div className="space-y-2 pt-1">
          {/* Price */}
          <div className="h-5 bg-slate-300 rounded-md w-1/2" />

          {/* Rating & Sold */}
          <div className="flex items-center gap-2">
            <div className="h-3 bg-slate-200 rounded-md w-10" />
            <div className="h-3 bg-slate-200 rounded-md w-14" />
          </div>

          {/* Shop City */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
            <div className="h-3 bg-slate-200 rounded-md w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

export default ProductCardSkeleton;
