import JournalClient from '@/app/(public)/journal/JournalClient';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getJournalData() {
    try {
        const [posts, settings, marketingCards] = await Promise.all([
            prisma.blogPost.findMany({
                where: { published: true },
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { name: true } } },
            }),
            prisma.siteSetting.findUnique({ where: { id: 'main' } }) as any,
            prisma.journalMarketingCard.findMany({
                where: { isActive: true },
                orderBy: { order: 'asc' },
            }),
        ]);

        return {
            posts: JSON.parse(JSON.stringify(posts)),
            hero: {
                label: settings?.journalHeroLabel ?? 'Our Stories',
                title: settings?.journalHeroTitle ?? 'The Journal',
                description: settings?.journalHeroDescription ?? 'Stay updated with the latest happenings, exclusive offers, and stories from our sanctuary.',
                backgroundImage: settings?.journalHeroImage ?? 'https://images.unsplash.com/photo-1455391704245-2376bb74b358?auto=format&fit=crop&q=80',
            },
            marketingCards: JSON.parse(JSON.stringify(marketingCards)),
        };
    } catch (error) {
        console.error('Error fetching journal data:', error);
        return {
            posts: [],
            hero: {
                label: 'Our Stories',
                title: 'The Journal',
                description: 'Stay updated with the latest happenings, exclusive offers, and stories from our sanctuary.',
                backgroundImage: 'https://images.unsplash.com/photo-1455391704245-2376bb74b358?auto=format&fit=crop&q=80',
            },
            marketingCards: [],
        };
    } finally {
        await prisma.$disconnect();
    }
}

export const metadata = {
    title: "Journal | NL Josephine's Hotel",
    description: "Latest news, events, and stories from NL Josephine's Hotel.",
};

export default async function JournalPage() {
    const { posts, hero, marketingCards } = await getJournalData();
    return <JournalClient initialPosts={posts} hero={hero} marketingCards={marketingCards} />;
}
