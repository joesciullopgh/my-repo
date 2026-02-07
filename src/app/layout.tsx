import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import { BUSINESS_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${BUSINESS_INFO.name} | Oakmont, PA`,
  description: BUSINESS_INFO.tagline,
  keywords: ['coffee', 'cafe', 'oakmont', 'pittsburgh', 'lattes', 'pastries', 'organic'],
  openGraph: {
    title: BUSINESS_INFO.name,
    description: BUSINESS_INFO.tagline,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
