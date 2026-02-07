import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-secondary">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & About */}
          <div>
            <h3 className="text-xl font-bold mb-4">{BUSINESS_INFO.name}</h3>
            <p className="text-secondary/80 text-sm leading-relaxed">
              {BUSINESS_INFO.tagline}. Serving the Oakmont community with
              organic roasted coffee, specialty lattes, and locally made pastries.
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-4">Hours</h4>
            <ul className="text-sm space-y-1 text-secondary/80">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>{BUSINESS_INFO.hours.monday.open} - {BUSINESS_INFO.hours.monday.close}</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>{BUSINESS_INFO.hours.saturday.open} - {BUSINESS_INFO.hours.saturday.close}</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>{BUSINESS_INFO.hours.sunday.open} - {BUSINESS_INFO.hours.sunday.close}</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <address className="text-sm not-italic space-y-2 text-secondary/80">
              <p>{BUSINESS_INFO.address.street}</p>
              <p>{BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state} {BUSINESS_INFO.address.zip}</p>
              <p className="mt-3">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </p>
            </address>

            {/* Social Links */}
            <div className="flex gap-4 mt-4">
              <a
                href={BUSINESS_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/80 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={BUSINESS_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href={BUSINESS_INFO.social.yelp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/80 hover:text-white transition-colors"
                aria-label="Yelp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 011.596-.206 9.194 9.194 0 011.67 4.711zm-6.768 3.12l3.942 3.016c.773.594.212 1.851-.85 1.906l-5.47.28a1.072 1.072 0 01-1.13-.97 9.193 9.193 0 013.508-4.232zm-5.085-.865l-1.15 5.04c-.224.98-1.627 1.108-2.12.193l-2.54-4.71a1.072 1.072 0 01.378-1.397 9.194 9.194 0 015.432.874zm-.478-2.89L3.96 9.683c-.77-.6-.196-1.85.87-1.893l5.46-.22a1.072 1.072 0 011.12.984 9.194 9.194 0 01-3.58 4.404zm3.17-4.473l-1.5-5.135c-.292-.998.927-1.792 1.846-1.2l4.73 3.044a1.072 1.072 0 01.316 1.418 9.194 9.194 0 01-5.392 1.873z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-primary-light text-center text-sm text-secondary/60">
          <p>&copy; {currentYear} {BUSINESS_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
