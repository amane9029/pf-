'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ShieldCheck } from './(public)/components/Icons';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('[PONDFISH SYSTEM ERROR]', error?.message || error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: '#f7fcff',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          background: '#ffffff',
          border: '1px solid #fecdd3',
          borderRadius: '20px',
          padding: '48px 36px',
          boxShadow: '0 8px 30px rgba(225, 29, 72, 0.05)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#e11d48',
          }}
        >
          <ShieldCheck size={32} color="#e11d48" />
        </div>

        <div style={{ fontSize: '11px', fontWeight: '900', color: '#e11d48', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px' }}>
          500 — System Notice
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f2c59', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
          Something went wrong
        </h1>

        <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', margin: '0 0 32px 0' }}>
          We encountered an unexpected issue while loading this page. Our technical team has been notified.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              background: '#1e56a0',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30, 86, 160, 0.2)',
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              background: '#f8fafc',
              color: '#0f2c59',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '800',
              textDecoration: 'none',
              border: '1px solid #cbd5e1',
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
