
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import AIChatAssistant from '@/components/ai/AIChatAssistant';

export const metadata: Metadata = {
  title: 'DhirPrint AI',
  description: 'AI-powered custom printing services by DhirPrint',
  manifest: '/manifest.json',
  keywords: ['flex', 'vinyl', 'standee', 'printing'],

  openGraph: {
    title: 'DhirPrint AI',
    description: 'AI-powered custom printing services — smart, simple & user-centric.',
    url: 'https://dhir-print-tau.vercel.app/',
    siteName: 'DhirPrint',
    images: [
      {
        url: 'https://dhir-print-tau.vercel.app/logo.png', // make sure this image exists
        width: 1200,
        height: 630,
        alt: 'DhirPrint Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'DhirPrint AI',
    description: 'Smart printing services powered by AI and great UX.',
    images: ['https://dhir-print-tau.vercel.app/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
    
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
            <AIChatAssistant />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
