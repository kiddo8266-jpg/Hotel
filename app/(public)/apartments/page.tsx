import { prisma } from '@/lib/prisma';
import ApartmentCard from '@/components/ApartmentCard';

export default async function ApartmentsPage() {
    const settings = (await prisma.siteSetting.findUnique({
        where: { id: 'main' }
    })) as any;

    const apartments = await prisma.apartment.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-[#F5F0E6]">
            {/* Header / Hero Section */}
            <section className="relative pt-48 pb-32 overflow-hidden bg-[#0F2C23]">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={settings?.apartmentsHeroImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'}
                        alt="NL Josephine's Hotel Collection"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0F2C23]/80 via-[#0F2C23]/60 to-[#F5F0E6]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <header className="text-center max-w-4xl mx-auto space-y-6">
                        <span className="inline-block px-4 py-1.5 rounded-full border border-[#C9A05B]/30 bg-[#C9A05B]/10 text-[#C9A05B] text-xs font-bold tracking-[0.3em] uppercase mb-4 backdrop-blur-md">
                            The Collection
                        </span>
                        <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-8">
                            Our <span className="italic font-serif text-[#C9A05B]">Accommodations</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed">
                            Discover our exclusive collection of premium, fully-serviced apartments designed for ultimate comfort and tranquility in the heart of Seguku.
                        </p>
                    </header>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {apartments.map((apt, index) => (
                        <ApartmentCard key={apt.id} apt={apt} index={index} />
                    ))}
                </div>

                {apartments.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400">No apartments found. Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}