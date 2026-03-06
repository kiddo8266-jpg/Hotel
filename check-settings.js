const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.siteSetting.findUnique({ where: { id: 'main' } });
    console.log('Logo URL:', settings.logoUrl);
    console.log('Logo Alt:', settings.logoAlt);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
