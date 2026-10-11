'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, ChevronDown } from './Icons';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Offers', href: '/discounts' },
  { label: 'Subscriptions', href: '/subscriptions' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Get App', href: '/#mobile-app' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [fishDropdown, setFishDropdown] = useState(false);

  return (
    <header className="pf-header">
      <div className="pf-container">
        <div className="pf-header-inner">
          {/* Brand Logo */}
          <Link href="/" className="pf-logo" aria-label="PondFish Home">
            <span className="pf-logo-pond">Pond</span>
            <span className="pf-logo-fish">Fish</span>
          </Link>

          {/* Desktop Nav with single-line guarantee */}
          <nav className="pf-nav-links">
            <Link href="/" className="pf-nav-link">Home</Link>

            {/* Fish Dropdown Anchor */}
            <div
              className="pf-nav-dropdown-wrapper"
              onMouseEnter={() => setFishDropdown(true)}
              onMouseLeave={() => setFishDropdown(false)}
            >
              <Link
                href="/fish"
                className="pf-nav-link pf-nav-link-dropdown"
              >
                <span>Fish</span>
                <ChevronDown size={12} />
              </Link>

              {fishDropdown && (
                <div className="pf-dropdown-menu">
                  <Link href="/fish" className="pf-dropdown-item">All Fish Varieties</Link>
                  <Link href="/fish?category=Freshwater%20Fish" className="pf-dropdown-item">Freshwater / Pond</Link>
                  <Link href="/fish?category=Sea%20Fish%20%2F%20Marine" className="pf-dropdown-item">Sea Fish / Marine</Link>
                  <Link href="/fish?category=Shellfish%20%26%20Prawns" className="pf-dropdown-item">Shellfish &amp; Prawns</Link>
                  <Link href="/categories" className="pf-dropdown-item" style={{ borderTop: '1px solid #f1f5f9', marginTop: '4px', paddingTop: '8px', color: '#1e56a0', fontWeight: '800' }}>
                    View All Categories &rarr;
                  </Link>
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link key={link.label} href={link.href} className="pf-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action CTA */}
          <div className="pf-header-actions">
            <Link href="/#mobile-app" className="pf-btn-primary pf-btn-app" title="Download the PondFish Mobile App">
              <Download size={14} />
              <span>Download App</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
