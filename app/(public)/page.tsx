import { prisma } from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import SuitesSection from '@/components/SuitesSection';
import AmenitiesSection from '@/components/AmenitiesSection';

export default async function Home() {
    const settings = await prisma.siteSetting.findUnique({
        where: { id: 'main' },
    });

    const heroItems = await prisma.heroContent.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
    });

    const apartments = await prisma.apartment.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const featuredApartments = apartments.slice(0, 3);

    const amenities = await prisma.amenity.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
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
                items={heroItems}
                fallback={{
                    title: settings.heroTitle,
                    subtitle: settings.heroSubtitle,
                    image: settings.heroImage
                }}
            />

            {/* Spirit Section / About Intro */}
            <section className="py-24 md:py-32 bg-[#F5F0E6] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div className="relative z-10">
                        <span className="text-[#C9A05B] font-medium tracking-widest uppercase text-sm mb-6 block">
                            {settings.spiritLabel || 'Our Heritage'}
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#0F2C23] mb-8 leading-tight">
                            {(settings.spiritHeading || "The Spirit of NL Josephine's Hotel & Apt").split('\n').map((line, i) => (
                                <span key={i}>
                                    {i === 0 ? line : <><br /><span className="italic font-serif text-[#C9A05B]">{line}</span></>}
                                </span>
                            ))}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed whitespace-pre-wrap mb-10">
                            {settings.aboutText}
                        </p>

                        <a href="/about" className="inline-flex items-center gap-3 text-[#0F2C23] font-bold text-xs uppercase tracking-[0.2em] group border-b border-[#0F2C23] pb-2 hover:text-[#C9A05B] hover:border-[#C9A05B] transition-colors">
                            Read Our Story
                            <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                        </a>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl relative z-10">
                            <img
                                src={settings.spiritImage || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2600&auto=format&fit=crop'}
                                alt={settings.spiritHeading || "NL Josephine's Hotel & Apt"}
                                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-2/3 aspect-square rounded-[40px] bg-[#0F2C23] -z-10 shadow-2xl" />
                        <div className="absolute -top-10 -right-10 w-1/2 aspect-square rounded-[40px] border border-[#C9A05B]/30 -z-10" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#C9A05B]/5 rounded-full blur-3xl -z-20 pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* Featured Suites */}
            <div id="suites">
                <SuitesSection
                    apartments={featuredApartments}
                    heading={settings.suitesHeading}
                    description={settings.suitesDescription}
                />
            </div>

            {/* Amenities Section */}
            <AmenitiesSection
                amenities={amenities}
                heading={settings.amenitiesHeading}
                description={settings.amenitiesDescription}
                subtitle={settings.amenitiesSubtitle}
                experienceTitle={settings.experienceTitle}
                experienceLabel={settings.experienceLabel}
                amenitiesImage={settings.amenitiesImage || undefined}
            />
        </main>
    );
}