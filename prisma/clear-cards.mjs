import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    await prisma.journalMarketingCard.deleteMany({});
    console.log('Cleared all journal marketing cards.');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
