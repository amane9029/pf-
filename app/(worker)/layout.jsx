'use client';

/**
 * Worker Tablet Portal Shell Layout
 * Traceability: PondFish Worker Portal Spec (Sections 5, 6, WP-01, WP-02)
 * Tablet-first responsive navigation, session monitoring, and operational header.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function WorkerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/worker/login';

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('pondfish_worker_token') : null;
    const cachedWorker = typeof window !== 'undefined' ? localStorage.getItem('pondfish_worker_info') : null;

    if (!token) {
      setWorker(null);
      setLoading(false);
      if (!isLoginPage) {
        router.replace('/worker/login');
      }
      return;
    }

    if (cachedWorker) {
      try {
        setWorker(JSON.parse(cachedWorker));
      } catch {
        // invalid cache
      }
    }

    // Verify token with backend
    fetch('/api/v1/worker/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data?.worker) {
          setWorker(json.data.worker);
          localStorage.setItem('pondfish_worker_info', JSON.stringify(json.data.worker));
        } else {
          localStorage.removeItem('pondfish_worker_token');
          localStorage.removeItem('pondfish_worker_info');
          setWorker(null);
          if (!isLoginPage) {
            router.replace('/worker/login');
          }
        }
      })
      .catch(() => {
        // network issue, keep cached if present
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, isLoginPage, router]);

  function handleLogout() {
    const token = localStorage.getItem('pondfish_worker_token');
    if (token) {
      fetch('/api/v1/worker/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('pondfish_worker_token');
    localStorage.removeItem('pondfish_worker_info');
    setWorker(null);
    router.replace('/worker/login');
  }

  if (isLoginPage) {
    return (
      <div style={{ minHeight: '100vh', background: '#F0F5FA', color: '#0F2C59', fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', color: '#0F2C59', fontFamily: "'Plus Jakarta Sans', var(--font-jakarta), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Tablet-First Operational Header */}
      <header
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(15, 44, 89, 0.04)',
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/worker" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E56A0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              <path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
            </svg>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#0F2C59', letterSpacing: '-0.02em' }}>
                PONDFISH
              </span>
              <span style={{ fontSize: '11px', color: '#1E56A0', fontWeight: '800', marginLeft: '6px', textTransform: 'uppercase' }}>
                Worker Tablet
              </span>
            </div>
          </Link>
          <span
            style={{
              fontSize: '11px',
              background: '#DCFCE7',
              color: '#166534',
              padding: '4px 10px',
              borderRadius: '20px',
              fontWeight: '800',
              border: '1px solid #BBF7D0',
            }}
          >
            ● STORE COUNTER ACTIVE
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link
            href="/worker"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              background: pathname === '/worker' ? '#1E56A0' : '#FFFFFF',
              color: pathname === '/worker' ? '#FFFFFF' : '#425B73',
              border: '1px solid',
              borderColor: pathname === '/worker' ? '#1E56A0' : '#CBD5E1',
              boxShadow: pathname === '/worker' ? '0 2px 8px rgba(30, 86, 160, 0.2)' : 'none',
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/worker/bookings"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              background: pathname === '/worker/bookings' ? '#1E56A0' : '#FFFFFF',
              color: pathname === '/worker/bookings' ? '#FFFFFF' : '#425B73',
              border: '1px solid',
              borderColor: pathname === '/worker/bookings' ? '#1E56A0' : '#CBD5E1',
              boxShadow: pathname === '/worker/bookings' ? '0 2px 8px rgba(30, 86, 160, 0.2)' : 'none',
            }}
          >
            Booking Queue
          </Link>
          <Link
            href="/worker/bookings/scan"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              background: pathname.includes('/scan') ? '#1E56A0' : '#FFFFFF',
              color: pathname.includes('/scan') ? '#FFFFFF' : '#425B73',
              border: '1px solid',
              borderColor: pathname.includes('/scan') ? '#1E56A0' : '#CBD5E1',
              boxShadow: pathname.includes('/scan') ? '0 2px 8px rgba(30, 86, 160, 0.2)' : 'none',
            }}
          >
            Scan QR
          </Link>
          <Link
            href="/worker/bookings/search"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '700',
              textDecoration: 'none',
              background: pathname.includes('/search') ? '#1E56A0' : '#FFFFFF',
              color: pathname.includes('/search') ? '#FFFFFF' : '#425B73',
              border: '1px solid',
              borderColor: pathname.includes('/search') ? '#1E56A0' : '#CBD5E1',
              boxShadow: pathname.includes('/search') ? '0 2px 8px rgba(30, 86, 160, 0.2)' : 'none',
            }}
          >
            Search
          </Link>
        </nav>

        {/* Worker Badge & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {worker && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#E0F2FE',
                  color: '#0369A1',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  border: '1px solid #BAE6FD',
                }}
              >
                {worker.name ? worker.name.charAt(0).toUpperCase() : 'W'}
              </div>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F2C59' }}>{worker.name || 'Store Worker'}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{worker.mobileNumber || ''}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Tablet Workspace */}
      <main style={{ flex: 1, padding: '28px 24px', maxWidth: '1400px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {children}
      </main>
    </div>
  );
}
