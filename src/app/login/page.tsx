'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Store,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, authLoading, callbackUrl, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      const res = await login({
        email: data.email,
        password: data.password,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.replace(callbackUrl);
          router.refresh();
        }, 600);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal masuk. Periksa kembali email dan kata sandi Anda.';
      setServerError(message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-orange-100/60 p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 mb-4 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <Store className="w-6 h-6 stroke-[2.5]" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Selamat Datang Kembali
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Masuk ke akun TokoOranye untuk melanjutkan belanja hemat & aman
          </p>
        </div>

        {/* Server Alert Message */}
        {serverError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{serverError}</div>
          </div>
        )}

        {isSuccess && (
          <div
            role="status"
            className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="font-semibold">Login berhasil! Mengalihkan...</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@email.com"
                disabled={isSubmitting || isSuccess}
                {...register('email')}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-150 ${
                  errors.email
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700"
              >
                Kata Sandi
              </label>
              <span className="text-xs text-orange-600 hover:text-orange-700 cursor-pointer font-medium hover:underline">
                Lupa kata sandi?
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Masukkan kata sandi Anda"
                disabled={isSubmitting || isSuccess}
                {...register('password')}
                className={`w-full pl-11 pr-11 py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-150 ${
                  errors.password
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit-button"
            disabled={isSubmitting || isSuccess}
            className="w-full mt-2 py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting || isSuccess ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Belum memiliki akun TokoOranye?{' '}
            <Link
              href={callbackUrl !== '/' ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/register'}
              id="to-register-link"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-0.5"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Data Aman & Terenkripsi
        </span>
        <span className="flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-orange-500" />
          Garansi Belanja 100%
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center py-10 px-4 bg-gradient-to-b from-orange-50/40 via-slate-50 to-slate-50">
      <Suspense
        fallback={
          <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-sm border border-gray-100 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl mx-auto mb-4" />
            <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto mb-2" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto mb-8" />
            <div className="h-10 bg-slate-100 rounded-xl mb-4" />
            <div className="h-10 bg-slate-100 rounded-xl mb-6" />
            <div className="h-12 bg-slate-200 rounded-xl" />
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
