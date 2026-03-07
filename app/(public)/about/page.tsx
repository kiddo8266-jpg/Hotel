import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'About Us | NL Josephine\'s Hotel',
    description: 'More Than a Residence. A Sanctuary. Discover the story, vision, and people behind NL Josephine\'s Hotel\'s premier luxury apartments.',
};

export const dynamic = 'force-dynamic';

export default async function About() {
    // Fetch active team members 
    const teamMembers = await prisma.team.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
    });

    // Fetch site settings text
    const settings = await prisma.siteSetting.findUnique({
        where: { id: 'main' }
    });

    return <AboutClient
        initialTeam={teamMembers}
        settings={{
            heroHeadline: settings?.aboutHero || 'More Than a Residence. Haven.',
            visionHeadline: settings?.aboutVision || 'Born from a desire to blend uncompromising tranquility with absolute location.',
            visionStory: settings?.aboutStory || 'NL Josephine\'s Hotel & Apt was designed as a retreat from the ordinary. We believe that a home is not just a place, but a feeling—a serene haven where life\'s best moments unfold.\n\nEvery detail, from the grand architecture to the finest interior finishes, has been meticulously curated to foster an environment of peace, security, and absolute comfort for our residents.',
            heroImage: settings?.aboutHeroImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2600&auto=format&fit=crop',
            visionImage1: settings?.aboutVisionImage1 || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80',
            visionImage2: settings?.aboutVisionImage2 || 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80',
        }}
    />;
}

