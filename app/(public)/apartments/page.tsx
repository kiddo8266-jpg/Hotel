import { prisma } from '@/lib/prisma';
import ApartmentCard from '@/components/ApartmentCard';

export default async function ApartmentsPage() {
    const apartments = await prisma.apartment.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen pt-40 pb-20 bg-[#fdfbf7] px-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                    <h1 className="text-5xl md:text-7xl font-serif text-[#0F2C23]">
                        Our Accommodations
                    </h1>
                    <div className="w-24 h-1 bg-[#C9A05B] mx-auto" />
                    <p className="text-xl text-gray-600 font-light leading-relaxed">
                        Discover our collection of premium, fully-serviced apartments designed for ultimate comfort and tranquility in the heart of Seguku.
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