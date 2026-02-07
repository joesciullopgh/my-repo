'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NAV_LINKS, BUSINESS_INFO } from '@/lib/constants';
import { useAuthStore, useUser, useIsAdmin } from '@/store/authStore';

export default function Header() {
  const router = useRouter();
  const user = useUser();
  const isAdmin = useIsAdmin();
  const { logout, isLoading } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
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

            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 text-amber-300 hover:text-amber-200 hover:bg-primary-light rounded-lg transition-colors text-sm font-medium"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Side - Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="text-right">
                  <p className="text-secondary text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-secondary/60 text-xs capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="px-4 py-2 bg-secondary/20 text-secondary hover:bg-secondary/30 rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-secondary text-primary hover:bg-secondary-dark rounded-lg transition-colors text-sm font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>

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
            {/* User Info (Mobile) */}
            {user && (
              <div className="px-4 py-3 mb-2 bg-primary-light/50 rounded-lg">
                <p className="text-secondary font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-secondary/60 text-sm">{user.email}</p>
              </div>
            )}

            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left px-4 py-3 text-secondary hover:text-white hover:bg-primary-light rounded-lg transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            ))}

            {/* Admin Link (Mobile) */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('/admin')}
                className="block w-full text-left px-4 py-3 text-amber-300 hover:text-amber-200 hover:bg-primary-light rounded-lg transition-colors text-sm font-medium"
              >
                Admin Dashboard
              </button>
            )}

            {/* Auth Actions (Mobile) */}
            <div className="pt-2 border-t border-primary-light">
              {user ? (
                <button
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="block w-full text-left px-4 py-3 text-red-300 hover:text-red-200 hover:bg-primary-light rounded-lg transition-colors text-sm font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => handleNavClick('/login')}
                  className="block w-full text-center px-4 py-3 bg-secondary text-primary hover:bg-secondary-dark rounded-lg transition-colors text-sm font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
