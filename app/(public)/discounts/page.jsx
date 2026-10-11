'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { Tag, ArrowRight, Check } from '../components/Icons';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchDiscounts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/public/discounts');
      if (!res.ok) {
        throw new Error('Failed to load active promotions from server.');
      }
      const json = await res.json();
      setDiscounts(json.data || []);
    } catch (err) {
      console.error('[DISCOUNTS FETCH ERROR]', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 64px', width: '100%' }}>
      {/* 1. Header Section */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ fontSize: '11px', fontWeight: '900', color: '#1e56a0', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '8px' }}>
          Active Promotions & Specials
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f2c59', letterSpacing: '-0.5px', margin: '0 0 10px 0' }}>
          PondFish Offers & Flash Savings
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '680px', lineHeight: '1.6', margin: 0 }}>
          Enjoy verified daily promotions, early bird counter savings, and automated Day-2 freshness clearance discounts on selected lake and river varieties.
        </p>
      </div>

      {/* 2. Content States */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                height: '240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 16px rgba(15, 44, 89, 0.04)',
              }}
            >
              <div>
                <div style={{ width: '90px', height: '26px', borderRadius: '6px', background: '#f1f5f9', marginBottom: '16px' }} />
                <div style={{ width: '60%', height: '32px', borderRadius: '6px', background: '#e2e8f0', marginBottom: '12px' }} />
                <div style={{ width: '90%', height: '14px', borderRadius: '4px', background: '#f1f5f9' }} />
              </div>
              <div style={{ width: '40%', height: '14px', borderRadius: '4px', background: '#e2e8f0' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Offers Unavailable"
          message={error}
          onRetry={fetchDiscounts}
        />
      ) : discounts.length === 0 ? (
        <EmptyState
          title="No Active Flash Offers Today"
          message="All fish varieties are currently priced at everyday fair farm-gate counter rates. Check back during morning harvest arrival!"
          actionLabel="Browse Fish Catalogue"
          onAction={() => { window.location.href = '/fish'; }}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {discounts.map((d) => (
            <div
              key={d.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(15, 44, 89, 0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: '#ecfdf5',
                  borderBottomLeftRadius: '12px',
                  borderLeft: '1px solid #a7f3d0',
                  borderBottom: '1px solid #a7f3d0',
                  padding: '6px 14px',
                  fontSize: '10px',
                  fontWeight: '800',
                  color: '#047857',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Check size={12} color="#047857" />
                <span>VERIFIED ACTIVE</span>
              </div>

              <div>
                {/* Promo Code Pill */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f8fafc',
                    border: '1px dashed #1e56a0',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    color: '#1e56a0',
                    fontSize: '13px',
                    fontWeight: '800',
                    fontFamily: 'monospace',
                    marginBottom: '16px',
                  }}
                >
                  <Tag size={14} color="#1e56a0" />
                  <span>{d.code || 'FLASH DEAL'}</span>
                </div>

                <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e56a0', margin: '0 0 8px 0' }}>
                  {d.percentage ? `${d.percentage}% OFF` : `₹${d.amount} OFF`}
                </div>

                <p style={{ fontSize: '14px', color: '#425b73', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                  {d.description || (d.fishName ? `Applicable on fresh daily ${d.fishName}.` : 'Applied automatically at counter or customer app booking checkout.')}
                </p>

                {(d.startDate || d.endDate) && (
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginBottom: '16px' }}>
                    {d.endDate && `Valid until: ${new Date(d.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </div>
                )}
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                <Link
                  href="/fish"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#1e56a0',
                    fontSize: '13px',
                    fontWeight: '800',
                    textDecoration: 'none',
                  }}
                >
                  <span>Browse Eligible Fish</span>
                  <ArrowRight size={14} color="#1e56a0" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
