import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultLinks = [
    { href: '/', label: 'Home', isHeader: true, order: 0 },
    { href: '/apartments', label: 'Apartments', isHeader: true, order: 1 },
    { href: '/gallery', label: 'Gallery', isHeader: true, order: 2 },
    { href: '/journal', label: 'Journal', isHeader: true, order: 3 },
    { href: '/about', label: 'About', isHeader: true, order: 4 },
    { href: '/contact', label: 'Contact', isHeader: true, order: 5 },

    // Footer exclusive or shared links
    { href: '/', label: 'The Sanctuary', isHeader: false, order: 0 },
    { href: '/apartments', label: 'The Collection', isHeader: false, order: 1 },
    { href: '/services', label: 'Services', isHeader: false, order: 2 },
    { href: '/about', label: 'Our Heritage', isHeader: false, order: 3 },
    { href: '/journal', label: 'The Journal', isHeader: false, order: 4 },
];

async function main() {
    console.log('Checking for existing navigation links...');
    const count = await prisma.navigationLink.count();

    if (count === 0) {
        console.log('Seeding default navigation links...');
        for (const link of defaultLinks) {
            await prisma.navigationLink.create({
                data: {
                    label: link.label,
                    href: link.href,
                    isHeader: link.isHeader,
                    order: link.order,
                    isActive: true
                }
            });
        }
        console.log('Successfully seeded navigation links.');
    } else {
        console.log('Navigation links already exist. Skipping seed.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
