import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
export const metadata: Metadata = {
  title: "NL Josephine's Hotel | Luxury Serviced Apartments Seguku",
  description: "Experience quiet luxury at NL Josephine's Hotel — your serene home away from home. Book your stay in our distinctive suites today.",
  keywords: ["hotel", "serviced apartments", "seguku", "uganda", "luxury accommodation", "nl josephine's hotel", "vacation rental"],
  openGraph: {
    title: "NL Josephine's Hotel | Luxury Serviced Apartments",
    description: "Experience quiet luxury at NL Josephine's Hotel — your serene home away from home.",
    url: "https://josehotel.com",
    siteName: "NL Josephine's Hotel",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542314831-c6a4d14d8343?q=80&w=2600&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "NL Josephine's Hotel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NL Josephine's Hotel",
    description: "Experience quiet luxury at NL Josephine's Hotel.",
    images: ["https://images.unsplash.com/photo-1542314831-c6a4d14d8343?q=80&w=2600&auto=format&fit=crop"],
  },
  icons: { icon: '/favicon.ico' },
};

import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-gray-50/50 text-[#0F2C23]`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}