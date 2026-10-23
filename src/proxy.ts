import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/profile', '/orders', '/checkout', '/dashboard', '/account', '/seller'];

// Routes for guest only (redirect to home if already logged in)
const guestOnlyRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isGuestOnlyRoute = guestOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // If user is accessing a protected route without a valid token, redirect to /login
  if (isProtectedRoute && !token) {
    const callbackUrl = encodeURIComponent(`${pathname}${search}`);
    const loginUrl = new URL(`/login?callbackUrl=${callbackUrl}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is already authenticated and visits login/register, redirect to home
  if (isGuestOnlyRoute && token) {
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    '/profile/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/dashboard/:path*',
    '/account/:path*',
    '/seller/:path*',
    '/login',
    '/register',
  ],
};

