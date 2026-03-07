import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const heroes = await prisma.heroContent.findMany();
    console.log('--- HERO CONTENT ---');
    console.log(JSON.stringify(heroes, null, 2));
}

main().finally(() => prisma.$disconnect());
