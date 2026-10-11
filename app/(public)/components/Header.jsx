'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Download, ChevronDown, Menu, X } from './Icons';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Fish', href: '/fish' },
  { label: 'Offers', href: '/discounts' },
  { label: 'Subscriptions', href: '/subscriptions' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [fishDropdown, setFishDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile drawer on ESC or route change
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="pf-header">
      <div className="pf-container">
        <div className="pf-header-inner">
          {/* Brand Logo */}
          <Link href="/" className="pf-logo" aria-label="PondFish Home" onClick={closeMenu}>
            <span className="pf-logo-pond">Pond</span>
            <span className="pf-logo-fish">Fish</span>
          </Link>

          {/* Desktop Nav */}
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

            {navLinks.slice(2).map((link) => (
              <Link key={link.label} href={link.href} className="pf-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action CTA (Desktop) */}
          <div className="pf-header-actions">
            <Link href="/#mobile-app" className="pf-btn-primary pf-btn-app" title="Download the PondFish Mobile App">
              <Download size={14} />
              <span>Download App</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button (3 lines) */}
          <button
            type="button"
            className="pf-mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} color="#0f2c59" /> : <Menu size={26} color="#0f2c59" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop & Menu mounted to body */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="pf-mobile-menu-overlay" onClick={closeMenu}>
          <div className="pf-mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="pf-mobile-menu-header">
              <Link href="/" className="pf-logo" onClick={closeMenu}>
                <span className="pf-logo-pond">Pond</span>
                <span className="pf-logo-fish">Fish</span>
              </Link>
              <button
                type="button"
                className="pf-mobile-close-btn"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={22} color="#0f2c59" />
              </button>
            </div>

            <nav className="pf-mobile-nav-list">
              <Link href="/" className="pf-mobile-nav-item" onClick={closeMenu}>
                Home
              </Link>
              <Link href="/fish" className="pf-mobile-nav-item" onClick={closeMenu}>
                All Fish Varieties
              </Link>
              <div className="pf-mobile-subnav">
                <Link href="/fish?category=Freshwater%20Fish" className="pf-mobile-sublink" onClick={closeMenu}>
                  • Freshwater / Pond
                </Link>
                <Link href="/fish?category=Sea%20Fish%20%2F%20Marine" className="pf-mobile-sublink" onClick={closeMenu}>
                  • Sea Fish / Marine
                </Link>
                <Link href="/fish?category=Shellfish%20%26%20Prawns" className="pf-mobile-sublink" onClick={closeMenu}>
                  • Shellfish &amp; Prawns
                </Link>
              </div>
              <Link href="/discounts" className="pf-mobile-nav-item" onClick={closeMenu}>
                Offers &amp; Deals
              </Link>
              <Link href="/subscriptions" className="pf-mobile-nav-item" onClick={closeMenu}>
                Seafood Subscriptions
              </Link>
              <Link href="/#how-it-works" className="pf-mobile-nav-item" onClick={closeMenu}>
                How PondFish Works
              </Link>
              <Link href="/about" className="pf-mobile-nav-item" onClick={closeMenu}>
                About Us
              </Link>
              <Link href="/contact" className="pf-mobile-nav-item" onClick={closeMenu}>
                Contact Store
              </Link>
            </nav>

            <div className="pf-mobile-menu-footer">
              <Link
                href="/#mobile-app"
                className="pf-btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', fontSize: '14px' }}
                onClick={closeMenu}
              >
                <Download size={16} />
                <span>Download PondFish App</span>
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
