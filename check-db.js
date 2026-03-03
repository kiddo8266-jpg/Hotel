const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.siteSetting.findFirst();
    console.log("SiteSettings:", settings);
    console.log("------------------------");
    // Also check if any HeroContent has old text
    const heroContent = await prisma.heroContent.findMany();
    console.log("HeroContent:", heroContent);
}

main().catch(console.error).finally(() => prisma.$disconnect());
