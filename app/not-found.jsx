import Link from 'next/link';
import { FishIcon, ArrowRight } from './(public)/components/Icons';

export default function NotFound() {
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
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '48px 36px',
          boxShadow: '0 8px 30px rgba(15, 44, 89, 0.05)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: '#e0f2fe',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#1e56a0',
          }}
        >
          <FishIcon size={36} color="#1e56a0" />
        </div>

        <div style={{ fontSize: '11px', fontWeight: '900', color: '#1e56a0', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px' }}>
          404 — Page Not Found
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f2c59', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
          Caught in an Empty Net
        </h1>

        <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', margin: '0 0 32px 0' }}>
          The page you're looking for doesn't exist or may have been relocated in today's counter replenishment.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              background: '#1e56a0',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '800',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(30, 86, 160, 0.2)',
            }}
          >
            Return Home
          </Link>
          <Link
            href="/fish"
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
            Browse Fish Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
