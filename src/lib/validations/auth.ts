import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Format email tidak valid'),
  password: z
    .string()
    .min(1, 'Kata sandi wajib diisi'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nama lengkap wajib diisi')
      .min(3, 'Nama minimal 3 karakter')
      .max(60, 'Nama maksimal 60 karakter'),
    email: z
      .string()
      .min(1, 'Email wajib diisi')
      .email('Format email tidak valid'),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val || val.trim() === '') return true;
          // Validates Indonesian phone format (starts with 08 or +62, 10-14 digits)
          const cleaned = val.replace(/[\s-]/g, '');
          return /^(\+62|62|08)[0-9]{8,12}$/.test(cleaned);
        },
        {
          message: 'Nomor telepon tidak valid (contoh: 081234567890)',
        }
      ),
    password: z
      .string()
      .min(1, 'Kata sandi wajib diisi')
      .min(6, 'Kata sandi minimal 6 karakter'),
    confirmPassword: z
      .string()
      .min(1, 'Konfirmasi kata sandi wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi kata sandi tidak cocok dengan kata sandi',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
