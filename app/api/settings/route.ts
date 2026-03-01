import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const settings = await prisma.siteSetting.findUnique({
            where: { id: 'main' },
        });
        return NextResponse.json(settings || {});
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Simple authentication/authorization guard could be added here

        const settings = await prisma.siteSetting.upsert({
            where: { id: 'main' },
            update: {
                heroTitle: data.heroTitle,
                heroSubtitle: data.heroSubtitle,
                heroImage: data.heroImage,
                aboutText: data.aboutText,
                contactPhone: data.contactPhone,
                contactEmail: data.contactEmail,
            },
            create: {
                id: 'main',
                heroTitle: data.heroTitle || 'Welcome',
                heroSubtitle: data.heroSubtitle || '',
                heroImage: data.heroImage || '',
                aboutText: data.aboutText || '',
                contactPhone: data.contactPhone || '',
                contactEmail: data.contactEmail || '',
            }
        });

        return NextResponse.json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
