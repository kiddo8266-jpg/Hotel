const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial SiteSettings...');
    await prisma.siteSetting.upsert({
        where: { id: 'main' },
        update: {},
        create: {
            id: 'main',
            heroTitle: 'Welcome to Josephine Haven',
            heroSubtitle: 'Experience luxury and comfort in the heart of the city.',
            heroImage: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8343?q=80&w=2600&auto=format&fit=crop',
            aboutText: 'Josephine Haven offers an unparalleled stay with top-tier amenities, exquisite dining, and breathtaking views. Whether you are here for business or leisure, our dedicated team ensures your experience is memorable and relaxing.',
            contactPhone: '+1 (555) 123-4567',
            contactEmail: 'contact@josephinehaven.com',
        },
    });

    console.log('Seeding Admin User...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@josephinehaven.com' },
        update: {},
        create: {
            email: 'admin@josephinehaven.com',
            password: hashedPassword,
            name: 'Admin',
            role: 'admin',
        },
    });

    console.log('Seeding initial Apartments...');

    const apartments = [
        {
            title: 'Executive Suite',
            description: 'Our most luxurious offering, featuring spacious living areas, premium furnishings, and a panoramic city view.',
            price: 450,
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2600&auto=format&fit=crop',
            type: 'Executive',
            bedrooms: 2,
            bathrooms: 2,
            size: 1200,
            features: 'King Bed,City View,Free Wi-Fi,Mini Bar,Jacuzzi,Lounge Access,24/7 Room Service,Premium Toiletries',
        },
        {
            title: 'Deluxe single and Double room',
            description: 'Perfect for families or business travelers, offering versatility and unmatched comfort with modern amenities.',
            price: 250,
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2600&auto=format&fit=crop',
            type: 'Deluxe single and Double room',
            bedrooms: 1,
            bathrooms: 1,
            size: 800,
            features: 'Choice of Bed,Workspace,Free Wi-Fi,Smart TV,Coffee Maker,Rain Shower',
        },
        {
            title: 'Standard suite',
            description: 'A cozy yet elegant space designed to provide all the essential luxuries for a perfect stay.',
            price: 150,
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2600&auto=format&fit=crop',
            type: 'Standard suite',
            bedrooms: 1,
            bathrooms: 1,
            size: 500,
            features: 'Queen Bed,Free Wi-Fi,Smart TV,En-suite Bathroom,Air Conditioning',
        },
    ];

    for (const apt of apartments) {
        const existing = await prisma.apartment.findFirst({
            where: { type: apt.type },
        });
        if (!existing) {
            await prisma.apartment.create({
                data: apt,
            });
        }
    }

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });