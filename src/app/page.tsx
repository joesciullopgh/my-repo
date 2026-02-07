import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/constants';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-primary opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center">
            {/* Logo placeholder */}
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-primary font-bold text-4xl">MC</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary mb-4">
              {BUSINESS_INFO.name}
            </h1>
            <p className="text-xl md:text-2xl text-secondary/80 mb-8 max-w-2xl mx-auto">
              {BUSINESS_INFO.tagline}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary-dark transition-colors text-lg"
              >
                View Our Menu
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-primary transition-colors text-lg"
              >
                Find Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Why Moonbeam?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Organic & Local</h3>
              <p className="text-text-light">
                We source organic roasted coffee and partner with local bakeries for fresh pastries daily.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Crafted With Care</h3>
              <p className="text-text-light">
                Every drink is handcrafted to perfection. Customize it your way with our variety of options.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Heart of Oakmont</h3>
              <p className="text-text-light">
                A cozy neighborhood cafe serving the Oakmont community since 2019.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Location Preview */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Visit Us
              </h2>
              <p className="text-accent-dark text-lg mb-6">
                Stop by for your morning coffee, a midday pick-me-up, or a relaxing weekend brunch.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Address</h4>
                    <p className="text-accent-dark">{BUSINESS_INFO.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Phone</h4>
                    <a href={`tel:${BUSINESS_INFO.phone}`} className="text-accent-dark hover:text-primary transition-colors">
                      {BUSINESS_INFO.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Hours</h4>
                    <p className="text-accent-dark">Mon-Fri: 8AM - 3PM</p>
                    <p className="text-accent-dark">Sat: 7AM - 2PM • Sun: 8AM - 2PM</p>
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center mt-6 text-primary font-semibold hover:text-primary-light transition-colors"
              >
                Get Directions
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Map placeholder */}
            <div className="bg-primary/10 rounded-2xl h-80 flex items-center justify-center">
              <p className="text-accent-dark">Map coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Ready to Order?
          </h2>
          <p className="text-secondary/80 text-lg mb-8">
            Browse our full menu and customize your perfect drink.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-primary font-semibold rounded-lg hover:bg-secondary-dark transition-colors text-lg"
          >
            Explore the Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
