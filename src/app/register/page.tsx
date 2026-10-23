'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Store,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { registerSchema, RegisterFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password', '');

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(callbackUrl);
    }
  }, [isAuthenticated, authLoading, callbackUrl, router]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.replace(callbackUrl);
          router.refresh();
        }, 800);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Pendaftaran gagal. Silakan periksa kembali data Anda.';
      setServerError(message);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
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
            Buat Akun TokoOranye
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Daftar sekarang untuk nikmati ribuan promo, cashback & gratis ongkir
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
            <div className="font-semibold">Registrasi berhasil! Menyiapkan akun Anda...</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label
              htmlFor="register-name"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="misal: Budi Santoso"
                disabled={isSubmitting || isSuccess}
                {...register('name')}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-150 ${
                  errors.name
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
            >
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="register-email"
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

          {/* Phone (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="register-phone"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700"
              >
                Nomor Telepon
              </label>
              <span className="text-[11px] text-gray-400 font-medium">Opsional</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Phone className="w-5 h-5" />
              </div>
              <input
                id="register-phone"
                type="tel"
                autoComplete="tel"
                placeholder="081234567890"
                disabled={isSubmitting || isSuccess}
                {...register('phone')}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-150 ${
                  errors.phone
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                    : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 karakter"
                  disabled={isSubmitting || isSuccess}
                  {...register('password')}
                  className={`w-full pl-11 pr-10 py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-150 ${
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5"
              >
                Ulangi Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Ulangi kata sandi"
                  disabled={isSubmitting || isSuccess}
                  {...register('confirmPassword')}
                  className={`w-full pl-11 pr-10 py-3 rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-150 ${
                    errors.confirmPassword
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
                      : 'border-gray-200 focus:border-orange-500 focus:ring-orange-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Password requirement hint */}
          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 text-xs text-gray-600 space-y-1">
            <span className="font-semibold text-gray-800 block">Ketentuan kata sandi:</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                  passwordValue.length >= 6
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className={passwordValue.length >= 6 ? 'text-emerald-700 font-medium' : ''}>
                Minimal 6 karakter
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="register-submit-button"
            disabled={isSubmitting || isSuccess}
            className="w-full mt-3 py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/20 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting || isSuccess ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Pendaftaran...</span>
              </>
            ) : (
              <>
                <span>Daftar Akun Baru</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Sudah memiliki akun?{' '}
            <Link
              href={callbackUrl !== '/' ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'}
              id="to-login-link"
              className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-flex items-center gap-0.5"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500 font-medium">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Data Pengguna Dijamin Kerahasiaannya
        </span>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center py-10 px-4 bg-gradient-to-b from-orange-50/40 via-slate-50 to-slate-50">
      <Suspense
        fallback={
          <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-sm border border-gray-100 animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl mx-auto mb-4" />
            <div className="h-6 bg-slate-200 rounded w-1/2 mx-auto mb-2" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mx-auto mb-8" />
            <div className="h-10 bg-slate-100 rounded-xl mb-3" />
            <div className="h-10 bg-slate-100 rounded-xl mb-3" />
            <div className="h-10 bg-slate-100 rounded-xl mb-3" />
            <div className="h-12 bg-slate-200 rounded-xl" />
          </div>
        }
      >
        <RegisterFormContent />
      </Suspense>
    </div>
  );
}
