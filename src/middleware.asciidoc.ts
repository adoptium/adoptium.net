import { NextResponse } from 'next/server';

/**
 * This middleware handles requests to AsciiDoc paths and forwards them
 * to our dynamic route handler.
 */
export function middleware() {
  // We don't need to manually check for file existence in middleware
  // as Next.js App Router will handle dynamic routes
  return NextResponse.next();
}

export const config = {
  // Skip API routes, static assets, etc.
  matcher: [
    '/((?!api|_next/static|_next/image|_vercel|favicon.ico|images|fonts).*)',
  ],
};
