'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Sparkles, ImageOff } from 'lucide-react';
import { Product } from '@/types';
import { formatRupiah, formatSold, formatRating } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const city = product.shop?.city || 'Indonesia';
  const shopName = product.shop?.name;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col bg-white rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-200 overflow-hidden text-left"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <ImageOff className="w-8 h-8 mb-1 stroke-1" />
            <span className="text-[11px]">Gambar tidak tersedia</span>
          </div>
        ) : (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {/* Free Shipping Badge */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start">
          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] tracking-tight shadow-xs flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Gratis Ongkir
          </span>
        </div>

        {/* Stock Alert Badge (if low stock) */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-semibold text-[10px] shadow-xs">
              Sisa {product.stock}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Product Name */}
          <h3
            title={product.name}
            className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          {/* Product Price */}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-bold text-orange-600 tracking-tight">
              {formatRupiah(product.price)}
            </span>
          </div>
        </div>

        {/* Footer info: Rating, Sold, Shop City */}
        <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-gray-500">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-700">
                {formatRating(product.rating)}
              </span>
            </div>

            <span className="text-gray-300">•</span>

            {/* Terjual */}
            <span className="text-gray-500 font-normal">
              {formatSold(product.sold)}
            </span>
          </div>

          {/* Shop City */}
          <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate" title={`${shopName ? shopName + ' - ' : ''}${city}`}>
            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
            <span className="truncate">{city}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
