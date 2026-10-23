'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Store,
  MapPin,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ImageOff,
  LogIn,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { CartItem } from '@/types';
import { formatRupiah } from '@/lib/formatters';

interface ShopGroup {
  shopId: string;
  shopName: string;
  shopCity: string;
  items: CartItem[];
  subtotal: number;
  totalQuantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    items,
    totalItems,
    totalAmount,
    isLoading: isCartLoading,
    updateQuantity,
    removeItem,
    clearCart,
    isClearingCart,
  } = useCart();

  const [isMounted, setIsMounted] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Group cart items by store/shop
  const shopGroups = useMemo<ShopGroup[]>(() => {
    const groups: Record<string, ShopGroup> = {};

    for (const item of items) {
      const shopId = item.product.shop?.id || 'unknown';
      const shopName = item.product.shop?.name || 'Toko TokoOranye';
      const shopCity = item.product.shop?.city || 'Indonesia';

      if (!groups[shopId]) {
        groups[shopId] = {
          shopId,
          shopName,
          shopCity,
          items: [],
          subtotal: 0,
          totalQuantity: 0,
        };
      }

      groups[shopId].items.push(item);
      groups[shopId].subtotal += item.subtotal;
      groups[shopId].totalQuantity += item.quantity;
    }

    return Object.values(groups);
  }, [items]);

  const handleUpdateQuantity = async (
    item: CartItem,
    newQuantity: number
  ) => {
    setErrorMessage(null);

    if (newQuantity <= 0) {
      handleRemoveItem(item.id, item.product.name);
      return;
    }

    if (newQuantity > item.product.stock) {
      setErrorMessage(
        `Stok produk "${item.product.name}" tidak mencukupi (tersedia: ${item.product.stock}, diminta: ${newQuantity})`
      );
      return;
    }

    try {
      setUpdatingItemId(item.id);
      await updateQuantity({ itemId: item.id, quantity: newQuantity });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui jumlah produk';
      setErrorMessage(msg);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string, productName: string) => {
    setErrorMessage(null);
    try {
      setDeletingItemId(itemId);
      await removeItem(itemId);
      setSuccessMessage(`Produk "${productName}" telah dihapus dari keranjang`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus produk';
      setErrorMessage(msg);
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja?')) {
      return;
    }

    setErrorMessage(null);
    try {
      await clearCart();
      setSuccessMessage('Seluruh keranjang belanja berhasil dikosongkan');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengosongkan keranjang';
      setErrorMessage(msg);
    }
  };

  if (!isMounted || isAuthLoading || (isAuthenticated && isCartLoading)) {
    return (
      <div className="min-h-[70vh] bg-slate-50 py-10 px-4 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 bg-slate-200 rounded-xl w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="h-44 bg-white rounded-2xl border border-gray-100" />
              <div className="h-44 bg-white rounded-2xl border border-gray-100" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-72 bg-white rounded-2xl border border-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Guest view: user not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 text-center space-y-5 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900">Keranjang Belanja Anda</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Masuk ke akun TokoOranye Anda untuk melihat daftar belanjaan, mengubah jumlah produk, dan melanjutkan ke pembayaran.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/login?callbackUrl=/cart"
              id="cart-login-btn"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Akun</span>
            </Link>
            <Link
              href="/"
              className="w-full inline-flex items-center justify-center py-3 px-6 rounded-xl font-semibold text-gray-700 hover:bg-slate-100 transition-colors text-sm"
            >
              Jelajahi Produk Dulu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title & Clear Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <span>Keranjang Belanja</span>
              {totalItems > 0 && (
                <span className="text-xs sm:text-sm font-semibold bg-orange-100 text-orange-800 px-3 py-0.5 rounded-full">
                  {totalItems} barang
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Kelola daftar belanjaan dari berbagai toko resmi mitra TokoOranye
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              id="clear-cart-btn"
              onClick={handleClearCart}
              disabled={isClearingCart}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isClearingCart ? 'Mengosongkan...' : 'Kosongkan Keranjang'}</span>
            </button>
          )}
        </div>

        {/* Global Alert Messages */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Perhatian</p>
              <p className="text-xs sm:text-sm text-rose-700">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span className="flex-1 text-xs sm:text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-gray-100 shadow-sm text-center max-w-2xl mx-auto space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
              <ShoppingCart className="w-12 h-12 stroke-[1.75]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Keranjang Belanja Masih Kosong
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                Wah, keranjang belanjaan Anda masih belum memiliki barang. Temukan berbagai produk impian dengan promo menarik sekarang!
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                id="cart-empty-shop-btn"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95 text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Mulai Belanja Sekarang</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Store-Grouped Cart Items */}
            <div className="lg:col-span-8 space-y-6">
              {shopGroups.map((group) => (
                <div
                  key={group.shopId}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden"
                >
                  {/* Shop Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-orange-50/30 to-slate-50 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm sm:text-base text-gray-900">
                            {group.shopName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Official
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>Kota {group.shopCity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-gray-500 block">Subtotal Toko:</span>
                      <span className="text-sm font-bold text-orange-600">
                        {formatRupiah(group.subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Items List in Shop */}
                  <div className="divide-y divide-gray-100">
                    {group.items.map((item) => {
                      const isOutOfStock = item.product.stock <= 0;
                      const isUpdating = updatingItemId === item.id;
                      const isDeleting = deletingItemId === item.id;

                      return (
                        <div
                          key={item.id}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                        >
                          {/* Product Info */}
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Link
                              href={`/products/${item.productId}`}
                              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-gray-100 flex-shrink-0 group"
                            >
                              {item.product.imageUrl ? (
                                <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  fill
                                  sizes="96px"
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageOff className="w-6 h-6" />
                                </div>
                              )}
                            </Link>

                            <div className="flex-1 min-w-0 space-y-1">
                              <Link
                                href={`/products/${item.productId}`}
                                className="font-bold text-sm sm:text-base text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                              >
                                {item.product.name}
                              </Link>

                              <p className="text-sm font-black text-orange-600">
                                {formatRupiah(item.product.price)}
                              </p>

                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Stok tersedia: <strong>{item.product.stock}</strong></span>
                                {item.quantity > item.product.stock && (
                                  <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded text-[10px]">
                                    Kuantitas melebihi stok!
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quantity Selector & Item Subtotal */}
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                              <button
                                type="button"
                                aria-label="Kurangi kuantitas"
                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating || isDeleting}
                                className="p-2 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5 text-gray-600" />
                              </button>

                              <span className="w-10 text-center text-xs sm:text-sm font-bold text-gray-900 select-none flex items-center justify-center">
                                {isUpdating ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600" />
                                ) : (
                                  item.quantity
                                )}
                              </span>

                              <button
                                type="button"
                                aria-label="Tambah kuantitas"
                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock || isUpdating || isDeleting}
                                className="p-2 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                            </div>

                            {/* Item Subtotal */}
                            <div className="text-right min-w-[100px]">
                              <span className="text-xs text-gray-400 block sm:hidden">Total:</span>
                              <span className="text-sm sm:text-base font-extrabold text-gray-900">
                                {formatRupiah(item.subtotal)}
                              </span>
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              aria-label={`Hapus ${item.product.name}`}
                              onClick={() => handleRemoveItem(item.id, item.product.name)}
                              disabled={isDeleting}
                              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                              title="Hapus dari keranjang"
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary & Checkout Card */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-gray-900 pb-3 border-b border-gray-100">
                  Ringkasan Belanja
                </h3>

                {/* Subtotals breakdown */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Total Barang ({totalItems} unit)</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(totalAmount)}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Estimasi Ongkir
                    </span>
                    <span className="font-semibold text-emerald-600">Gratis (Promo)</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-gray-900 block">Total Pembayaran</span>
                      <span className="text-[11px] text-gray-400 font-normal">Termasuk PPN</span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-orange-600 tracking-tight" id="cart-grand-total">
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  id="checkout-btn"
                  onClick={() => router.push('/checkout')}
                  disabled={items.length === 0}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <span>Lanjut ke Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Guarantees info */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Belanja 100% Aman & Terpercaya</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Pembayaran dilindungi enkripsi standar bank dan jaminan uang kembali jika barang tidak sesuai.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
