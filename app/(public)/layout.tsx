import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [settings, headerLinks] = await Promise.all([
        prisma.siteSetting.findUnique({ where: { id: 'main' } }),
        prisma.navigationLink.findMany({
            where: { isHeader: true, isActive: true },
            orderBy: { order: 'asc' },
            select: { href: true, label: true }
        })
    ]);

    const hotelName = settings?.hotelName || "NL Josephine's Hotel";

    return (
        <>
            <Navbar hotelName={hotelName} navLinks={headerLinks} />
            <main className="min-h-screen flex flex-col">
                {children}
            </main>
            <Footer />
        </>
    );
}
