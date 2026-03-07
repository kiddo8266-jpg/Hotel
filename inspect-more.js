const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const media = await prisma.media.findMany();
        console.log('--- MEDIA ---');
        console.log(JSON.stringify(media, null, 2));

        const enquiries = await prisma.enquiry.findMany();
        console.log('--- ENQUIRIES ---');
        console.log(JSON.stringify(enquiries, null, 2));

        const team = await prisma.team.findMany();
        console.log('--- TEAM ---');
        console.log(JSON.stringify(team, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
