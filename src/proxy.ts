import { NextRequest, NextResponse } from 'next/server';

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/api/upload-image', '/manifest.json'];
  if (publicPaths.includes(path) || path.startsWith('/_next') || path.match(/\.(png|jpg|jpeg|gif|svg|ico|json)$/)) {
    return NextResponse.next();
  }

  // Check for the auth cookie set by authContext.tsx
  const authCookie = req.cookies.get('stucor_auth')?.value;

  if (!authCookie) {
    // Redirect to home (login page) if trying to access protected route without auth
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  skipProxyUrlNormalize: true,
};
