import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/query-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TokoOranye - Marketplace Belanja Online Mudah, Cepat & Aman',
  description:
    'Jual beli online aman dan nyaman di TokoOranye. Temukan aneka kebutuhan mulai dari gadget, fashion, elektronik hingga kebutuhan harian dengan jaminan kualitas dan promo menarik.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
        <QueryProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
