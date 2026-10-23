'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  MapPin,
  Store,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Share2,
  Heart,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  MessageCircle,
  CheckCircle2,
  ImageOff,
} from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { formatRupiah, formatSold, formatRating } from '@/lib/formatters';

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 bg-slate-200 rounded w-1/3" />

      {/* Main Detail Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        {/* Left Column: Image */}
        <div className="lg:col-span-5">
          <div className="w-full aspect-square bg-slate-200 rounded-2xl" />
        </div>

        {/* Center Column: Product Information */}
        <div className="lg:col-span-7 space-y-5">
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-10 bg-slate-300 rounded w-1/3" />
          <div className="h-24 bg-slate-100 rounded-xl" />
          <div className="h-20 bg-slate-100 rounded-xl" />
          <div className="h-12 bg-slate-200 rounded-xl w-1/2" />
        </div>
      </div>
    </div>
  );
}

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const productId = (params?.id as string) || '';

  const { data: product, isLoading, isError } = useProduct(productId);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    if (!product) return;
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const handleAddToCart = () => {
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 3000);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-900">
              Produk Tidak Ditemukan
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Produk dengan ID tersebut tidak ditemukan atau telah dihapus dari sistem.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shopCity = product.shop?.city || 'Indonesia';
  const shopName = product.shop?.name || 'Toko Marketplace';
  const categoryName = product.category?.name || 'Katalog';
  const isOutOfStock = product.stock <= 0;
  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-full pb-24 lg:pb-16 pt-4">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5" />
          <span>{quantity}x produk berhasil ditambahkan ke keranjang!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-4 space-y-4 sm:space-y-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto no-scrollbar py-1"
        >
          <Link href="/" className="hover:text-orange-600 transition-colors flex-shrink-0">
            Beranda
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          {product.categoryId && (
            <>
              <Link
                href={`/?categoryId=${product.categoryId}`}
                className="hover:text-orange-600 transition-colors whitespace-nowrap flex-shrink-0"
              >
                {categoryName}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </>
          )}
          <span className="text-gray-800 font-medium truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Main Product Card Section */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-6 lg:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Product Image Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-gray-100 shadow-xs group">
                {imageError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-6 text-center">
                    <ImageOff className="w-12 h-12 mb-2 stroke-1" />
                    <span className="text-xs">Gambar produk tidak tersedia</span>
                  </div>
                ) : (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={() => setImageError(true)}
                  />
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs tracking-tight shadow-md flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    Gratis Ongkir Xtra
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-orange-600 text-white font-bold text-xs tracking-tight shadow-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    100% Original
                  </span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-[11px] text-gray-600 font-medium">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-orange-500" />
                  <span>Gratis Ongkir</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Jaminan Ori</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-blue-500" />
                  <span>Bebas Retur 7 Hari</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & Order Action */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category Badge & Actions */}
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/?categoryId=${product.categoryId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition-colors border border-orange-200"
                  >
                    <span>{categoryName}</span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      aria-label="Wishlist"
                      className={`p-2 rounded-xl border transition-colors ${
                        isWishlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-500'
                          : 'border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Tautan produk berhasil disalin!');
                        }
                      }}
                      aria-label="Bagikan"
                      className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                      title="Salin tautan produk"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Name */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Rating, Sold, Stock info */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-wrap">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <span className="font-bold text-gray-900 underline underline-offset-2">
                      {formatRating(product.rating)}
                    </span>
                  </div>

                  <span className="text-gray-300">|</span>

                  {/* Sold count */}
                  <div className="font-medium">
                    <span className="font-semibold text-gray-700">{formatSold(product.sold)}</span>
                  </div>

                  <span className="text-gray-300">|</span>

                  {/* Stock Status */}
                  <div className="flex items-center gap-1">
                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200">
                        Stok Habis
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Tersedia ({product.stock} barang)
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-100 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-orange-600 tracking-tight">
                    {formatRupiah(product.price)}
                  </span>
                  <span className="text-xs text-orange-800 font-semibold px-2 py-0.5 rounded bg-orange-200/60">
                    Harga Terbaik
                  </span>
                </div>

                {/* Quantity Selector & Subtotal (Desktop & Tablet) */}
                {!isOutOfStock && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        Atur Jumlah:
                      </span>
                      <div className="inline-flex items-center border border-gray-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                        <button
                          type="button"
                          onClick={handleDecreaseQuantity}
                          disabled={quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                          aria-label="Kurangi kuantitas"
                        >
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-12 text-center text-sm font-bold text-gray-900 select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncreaseQuantity}
                          disabled={quantity >= product.stock}
                          className="p-2 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                          aria-label="Tambah kuantitas"
                        >
                          <Plus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                      </div>

                      <span className="text-xs text-gray-500">
                        Total stok: <strong className="text-gray-800">{product.stock}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 pt-1">
                      <span>Subtotal Belanja:</span>
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        {formatRupiah(totalPrice)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons (Desktop) */}
                <div className="hidden sm:flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 py-3.5 px-6 rounded-xl border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>+ Keranjang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart();
                      router.push('/cart');
                    }}
                    disabled={isOutOfStock}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Beli Sekarang</span>
                  </button>
                </div>
              </div>

              {/* Shop / Store Info Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-xs flex-shrink-0">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900">
                          {shopName}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-orange-950">
                          Official
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>Kota {shopCity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-orange-500" />
                      <span>Chat</span>
                    </button>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl border border-orange-500 text-orange-600 hover:bg-orange-50 text-xs font-semibold transition-colors"
                    >
                      Kunjungi Toko
                    </button>
                  </div>
                </div>

                {product.shop?.description && (
                  <p className="text-xs text-gray-600 line-clamp-2 pt-1 border-t border-slate-200/60">
                    {product.shop.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Description & Specification Section */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block" />
              Deskripsi & Spesifikasi Produk
            </h2>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 block font-medium">Kategori</span>
              <span className="text-gray-800 font-semibold">{categoryName}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 block font-medium">Stok Produk</span>
              <span className="text-gray-800 font-semibold">{product.stock} unit</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 block font-medium">Kondisi</span>
              <span className="text-gray-800 font-semibold">100% Baru & Segel</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="text-gray-400 block font-medium">Dikirim Dari</span>
              <span className="text-gray-800 font-semibold">Kota {shopCity}</span>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
            <div className="whitespace-pre-line">
              {product.description}
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1.5">
              <strong className="block font-bold">Catatan Pembeli:</strong>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                <li>Harap rekam video unboxing saat paket pertama kali diterima.</li>
                <li>Garansi berlaku sesuai dengan ketentuan toko dan distributor resmi.</li>
                <li>Pengiriman pesanan setiap hari kerja dengan asuransi pengiriman terjamin.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Like Shopee/Tokopedia App) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-2.5">
        <button
          type="button"
          className="flex flex-col items-center justify-center p-1.5 text-gray-600 hover:text-orange-600 text-[10px] font-medium flex-shrink-0"
        >
          <MessageCircle className="w-5 h-5 text-gray-700" />
          <span>Chat</span>
        </button>

        <div className="h-7 w-px bg-gray-200 flex-shrink-0" />

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 py-2.5 px-3 rounded-xl border border-orange-500 bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>+ Keranjang</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleAddToCart();
            router.push('/cart');
          }}
          disabled={isOutOfStock}
          className="flex-1 py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Beli Sekarang</span>
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent />
    </Suspense>
  );
}

