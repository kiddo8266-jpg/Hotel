const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const postsCount = await prisma.blogPost.count();
        const cardsCount = await prisma.journalMarketingCard.count();
        const heroContentCount = await prisma.heroContent.count();
        const apartmentsCount = await prisma.apartment.count();
        const amenitiesCount = await prisma.amenity.count();
        const usersCount = await prisma.user.count();
        const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });

        console.log('--- DATABASE DIAGNOSTICS ---');
        console.log('BlogPosts count:', postsCount);
        console.log('JournalMarketingCards count:', cardsCount);
        console.log('HeroContent count:', heroContentCount);
        console.log('Apartments count:', apartmentsCount);
        console.log('Amenities count:', amenitiesCount);
        console.log('Users count:', usersCount);
        console.log('SiteSettings journalHeroTitle:', settings?.journalHeroTitle);
        console.log('SiteSettings journalHeroDescription:', settings?.journalHeroDescription);
        console.log('----------------------------');

        if (postsCount > 0) {
            const posts = await prisma.blogPost.findMany({ take: 2 });
            console.log('Sample BlogPosts:', JSON.stringify(posts, null, 2));
        }

        if (cardsCount > 0) {
            const cards = await prisma.journalMarketingCard.findMany({ take: 2 });
            console.log('Sample MarketingCards:', JSON.stringify(cards, null, 2));
        }
    } catch (err) {
        console.error('Error during diagnostics:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
