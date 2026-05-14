import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const proxy = auth(function (req: NextRequest & { auth: unknown }) {
  const path = req.nextUrl.pathname;
  const isLoginPage = path === '/admin/login';
  const isSetupPage = path === '/admin/setup';
  const hasSession = !!(req as NextRequest & { auth: unknown }).auth;

  if (!isLoginPage && !isSetupPage && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (isLoginPage && hasSession) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }
});

export const config = {
  matcher: ['/admin/:path*'],
};
