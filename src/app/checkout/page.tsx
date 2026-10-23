'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Plus,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Store,
  CreditCard,
  ShoppingBag,
  Building,
  Phone,
  User as UserIcon,
  X,
  ImageOff,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useAddresses } from '@/hooks/useAddresses';
import { orderService } from '@/services/order.service';
import { formatRupiah } from '@/lib/formatters';
import { CreateAddressInput } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { items, totalItems, totalAmount, isLoading: isCartLoading, refetchCart } = useCart();
  const {
    addresses,
    defaultAddress,
    isLoading: isAddressLoading,
    createAddress,
    isCreatingAddress,
  } = useAddresses();

  const [isMounted, setIsMounted] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');

  // Form state for adding new address
  const [addressForm, setAddressForm] = useState<CreateAddressInput>({
    recipientName: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false,
  });
  const [addressFormError, setAddressFormError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Set default selected address once loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const def = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  // Pre-fill recipient name and phone from user if blank
  useEffect(() => {
    if (user && !addressForm.recipientName) {
      setAddressForm((prev) => ({
        ...prev,
        recipientName: user.name || '',
        phone: user.phone || '',
      }));
    }
  }, [user, addressForm.recipientName]);

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormError(null);

    if (!addressForm.recipientName.trim()) {
      setAddressFormError('Nama penerima wajib diisi');
      return;
    }
    if (!addressForm.phone.trim()) {
      setAddressFormError('Nomor telepon penerima wajib diisi');
      return;
    }
    if (!addressForm.street.trim()) {
      setAddressFormError('Alamat jalan / alamat lengkap wajib diisi');
      return;
    }
    if (!addressForm.city.trim()) {
      setAddressFormError('Kota / Kabupaten wajib diisi');
      return;
    }

    try {
      const newAddress = await createAddress(addressForm);
      setSelectedAddressId(newAddress.id);
      setShowAddAddressModal(false);
      setAddressForm({
        recipientName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        isDefault: false,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan alamat baru';
      setAddressFormError(msg);
    }
  };

  const handleCreateOrder = async () => {
    setOrderError(null);

    if (items.length === 0) {
      setOrderError('Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.');
      return;
    }

    if (!selectedAddressId) {
      setOrderError('Silakan pilih atau tambahkan alamat pengiriman terlebih dahulu.');
      return;
    }

    try {
      setIsSubmittingOrder(true);
      const newOrder = await orderService.createOrder(selectedAddressId);
      await refetchCart();
      setCreatedOrderId(newOrder.id);
      setOrderSuccess(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memproses pesanan. Silakan periksa kembali stok produk.';
      setOrderError(msg);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (!isMounted || isAuthLoading || isCartLoading || isAddressLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-8 bg-slate-200 rounded-xl w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-44 bg-white rounded-3xl border border-gray-100" />
              <div className="h-64 bg-white rounded-3xl border border-gray-100" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-80 bg-white rounded-3xl border border-gray-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated safeguard
  if (!isAuthenticated) {
    router.push('/login?callbackUrl=/checkout');
    return null;
  }

  // Success Confirmation Screen
  if (orderSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12 stroke-[2.25]" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Pesanan Berhasil Dibuat
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Terima Kasih atas Pesanan Anda!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Pesanan Anda dengan nomor ID{' '}
              <strong className="text-gray-900 font-mono text-xs">{createdOrderId}</strong> telah berhasil dibuat dan segera diproses oleh penjual.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/orders"
              id="view-orders-btn"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md transition-all active:scale-95 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Lihat Pesanan Saya</span>
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center py-3 px-6 rounded-xl font-semibold text-gray-700 hover:bg-slate-100 transition-colors text-sm"
            >
              Belanja Lagi
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Checkout Pesanan
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Tinjau alamat pengiriman dan rincian pesanan Anda sebelum membuat pesanan
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Keranjang</span>
          </Link>
        </div>

        {/* Prominent Stock Error Alert */}
        {orderError && (
          <div
            id="checkout-error-banner"
            className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-900 shadow-sm animate-in fade-in duration-200 space-y-3"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <h3 className="font-extrabold text-sm sm:text-base text-rose-950">
                  Pesanan Tidak Dapat Diproses
                </h3>
                <p className="text-xs sm:text-sm text-rose-800 leading-relaxed font-medium">
                  {orderError}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-rose-700">
                Silakan sesuaikan kuantitas barang yang melebihi stok di keranjang Anda.
              </span>
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-xs"
              >
                <span>Perbaiki di Keranjang</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        )}

        {/* Empty Cart Notice */}
        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm text-center max-w-md mx-auto space-y-4">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
            <h2 className="text-lg font-bold text-gray-900">Keranjang Belanja Kosong</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Tidak ada produk yang dapat di-checkout saat ini. Silakan tambahkan produk ke keranjang terlebih dahulu.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-700 text-xs sm:text-sm"
            >
              Cari Produk
            </Link>
          </div>
        ) : (
          /* Main Checkout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Delivery Address & Order Items Breakdown */}
            <div className="lg:col-span-8 space-y-6">
              {/* Section 1: Address Selection */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <MapPin className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                        Alamat Pengiriman
                      </h2>
                      <span className="text-xs text-gray-500">
                        Pilih alamat tujuan pengiriman pesanan Anda
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    id="add-address-modal-btn"
                    onClick={() => setShowAddAddressModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-500 bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-bold transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alamat Baru</span>
                  </button>
                </div>

                {/* Address List */}
                {addresses.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-3">
                    <MapPin className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="text-xs sm:text-sm text-amber-900 font-medium">
                      Anda belum memiliki alamat pengiriman yang tersimpan.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddAddressModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Buat Alamat Sekarang</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((address) => {
                      const isSelected = selectedAddressId === address.id;

                      return (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                id={`address-radio-${address.id}`}
                                name="shipping-address"
                                checked={isSelected}
                                onChange={() => setSelectedAddressId(address.id)}
                                className="mt-1 w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                              />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm text-gray-900">
                                    {address.recipientName}
                                  </span>
                                  <span className="text-xs text-gray-500 font-normal">
                                    ({address.phone})
                                  </span>
                                  {address.isDefault && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                                      Utama
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  {address.street}, {address.city}
                                  {address.province ? `, ${address.province}` : ''}
                                  {address.postalCode ? ` ${address.postalCode}` : ''}
                                </p>
                              </div>
                            </div>

                            {isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 2: Order Items Breakdown */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <Store className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                      Rincian Produk yang Dipesan
                    </h2>
                    <span className="text-xs text-gray-500">
                      Total {totalItems} barang dari keranjang belanja Anda
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-gray-100 flex-shrink-0">
                          {item.product.imageUrl ? (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageOff className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{item.quantity} x {formatRupiah(item.product.price)}</span>
                            {item.product.shop?.name && (
                              <span className="text-gray-400">• Toko: {item.product.shop.name}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="font-extrabold text-xs sm:text-sm text-gray-900">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Payment & Order Summary */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
                  <span>Ringkasan Pesanan</span>
                  <CreditCard className="w-4 h-4 text-orange-500" />
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Total Harga ({totalItems} barang)</span>
                    <span className="font-semibold text-gray-900">{formatRupiah(totalAmount)}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Biaya Pengiriman
                    </span>
                    <span className="font-semibold text-emerald-600">Rp 0 (Gratis Ongkir)</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Biaya Layanan</span>
                    <span className="font-semibold text-emerald-600">Gratis</span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-sm font-bold text-gray-900 block">Total Tagihan</span>
                      <span className="text-[11px] text-gray-400 font-normal">Termasuk PPN</span>
                    </div>
                    <span
                      id="checkout-grand-total"
                      className="text-xl sm:text-2xl font-black text-orange-600 tracking-tight"
                    >
                      {formatRupiah(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Buat Pesanan Button */}
                <button
                  type="button"
                  id="place-order-btn"
                  onClick={handleCreateOrder}
                  disabled={isSubmittingOrder || items.length === 0 || !selectedAddressId}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmittingOrder ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses Pesanan...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Buat Pesanan</span>
                    </>
                  )}
                </button>

                {/* Security and Protection Notice */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Garansi TokoOranye Dilindungi</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Stok produk akan diverifikasi dan dipotong secara langsung saat pesanan dibuat. Jaminan barang asli atau uang kembali.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Tambah Alamat Baru */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-extrabold text-gray-900">Tambah Alamat Baru</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAddressModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addressFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{addressFormError}</span>
              </div>
            )}

            <form onSubmit={handleCreateAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-gray-400" /> Nama Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipientName}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, recipientName: e.target.value }))
                    }
                    placeholder="Contoh: Budi Santoso"
                    id="address-recipient-name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="08123456789"
                    id="address-phone"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">
                  Alamat Lengkap (Jalan, RT/RW, No. Rumah) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={addressForm.street}
                  onChange={(e) =>
                    setAddressForm((prev) => ({ ...prev, street: e.target.value }))
                  }
                  placeholder="Jl. Merdeka No. 45, RT 02 / RW 05"
                  id="address-street"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-gray-400" /> Kota/Kab *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="Jakarta Selatan"
                    id="address-city"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Provinsi</label>
                  <input
                    type="text"
                    value={addressForm.province || ''}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, province: e.target.value }))
                    }
                    placeholder="DKI Jakarta"
                    id="address-province"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Kode Pos</label>
                  <input
                    type="text"
                    value={addressForm.postalCode || ''}
                    onChange={(e) =>
                      setAddressForm((prev) => ({ ...prev, postalCode: e.target.value }))
                    }
                    placeholder="12345"
                    id="address-postal-code"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="address-is-default"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))
                  }
                  className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                />
                <label htmlFor="address-is-default" className="text-xs text-gray-700 select-none">
                  Jadikan sebagai alamat utama / default
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="submit-new-address-btn"
                  disabled={isCreatingAddress}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-md shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isCreatingAddress ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Alamat</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
