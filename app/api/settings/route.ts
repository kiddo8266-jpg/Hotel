import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const settings = await prisma.siteSetting.findUnique({
            where: { id: 'main' },
        });
        return NextResponse.json(settings || {});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Simple authentication/authorization guard could be added here

        const settings = await prisma.siteSetting.upsert({
            where: { id: 'main' },
            update: {
                hotelName: data.hotelName,
                address: data.address,
                heroTitle: data.heroTitle,
                heroSubtitle: data.heroSubtitle,
                heroImage: data.heroImage,
                aboutText: data.aboutText,
                contactPhone: data.contactPhone,
                contactEmail: data.contactEmail,
                aboutHero: data.aboutHero,
                aboutVision: data.aboutVision,
                aboutStory: data.aboutStory,
                facebookUrl: data.facebookUrl,
                instagramUrl: data.instagramUrl,
                twitterUrl: data.twitterUrl,
                youtubeUrl: data.youtubeUrl,
                tiktokUrl: data.tiktokUrl,
                seoKeywords: data.seoKeywords,
                seoDescription: data.seoDescription,
                spiritImage: data.spiritImage,
                spiritHeading: data.spiritHeading,
                spiritLabel: data.spiritLabel,
            } as any,
            create: {
                id: 'main',
                hotelName: data.hotelName || "NL Josephine's Hotel",
                address: data.address || "Seguku, Entebbe Road\\nKampala, Uganda",
                heroTitle: data.heroTitle || 'Welcome',
                heroSubtitle: data.heroSubtitle || '',
                heroImage: data.heroImage || '',
                aboutText: data.aboutText || '',
                contactPhone: data.contactPhone || '',
                contactEmail: data.contactEmail || '',
                aboutHero: data.aboutHero || "More Than a Residence.\\nNL Josephine's Hotel.",
                aboutVision: data.aboutVision || 'Born from a desire to blend uncompromising tranquility with modern luxury.',
                aboutStory: data.aboutStory || "NL Josephine's Hotel was designed as a retreat from the ordinary. We believe that a home is not just a place, but a feeling—a serene sanctuary where life's best moments unfold.\n\nEvery detail, from the grand architecture to the finest interior finishes, has been meticulously curated to foster an environment of peace, security, and absolute comfort for our residents.",
                facebookUrl: data.facebookUrl || "https://facebook.com",
                instagramUrl: data.instagramUrl || "https://instagram.com",
                twitterUrl: data.twitterUrl || "https://twitter.com",
                youtubeUrl: data.youtubeUrl || "https://youtube.com",
                tiktokUrl: data.tiktokUrl || "https://tiktok.com",
                seoKeywords: data.seoKeywords || "vacation rental, serviced apartments, luxury hotel, Entebbe, Uganda",
                seoDescription: data.seoDescription || "NL Josephine's Hotel offers uncompromising tranquility with modern luxury in Seguku, Entebbe Road.",
                spiritImage: data.spiritImage || "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2600&auto=format&fit=crop",
                spiritHeading: data.spiritHeading || "The Spirit of NL Josephine's Hotel",
                spiritLabel: data.spiritLabel || "Our Heritage",
            } as any
        });

        return NextResponse.json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
