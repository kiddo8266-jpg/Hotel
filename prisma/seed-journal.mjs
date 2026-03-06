// prisma/seed-journal.mjs
// Run: node prisma/seed-journal.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const existing = await prisma.journalMarketingCard.count();
    if (existing > 0) {
        console.log(`✅ ${existing} marketing card(s) already exist — skipping seed.`);
        return;
    }

    await prisma.journalMarketingCard.createMany({
        data: [
            {
                tag: 'The Highlight',
                title: 'Saturday\nOldies Night',
                description: 'A curated nostalgic journey through sound and soul. Every Saturday at 7:00 PM.',
                image: '',
                buttonLabel: 'Reserve Seat',
                subject: 'Seat Reservation: Oldies Night',
                order: 0,
                isActive: true,
            },
            {
                tag: '',
                title: 'Hotel Gastronomy',
                description: 'Discover the art of taste in our premium dining hall. From local organic secrets to global masterpieces.',
                image: '',
                buttonLabel: 'Reserve Table',
                subject: 'Table Reservation: Hotel Gastronomy',
                order: 1,
                isActive: true,
            },
            {
                tag: '',
                title: 'Elevated\nWorkspaces',
                description: 'Luxury office suites to let in the heart of the hotel grounds.',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000',
                buttonLabel: 'Send Enquiry',
                subject: 'Viewing Request: Elevated Workspaces',
                order: 2,
                isActive: true,
            },
        ],
    });

    console.log('✅ Seeded 3 default Journal marketing cards successfully.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
