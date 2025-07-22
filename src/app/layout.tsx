
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import AIChatAssistant from '@/components/ai/AIChatAssistant';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <head>
        <title>DhirPrint AI</title>
        <meta name="description" content="AI-powered custom printing services by DhirPrint" />
        <meta name="keywords" content="flex, vinyl, standee, printing" />
        <link rel="manifest" href="/manifest.json" />

        <meta property="og:title" content="DhirPrint AI" />
        <meta property="og:description" content="AI-powered custom printing services — smart, simple & user-centric." />
        <meta property="og:url" content="https://dhir-print-tau.vercel.app/" />
        <meta property="og:site_name" content="DhirPrint" />
        <meta property="og:image" content="https://dhir-print-tau.vercel.app/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="DhirPrint Preview" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DhirPrint AI" />
        <meta name="twitter:description" content="Smart printing services powered by AI and great UX." />
        <meta name="twitter:image" content="https://dhir-print-tau.vercel.app/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#007FFF" />
      </head>
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
