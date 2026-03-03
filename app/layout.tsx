import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/theme-provider';
import { prisma } from '@/lib/prisma';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export async function generateMetadata(): Promise<Metadata> {
  let siteSetting;
  try {
    siteSetting = await prisma.siteSetting.findUnique({
      where: { id: "main" }
    });
  } catch (error) {
    console.error("Failed to fetch site settings for metadata", error);
  }

  const title = siteSetting?.hotelName ? `${siteSetting.hotelName} | Luxury Serviced Apartments` : "NL Josephine's Hotel | Luxury Serviced Apartments";
  const defaultDesc = "Experience quiet luxury at NL Josephine's Hotel — your serene home away from home. Book your stay in our distinctive suites today.";
  const description = siteSetting?.seoDescription || defaultDesc;
  const keywords = siteSetting?.seoKeywords?.split(',').map((k: string) => k.trim()) || ["hotel", "serviced apartments", "seguku", "uganda", "luxury accommodation", "nl josephine's hotel", "vacation rental"];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: "https://josehotel.com",
      siteName: siteSetting?.hotelName || "NL Josephine's Hotel",
      images: [
        {
          url: "https://images.unsplash.com/photo-1542314831-c6a4d14d8343?q=80&w=2600&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: siteSetting?.hotelName || "NL Josephine's Hotel",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://images.unsplash.com/photo-1542314831-c6a4d14d8343?q=80&w=2600&auto=format&fit=crop"],
    },
    icons: { icon: '/favicon.ico' },
  };
}


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
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#0F2C23',
                color: '#C9A05B',
                border: '1px solid #C9A05B',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}