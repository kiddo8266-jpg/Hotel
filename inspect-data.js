const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const apartments = await prisma.apartment.findMany({
            include: { amenities: true }
        });
        console.log('--- APARTMENTS ---');
        console.log(JSON.stringify(apartments, null, 2));

        const amenities = await prisma.amenity.findMany();
        console.log('--- AMENITIES ---');
        console.log(JSON.stringify(amenities, null, 2));

        const blogPosts = await prisma.blogPost.findMany();
        console.log('--- BLOG POSTS ---');
        console.log(JSON.stringify(blogPosts, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
