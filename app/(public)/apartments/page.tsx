import { prisma } from '@/lib/prisma';
import ApartmentCard from '@/components/ApartmentCard';

export default async function ApartmentsPage() {
    const apartments = await prisma.apartment.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen pt-32 pb-24 bg-[#F5F0E6] px-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-center max-w-4xl mx-auto mb-20 space-y-6">
                    <span className="inline-block px-4 py-1.5 rounded-full border border-[#0F2C23]/20 bg-[#C9A05B]/5 text-[#C9A05B] text-xs font-bold tracking-[0.3em] uppercase mb-4 backdrop-blur-md">
                        The Collection
                    </span>
                    <h1 className="text-5xl md:text-7xl font-light text-[#0F2C23] leading-tight mb-8">
                        Our <span className="italic font-serif text-[#C9A05B]">Accommodations</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
                        Discover our exclusive collection of premium, fully-serviced apartments designed for ultimate comfort and tranquility in the heart of Seguku.
                    </p>
                </header>

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