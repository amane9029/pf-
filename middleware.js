/**
 * Multi-Portal RBAC Authentication, Subdomain Router & Session Guard Middleware
 * Supports Multi-Tenant Vercel Subdomain Hosting:
 * - pondfish.in / www.pondfish.in -> Public Storefront (app/(public))
 * - admin.pondfish.in            -> Admin POS & Operations Portal (app/(admin))
 * - worker.pondfish.in           -> Worker Tablet / Counter POS Portal (app/(worker))
 * - tv.pondfish.in               -> Shop Live TV Broadcast Portal (app/(tv))
 */

import { NextResponse } from 'next/server';

/**
 * Extract active subdomain from Host header
 * @param {string|null} host
 * @returns {string|null}
 */
function getSubdomain(host) {
  if (!host) return null;
  const hostname = host.split(':')[0].toLowerCase();

  // Local development support (e.g. admin.localhost, worker.localhost, tv.localhost)
  if (hostname.endsWith('.localhost')) {
    return hostname.replace('.localhost', '');
  }

  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'pondfish.in').toLowerCase();

  // Apex domain or www is storefront
  if (hostname === rootDomain || hostname === `www.${rootDomain}` || hostname === 'localhost') {
    return null;
  }

  // Production root domain subdomains (e.g. admin.pondfish.in)
  if (hostname.endsWith(`.${rootDomain}`)) {
    return hostname.slice(0, -(rootDomain.length + 1));
  }

  // Vercel deployment preview / branch URL matching
  if (hostname.startsWith('admin.') || hostname.startsWith('admin-')) return 'admin';
  if (hostname.startsWith('worker.') || hostname.startsWith('worker-')) return 'worker';
  if (hostname.startsWith('tv.') || hostname.startsWith('tv-')) return 'tv';

  return null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Let API, static files, and Next.js internals pass through cleanly
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const subdomain = getSubdomain(request.headers.get('host'));
  let targetPath = pathname;

  // Subdomain route rewriting
  if (subdomain === 'admin') {
    if (!pathname.startsWith('/admin')) {
      targetPath = `/admin${pathname === '/' ? '' : pathname}`;
    }
  } else if (subdomain === 'worker') {
    if (!pathname.startsWith('/worker')) {
      targetPath = `/worker${pathname === '/' ? '' : pathname}`;
    }
  } else if (subdomain === 'tv') {
    if (!pathname.startsWith('/tv')) {
      targetPath = `/tv${pathname === '/' ? '' : pathname}`;
    }
  }

  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  // Admin Route Boundary Enforcement
  if (targetPath.startsWith('/admin') && !targetPath.startsWith('/admin/login')) {
    const adminToken =
      bearerToken ||
      request.cookies.get('admin_session')?.value ||
      request.cookies.get('pf_session')?.value;

    if (!adminToken && process.env.NODE_ENV === 'production') {
      const loginPath = subdomain === 'admin' ? '/login' : '/admin/login';
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Worker Route Boundary Enforcement
  if (targetPath.startsWith('/worker') && !targetPath.startsWith('/worker/login')) {
    const workerToken =
      bearerToken ||
      request.cookies.get('worker_session')?.value ||
      request.cookies.get('pf_session')?.value;

    if (!workerToken && process.env.NODE_ENV === 'production') {
      const loginPath = subdomain === 'worker' ? '/login' : '/worker/login';
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If URL rewrite is required for subdomain mapping
  if (targetPath !== pathname) {
    return NextResponse.rewrite(new URL(targetPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
