'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  ArrowLeft,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MapPin,
  Store,
  Calendar,
  ImageOff,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/services/order.service';
import { formatRupiah } from '@/lib/formatters';
import { Order, OrderStatus } from '@/types';

function getStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Menunggu Konfirmasi',
        className: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
      };
    case 'PROCESSING':
      return {
        label: 'Sedang Diproses',
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Package,
      };
    case 'SHIPPED':
      return {
        label: 'Dalam Pengiriman',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck,
      };
    case 'DELIVERED':
      return {
        label: 'Pesanan Selesai',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
      };
    case 'CANCELLED':
      return {
        label: 'Dibatalkan',
        className: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: XCircle,
      };
    default:
      return {
        label: status,
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: Package,
      };
  }
}

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: orders = [], isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
    enabled: typeof window !== 'undefined' && isAuthenticated,
    staleTime: 1000 * 15,
  });

  if (!isMounted || isAuthLoading || (isAuthenticated && isOrdersLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 animate-pulse">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-slate-200 rounded-xl w-1/4" />
          <div className="space-y-4">
            <div className="h-44 bg-white rounded-3xl border border-gray-100" />
            <div className="h-44 bg-white rounded-3xl border border-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Pesanan Saya
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Pantau riwayat dan status pesanan belanja Anda di TokoOranye
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3.5 py-2 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Belanja Lagi</span>
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-gray-100 shadow-sm text-center max-w-lg mx-auto space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
              <Package className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900">Belum Ada Pesanan</h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Halo {user?.name || 'Pelanggan'}, Anda belum memiliki riwayat pesanan belanja. Mari temukan beragam produk pilihan sekarang!
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Mulai Belanja</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const StatusIcon = statusBadge.icon;
              const formattedDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden"
                >
                  {/* Order Card Header */}
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-orange-50/20 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formattedDate}</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs font-mono text-gray-500 truncate max-w-[150px] sm:max-w-none">
                        No. Pesanan: {order.id.slice(0, 8)}...
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.className}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{statusBadge.label}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-5 divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-gray-100 flex-shrink-0">
                            {item.product?.imageUrl ? (
                              <Image
                                src={item.product.imageUrl}
                                alt={item.productName}
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
                              {item.productName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{item.quantity} barang x {formatRupiah(item.price)}</span>
                              {item.product?.shop?.name && (
                                <span className="text-gray-400">• Toko: {item.product.shop.name}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="font-bold text-xs sm:text-sm text-gray-900">
                            {formatRupiah(item.subtotal)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Card Footer */}
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                    {order.address ? (
                      <div className="flex items-start gap-2 text-xs text-gray-600 max-w-md">
                        <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="truncate">
                          Tujuan: <strong>{order.address.recipientName}</strong>, {order.address.street}, {order.address.city}
                        </span>
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-baseline gap-2 ml-auto">
                      <span className="text-xs text-gray-500">Total Pesanan:</span>
                      <span className="text-base sm:text-lg font-black text-orange-600">
                        {formatRupiah(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
