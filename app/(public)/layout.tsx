import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });
    const hotelName = settings?.hotelName || "NL Josephine's Hotel";

    return (
        <>
            <Navbar hotelName={hotelName} />
            <main className="min-h-screen flex flex-col">
                {children}
            </main>
            <Footer />
        </>
    );
}
