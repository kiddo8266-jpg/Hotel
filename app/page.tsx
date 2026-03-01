import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import SuitesSection from '@/components/SuitesSection';

// This is a Server Component, meaning database calls happen securely on the server
export default async function Home() {
    const settings = await prisma.siteSetting.findUnique({
        where: { id: 'main' },
    });

    const apartments = await prisma.apartment.findMany({
        orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Settings not found. Please run the seed command.
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <HeroSection
                title={settings.heroTitle}
                subtitle={settings.heroSubtitle}
                image={settings.heroImage}
            />

            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-serif text-[#0F2C23] mb-6">About Josephine Haven</h2>
                        <div className="w-16 h-1 bg-[#C9A05B] mb-8" />
                        <p className="text-lg text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
                            {settings.aboutText}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] bg-gray-200">
                            {/* Optional secondary image for the about section, using hero image for now if no specific about image exists */}
                            <img
                                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2600&auto=format&fit=crop"
                                alt="Interior"
                                className="w-full h-full object-cover shadow-2xl"
                            />
                        </div>
                        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#0F2C23] -z-10" />
                        <div className="absolute -top-8 -right-8 w-48 h-48 border border-[#C9A05B] -z-10" />
                    </div>
                </div>
            </section>

            <SuitesSection apartments={apartments} />
        </main>
    );
}