'use client';

/**
 * Global Admin Shell Layout & Authentication Guard
 * Traceability:
 * - PondFish Page-by-Page UI Specification Admin Portal (Sections 9–11, 23, 174–179)
 * - Slice 13 Scope: Admin Access Control, Security & Session Governance
 */

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const [adminUser, setAdminUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    async function verifyAuth() {
      try {
        const res = await fetch('/api/v1/admin/auth/me', {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('pondfish_admin_user');
          window.location.href = `/admin/login?expired=true&redirect=${encodeURIComponent(pathname || '/admin')}`;
          return;
        }

        const data = await res.json();
        if (data.success && data.admin) {
          setAdminUser(data.admin);
          localStorage.setItem('pondfish_admin_user', JSON.stringify(data.admin));
        }
      } catch (err) {
        // Fallback to cached user if network glitch
        const cached = localStorage.getItem('pondfish_admin_user');
        if (cached) {
          try { setAdminUser(JSON.parse(cached)); } catch {}
        }
      } finally {
        setCheckingAuth(false);
      }
    }

    verifyAuth();
  }, [pathname, isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/admin/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch {}

    if (typeof window !== 'undefined') {
      localStorage.removeItem('pondfish_admin_user');
      window.location.href = '/admin/login';
    }
  };

  // If on login page, render without admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If checking authentication, show loading shell
  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F0F5FA',
        color: '#0F2C59',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#E0F2FE', color: '#1E56A0', marginBottom: '16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F2C59', marginBottom: '4px' }}>Verifying Administrator Credentials...</div>
          <div style={{ fontSize: '13px', color: '#64748B' }}>Connecting to secure enterprise session</div>
        </div>
      </div>
    );
  }

  const getNavLinkStyle = (isActive) => ({
    color: isActive ? '#FFFFFF' : '#CBD5E1',
    background: isActive ? '#1E56A0' : 'transparent',
    textDecoration: 'none',
    padding: '9px 12px',
    borderRadius: '8px',
    fontWeight: isActive ? '700' : '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8FAFC', fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', background: '#0F2C59', borderRight: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', paddingLeft: '4px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1E56A0, #0284C7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              <path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Pond<span style={{ color: '#38BDF8' }}>Fish</span>
            </span>
            <span style={{ fontSize: '10px', fontWeight: '800', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
              Admin
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#CBD5E1', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.4)', margin: '8px 8px 4px', fontWeight: '700' }}>
            Operations
          </div>
          <a
            href="/admin"
            style={getNavLinkStyle(pathname === '/admin')}
          >
            Executive Dashboard
          </a>
          <a
            id="nav-admin-bookings"
            href="/admin/bookings"
            style={getNavLinkStyle(pathname?.startsWith('/admin/bookings'))}
          >
            Bookings
          </a>
          <a
            id="nav-admin-transactions"
            href="/admin/transactions"
            style={getNavLinkStyle(pathname?.startsWith('/admin/transactions'))}
          >
            Transactions
          </a>
          <a
            id="nav-admin-notifications"
            href="/admin/notifications"
            style={getNavLinkStyle(pathname?.startsWith('/admin/notifications'))}
          >
            Notifications
          </a>
          <a
            href="/admin/journeys"
            style={getNavLinkStyle(pathname?.startsWith('/admin/journeys'))}
          >
            GPS Truck Journey
          </a>
          <a
            href="/admin/settings"
            style={getNavLinkStyle(pathname === '/admin/settings')}
          >
            Business Settings
          </a>
          <a
            href="/admin/reports"
            style={getNavLinkStyle(pathname === '/admin/reports' || pathname === '/admin/exports')}
          >
            Reports & Exports
          </a>

          <div style={{ margin: '14px 0 4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.4)', paddingLeft: '8px', fontWeight: '700' }}>
            Catalog & Sales
          </div>
          <a
            id="nav-admin-fish"
            href="/admin/fish"
            style={getNavLinkStyle(pathname === '/admin/fish')}
          >
            Fish Management
          </a>
          <a
            id="nav-admin-categories"
            href="/admin/categories"
            style={getNavLinkStyle(pathname === '/admin/categories')}
          >
            Categories
          </a>
          <a
            id="nav-admin-discounts"
            href="/admin/discounts"
            style={getNavLinkStyle(pathname === '/admin/discounts')}
          >
            Discounts
          </a>

          <div style={{ margin: '14px 0 4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.4)', paddingLeft: '8px', fontWeight: '700' }}>
            Subscriptions
          </div>
          <a
            id="nav-admin-subscription-plans"
            href="/admin/subscriptions/plans"
            style={getNavLinkStyle(pathname === '/admin/subscriptions/plans')}
          >
            Subscription Plans
          </a>
          <a
            id="nav-admin-customer-subscriptions"
            href="/admin/subscriptions"
            style={getNavLinkStyle(pathname === '/admin/subscriptions')}
          >
            Customer Subscriptions
          </a>

          <div style={{ margin: '14px 0 4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.4)', paddingLeft: '8px', fontWeight: '700' }}>
            People & Teams
          </div>
          <a
            id="nav-admin-customers"
            href="/admin/customers"
            style={getNavLinkStyle(pathname === '/admin/customers')}
          >
            Customers
          </a>
          <a
            id="nav-admin-workers"
            href="/admin/workers"
            style={getNavLinkStyle(pathname === '/admin/workers')}
          >
            Workers
          </a>

          <div style={{ margin: '14px 0 4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.4)', paddingLeft: '8px', fontWeight: '700' }}>
            Governance
          </div>
          <a
            href="/admin/audit"
            style={getNavLinkStyle(pathname === '/admin/audit' || pathname === '/admin/audit-logs')}
          >
            Audit Trail
          </a>
          <a
            href="/admin/exceptions"
            style={getNavLinkStyle(pathname === '/admin/exceptions')}
          >
            Exceptions Center
          </a>
          <a
            id="nav-admin-security"
            href="/admin/security"
            style={getNavLinkStyle(pathname === '/admin/security')}
          >
            Admin Security
          </a>

          <div style={{ margin: '14px 0 4px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255, 255, 255, 0.4)', paddingLeft: '8px', fontWeight: '700' }}>
            Account
          </div>
          <a
            id="nav-admin-profile"
            href="/admin/profile"
            style={getNavLinkStyle(pathname === '/admin/profile')}
          >
            Profile & Identity
          </a>
          <button
            id="nav-admin-logout"
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#F87171',
              textAlign: 'left',
              padding: '9px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </nav>

        {/* User Mini Card at bottom of sidebar */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1E56A0, #0284C7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            color: '#FFFFFF',
            fontWeight: '800',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          }}>
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminUser?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminUser?.email || 'admin@pondfish.in'}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header style={{
          padding: '14px 32px',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(15, 44, 89, 0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>PondFish Enterprise Operations</span>
            <span style={{ fontSize: '11px', color: '#CBD5E1' }}>|</span>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#166534',
              background: '#DCFCE7',
              padding: '3px 10px',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }}></span>
              ACTIVE SESSION
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: '#0F2C59', fontWeight: '600' }}>
              {adminUser ? `${adminUser.name} (${adminUser.email})` : 'Administrator'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#DC2626',
                padding: '6px 14px',
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

        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#F8FAFC' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
