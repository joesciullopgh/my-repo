'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_LINKS, BUSINESS_INFO } from '@/lib/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
              {/* Placeholder for logo - will use actual logo image */}
              <span className="text-primary font-bold text-lg">MC</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-secondary font-bold text-lg leading-tight">
                {BUSINESS_INFO.name}
              </h1>
              <p className="text-secondary/70 text-xs">
                Oakmont, PA
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-secondary hover:text-white hover:bg-primary-light rounded-lg transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="ml-2 px-4 py-2 bg-secondary text-primary hover:bg-secondary-dark rounded-lg transition-colors text-sm font-semibold"
            >
              Sign In
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-secondary hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary-light">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-secondary hover:text-white hover:bg-primary-light rounded-lg transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-primary-light">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 bg-secondary text-primary hover:bg-secondary-dark rounded-lg transition-colors text-sm font-semibold text-center"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
