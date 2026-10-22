import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Smartphone,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto text-gray-600 text-sm">
      {/* Marketplace Value Highlights */}
      <div className="border-b border-gray-100 bg-orange-50/40 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-xs border border-orange-100/60">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Gratis Ongkir Se-Indonesia</h4>
              <p className="text-xs text-gray-500 mt-0.5">Klaim voucher gratis ongkir tanpa min. belanja</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-xs border border-orange-100/60">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">100% Produk Original</h4>
              <p className="text-xs text-gray-500 mt-0.5">Jaminan barang asli dari official seller</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-xs border border-orange-100/60">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Garansi 7 Hari Retur</h4>
              <p className="text-xs text-gray-500 mt-0.5">Pengembalian mudah jika barang tidak sesuai</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-xl bg-white shadow-xs border border-orange-100/60">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Layanan CS 24/7</h4>
              <p className="text-xs text-gray-500 mt-0.5">Tim support ramah siap membantu kapan pun</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Col 1: Layanan Pelanggan */}
          <div className="col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Layanan Pelanggan
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <Link href="/help" className="hover:text-orange-600 transition-colors">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/help/order" className="hover:text-orange-600 transition-colors">
                  Cara Pembelian
                </Link>
              </li>
              <li>
                <Link href="/help/shipping" className="hover:text-orange-600 transition-colors">
                  Pengiriman & Pelacakan
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="hover:text-orange-600 transition-colors">
                  Pengembalian & Dana
                </Link>
              </li>
              <li>
                <Link href="/help/guarantee" className="hover:text-orange-600 transition-colors">
                  Garansi Marketplace
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-600 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Jelajahi Toko */}
          <div className="col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Jelajahi Toko
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <Link href="/about" className="hover:text-orange-600 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-orange-600 transition-colors">
                  Karir & Rekrutmen
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-orange-600 transition-colors">
                  Blog & Berita
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-600 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-600 transition-colors">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/seller" className="hover:text-orange-600 transition-colors text-orange-600 font-medium">
                  Mulai Jualan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Pembayaran & Pengiriman */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Pembayaran Aman & Pengiriman
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Didukung oleh sistem gerbang pembayaran berstandar keamanan internasional.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {['BCA', 'Mandiri', 'BNI', 'BRI', 'QRIS', 'GoPay', 'OVO', 'ShopeePay', 'COD'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-gray-100 text-gray-700 rounded border border-gray-200"
                >
                  {method}
                </span>
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
              Mitra Pengiriman
            </h4>
            <div className="flex flex-wrap gap-2">
              {['JNE Express', 'J&T', 'SiCepat', 'Anteraja', 'GoSend', 'GrabExpress'].map((courier) => (
                <span
                  key={courier}
                  className="px-2.5 py-1 text-[11px] font-medium bg-gray-50 text-gray-600 rounded border border-gray-200"
                >
                  {courier}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Ikuti Kami & Unduh */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Ikuti Kami
            </h3>
            <div className="flex items-center gap-3 mb-6">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-gray-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-orange-500 hover:text-white flex items-center justify-center text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
              Unduh Aplikasi
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 cursor-pointer transition-colors">
                <Smartphone className="w-5 h-5 text-orange-400" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 leading-none">Unduh di</div>
                  <div className="text-xs font-bold leading-tight">Google Play / App Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-gray-100 border-t border-gray-200 py-4 px-4 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p>© 2026 TokoOranye. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4 text-gray-500">
            <span>Indonesia</span>
            <span>•</span>
            <Link href="/privacy" className="hover:underline">Privasi</Link>
            <span>•</span>
            <Link href="/terms" className="hover:underline">Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
